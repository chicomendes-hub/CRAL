# 🔧 Configurazione File .env - Guida Completa

## ⚠️ IMPORTANTE: Cosa sono i file .env?

I file `.env` contengono **variabili d'ambiente** sensibili (chiavi, password, URL) e **NON vengono salvati su GitHub** per motivi di sicurezza.

Quando scarichi il progetto da GitHub, **devi creare questi file manualmente**.

---

## 📋 PASSO 1: Crea i File .env

### Backend (.env)

1. **Apri la cartella** `backend` del progetto
2. **Crea un nuovo file** chiamato `.env` (attenzione al punto iniziale!)
3. **Copia il contenuto** da `/app/backend/.env.example`
4. **Configura i valori** (vedi sotto)

**Su Windows:**
```bash
# Vai nella cartella backend
cd backend

# Crea il file (usa il Blocco Note o un editor di testo)
notepad .env
```

**Su Mac/Linux:**
```bash
# Vai nella cartella backend
cd backend

# Copia il file di esempio
cp .env.example .env

# Modifica il file
nano .env
# oppure
code .env  # se usi VS Code
```

### Frontend (.env)

1. **Apri la cartella** `frontend` del progetto
2. **Crea un nuovo file** chiamato `.env`
3. **Copia il contenuto** da `/app/frontend/.env.example`
4. **Configura i valori** (vedi sotto)

**Su Windows/Mac/Linux:**
```bash
# Vai nella cartella frontend
cd frontend

# Copia il file di esempio
cp .env.example .env
```

---

## 📝 PASSO 2: Configura Backend .env

Apri il file `/app/backend/.env` e configura questi valori:

```env
# DATABASE
MONGO_URL="mongodb://localhost:27017"
DB_NAME="cral_lecce"

# CORS
CORS_ORIGINS="*"

# TELEGRAM BOT TOKEN
TELEGRAM_TOKEN="IL_TUO_TOKEN_DA_BOTFATHER"

# WEBHOOK SECRET
WEBHOOK_SECRET="cral_lecce_secret_2026"
```

### Cosa Configurare:

| Variabile | Valore | Dove Ottenerlo |
|-----------|--------|----------------|
| `MONGO_URL` | `mongodb://localhost:27017` | Lascia così (MongoDB locale) |
| `DB_NAME` | `cral_lecce` | Puoi cambiarlo se vuoi |
| `CORS_ORIGINS` | `*` | Lascia così per sviluppo |
| `TELEGRAM_TOKEN` | **DA CONFIGURARE** | Vedi sotto ⬇️ |
| `WEBHOOK_SECRET` | `cral_lecce_secret_2026` | Lascia così o cambia |

### 🤖 Come Ottenere il TELEGRAM_TOKEN:

1. **Apri Telegram** sul telefono o PC
2. **Cerca @BotFather**
3. **Invia** `/newbot`
4. **Segui le istruzioni**:
   - Nome: `CRAL Lecce Bot`
   - Username: `cral_lecce_bot`
5. **BotFather ti darà un TOKEN** tipo:
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
6. **COPIA questo token** e incollalo nel file `.env`

**Guida dettagliata:** Vedi `/app/ISTRUZIONI_BOTFATHER.md`

---

## 📝 PASSO 3: Configura Frontend .env

Apri il file `/app/frontend/.env` e configura:

```env
REACT_APP_BACKEND_URL="http://localhost:8001"
```

### Per Sviluppo Locale:

```env
REACT_APP_BACKEND_URL="http://localhost:8001"
```

### Per Produzione/Deploy:

```env
REACT_APP_BACKEND_URL="https://tuo-app.preview.emergentagent.com"
```

⚠️ **IMPORTANTE:** 
- Non mettere `/` alla fine dell'URL
- Usa `http://` per locale, `https://` per produzione

---

## ✅ PASSO 4: Verifica la Configurazione

### Controlla che i file esistano:

**Su Windows:**
```bash
# Backend
dir backend\.env

# Frontend
dir frontend\.env
```

**Su Mac/Linux:**
```bash
# Backend
ls -la backend/.env

# Frontend
ls -la frontend/.env
```

Se vedi i file, sei a posto! ✅

### Controlla il contenuto:

**Backend:**
```bash
cat backend/.env
```

Dovresti vedere qualcosa tipo:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="cral_lecce"
CORS_ORIGINS="*"
TELEGRAM_TOKEN="123456789:ABCdefGHI..."
WEBHOOK_SECRET="cral_lecce_secret_2026"
```

**Frontend:**
```bash
cat frontend/.env
```

Dovresti vedere:
```env
REACT_APP_BACKEND_URL="http://localhost:8001"
```

---

## 🚨 Problemi Comuni

### "File .env non trovato"

**Causa:** Il file non esiste o ha un nome sbagliato

**Soluzione:**
```bash
# Controlla se il file esiste
ls -la backend/.env

# Se non esiste, crealo
cp backend/.env.example backend/.env
```

### "Il file .env è nascosto!"

**Causa:** I file che iniziano con `.` sono nascosti per impostazione predefinita

**Soluzione Windows:**
1. Apri Esplora Risorse
2. Vai su "Visualizza"
3. Spunta "Elementi nascosti"

**Soluzione Mac:**
1. Apri Finder
2. Premi `Cmd + Shift + .` (punto)
3. I file nascosti appariranno

**Soluzione Linux:**
- I file nascosti sono visibili con `ls -la`
- Nel file manager, abilita "Mostra file nascosti"

### "Backend non si avvia dopo configurazione .env"

**Causa:** Token Telegram non valido o MongoDB non avviato

**Soluzione:**
```bash
# 1. Verifica MongoDB
mongosh mongodb://localhost:27017

# 2. Controlla il token nel .env
grep TELEGRAM_TOKEN backend/.env

# 3. Verifica che non ci siano spazi extra
# ❌ SBAGLIATO: TELEGRAM_TOKEN=" 123456789:ABC "
# ✅ CORRETTO:  TELEGRAM_TOKEN="123456789:ABC"
```

### "Frontend non si connette al backend"

**Causa:** URL backend sbagliato nel .env frontend

**Soluzione:**
```bash
# Controlla l'URL
grep REACT_APP_BACKEND_URL frontend/.env

# Deve essere:
# REACT_APP_BACKEND_URL="http://localhost:8001"
# NON http://localhost:8001/
# NON http://localhost:8001/api
```

---

## 📋 Checklist Finale

Prima di avviare l'applicazione, verifica:

- [ ] File `backend/.env` esiste
- [ ] File `frontend/.env` esiste
- [ ] `TELEGRAM_TOKEN` configurato nel backend .env
- [ ] Token Telegram è valido (senza spazi)
- [ ] `REACT_APP_BACKEND_URL` è `http://localhost:8001`
- [ ] MongoDB è installato e avviato
- [ ] Non ci sono spazi extra nelle variabili

Se tutti i punti sono ✅, puoi avviare l'applicazione!

---

## 🚀 Prossimi Passi

Dopo aver configurato i file .env:

1. **Avvia MongoDB** (se non è già avviato)
2. **Avvia il backend**:
   ```bash
   cd backend
   python server.py
   ```
3. **Avvia il frontend** (in un altro terminale):
   ```bash
   cd frontend
   yarn start
   ```
4. **Apri il browser** su http://localhost:3000

---

## 💡 Suggerimenti

### Backup delle configurazioni

Salva i tuoi valori .env in un posto sicuro (NON su GitHub!):
- Password manager
- File crittografato locale
- Note sicure

### File .env per diversi ambienti

Puoi creare:
- `.env.local` - sviluppo locale
- `.env.production` - produzione
- `.env.test` - testing

### Variabili d'ambiente nel sistema

Invece di usare file .env, puoi configurare le variabili nel sistema:

**Windows:**
```bash
setx TELEGRAM_TOKEN "123456789:ABC"
```

**Mac/Linux:**
```bash
export TELEGRAM_TOKEN="123456789:ABC"
```

---

## 📞 Serve Aiuto?

Se hai ancora problemi:

1. ✅ Rileggi questa guida
2. ✅ Controlla gli errori nel terminale
3. ✅ Verifica che MongoDB sia avviato
4. ✅ Controlla i log: `tail -f backend/logs/*.log`

---

**Ora i tuoi file .env sono configurati correttamente! 🎉**
