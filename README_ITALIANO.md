# 🤖 Bot Telegram CRAL Palazzo di Giustizia Lecce

Benvenuto nel bot Telegram per la gestione del CRAL del Palazzo di Giustizia di Lecce!

## 📋 Funzionalità

### ✅ Gestione Sondaggi
- **Sondaggi Sì/No**: Voti rapidi con due opzioni
- **Scelta Multipla**: Sondaggi con più opzioni tra cui scegliere
- **Risposta Testuale**: Raccolta di feedback testuali dai membri
- Visualizzazione risultati in tempo reale
- Sistema di votazione semplice tramite pulsanti inline

### 📅 Gestione Eventi
- Creazione eventi con data, ora e luogo
- Iscrizioni membri con limite partecipanti (opzionale)
- Tracciamento partecipanti in tempo reale
- Stati evento: Prossimo, In Corso, Completato, Annullato
- Notifiche automatiche agli iscritti

### 🎫 Sistema Prenotazioni
- Gestione prenotazioni per attività e servizi
- Controllo posti disponibili
- Prenotazione/cancellazione semplificata via bot
- Monitoraggio occupazione in tempo reale

### 💰 Quote Associative
- Registrazione quote annuali per membro
- Tracciamento pagamenti
- Storico quote per anno
- Report quote pagate/da pagare
- Verifica stato quote personali via bot

### 📢 Sistema Notifiche
- Invio messaggi broadcast a tutti i membri
- Notifiche personalizzate
- Tracciamento messaggi inviati
- Sistema di messaggistica sicuro

### 👥 Gestione Membri
- Registrazione automatica al primo utilizzo del bot
- Sistema ruoli: Admin e Membri
- Promozione/retrocessione ruoli
- Statistiche membri attivi
- Storico interazioni

## 🚀 Come Iniziare

### Passo 1: Crea il Bot Telegram

**IMPORTANTE**: Devi prima creare il bot su Telegram seguendo le istruzioni nel file:
📄 **[ISTRUZIONI_BOTFATHER.md](/app/ISTRUZIONI_BOTFATHER.md)**

Questo file contiene:
- Guida passo-passo per creare il bot con BotFather
- Come ottenere il TOKEN necessario
- Configurazione comandi del bot
- Personalizzazione nome e icona

### Passo 2: Configura le Variabili d'Ambiente

Dopo aver ottenuto il TOKEN da BotFather:

1. Apri il file `/app/backend/.env`
2. Sostituisci il valore di `TELEGRAM_TOKEN`:
   ```env
   TELEGRAM_TOKEN="il_tuo_token_ricevuto_da_botfather"
   ```
3. Salva il file
4. Riavvia il backend:
   ```bash
   sudo supervisorctl restart backend
   ```

### Passo 3: Accedi alla Dashboard Admin

