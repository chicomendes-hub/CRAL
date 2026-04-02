# 📥 Guida Installazione Locale - Bot Telegram CRAL
## Per Utenti Non Tecnici - Passo dopo Passo

---

## 🎯 Cosa faremo in questa guida?

Ti guiderò nell'installazione del bot Telegram sul tuo computer personale, passo dopo passo, in modo molto semplice.

**Tempo necessario**: 30-45 minuti  
**Difficoltà**: Facile (seguendo alla lettera ogni passo)

---

## 📋 PARTE 1: PREPARAZIONE - Installa gli Strumenti Necessari

### Passo 1.1: Scarica e Installa Git

**Cos'è Git?** Un programma per scaricare codice da internet.

#### Su Windows:
1. Vai su: https://git-scm.com/download/windows
2. Scarica il file (clicca "Click here to download")
3. Fai doppio click sul file scaricato
4. Clicca sempre "Next" fino a "Install"
5. Clicca "Finish" quando finisce

#### Su Mac:
1. Apri il "Terminale" (cerca "Terminal" in Spotlight)
2. Copia e incolla questo comando:
   ```bash
   git --version
   ```
3. Se vedi un numero (tipo 2.39.0), Git è già installato! ✅
4. Se no, ti chiederà di installarlo automaticamente, clicca "Installa"

#### Su Linux:
```bash
sudo apt-get update
sudo apt-get install git
```

---

### Passo 1.2: Scarica e Installa Python

**Cos'è Python?** Il linguaggio in cui è scritto il backend del bot.

#### Su Windows:
1. Vai su: https://www.python.org/downloads/
2. Scarica "Python 3.11" o superiore (clicca il bottone giallo grande)
3. **IMPORTANTE**: Durante l'installazione, metti la ✅ su "Add Python to PATH"
4. Clicca "Install Now"
5. Aspetta che finisca e chiudi

#### Su Mac:
1. Apri il Terminale
2. Copia e incolla:
   ```bash
   python3 --version
   ```
3. Se vedi Python 3.11 o superiore, sei a posto! ✅
4. Altrimenti scarica da: https://www.python.org/downloads/macos/

#### Su Linux:
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip
```

**Verifica che Python sia installato:**
1. Apri il Terminale (o CMD su Windows)
2. Scrivi: `python --version` o `python3 --version`
3. Dovresti vedere: Python 3.11.x o superiore ✅

---

### Passo 1.3: Scarica e Installa Node.js

**Cos'è Node.js?** Serve per far funzionare il frontend (la dashboard web).

1. Vai su: https://nodejs.org/
2. Scarica la versione "LTS" (quella raccomandata)
3. Installa il file scaricato (sempre "Next" → "Install")
4. Aspetta che finisca

**Verifica che Node.js sia installato:**
1. Apri un nuovo Terminale/CMD
2. Scrivi: `node --version`
3. Dovresti vedere: v18.x.x o superiore ✅

---

### Passo 1.4: Installa Yarn

**Cos'è Yarn?** Un gestore di pacchetti per Node.js (più veloce di npm).

Apri il Terminale/CMD e scrivi:
```bash
npm install -g yarn
```

Aspetta che finisca, poi verifica:
```bash
yarn --version
```
Dovresti vedere un numero tipo 1.22.x ✅

---

### Passo 1.5: Installa MongoDB

**Cos'è MongoDB?** Il database dove salvare tutti i dati del bot.

#### Su Windows:
1. Vai su: https://www.mongodb.com/try/download/community
2. Seleziona:
   - Version: Latest (6.0 o superiore)
   - Platform: Windows
   - Package: MSI
3. Clicca "Download"
4. Installa il file scaricato
5. Durante l'installazione:
   - Scegli "Complete"
   - Metti ✅ su "Install MongoDB as a Service"
   - Clicca "Next" fino a "Install"

#### Su Mac:
```bash
# Installa Homebrew se non ce l'hai
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installa MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Su Linux:
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Verifica che MongoDB funzioni:**
```bash
mongosh --version
```
Dovresti vedere un numero di versione ✅

---

## 📥 PARTE 2: SCARICA IL CODICE DA EMERGENT

### Passo 2.1: Connetti GitHub a Emergent

1. **Apri Emergent** nel browser (la pagina dove stai chattando con me)
2. Clicca sulla **tua foto profilo** in alto a destra
3. Cerca il pulsante **"Connect GitHub"** o **"GitHub Settings"**
4. Clicca e **autorizza** Emergent ad accedere al tuo GitHub
5. Segui le istruzioni a schermo

