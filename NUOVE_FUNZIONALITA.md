# 🆕 Nuove Funzionalità - Bot Telegram CRAL

## Aggiornamenti Recenti

### 1. 👨‍💼 Ruolo Gestore Eventi

Ora è possibile assegnare **gestori specifici** per ogni evento!

#### Cosa può fare un Gestore Eventi?

- ✅ Visualizzare i partecipanti dell'evento
- ✅ Rimuovere partecipanti dall'evento
- ✅ Gestire le iscrizioni
- ✅ Accedere ai dettagli completi dei partecipanti

#### Come funziona?

**Per gli Admin:**
1. Vai su **"Eventi"** nella dashboard
2. Clicca su **"Gestisci Partecipanti"** su un evento
3. Clicca su **"Modifica Gestori"**
4. Seleziona i membri con ruolo "Gestore Eventi" o "Admin"
5. Salva le modifiche

**Per i Gestori Eventi:**
- Accedi alla sezione Eventi
- Puoi gestire SOLO gli eventi dove sei stato assegnato come gestore
- Visualizzi e gestisci i partecipanti dei tuoi eventi

#### Ruoli Disponibili

| Ruolo | Permessi Eventi |
|-------|----------------|
| **Admin** | Può gestire tutti gli eventi e assegnare gestori |
| **Gestore Eventi** | Può gestire solo gli eventi assegnati |
| **Membro** | Può solo iscriversi agli eventi |

#### Come rendere un utente Gestore Eventi?

**Via Dashboard:**
1. Vai su **"Membri"**
2. Trova l'utente
3. Clicca **"Cambia Ruolo"**
4. Seleziona "event_manager"

**Via MongoDB:**
```javascript
db.users.updateOne(
  { telegram_id: TELEGRAM_ID_UTENTE },
  { $set: { role: "event_manager" } }
)
```

---

### 2. 👥 Gruppi Utenti per Notifiche Mirate

Crea **sottogruppi di utenti** per inviare notifiche specifiche!

#### Funzionalità Gruppi

- ✅ Crea gruppi personalizzati di membri
- ✅ Aggiungi/rimuovi membri dai gruppi
- ✅ Visualizza dettagli membri di ogni gruppo
- ✅ Elimina gruppi non più necessari
- ✅ Invia notifiche a gruppi specifici

#### Come Creare un Gruppo?

1. Vai su **"Gruppi"** nel menu laterale
2. Clicca **"Nuovo Gruppo"**
3. Compila:
   - **Nome**: Es. "Membri Attivi 2026"
   - **Descrizione**: Descrizione opzionale
   - **Seleziona Membri**: Spunta i membri da includere
4. Clicca **"Crea Gruppo"**

#### Esempi di Utilizzo Gruppi

**Gruppo "Organizzatori"**
- Membri che organizzano eventi
- Notifiche per coordinamento attività

**Gruppo "Nuovi Membri"**
- Membri iscritti da meno di 3 mesi
- Notifiche di benvenuto e informazioni

**Gruppo "Interessati Sport"**
- Membri interessati ad attività sportive
- Notifiche per tornei e partite

**Gruppo "Volontari"**
- Membri disponibili per volontariato
- Richieste di aiuto per eventi

#### Come Inviare Notifiche a un Gruppo?

1. Vai su **"Notifiche"**
2. Seleziona **"Gruppi specifici"** invece di "Tutti i membri"
3. Spunta i gruppi destinatari
4. Scrivi il messaggio
5. Clicca **"Invia Notifica"**

**Puoi selezionare più gruppi contemporaneamente!**

#### Gestione Gruppi

**Visualizzare Membri di un Gruppo:**
- Nella pagina Gruppi, clicca **"Vedi Membri"**
- Visualizzi l'elenco completo con dettagli

**Eliminare un Gruppo:**
- Clicca l'icona cestino sul gruppo
- Conferma l'eliminazione
- ⚠️ L'eliminazione è permanente!

---

## 📊 Nuovi Endpoint API

### Eventi - Gestione Gestori

```bash
# Assegna gestori a un evento (solo admin)
PATCH /api/events/{event_id}/managers
Body: {
  "manager_telegram_ids": [123456789, 987654321]
}

# Ottieni partecipanti evento (admin e gestori)
GET /api/events/{event_id}/participants?telegram_id={user_id}

# Rimuovi partecipante (admin e gestori)
DELETE /api/events/{event_id}/participants/{participant_id}?telegram_id={user_id}
```

### Gruppi Utenti

```bash
# Crea gruppo (solo admin)
POST /api/groups?telegram_id={user_id}
Body: {
  "name": "Nome Gruppo",
  "description": "Descrizione",
  "member_telegram_ids": [123456789, 987654321]
}

# Lista gruppi (solo admin)
GET /api/groups?telegram_id={user_id}

# Dettagli gruppo (solo admin)
GET /api/groups/{group_id}?telegram_id={user_id}

# Membri di un gruppo (solo admin)
GET /api/groups/{group_id}/members?telegram_id={user_id}

# Aggiorna membri gruppo (solo admin)
PATCH /api/groups/{group_id}/members?telegram_id={user_id}
Body: [123456789, 987654321]

# Elimina gruppo (solo admin)
DELETE /api/groups/{group_id}?telegram_id={user_id}
```

### Notifiche Aggiornate

```bash
# Invia notifica (supporta gruppi)
POST /api/notifications/send?telegram_id={user_id}
Body: {
  "message": "Testo messaggio",
  "send_to_all": false,           # true = tutti, false = gruppi
  "group_ids": ["group_id_1", "group_id_2"]  # se send_to_all=false
}
```