1. Apri l'URL della dashboard: **https://curious-ruminant-rqolwj.preview.emergentagent.com**
2. Inserisci il tuo Telegram ID (ottienilo da [@userinfobot](https://t.me/userinfobot))
3. Accedi e inizia a gestire il CRAL!

### Passo 4: Diventa Admin

Per default, tutti gli utenti sono "membri". Per diventare admin:

#### Opzione A: Via MongoDB (consigliata)
```bash
# Connettiti a MongoDB
mongosh mongodb://localhost:27017/test_database

# Trova il tuo utente e rendilo admin
db.users.updateOne(
  { telegram_id: IL_TUO_TELEGRAM_ID },
  { $set: { role: "admin" } }
)
```

#### Opzione B: Via Dashboard
Dopo aver fatto login come primo utente, usa la sezione "Membri" per promuoverti ad admin.

## 📱 Comandi Bot per Utenti

Gli utenti possono interagire con il bot usando questi comandi:

```
/start - Inizia a usare il bot e registrati
/help - Mostra tutti i comandi disponibili
/sondaggi - Visualizza i sondaggi attivi
/eventi - Visualizza gli eventi prossimi
/prenotazioni - Visualizza le prenotazioni disponibili
/mie_quote - Controlla le tue quote associative
```

## 👨‍💼 Dashboard Admin

La dashboard web permette agli admin di:

### 📊 Dashboard
- Visualizzazione statistiche generali
- Membri totali
- Sondaggi, eventi e prenotazioni attive
- Quote da pagare

### 📊 Sondaggi
- Crea nuovi sondaggi (tutti i tipi)
- Visualizza risultati
- Gestisci sondaggi attivi
- Elimina sondaggi

### 📅 Eventi
- Crea nuovi eventi
- Imposta data, ora, luogo
- Limita numero partecipanti
- Monitora iscrizioni

### 🎫 Prenotazioni
- Crea nuove prenotazioni
- Imposta posti disponibili
- Monitora occupazione

### 👥 Membri
- Visualizza tutti i membri
- Promuovi/retrocedi admin
- Vedi statistiche membri

### 💰 Quote
- Aggiungi nuove quote
- Segna quote come pagate
- Visualizza storico pagamenti
- Report quote per anno

### 📢 Notifiche
- Invia messaggi a tutti i membri
- Comunicazioni importanti
- Annunci CRAL

## 🛠 Tecnologie Utilizzate

### Backend
- **FastAPI** - Framework web moderno e veloce
- **python-telegram-bot** - Libreria per interazione con Telegram
- **MongoDB** - Database NoSQL per persistenza dati
- **Motor** - Driver MongoDB asincrono

### Frontend
- **React** - Libreria UI moderna
- **React Router** - Gestione routing
- **Axios** - Client HTTP
- **Tailwind CSS** - Framework CSS utility-first
- **Sonner** - Sistema notifiche toast
- **Lucide React** - Icone moderne

## 📁 Struttura Progetto

```
/app/
├── backend/
│   ├── server.py           # Server FastAPI con tutte le API
│   ├── .env                # Variabili d'ambiente
│   └── requirements.txt    # Dipendenze Python
│
├── frontend/
│   ├── src/
│   │   ├── App.js          # Componente principale con routing
│   │   ├── App.css         # Stili globali
│   │   ├── pages/          # Pagine dell'applicazione
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Polls.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── Members.jsx
│   │   │   ├── Fees.jsx
│   │   │   └── Notifications.jsx
│   │   └── components/
│   │       └── Layout.jsx  # Layout con sidebar
│   ├── package.json        # Dipendenze Node.js
│   └── .env                # Variabili d'ambiente frontend
│
├── ISTRUZIONI_BOTFATHER.md # Guida creazione bot
└── README_ITALIANO.md      # Questo file
```

## 🔐 Sicurezza

- ⚠️ **NON condividere mai il TELEGRAM_TOKEN**
- 🔒 Il WEBHOOK_SECRET protegge l'endpoint webhook
- 👤 Sistema ruoli previene accessi non autorizzati
- ✅ Validazione input su tutti gli endpoint

## 🗄️ Modelli Database (MongoDB)

### Users (Utenti)
- `telegram_id` - ID univoco Telegram
- `username` - Username Telegram
- `first_name`, `last_name` - Nome cognome
- `role` - admin/member
- `is_active` - Stato attivo
- `registered_at` - Data registrazione

### Polls (Sondaggi)
- `title` - Titolo
- `description` - Descrizione
- `poll_type` - yes_no/multiple_choice/text_response
- `options` - Lista opzioni (per scelta multipla)
- `votes` - Dizionario voti
- `is_active` - Stato attivo

### Events (Eventi)
- `title` - Titolo
- `description` - Descrizione
- `event_date` - Data evento
- `location` - Luogo
- `max_participants` - Limite partecipanti
- `participants` - Lista telegram_id iscritti
- `status` - upcoming/ongoing/completed/cancelled

### Bookings (Prenotazioni)
- `title` - Titolo
- `description` - Descrizione
- `available_slots` - Posti disponibili
- `booked_by` - Lista telegram_id prenotati

### Fees (Quote)
- `user_telegram_id` - ID utente
- `amount` - Importo
- `year` - Anno
- `is_paid` - Stato pagamento
- `paid_at` - Data pagamento

### Notifications (Notifiche)
- `message` - Messaggio
- `sent_to` - Lista destinatari
- `sent_by` - ID mittente
- `sent_at` - Data invio

## 🔧 Configurazione Webhook (Produzione)

Per usare il bot in produzione, devi configurare il webhook:

```python
import asyncio
from telegram import Bot

async def setup_webhook():
    bot = Bot(token="TUO_TELEGRAM_TOKEN")
    webhook_url = "https://tuo-dominio.com/api/telegram/webhook/WEBHOOK_SECRET"
    await bot.set_webhook(url=webhook_url)
    print("Webhook configurato!")

asyncio.run(setup_webhook())
```

## 📞 API Endpoints

### Telegram
- `POST /api/telegram/webhook/{secret}` - Webhook Telegram

### Polls
- `POST /api/polls` - Crea sondaggio
- `GET /api/polls` - Lista sondaggi
- `GET /api/polls/{id}` - Dettaglio sondaggio
- `DELETE /api/polls/{id}` - Elimina sondaggio

### Events
- `POST /api/events` - Crea evento
- `GET /api/events` - Lista eventi
- `GET /api/events/{id}` - Dettaglio evento

### Bookings
- `POST /api/bookings` - Crea prenotazione
- `GET /api/bookings` - Lista prenotazioni

### Members
- `GET /api/members` - Lista membri
- `PATCH /api/members/{id}/role` - Cambia ruolo

### Fees
- `POST /api/fees` - Crea quota
- `GET /api/fees` - Lista quote
- `PATCH /api/fees/{id}/pay` - Segna come pagata

### Notifications
- `POST /api/notifications/send` - Invia notifica

### Statistics
- `GET /api/statistics` - Statistiche generali

## 🎯 Esempi d'Uso

### Creare un Sondaggio Sì/No
1. Accedi alla dashboard admin
2. Vai su "Sondaggi"
3. Clicca "Nuovo Sondaggio"
4. Compila:
   - Titolo: "Organizziamo una gita?"
   - Tipo: Sì/No
5. I membri riceveranno il sondaggio e potranno votare dal bot

### Organizzare un Evento
1. Vai su "Eventi"
2. Clicca "Nuovo Evento"
3. Compila:
   - Titolo: "Cena di Natale 2026"
   - Descrizione: "Cena presso ristorante..."
   - Data: 20/12/2026 20:00
   - Luogo: "Ristorante La Bella Vista"
   - Max partecipanti: 50
4. I membri potranno iscriversi dal bot

### Inviare una Notifica
1. Vai su "Notifiche"
2. Scrivi il messaggio
3. Clicca "Invia Notifica"
4. Tutti i membri attivi riceveranno il messaggio

## 🐛 Risoluzione Problemi

### Il bot non risponde
- ✅ Verifica che il TOKEN sia corretto in `.env`
- ✅ Controlla che il backend sia attivo: `sudo supervisorctl status backend`
- ✅ Guarda i log: `tail -f /var/log/supervisor/backend.*.log`

### Errore "Not authorized" nelle API
- ✅ Verifica di essere admin nel database
- ✅ Controlla di passare il `telegram_id` nelle richieste

### Il webhook non funziona
- ✅ Verifica che il `WEBHOOK_SECRET` sia corretto
- ✅ Configura il webhook con il comando corretto
- ✅ Usa HTTPS in produzione (Telegram lo richiede)

## 📚 Risorse Utili

- **BotFather**: https://t.me/BotFather
- **Trova Telegram ID**: https://t.me/userinfobot
- **Documentazione Telegram Bot API**: https://core.telegram.org/bots/api
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev

## 🎉 Buon Lavoro!

Il bot è ora pronto per essere utilizzato dal CRAL del Palazzo di Giustizia di Lecce!

Per qualsiasi domanda o problema, consulta la documentazione o contatta il supporto.

---

**Made with ❤️ for CRAL Lecce**
