# ⚠️ Risoluzione Errori Comuni - Installazione Locale

## 🔴 Errore: emergentintegrations non trovato

### Messaggio di Errore:
```
ERROR: Could not find a version that satisfies the requirement emergentintegrations==0.1.0
ERROR: No matching distribution found for emergentintegrations==0.1.0
```

### 🤔 Perché succede?

La libreria `emergentintegrations` è **disponibile solo nell'ambiente Emergent** e non è pubblicata su PyPI pubblico.

Quando scarichi il progetto da GitHub e provi a installare le dipendenze in locale, `pip` non riesce a trovarla.

### ✅ Soluzione 1: Usa requirements.local.txt (CONSIGLIATO)

Abbiamo creato un file `requirements.local.txt` senza questa dipendenza:

```bash
cd backend
pip install -r requirements.local.txt
```

Questo file contiene **solo le dipendenze necessarie** per l'installazione locale.

### ✅ Soluzione 2: Modifica requirements.txt

Se preferisci, puoi modificare manualmente `requirements.txt`:

1. Apri il file `backend/requirements.txt`
2. **Trova la riga**:
   ```
   emergentintegrations==0.1.0
   ```
3. **Cancellala** o **commentala** aggiungendo `#` all'inizio:
   ```
   # emergentintegrations==0.1.0
   ```
4. Salva il file
5. Riprova l'installazione:
   ```bash
   pip install -r requirements.txt
   ```

### ✅ Soluzione 3: Usa Virtual Environment Pulito

Se hai già provato a installare e hai errori, crea un nuovo virtual environment:

```bash
# Elimina il vecchio venv (se esiste)
rm -rf venv

# Crea nuovo venv
python3 -m venv venv

# Attiva il venv
# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Installa con il file locale
pip install -r requirements.local.txt
```

---

## 🔴 Errore: TELEGRAM_TOKEN non configurato

### Messaggio di Errore:
```
ERROR: TELEGRAM_TOKEN not configured
```
o
```
telegram.error.InvalidToken: Invalid token
```

### ✅ Soluzione:

1. **Crea il bot** su Telegram con @BotFather
   - Vedi [ISTRUZIONI_BOTFATHER.md](ISTRUZIONI_BOTFATHER.md)

2. **Copia il token** ricevuto da BotFather

3. **Incollalo nel file** `backend/.env`:
   ```env
   TELEGRAM_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
   ```

4. **Riavvia il backend**

---

## 🔴 Errore: Cannot connect to MongoDB

### Messaggi di Errore:
```
pymongo.errors.ServerSelectionTimeoutError
```
o
```
Connection refused
```

### ✅ Soluzione:

**1. Verifica che MongoDB sia installato:**
```bash
mongosh --version
```

**2. Avvia MongoDB:**

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Windows:**
1. Apri "Servizi" (cerca "services.msc")
2. Trova "MongoDB Server"
3. Clicca destro → "Avvia"

**3. Verifica la connessione:**
```bash
mongosh mongodb://localhost:27017
```

Se si apre la shell MongoDB, funziona! ✅

---

## 🔴 Errore: Module not found

### Messaggi di Errore:
```
ModuleNotFoundError: No module named 'fastapi'
ModuleNotFoundError: No module named 'telegram'
```

### ✅ Soluzione:

**1. Assicurati di essere nel virtual environment:**
```bash
# Controlla se il venv è attivo
# Dovresti vedere (venv) all'inizio del prompt

# Se non è attivo:
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

**2. Reinstalla le dipendenze:**
```bash
cd backend
pip install -r requirements.local.txt
```

**3. Se il problema persiste, reinstalla tutto:**
```bash
pip uninstall -r requirements.local.txt -y
pip install -r requirements.local.txt
```

---

## 🔴 Errore: Port already in use

### Messaggio di Errore:
```
OSError: [Errno 48] Address already in use
ERROR: Port 8001 already in use
```

### ✅ Soluzione:

**Mac/Linux:**
```bash
# Trova il processo sulla porta 8001
lsof -ti:8001

# Termina il processo
kill -9 $(lsof -ti:8001)
```

**Windows:**
```bash
# Trova il processo
netstat -ano | findstr :8001

# Termina il processo (sostituisci PID con il numero trovato)
taskkill /PID [PID] /F
```

**Alternativa: Cambia porta**

Modifica `server.py` per usare una porta diversa:
```python
uvicorn.run(app, host="0.0.0.0", port=8002)  # Cambia 8001 in 8002
```

---

## 🔴 Errore: Frontend non si connette al Backend

### Problema:
Il frontend mostra errori di rete o non carica i dati.

### ✅ Soluzione:

**1. Verifica che il backend sia avviato:**
```bash
curl http://localhost:8001/api/
```

Dovresti vedere:
```json
{"message":"CRAL Bot API"}
```

**2. Controlla l'URL nel frontend/.env:**
```env
REACT_APP_BACKEND_URL="http://localhost:8001"
```

⚠️ **Attenzione:**
- ✅ CORRETTO: `http://localhost:8001`
- ❌ SBAGLIATO: `http://localhost:8001/`
- ❌ SBAGLIATO: `http://localhost:8001/api`

**3. Riavvia il frontend:**
```bash
# Ctrl+C per fermare
# Poi riavvia
cd frontend
yarn start
```

---

## 🔴 Errore: yarn: command not found

### ✅ Soluzione:

**Installa Yarn:**
```bash
npm install -g yarn
```

**Verifica:**
```bash
yarn --version
```

---

## 🔴 File .env non trovato

### ✅ Soluzione:

**Usa lo script automatico:**
```bash
# Mac/Linux
./scripts/setup_env.sh

# Windows
scripts\setup_env.bat
```

**O copia manualmente:**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Vedi [CONFIGURAZIONE_ENV.md](CONFIGURAZIONE_ENV.md) per dettagli.

---

## 🔴 Errore: bcrypt compilation failed

### Messaggio di Errore:
```
error: Microsoft Visual C++ 14.0 or greater is required
```

### ✅ Soluzione Windows:

**Scarica e installa Visual C++ Build Tools:**
https://visualstudio.microsoft.com/visual-cpp-build-tools/

**Poi reinstalla:**
```bash
pip install bcrypt --force-reinstall
```

### ✅ Soluzione Mac/Linux:

```bash
# Installa le build tools necessarie
# Mac:
xcode-select --install

# Linux:
sudo apt-get install build-essential python3-dev
```

---

## 📞 Altre Domande?

Se riscontri altri errori:

1. ✅ Controlla i log completi nel terminale
2. ✅ Verifica di aver seguito tutti i passi di setup
3. ✅ Rileggi la documentazione:
   - [GUIDA_INSTALLAZIONE_LOCALE.md](GUIDA_INSTALLAZIONE_LOCALE.md)
   - [CONFIGURAZIONE_ENV.md](CONFIGURAZIONE_ENV.md)

---

## 📋 Checklist Debug

Quando hai un errore, verifica:

- [ ] Virtual environment attivato
- [ ] File .env configurati
- [ ] MongoDB avviato
- [ ] Dipendenze installate (con requirements.local.txt)
- [ ] Porte libere (8001 per backend, 3000 per frontend)
- [ ] TELEGRAM_TOKEN configurato
- [ ] Backend avviato e funzionante
- [ ] Frontend avviato

---

**La maggior parte degli errori si risolvono con questi passi! 🎉**
