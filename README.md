# 🤖 Bot Telegram CRAL - Guida Setup Rapido

## ⚠️ PRIMO PASSO: File .env Mancanti?

Quando scarichi il progetto da GitHub, **i file `.env` non ci sono** (per motivi di sicurezza).

### ✨ Soluzione Rapida (Consigliata)

Usa lo script automatico per creare i file `.env`:

**Mac/Linux:**
```bash
./scripts/setup_env.sh
```

**Windows:**
```cmd
scripts\setup_env.bat
```

Lo script fa tutto per te! 🎉

### 📝 Soluzione Manuale

Se preferisci configurare manualmente:

1. **Copia i file di esempio:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

2. **Configura il Telegram Token:**
   - Apri `backend/.env`
   - Inserisci il token ricevuto da @BotFather
   - Vedi [ISTRUZIONI_BOTFATHER.md](ISTRUZIONI_BOTFATHER.md)

3. **Verifica la configurazione:**
   ```bash
   cat backend/.env
   cat frontend/.env
   ```

📚 **Guida dettagliata**: [CONFIGURAZIONE_ENV.md](CONFIGURAZIONE_ENV.md)

---

## 📚 Documentazione Disponibile

| Documento | Descrizione |
|-----------|-------------|
| **[GUIDA_RAPIDA.md](GUIDA_RAPIDA.md)** | Setup in 5 minuti ⚡ |
| **[GUIDA_INSTALLAZIONE_LOCALE.md](GUIDA_INSTALLAZIONE_LOCALE.md)** | Installazione completa passo-passo 📖 |
| **[CONFIGURAZIONE_ENV.md](CONFIGURAZIONE_ENV.md)** | Guida file .env 🔧 |
| **[ISTRUZIONI_BOTFATHER.md](ISTRUZIONI_BOTFATHER.md)** | Come creare il bot Telegram 🤖 |
| **[README_ITALIANO.md](README_ITALIANO.md)** | Documentazione completa 📚 |
| **[NUOVE_FUNZIONALITA.md](NUOVE_FUNZIONALITA.md)** | Gestori eventi e gruppi 🆕 |

---

## 🚀 Setup Veloce (dopo aver configurato .env)

```bash
# 1. Installa dipendenze backend
cd backend
pip install -r requirements.txt

# 2. Installa dipendenze frontend
cd ../frontend
yarn install

# 3. Avvia MongoDB (se non è già avviato)
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
# Windows: Cerca "Services" e avvia MongoDB

# 4. Avvia backend (in un terminale)
cd backend
python server.py

# 5. Avvia frontend (in un altro terminale)
cd frontend
yarn start
```

---

## ✅ Checklist Pre-Avvio

Prima di avviare, verifica:

- [ ] File `backend/.env` esiste e configurato
- [ ] File `frontend/.env` esiste e configurato
- [ ] Telegram Token inserito in `backend/.env`
- [ ] MongoDB installato e avviato
- [ ] Dipendenze backend installate
- [ ] Dipendenze frontend installate

---

## 🆘 Problemi Comuni

### ❌ "File .env non trovato"

**Soluzione:**
```bash
./scripts/setup_env.sh
```

### ❌ "TELEGRAM_TOKEN non configurato"

**Soluzione:**
1. Crea il bot con @BotFather
2. Copia il token
3. Incollalo in `backend/.env`

### ❌ "Cannot connect to MongoDB"

**Soluzione:**
```bash
# Avvia MongoDB
# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongodb

# Windows:
# Services → MongoDB → Start
```

### ❌ "Module not found"

**Soluzione:**
```bash
# Reinstalla dipendenze
cd backend
pip install -r requirements.txt

cd frontend
yarn install
```

---

## 📖 Per Maggiori Dettagli

- **Setup completo**: Leggi [GUIDA_INSTALLAZIONE_LOCALE.md](GUIDA_INSTALLAZIONE_LOCALE.md)
- **Problemi .env**: Leggi [CONFIGURAZIONE_ENV.md](CONFIGURAZIONE_ENV.md)
- **Funzionalità**: Leggi [README_ITALIANO.md](README_ITALIANO.md)

---

## 🎉 Tutto Pronto?

Se hai configurato tutto correttamente:

1. **Backend** in ascolto su http://localhost:8001
2. **Frontend** aperto su http://localhost:3000
3. **Bot Telegram** operativo e pronto!

**Buon lavoro con il CRAL Bot! 🚀**

---

Made with ❤️ for CRAL Palazzo di Giustizia Lecce