---

### Passo 2.2: Salva il Progetto su GitHub

1. Nella chat di Emergent, cerca il pulsante **"Save to GitHub"** o **"Push to GitHub"**
2. Clicca sul pulsante
3. Ti apparirà una finestra:
   - **Repository name**: scrivi `cral-lecce-bot` (o un nome a tua scelta)
   - **Branch**: lascia `main` o scegli `develop`
4. Clicca **"PUSH TO GITHUB"**
5. Aspetta che finisca (vedrai un messaggio di conferma) ✅

---

### Passo 2.3: Clona il Progetto sul Tuo Computer

1. **Apri il Terminale** (o CMD su Windows)
2. Vai nella cartella dove vuoi salvare il progetto:
   ```bash
   cd Desktop
   ```
   *(Questo lo salverà sul Desktop, puoi scegliere un'altra cartella)*

3. **Vai su GitHub nel browser**:
   - Vai su https://github.com
   - Trovi il tuo repository `cral-lecce-bot`
   - Clicca sul bottone verde **"Code"**
   - Copia l'URL che appare (tipo: https://github.com/tuo-username/cral-lecce-bot.git)

4. **Torna al Terminale** e scrivi:
   ```bash
   git clone https://github.com/tuo-username/cral-lecce-bot.git
   ```
   *(Sostituisci con l'URL che hai copiato)*

5. Aspetta che scarichi tutto... vedrai le righe scorrere ✅

6. Entra nella cartella:
   ```bash
   cd cral-lecce-bot
   ```

**PERFETTO!** Ora hai tutto il codice sul tuo computer! 🎉

---

## 🔧 PARTE 3: CONFIGURA IL PROGETTO

### ⚡ METODO RAPIDO: Usa lo Script Automatico

**IMPORTANTE**: Puoi saltare i passi 3.2 e 3.3 usando lo script automatico!

**Su Mac/Linux:**
```bash
cd cral-lecce-bot
./scripts/setup_env.sh
```

**Su Windows:**
```cmd
cd cral-lecce-bot
scripts\setup_env.bat
```

Lo script:
- ✅ Copia automaticamente i file `.env.example` in `.env`
- ✅ Ti chiede il Telegram Token e lo configura
- ✅ Ti guida nei prossimi passi

**Se preferisci configurare manualmente, continua con i passi 3.2 e 3.3 qui sotto.**

---

### Passo 3.1: Crea il Tuo Bot su Telegram

**IMPORTANTE**: Prima di continuare, devi creare il bot su Telegram!

1. Apri **Telegram** sul telefono o computer
2. Cerca **@BotFather**
3. Clicca "Start" o "Avvia"
4. Scrivi: `/newbot`
5. BotFather ti chiederà:
   - **Nome bot**: Scrivi `CRAL Lecce Bot` (o quello che vuoi)
   - **Username**: Scrivi `cral_lecce_bot` (deve finire con `_bot`)
6. **COPIA IL TOKEN** che ti darà BotFather!
   - Sarà tipo: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - **SALVALO DA QUALCHE PARTE!** Te lo chiederò tra poco

---

### Passo 3.2: Configura le Variabili d'Ambiente Backend

1. **Apri la cartella del progetto** con l'esplora file:
   - Su Windows: Esplora Risorse → Desktop → cral-lecce-bot
   - Su Mac: Finder → Desktop → cral-lecce-bot

2. Entra nella cartella **`backend`**

3. Trovi un file chiamato **`.env`** 
   - Se non lo vedi, attiva "Mostra file nascosti":
     - Windows: Visualizza → Mostra → Elementi nascosti
     - Mac: Cmd+Shift+. nel Finder

4. **Apri il file `.env` con un editor di testo** (Blocco Note, TextEdit, VS Code, ecc.)

5. **Modifica queste righe**:
   ```env
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="cral_lecce"
   CORS_ORIGINS="*"
   TELEGRAM_TOKEN="INCOLLA_QUI_IL_TOKEN_DI_BOTFATHER"
   WEBHOOK_SECRET="cral_lecce_secret_2026"
   ```

6. Dove dice `TELEGRAM_TOKEN=""`, **incolla il token** che hai copiato prima da BotFather

7. **SALVA il file** (Ctrl+S o Cmd+S)

---

### Passo 3.3: Configura le Variabili d'Ambiente Frontend

1. Torna alla cartella principale del progetto

2. Entra nella cartella **`frontend`**

3. Apri il file **`.env`**

4. Dovresti vedere qualcosa tipo:
   ```env
   REACT_APP_BACKEND_URL="https://qualcosa.preview.emergentagent.com"
   ```

5. **Cambialo in**:
   ```env
   REACT_APP_BACKEND_URL="http://localhost:8001"
   ```

6. **SALVA il file**

---

### Passo 3.4: Installa le Dipendenze Backend

1. Apri il **Terminale** (o CMD)

2. Vai nella cartella backend:
   ```bash
   cd Desktop/cral-lecce-bot/backend
   ```
   *(Adatta il percorso a dove hai salvato il progetto)*

3. Installa le dipendenze Python:
   ```bash
   pip install -r requirements.txt
   ```
   o su Mac/Linux:
   ```bash
   pip3 install -r requirements.txt
   ```

4. Aspetta che finisca... ci vorranno 2-3 minuti ⏱️

5. Quando finisce, dovresti vedere "Successfully installed..." ✅

---

### Passo 3.5: Installa le Dipendenze Frontend

1. Apri un **NUOVO Terminale** (lascia aperto quello di prima)

2. Vai nella cartella frontend:
   ```bash
   cd Desktop/cral-lecce-bot/frontend
   ```

3. Installa le dipendenze:
   ```bash
   yarn install
   ```

4. Aspetta... ci vorranno 3-5 minuti ⏱️

5. Quando finisce, vedrai "✨ Done..." ✅

---

## 🚀 PARTE 4: AVVIA L'APPLICAZIONE

### Passo 4.1: Avvia MongoDB

**Su Windows:**
- MongoDB dovrebbe già essere avviato automaticamente come servizio
- Se no, cerca "Services" nel menu Start, trova "MongoDB" e clicca "Start"

**Su Mac:**
```bash
brew services start mongodb-community
```

**Su Linux:**
```bash
sudo systemctl start mongodb
```

**Verifica che funzioni:**
```bash
mongosh
```
Se si apre una shell MongoDB, funziona! Scrivi `exit` per uscire ✅

---

### Passo 4.2: Avvia il Backend

1. Nel **primo Terminale** (quello nella cartella backend), scrivi:
   ```bash
   python server.py
   ```
   o su Mac/Linux:
   ```bash
   python3 server.py
   ```

   O se preferisci uvicorn:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

2. Aspetta qualche secondo...

3. Dovresti vedere:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8001
   INFO:     Application startup complete.
   ```

4. **NON CHIUDERE QUESTO TERMINALE!** Lascialo aperto ✅

---

### Passo 4.3: Avvia il Frontend

1. Nel **secondo Terminale** (quello nella cartella frontend), scrivi:
   ```bash
   yarn start
   ```

2. Aspetta... ci vorrà un minuto per compilare

3. Quando è pronto, vedrai:
   ```
   Compiled successfully!
   ```

4. Si dovrebbe aprire automaticamente il browser su http://localhost:3000

5. **NON CHIUDERE QUESTO TERMINALE!** Lascialo aperto ✅

---

## 🎉 PARTE 5: TESTA L'APPLICAZIONE!

### Passo 5.1: Testa la Dashboard

1. Apri il browser su: **http://localhost:3000**

2. Dovresti vedere la **pagina di login** con:
   - Logo del bot
   - Campo "Telegram ID"
   - Bottone "Accedi"

3. **Ottieni il tuo Telegram ID**:
   - Apri Telegram
   - Cerca **@userinfobot**
   - Clicca Start
   - Ti dirà il tuo ID (un numero tipo 123456789)

4. **Inserisci il tuo Telegram ID** nella dashboard

5. Clicca **"Accedi"**

6. Dovresti vedere la **Dashboard** con le statistiche! 🎉

---

### Passo 5.2: Renditi Admin

Per creare sondaggi ed eventi, devi essere admin:

1. Apri un **nuovo Terminale**

2. Connettiti a MongoDB:
   ```bash
   mongosh mongodb://localhost:27017/cral_lecce
   ```

3. Scrivi questo comando (sostituisci 123456789 con il TUO Telegram ID):
   ```javascript
   db.users.updateOne(
     { telegram_id: 123456789 },
     { $set: { role: "admin" } }
   )
   ```

4. Dovresti vedere:
   ```
   { acknowledged: true, modifiedCount: 1 }
   ```

5. Scrivi `exit` per uscire

6. **Ricarica la pagina** della dashboard (F5)

7. Ora sei admin! ✅

---

### Passo 5.3: Crea il Tuo Primo Sondaggio

1. Nella dashboard, clicca **"Sondaggi"** nel menu laterale

2. Clicca **"Nuovo Sondaggio"**

3. Compila:
   - **Titolo**: "Test - Ti piace questo bot?"
   - **Tipo**: Sì/No

4. Clicca **"Crea Sondaggio"**

5. Dovresti vedere il sondaggio nella lista! ✅

---

### Passo 5.4: Testa il Bot su Telegram

**NOTA IMPORTANTE**: Per testare il bot in locale, hai due opzioni:

#### **Opzione A: Polling (più semplice per test)**

Il codice attuale usa webhook. Per test locali, dovresti modificare il codice per usare il polling, ma è più avanzato.

#### **Opzione B: Ngrok (consigliato per test completi)**

1. Scarica **ngrok** da: https://ngrok.com/download
2. Installa ngrok
3. Avvia ngrok:
   ```bash
   ngrok http 8001
   ```
4. Copia l'URL che ti dà (tipo: https://abcd1234.ngrok.io)
5. Configura il webhook del bot (vedi documentazione Telegram)

**Per ora**, puoi testare la **dashboard web** che funziona perfettamente! 🎉

---

## ❓ PROBLEMI COMUNI E SOLUZIONI

### Problema: "comando non trovato" o "command not found"

**Soluzione**: Il programma non è installato o non è nel PATH
- Ricontrolla i passi di installazione
- Riavvia il Terminale dopo aver installato
- Su Windows, assicurati di aver messo ✅ su "Add to PATH"

---

### Problema: "port 8001 already in use"

**Soluzione**: La porta è già occupata
```bash
# Su Mac/Linux, trova e chiudi il processo:
lsof -ti:8001 | xargs kill -9

# Su Windows, usa il Task Manager per chiudere Python
```

---

### Problema: "Cannot connect to MongoDB"

**Soluzione**: MongoDB non è avviato
```bash
# Avvia MongoDB:
# Windows: cerca "Services" e avvia MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

---

### Problema: "Module not found"

**Soluzione**: Dipendenze non installate correttamente
```bash
# Backend:
cd backend
pip install -r requirements.txt --force-reinstall

# Frontend:
cd frontend
rm -rf node_modules
yarn install
```

---

### Problema: Pagina bianca nel browser

**Soluzione**: 
1. Apri la Console del browser (F12)
2. Guarda gli errori nella tab "Console"
3. Verifica che il backend sia avviato (http://localhost:8001/api/)
4. Controlla il file `.env` del frontend

---

## 🎯 RIEPILOGO COMANDI RAPIDI

**Per avviare tutto** (dopo la prima configurazione):

1. **Terminale 1 - Backend**:
   ```bash
   cd Desktop/cral-lecce-bot/backend
   python server.py
   ```

2. **Terminale 2 - Frontend**:
   ```bash
   cd Desktop/cral-lecce-bot/frontend
   yarn start
   ```

3. **Browser**: Apri http://localhost:3000

**Per fermare tutto**:
- Premi `Ctrl+C` in ogni terminale

---

## 📞 SERVE AIUTO?

Se hai problemi:

1. ✅ Rileggi attentamente i passi
2. ✅ Controlla i messaggi di errore nel Terminale
3. ✅ Verifica che tutti i programmi siano installati correttamente
4. ✅ Riavvia il computer e riprova

**File di documentazione utili**:
- `/app/README_ITALIANO.md` - Documentazione completa
- `/app/ISTRUZIONI_BOTFATHER.md` - Creazione bot Telegram
- `/app/GUIDA_RAPIDA.md` - Setup veloce

---

## ✅ CHECKLIST FINALE

Prima di dire "funziona tutto":

- [ ] Python installato (python --version)
- [ ] Node.js installato (node --version)
- [ ] Yarn installato (yarn --version)
- [ ] MongoDB installato e avviato
- [ ] Codice scaricato da GitHub
- [ ] Bot creato su BotFather
- [ ] Token configurato in backend/.env
- [ ] Dipendenze backend installate
- [ ] Dipendenze frontend installate
- [ ] Backend avviato senza errori
- [ ] Frontend avviato senza errori
- [ ] Dashboard accessibile su localhost:3000
- [ ] Login funzionante
- [ ] Utente promosso ad admin
- [ ] Creato sondaggio di test

Se tutti questi punti hanno la ✅, complimenti! Ce l'hai fatta! 🎉🎊

---

**Buon divertimento con il tuo bot CRAL! 🤖**