---

## 🗄️ Nuovi Modelli Database

### UserGroup (Gruppi Utenti)
```javascript
{
  "id": "uuid",
  "name": "Nome gruppo",
  "description": "Descrizione opzionale",
  "members": [123456789, 987654321],  // telegram_ids
  "created_by": "user_id",
  "created_at": "2026-01-15T10:00:00"
}
```

### Event (Aggiornato)
```javascript
{
  "id": "uuid",
  "title": "Titolo evento",
  // ... campi esistenti ...
  "managers": [123456789, 987654321],  // NEW: telegram_ids dei gestori
  "participants": [111111111, 222222222]
}
```

### User (Aggiornato)
```javascript
{
  "id": "uuid",
  "telegram_id": 123456789,
  "role": "admin" | "event_manager" | "member",  // NEW: event_manager
  // ... altri campi ...
}
```

---

## 🎯 Casi d'Uso Pratici

### Caso 1: Evento con Gestori Multipli

**Scenario:** Organizzate un torneo di calcetto con 3 responsabili

1. **Admin** crea l'evento "Torneo Calcetto 2026"
2. **Admin** assegna 3 gestori (Mario, Luigi, Paolo)
3. I **gestori** possono:
   - Vedere chi si è iscritto
   - Rimuovere iscrizioni duplicate
   - Monitorare il numero di partecipanti
4. I **membri** si iscrivono normalmente dal bot

**Vantaggi:**
- Delega responsabilità
- Più persone possono gestire
- Admin non deve fare tutto

---

### Caso 2: Notifiche Mirate per Gruppi

**Scenario:** Organizzi una gita e vuoi avvisare solo chi ha partecipato all'evento precedente

1. Crea un gruppo **"Partecipanti Gita Precedente"**
2. Aggiungi manualmente i membri che hanno partecipato
3. Invia notifica **solo a questo gruppo**: "Nuova gita in programma!"
4. Solo loro ricevono la notifica

**Vantaggi:**
- Non disturbi chi non è interessato
- Comunicazione mirata
- Maggiore engagement

---

### Caso 3: Gestione Volontari

**Scenario:** Hai bisogno di volontari per un evento

1. Crea gruppo **"Volontari Disponibili"**
2. Aggiungi membri che si sono dichiarati disponibili
3. Quando serve aiuto:
   - Invia notifica solo al gruppo volontari
   - Chiedi disponibilità
   - Organizzi turni
4. Non disturbi gli altri membri

---

## 📱 Interfaccia Dashboard Aggiornata

### Menu Laterale (nuovo)

```
Dashboard
Sondaggi
Eventi
Prenotazioni
Membri
👉 Gruppi          <- NUOVO!
Quote
Notifiche
```

### Pagina Eventi (aggiornata)

Ogni card evento ora ha:
- Bottone **"Gestisci Partecipanti"**
- Modal con:
  - Sezione **Gestori Evento** (assegna/rimuovi)
  - Elenco **Partecipanti** con rimozione
  - Dettagli completi membri

### Pagina Gruppi (nuova)

- Card per ogni gruppo con:
  - Nome e descrizione
  - Numero membri
  - Bottone "Vedi Membri"
  - Bottone elimina
- Modal creazione gruppo con selezione membri

### Pagina Notifiche (aggiornata)

- Radio button:
  - ⚪ Tutti i membri
  - ⚪ Gruppi specifici
- Se "Gruppi specifici":
  - Lista gruppi con checkbox
  - Contatore gruppi selezionati
  - Info numero membri totale

---

## 🔧 Configurazione Ruoli

### Rendere un utente Gestore Eventi

**MongoDB:**
```javascript
// Connetti al database
mongosh mongodb://localhost:27017/cral_lecce

// Trova l'utente e cambia ruolo
db.users.updateOne(
  { telegram_id: 123456789 },
  { $set: { role: "event_manager" } }
)

// Verifica
db.users.findOne({ telegram_id: 123456789 })
```

**Dashboard (prossimamente):**
- Funzione cambio ruolo direttamente dalla pagina Membri

---

## ✨ Miglioramenti Futuri Suggeriti

### Per i Gruppi:
- 📊 Statistiche di engagement per gruppo
- 🔄 Sincronizzazione automatica (es: "tutti i nuovi iscritti")
- 📝 Log storico notifiche per gruppo

### Per i Gestori Eventi:
- 📧 Notifiche automatiche ai gestori quando qualcuno si iscrive
- 📊 Dashboard dedicata per gestori con i loro eventi
- ✅ Sistema di check-in partecipanti il giorno dell'evento

### Per il Bot:
- 🤖 Comando `/miei_eventi` per vedere eventi dove sei gestore
- 📋 Lista partecipanti direttamente dal bot per i gestori
- 🔔 Alert automatici quando evento raggiunge max partecipanti

---

## 🚀 Come Iniziare

1. **Aggiorna il codice** (già fatto! ✅)
2. **Riavvia backend e frontend** (già fatto! ✅)
3. **Crea il tuo primo gruppo**:
   - Vai su Gruppi → Nuovo Gruppo
   - Aggiungi alcuni membri
4. **Testa le notifiche mirate**:
   - Vai su Notifiche
   - Seleziona il gruppo
   - Invia un messaggio di test
5. **Assegna un gestore a un evento**:
   - Crea un evento
   - Clicca "Gestisci Partecipanti"
   - Aggiungi un gestore

---

**Le nuove funzionalità sono operative! 🎉**

Per domande o supporto, consulta la documentazione completa.
