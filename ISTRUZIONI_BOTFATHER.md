# Istruzioni per creare il Bot Telegram

## Passo 1: Apri Telegram e cerca BotFather

1. Apri l'app Telegram sul tuo telefono o computer
2. Cerca **@BotFather** nella barra di ricerca
3. Clicca su **@BotFather** (è verificato con il segno di spunta blu)
4. Clicca su **START** o **AVVIA**

## Passo 2: Crea un nuovo bot

1. Invia il comando `/newbot` a BotFather
2. BotFather ti chiederà di scegliere un **nome** per il tuo bot
   - Esempio: `CRAL Palazzo Giustizia Lecce Bot`
   - Questo è il nome che vedranno gli utenti

3. Poi ti chiederà di scegliere un **username** per il bot
   - L'username deve finire con "bot" (es: `cral_lecce_bot` o `CralLecceBot`)
   - L'username deve essere unico
   - Esempio: `cral_lecce_bot`

## Passo 3: Ottieni il Token

Dopo aver creato il bot, BotFather ti invierà un messaggio con:
- Il link al tuo bot
- **Il TOKEN** (una stringa lunga tipo: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

⚠️ **IMPORTANTE**: Copia questo token e conservalo in modo sicuro! Non condividerlo con nessuno!

## Passo 4: Configura il Bot

### Aggiungi una descrizione (opzionale ma consigliato)

1. Invia `/setdescription` a BotFather
2. Seleziona il tuo bot dalla lista
3. Invia la descrizione:
   ```
   Bot ufficiale del CRAL del Palazzo di Giustizia di Lecce.
   Gestisci sondaggi, eventi, prenotazioni e molto altro!
   ```

### Aggiungi una foto profilo (opzionale)

1. Invia `/setuserpic` a BotFather
2. Seleziona il tuo bot
3. Invia una foto (preferibilmente quadrata, 512x512 pixel)

### Configura i comandi del bot

1. Invia `/setcommands` a BotFather
2. Seleziona il tuo bot
3. Invia questa lista di comandi:
   ```
   start - Inizia a usare il bot
   help - Mostra tutti i comandi disponibili
   sondaggi - Visualizza i sondaggi attivi
   eventi - Visualizza gli eventi prossimi
   prenotazioni - Visualizza le prenotazioni disponibili
   mie_quote - Controlla le tue quote associative
   ```

## Passo 5: Configura l'applicazione

1. Apri il file `/app/backend/.env`
2. Aggiungi il TOKEN che hai ricevuto da BotFather:
   ```
   TELEGRAM_TOKEN="il_tuo_token_qui"
   WEBHOOK_SECRET="una_stringa_segreta_casuale"
   ```

3. Sostituisci `il_tuo_token_qui` con il token ricevuto da BotFather
4. Sostituisci `una_stringa_segreta_casuale` con una stringa a tua scelta (es: `mysecret123`)

## Passo 6: Crea un Admin

Per usare le funzionalità admin (creare sondaggi, eventi, ecc.), devi rendere un utente amministratore:

1. Apri il bot che hai creato su Telegram
2. Clicca su **START** o **AVVIA**
3. Prendi nota del tuo Telegram ID (lo troverai nei log del backend o usando il comando `/start`)
4. Usa la dashboard web per promuovere il tuo account ad Admin

In alternativa, puoi aggiungere manualmente un admin nel database MongoDB:

```javascript
// Esempio di query MongoDB per rendere un utente admin
db.users.updateOne(
  { telegram_id: IL_TUO_TELEGRAM_ID },
  { $set: { role: "admin" } }
)
```

## Passo 7: Testa il Bot

1. Cerca il tuo bot su Telegram usando l'username che hai scelto (es: `@cral_lecce_bot`)
2. Clicca su **START**
3. Prova i comandi:
   - `/help` - Vedere tutti i comandi
   - `/sondaggi` - Vedere i sondaggi (ancora nessuno)
   - `/eventi` - Vedere gli eventi (ancora nessuno)

## Comandi disponibili per gli Admin

Gli admin possono creare contenuti tramite la dashboard web o le API:

- **Sondaggi**: Crea sondaggi sì/no, a scelta multipla o con risposte testuali
- **Eventi**: Crea eventi con data, luogo e numero massimo di partecipanti
- **Prenotazioni**: Crea prenotazioni per attività o servizi
- **Notifiche**: Invia messaggi broadcast a tutti i membri
- **Quote**: Gestisci le quote associative dei membri

## Risoluzione problemi

### Il bot non risponde?

1. Verifica che il TOKEN sia corretto nel file `.env`
2. Verifica che il server backend sia avviato
3. Controlla i log del backend per eventuali errori

### Come trovare il mio Telegram ID?

Puoi usare bot come `@userinfobot` su Telegram, oppure controllare i log del backend dopo aver inviato `/start` al tuo bot.

### Webhook vs Polling

Questa applicazione usa il webhook. Per configurare il webhook:

1. Il webhook verrà configurato automaticamente quando l'app viene deployata
2. L'URL del webhook sarà: `https://tuo-dominio.com/api/telegram/webhook/WEBHOOK_SECRET`

---

## Link utili

- **BotFather**: https://t.me/BotFather
- **Documentazione Telegram Bot API**: https://core.telegram.org/bots/api
- **Trova il tuo Telegram ID**: https://t.me/userinfobot

---

**Buon divertimento con il tuo bot CRAL! 🎉**