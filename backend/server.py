from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from telegram import Update, Bot, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters
import asyncio
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Telegram Bot
TELEGRAM_TOKEN = os.environ.get('TELEGRAM_TOKEN', '')
WEBHOOK_SECRET = os.environ.get('WEBHOOK_SECRET', 'secret123')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class UserRole(str, Enum):
    ADMIN = "admin"
    EVENT_MANAGER = "event_manager"
    MEMBER = "member"

class PollType(str, Enum):
    YES_NO = "yes_no"
    MULTIPLE_CHOICE = "multiple_choice"
    TEXT_RESPONSE = "text_response"

class EventStatus(str, Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    telegram_id: int
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: UserRole = UserRole.MEMBER
    is_active: bool = True
    registered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_interaction: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Poll(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    poll_type: PollType
    options: List[str] = []  # For multiple choice
    is_active: bool = True
    created_by: str  # user_id
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ends_at: Optional[datetime] = None
    votes: Dict[str, Any] = {}  # telegram_id -> vote

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    event_date: datetime
    location: Optional[str] = None
    max_participants: Optional[int] = None
    status: EventStatus = EventStatus.UPCOMING
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    participants: List[int] = []  # telegram_ids
    managers: List[int] = []  # telegram_ids of event managers

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    available_slots: int
    booked_by: List[int] = []  # telegram_ids
    is_active: bool = True
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Fee(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_telegram_id: int
    amount: float
    year: int
    is_paid: bool = False
    paid_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    message: str
    sent_to: List[int] = []  # telegram_ids
    sent_by: str
    sent_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserGroup(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    members: List[int] = []  # telegram_ids
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Request/Response Models
class PollCreate(BaseModel):
    title: str
    description: Optional[str] = None
    poll_type: PollType
    options: List[str] = []
    ends_at: Optional[datetime] = None

class EventCreate(BaseModel):
    title: str
    description: str
    event_date: datetime
    location: Optional[str] = None
    max_participants: Optional[int] = None

class BookingCreate(BaseModel):
    title: str
    description: str
    available_slots: int

class NotificationCreate(BaseModel):
    message: str
    send_to_all: bool = True
    group_ids: List[str] = []  # IDs of groups to send to

class FeeCreate(BaseModel):
    user_telegram_id: int
    amount: float
    year: int

class UserGroupCreate(BaseModel):
    name: str
    description: Optional[str] = None
    member_telegram_ids: List[int] = []

class EventManagerAssign(BaseModel):
    manager_telegram_ids: List[int]

# Helper Functions
async def get_user_by_telegram_id(telegram_id: int) -> Optional[User]:
    user_doc = await db.users.find_one({"telegram_id": telegram_id}, {"_id": 0})
    if user_doc:
        if isinstance(user_doc.get('registered_at'), str):
            user_doc['registered_at'] = datetime.fromisoformat(user_doc['registered_at'])
        if isinstance(user_doc.get('last_interaction'), str):
            user_doc['last_interaction'] = datetime.fromisoformat(user_doc['last_interaction'])
        return User(**user_doc)
    return None

async def is_admin(telegram_id: int) -> bool:
    user = await get_user_by_telegram_id(telegram_id)
    return user and user.role == UserRole.ADMIN

async def is_event_manager(telegram_id: int, event_id: str) -> bool:
    """Check if user is manager of specific event"""
    user = await get_user_by_telegram_id(telegram_id)
    if not user:
        return False
    
    # Admins can manage all events
    if user.role == UserRole.ADMIN:
        return True
    
    # Check if user is assigned as manager for this event
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if event and telegram_id in event.get('managers', []):
        return True
    
    return False

async def can_manage_events(telegram_id: int) -> bool:
    """Check if user can manage events (admin or event_manager role)"""
    user = await get_user_by_telegram_id(telegram_id)
    return user and user.role in [UserRole.ADMIN, UserRole.EVENT_MANAGER]

async def register_user(telegram_id: int, username: Optional[str], first_name: Optional[str], last_name: Optional[str]) -> User:
    existing_user = await get_user_by_telegram_id(telegram_id)
    if existing_user:
        return existing_user
    
    user = User(
        telegram_id=telegram_id,
        username=username,
        first_name=first_name,
        last_name=last_name
    )
    
    doc = user.model_dump()
    doc['registered_at'] = doc['registered_at'].isoformat()
    doc['last_interaction'] = doc['last_interaction'].isoformat()
    
    await db.users.insert_one(doc)
    return user

# Telegram Bot Handlers
async def start_command(update: Update, context):
    user = update.effective_user
    await register_user(user.id, user.username, user.first_name, user.last_name)
    
    welcome_message = f"""👋 Ciao {user.first_name}!

Benvenuto nel bot del CRAL del Palazzo di Giustizia di Lecce!

Comandi disponibili:
/help - Mostra tutti i comandi
/sondaggi - Vedi sondaggi attivi
/eventi - Vedi eventi prossimi
/prenotazioni - Vedi prenotazioni disponibili
/mie_quote - Controlla le tue quote associative

Buon divertimento! 🎉"""
    
    await update.message.reply_text(welcome_message)

async def help_command(update: Update, context):
    telegram_id = update.effective_user.id
    is_user_admin = await is_admin(telegram_id)
    
    help_text = """📋 COMANDI DISPONIBILI

👤 Comandi Utente:
/sondaggi - Visualizza sondaggi attivi
/eventi - Visualizza eventi prossimi
/prenotazioni - Vedi prenotazioni disponibili
/mie_quote - Controlla le tue quote associative
/help - Mostra questo messaggio"""
    
    if is_user_admin:
        help_text += """\n
👨‍💼 Comandi Admin:
/crea_sondaggio - Crea un nuovo sondaggio
/crea_evento - Crea un nuovo evento
/crea_prenotazione - Crea una nuova prenotazione
/invia_notifica - Invia notifica a tutti i membri
/lista_membri - Visualizza tutti i membri
/statistiche - Visualizza statistiche"""
    
    await update.message.reply_text(help_text)

async def list_polls_command(update: Update, context):
    polls = await db.polls.find({"is_active": True}, {"_id": 0}).to_list(100)
    
    if not polls:
        await update.message.reply_text("📊 Nessun sondaggio attivo al momento.")
        return
    
    keyboard = []
    for poll in polls:
        poll_id = poll['id']
        title = poll['title']
        keyboard.append([InlineKeyboardButton(f"📊 {title}", callback_data=f"poll_{poll_id}")])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("📊 Sondaggi attivi:", reply_markup=reply_markup)

async def list_events_command(update: Update, context):
    events = await db.events.find(
        {"status": EventStatus.UPCOMING}, 
        {"_id": 0}
    ).to_list(100)
    
    if not events:
        await update.message.reply_text("📅 Nessun evento in programma al momento.")
        return
    
    keyboard = []
    for event in events:
        event_id = event['id']
        title = event['title']
        keyboard.append([InlineKeyboardButton(f"📅 {title}", callback_data=f"event_{event_id}")])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("📅 Eventi prossimi:", reply_markup=reply_markup)

async def list_bookings_command(update: Update, context):
    bookings = await db.bookings.find({"is_active": True}, {"_id": 0}).to_list(100)
    
    if not bookings:
        await update.message.reply_text("🎫 Nessuna prenotazione disponibile al momento.")
        return
    
    keyboard = []
    for booking in bookings:
        booking_id = booking['id']
        title = booking['title']
        available = booking['available_slots'] - len(booking.get('booked_by', []))
        keyboard.append([InlineKeyboardButton(
            f"🎫 {title} ({available} posti)", 
            callback_data=f"booking_{booking_id}"
        )])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("🎫 Prenotazioni disponibili:", reply_markup=reply_markup)

async def my_fees_command(update: Update, context):
    telegram_id = update.effective_user.id
    fees = await db.fees.find({"user_telegram_id": telegram_id}, {"_id": 0}).to_list(100)
    
    if not fees:
        await update.message.reply_text("💰 Nessuna quota associativa registrata.")
        return
    
    message = "💰 Le tue quote associative:\n\n"
    for fee in fees:
        status = "✅ Pagata" if fee['is_paid'] else "❌ Non pagata"
        message += f"Anno {fee['year']}: €{fee['amount']:.2f} - {status}\n"
    
    await update.message.reply_text(message)

async def callback_handler(update: Update, context):
    query = update.callback_query
    await query.answer()
    
    data = query.data
    telegram_id = update.effective_user.id
    
    if data.startswith("poll_"):
        poll_id = data.replace("poll_", "")
        poll = await db.polls.find_one({"id": poll_id}, {"_id": 0})
        
        if poll:
            message = f"📊 {poll['title']}\n\n"
            if poll.get('description'):
                message += f"{poll['description']}\n\n"
            
            keyboard = []
            if poll['poll_type'] == PollType.YES_NO:
                keyboard.append([InlineKeyboardButton("✅ Sì", callback_data=f"vote_{poll_id}_yes")])
                keyboard.append([InlineKeyboardButton("❌ No", callback_data=f"vote_{poll_id}_no")])
            elif poll['poll_type'] == PollType.MULTIPLE_CHOICE:
                for idx, option in enumerate(poll['options']):
                    keyboard.append([InlineKeyboardButton(
                        option, 
                        callback_data=f"vote_{poll_id}_{idx}"
                    )])
            
            keyboard.append([InlineKeyboardButton("📈 Vedi risultati", callback_data=f"results_{poll_id}")])
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.edit_message_text(message, reply_markup=reply_markup)
    
    elif data.startswith("vote_"):
        parts = data.replace("vote_", "").split("_")
        poll_id = parts[0]
        vote = "_".join(parts[1:])
        
        poll = await db.polls.find_one({"id": poll_id}, {"_id": 0})
        if poll:
            votes = poll.get('votes', {})
            votes[str(telegram_id)] = vote
            
            await db.polls.update_one(
                {"id": poll_id},
                {"$set": {"votes": votes}}
            )
            
            await query.answer("✅ Voto registrato!")
            await query.edit_message_text(f"✅ Grazie per aver votato nel sondaggio '{poll['title']}'!")
    
    elif data.startswith("results_"):
        poll_id = data.replace("results_", "")
        poll = await db.polls.find_one({"id": poll_id}, {"_id": 0})
        
        if poll:
            votes = poll.get('votes', {})
            message = f"📈 Risultati: {poll['title']}\n\n"
            message += f"Votanti: {len(votes)}\n\n"
            
            if poll['poll_type'] == PollType.YES_NO:
                yes_count = sum(1 for v in votes.values() if v == 'yes')
                no_count = sum(1 for v in votes.values() if v == 'no')
                message += f"✅ Sì: {yes_count}\n"
                message += f"❌ No: {no_count}\n"
            elif poll['poll_type'] == PollType.MULTIPLE_CHOICE:
                from collections import Counter
                vote_counter = Counter(votes.values())
                for idx, option in enumerate(poll['options']):
                    count = vote_counter.get(str(idx), 0)
                    message += f"{option}: {count}\n"
            
            await query.edit_message_text(message)
    
    elif data.startswith("event_"):
        event_id = data.replace("event_", "")
        event = await db.events.find_one({"id": event_id}, {"_id": 0})
        
        if event:
            event_date = event['event_date']
            if isinstance(event_date, str):
                event_date = datetime.fromisoformat(event_date)
            
            message = f"📅 {event['title']}\n\n"
            message += f"{event['description']}\n\n"
            message += f"📍 Luogo: {event.get('location', 'Da definire')}\n"
            message += f"🕒 Data: {event_date.strftime('%d/%m/%Y %H:%M')}\n"
            
            participants = event.get('participants', [])
            message += f"👥 Iscritti: {len(participants)}"
            
            if event.get('max_participants'):
                message += f"/{event['max_participants']}"
            
            keyboard = []
            if telegram_id not in participants:
                keyboard.append([InlineKeyboardButton(
                    "✅ Iscriviti", 
                    callback_data=f"join_event_{event_id}"
                )])
            else:
                keyboard.append([InlineKeyboardButton(
                    "❌ Annulla iscrizione", 
                    callback_data=f"leave_event_{event_id}"
                )])
            
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.edit_message_text(message, reply_markup=reply_markup)
    
    elif data.startswith("join_event_"):
        event_id = data.replace("join_event_", "")
        event = await db.events.find_one({"id": event_id}, {"_id": 0})
        
        if event:
            participants = event.get('participants', [])
            if telegram_id not in participants:
                participants.append(telegram_id)
                await db.events.update_one(
                    {"id": event_id},
                    {"$set": {"participants": participants}}
                )
                await query.answer("✅ Iscrizione confermata!")
            else:
                await query.answer("ℹ️ Sei già iscritto!")
    
    elif data.startswith("leave_event_"):
        event_id = data.replace("leave_event_", "")
        event = await db.events.find_one({"id": event_id}, {"_id": 0})
        
        if event:
            participants = event.get('participants', [])
            if telegram_id in participants:
                participants.remove(telegram_id)
                await db.events.update_one(
                    {"id": event_id},
                    {"$set": {"participants": participants}}
                )
                await query.answer("✅ Iscrizione annullata!")
    
    elif data.startswith("booking_"):
        booking_id = data.replace("booking_", "")
        booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
        
        if booking:
            booked = booking.get('booked_by', [])
            available = booking['available_slots'] - len(booked)
            
            message = f"🎫 {booking['title']}\n\n"
            message += f"{booking['description']}\n\n"
            message += f"Posti disponibili: {available}/{booking['available_slots']}\n"
            
            keyboard = []
            if telegram_id not in booked and available > 0:
                keyboard.append([InlineKeyboardButton(
                    "✅ Prenota", 
                    callback_data=f"book_{booking_id}"
                )])
            elif telegram_id in booked:
                keyboard.append([InlineKeyboardButton(
                    "❌ Annulla prenotazione", 
                    callback_data=f"cancel_book_{booking_id}"
                )])
            
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.edit_message_text(message, reply_markup=reply_markup)
    
    elif data.startswith("book_"):
        booking_id = data.replace("book_", "")
        booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
        
        if booking:
            booked = booking.get('booked_by', [])
            if telegram_id not in booked and len(booked) < booking['available_slots']:
                booked.append(telegram_id)
                await db.bookings.update_one(
                    {"id": booking_id},
                    {"$set": {"booked_by": booked}}
                )
                await query.answer("✅ Prenotazione confermata!")
            else:
                await query.answer("❌ Posti esauriti o già prenotato!")
    
    elif data.startswith("cancel_book_"):
        booking_id = data.replace("cancel_book_", "")
        booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
        
        if booking:
            booked = booking.get('booked_by', [])
            if telegram_id in booked:
                booked.remove(telegram_id)
                await db.bookings.update_one(
                    {"id": booking_id},
                    {"$set": {"booked_by": booked}}
                )
                await query.answer("✅ Prenotazione annullata!")

# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "CRAL Bot API"}

# Webhook endpoint
@api_router.post("/telegram/webhook/{secret}")
async def telegram_webhook(secret: str, request: Request):
    if secret != WEBHOOK_SECRET:
        raise HTTPException(status_code=403, detail="Invalid webhook secret")
    
    if not TELEGRAM_TOKEN:
        raise HTTPException(status_code=500, detail="Telegram token not configured")
    
    try:
        update_data = await request.json()
        bot = Bot(token=TELEGRAM_TOKEN)
        update = Update.de_json(update_data, bot)
        
        # Handle the update manually
        if update.message:
            if update.message.text:
                if update.message.text.startswith('/start'):
                    await start_command(update, None)
                elif update.message.text.startswith('/help'):
                    await help_command(update, None)
                elif update.message.text.startswith('/sondaggi'):
                    await list_polls_command(update, None)
                elif update.message.text.startswith('/eventi'):
                    await list_events_command(update, None)
                elif update.message.text.startswith('/prenotazioni'):
                    await list_bookings_command(update, None)
                elif update.message.text.startswith('/mie_quote'):
                    await my_fees_command(update, None)
        elif update.callback_query:
            await callback_handler(update, None)
        
        return {"status": "ok"}
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Poll endpoints
@api_router.post("/polls", response_model=Poll)
async def create_poll(poll_data: PollCreate, telegram_id: int):
    user = await get_user_by_telegram_id(telegram_id)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create polls")
    
    poll = Poll(
        **poll_data.model_dump(),
        created_by=user.id
    )
    
    doc = poll.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc.get('ends_at'):
        doc['ends_at'] = doc['ends_at'].isoformat()
    
    await db.polls.insert_one(doc)
    return poll

@api_router.get("/polls", response_model=List[Poll])
async def get_polls(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    polls = await db.polls.find(query, {"_id": 0}).to_list(100)
    
    for poll in polls:
        if isinstance(poll.get('created_at'), str):
            poll['created_at'] = datetime.fromisoformat(poll['created_at'])
        if poll.get('ends_at') and isinstance(poll['ends_at'], str):
            poll['ends_at'] = datetime.fromisoformat(poll['ends_at'])
    
    return polls

@api_router.get("/polls/{poll_id}", response_model=Poll)
async def get_poll(poll_id: str):
    poll = await db.polls.find_one({"id": poll_id}, {"_id": 0})
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    if isinstance(poll.get('created_at'), str):
        poll['created_at'] = datetime.fromisoformat(poll['created_at'])
    if poll.get('ends_at') and isinstance(poll['ends_at'], str):
        poll['ends_at'] = datetime.fromisoformat(poll['ends_at'])
    
    return poll

@api_router.delete("/polls/{poll_id}")
async def delete_poll(poll_id: str, telegram_id: int):
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.polls.update_one(
        {"id": poll_id},
        {"$set": {"is_active": False}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    return {"message": "Poll deleted"}

# Event endpoints
@api_router.post("/events", response_model=Event)
async def create_event(event_data: EventCreate, telegram_id: int):
    user = await get_user_by_telegram_id(telegram_id)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create events")
    
    event = Event(
        **event_data.model_dump(),
        created_by=user.id
    )
    
    doc = event.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['event_date'] = doc['event_date'].isoformat()
    
    await db.events.insert_one(doc)
    return event

@api_router.get("/events", response_model=List[Event])
async def get_events():
    events = await db.events.find({}, {"_id": 0}).to_list(100)
    
    for event in events:
        if isinstance(event.get('created_at'), str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
        if isinstance(event.get('event_date'), str):
            event['event_date'] = datetime.fromisoformat(event['event_date'])
    
    return events

@api_router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if isinstance(event.get('created_at'), str):
        event['created_at'] = datetime.fromisoformat(event['created_at'])
    if isinstance(event.get('event_date'), str):
        event['event_date'] = datetime.fromisoformat(event['event_date'])
    
    return event

@api_router.patch("/events/{event_id}/managers")
async def assign_event_managers(event_id: str, data: EventManagerAssign, telegram_id: int):
    """Assign managers to an event (only admins)"""
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Only admins can assign event managers")
    
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Update managers
    result = await db.events.update_one(
        {"id": event_id},
        {"$set": {"managers": data.manager_telegram_ids}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event managers updated", "managers": data.manager_telegram_ids}

@api_router.delete("/events/{event_id}/participants/{participant_id}")
async def remove_event_participant(event_id: str, participant_id: int, telegram_id: int):
    """Remove participant from event (admins and event managers)"""
    if not await is_event_manager(telegram_id, event_id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    participants = event.get('participants', [])
    if participant_id in participants:
        participants.remove(participant_id)
        await db.events.update_one(
            {"id": event_id},
            {"$set": {"participants": participants}}
        )
    
    return {"message": "Participant removed"}

@api_router.get("/events/{event_id}/participants")
async def get_event_participants(event_id: str, telegram_id: int):
    """Get detailed participant list (admins and event managers)"""
    if not await is_event_manager(telegram_id, event_id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    participant_ids = event.get('participants', [])
    
    # Get user details for participants
    participants = []
    for tid in participant_ids:
        user = await get_user_by_telegram_id(tid)
        if user:
            participants.append({
                "telegram_id": user.telegram_id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name
            })
    
    return {"participants": participants, "total": len(participants)}

# Booking endpoints
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate, telegram_id: int):
    user = await get_user_by_telegram_id(telegram_id)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create bookings")
    
    booking = Booking(
        **booking_data.model_dump(),
        created_by=user.id
    )
    
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookings.insert_one(doc)
    return booking

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    bookings = await db.bookings.find({"is_active": True}, {"_id": 0}).to_list(100)
    
    for booking in bookings:
        if isinstance(booking.get('created_at'), str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return bookings

# Member endpoints
@api_router.get("/members", response_model=List[User])
async def get_members(telegram_id: int):
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = await db.users.find({}, {"_id": 0}).to_list(1000)
    
    for user in users:
        if isinstance(user.get('registered_at'), str):
            user['registered_at'] = datetime.fromisoformat(user['registered_at'])
        if isinstance(user.get('last_interaction'), str):
            user['last_interaction'] = datetime.fromisoformat(user['last_interaction'])
    
    return users

@api_router.patch("/members/{user_id}/role")
async def update_member_role(user_id: str, role: UserRole, telegram_id: int):
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"role": role}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Role updated"}

# Fee endpoints
@api_router.post("/fees", response_model=Fee)
async def create_fee(fee_data: FeeCreate, telegram_id: int):
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    fee = Fee(**fee_data.model_dump())
    
    doc = fee.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc.get('paid_at'):
        doc['paid_at'] = doc['paid_at'].isoformat()
    
    await db.fees.insert_one(doc)
    return fee

@api_router.get("/fees", response_model=List[Fee])
async def get_fees(telegram_id: int, user_filter: Optional[int] = None):
    if not await is_admin(telegram_id) and user_filter != telegram_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    query = {}
    if user_filter:
        query["user_telegram_id"] = user_filter
    
    fees = await db.fees.find(query, {"_id": 0}).to_list(1000)
    
    for fee in fees:
        if isinstance(fee.get('created_at'), str):
            fee['created_at'] = datetime.fromisoformat(fee['created_at'])
        if fee.get('paid_at') and isinstance(fee['paid_at'], str):
            fee['paid_at'] = datetime.fromisoformat(fee['paid_at'])
    
    return fees

@api_router.patch("/fees/{fee_id}/pay")
async def mark_fee_paid(fee_id: str, telegram_id: int):
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.fees.update_one(
        {"id": fee_id},
        {"$set": {"is_paid": True, "paid_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Fee not found")
    
    return {"message": "Fee marked as paid"}

# Notification endpoints
@api_router.post("/notifications/send")
async def send_notification(notification_data: NotificationCreate, telegram_id: int):
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if not TELEGRAM_TOKEN:
        raise HTTPException(status_code=500, detail="Telegram token not configured")
    
    bot = Bot(token=TELEGRAM_TOKEN)
    
    sent_to = []
    
    if notification_data.send_to_all:
        # Get all active users
        users = await db.users.find({"is_active": True}, {"_id": 0}).to_list(1000)
        target_users = users
    else:
        # Get users from specified groups
        target_users = []
        for group_id in notification_data.group_ids:
            group = await db.user_groups.find_one({"id": group_id}, {"_id": 0})
            if group:
                for member_id in group.get('members', []):
                    user = await get_user_by_telegram_id(member_id)
                    if user and user.is_active:
                        target_users.append({
                            'telegram_id': user.telegram_id
                        })
    
    # Remove duplicates
    unique_ids = set()
    unique_users = []
    for user in target_users:
        if user['telegram_id'] not in unique_ids:
            unique_ids.add(user['telegram_id'])
            unique_users.append(user)
    
    for user in unique_users:
        try:
            await bot.send_message(
                chat_id=user['telegram_id'],
                text=f"📢 {notification_data.message}"
            )
            sent_to.append(user['telegram_id'])
        except Exception as e:
            logging.error(f"Failed to send to {user['telegram_id']}: {e}")
    
    # Save notification
    user_obj = await get_user_by_telegram_id(telegram_id)
    notification = Notification(
        message=notification_data.message,
        sent_to=sent_to,
        sent_by=user_obj.id if user_obj else ""
    )
    
    doc = notification.model_dump()
    doc['sent_at'] = doc['sent_at'].isoformat()
    await db.notifications.insert_one(doc)
    
    return {"message": f"Notification sent to {len(sent_to)} users", "count": len(sent_to)}

# User Groups endpoints
@api_router.post("/groups", response_model=UserGroup)
async def create_group(group_data: UserGroupCreate, telegram_id: int):
    """Create a new user group (admins only)"""
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    user = await get_user_by_telegram_id(telegram_id)
    
    group = UserGroup(
        name=group_data.name,
        description=group_data.description,
        members=group_data.member_telegram_ids,
        created_by=user.id
    )
    
    doc = group.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.user_groups.insert_one(doc)
    return group

@api_router.get("/groups", response_model=List[UserGroup])
async def get_groups(telegram_id: int):
    """Get all user groups (admins only)"""
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    groups = await db.user_groups.find({}, {"_id": 0}).to_list(100)
    
    for group in groups:
        if isinstance(group.get('created_at'), str):
            group['created_at'] = datetime.fromisoformat(group['created_at'])
    
    return groups

@api_router.get("/groups/{group_id}", response_model=UserGroup)
async def get_group(group_id: str, telegram_id: int):
    """Get group details (admins only)"""
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    group = await db.user_groups.find_one({"id": group_id}, {"_id": 0})
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    if isinstance(group.get('created_at'), str):
        group['created_at'] = datetime.fromisoformat(group['created_at'])
    
    return group

@api_router.patch("/groups/{group_id}/members")
async def update_group_members(group_id: str, member_telegram_ids: List[int], telegram_id: int):
    """Update group members (admins only)"""
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.user_groups.update_one(
        {"id": group_id},
        {"$set": {"members": member_telegram_ids}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Group not found")
    
    return {"message": "Group members updated", "count": len(member_telegram_ids)}

@api_router.delete("/groups/{group_id}")
async def delete_group(group_id: str, telegram_id: int):
    """Delete a group (admins only)"""
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.user_groups.delete_one({"id": group_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Group not found")
    
    return {"message": "Group deleted"}

@api_router.get("/groups/{group_id}/members")
async def get_group_members(group_id: str, telegram_id: int):
    """Get detailed member list of a group (admins only)"""
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    group = await db.user_groups.find_one({"id": group_id}, {"_id": 0})
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    member_ids = group.get('members', [])
    
    # Get user details for members
    members = []
    for tid in member_ids:
        user = await get_user_by_telegram_id(tid)
        if user:
            members.append({
                "telegram_id": user.telegram_id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role
            })
    
    return {"members": members, "total": len(members)}

# Statistics
@api_router.get("/statistics")
async def get_statistics(telegram_id: int):
    if not await is_admin(telegram_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_users = await db.users.count_documents({})
    active_polls = await db.polls.count_documents({"is_active": True})
    upcoming_events = await db.events.count_documents({"status": EventStatus.UPCOMING})
    active_bookings = await db.bookings.count_documents({"is_active": True})
    unpaid_fees = await db.fees.count_documents({"is_paid": False})
    
    return {
        "total_members": total_users,
        "active_polls": active_polls,
        "upcoming_events": upcoming_events,
        "active_bookings": active_bookings,
        "unpaid_fees": unpaid_fees
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()