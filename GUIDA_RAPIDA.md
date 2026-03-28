# 🚀 Guida Rapida - Bot Telegram CRAL Lecce

## ⚡ Setup in 5 minuti

### 1️⃣ Crea il Bot Telegram (3 minuti)
1. Apri Telegram e cerca **@BotFather**
2. Invia `/newbot` e segui le istruzioni
3. **Copia il TOKEN** che riceverai (es: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

📖 Istruzioni dettagliate: [ISTRUZIONI_BOTFATHER.md](/app/ISTRUZIONI_BOTFATHER.md)

### 2️⃣ Configura il Token (1 minuto)
1. Apri `/app/backend/.env`
2. Sostituisci la riga:
   ```env
   TELEGRAM_TOKEN="IL_TUO_TOKEN_QUI"
   ```
3. Salva e riavvia:
   ```bash
   sudo supervisorctl restart backend
   ```

### 3️⃣ Diventa Admin (1 minuto)
1. Apri il bot su Telegram e invia `/start`
2. Ottieni il tuo Telegram ID da [@userinfobot](https://t.me/userinfobot)
3. Renditi admin via MongoDB:
   ```bash
   mongosh mongodb://localhost:27017/test_database
   ```
   ```javascript
   db.users.updateOne(
     { telegram_id: IL_TUO_TELEGRAM_ID },
     { $set: { role: "admin" } }
   )
   ```

### 4️⃣ Accedi alla Dashboard
- **URL**: https://curious-ruminant-rqolwj.preview.emergentagent.com
- **Login**: Inserisci il tuo Telegram ID

### 5️⃣ Inizia a usare! ✅
- Crea il tuo primo sondaggio
- Organizza un evento
- Invia una notifica ai membri

## 🎯 Funzionalità Principali

| Funzione | Descrizione | Come usarla |
|----------|-------------|-------------|
| 📊 Sondaggi | Voti Sì/No, scelta multipla, testuali | Dashboard → Sondaggi → Nuovo |
| 📅 Eventi | Organizza eventi con iscrizioni | Dashboard → Eventi → Nuovo |
| 🎫 Prenotazioni | Gestisci prenotazioni attività | Dashboard → Prenotazioni → Nuovo |
| 👥 Membri | Gestisci membri e ruoli | Dashboard → Membri |
| 💰 Quote | Traccia quote associative | Dashboard → Quote → Nuova |
| 📢 Notifiche | Messaggi broadcast | Dashboard → Notifiche |

## 🤖 Comandi Bot per Utenti

```
/start - Inizia e registrati
/help - Mostra aiuto
/sondaggi - Vedi sondaggi attivi
/eventi - Vedi eventi prossimi
/prenotazioni - Vedi prenotazioni
/mie_quote - Controlla le tue quote
```

## 📱 Test Rapido

Dopo aver configurato il bot:

1. **Apri il bot** su Telegram (cerca @il_tuo_bot_username)
2. Invia `/start` - Dovresti ricevere un messaggio di benvenuto
3. Invia `/help` - Dovresti vedere la lista comandi
4. **Dalla dashboard**, crea un sondaggio
5. **Sul bot**, invia `/sondaggi` - Dovresti vedere il sondaggio appena creato!

## 🆘 Problemi Comuni

### Il bot non risponde?
```bash
# Controlla se il backend è attivo
sudo supervisorctl status backend

# Guarda i log
tail -f /var/log/supervisor/backend.*.log

# Verifica il token
grep TELEGRAM_TOKEN /app/backend/.env
```

### Errore "Admin access required"?
```bash
# Verifica di essere admin
mongosh mongodb://localhost:27017/test_database
db.users.find({ telegram_id: IL_TUO_ID })
```

## 📚 Documentazione Completa

Per maggiori dettagli, consulta:
- 📖 [README Completo](/app/README_ITALIANO.md)
- 🤖 [Istruzioni BotFather](/app/ISTRUZIONI_BOTFATHER.md)

## ✨ Pronto!

Il tuo bot CRAL è ora operativo! 🎉

---

**Supporto**: Consulta la documentazione completa per ulteriori informazioni
