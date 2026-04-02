#!/bin/bash

# ============================================
# Script di Setup File .env
# ============================================
# Questo script copia automaticamente i file .env.example
# e ti guida nella configurazione

echo "🚀 Setup File .env per CRAL Bot Telegram"
echo "=========================================="
echo ""

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funzione per copiare file .env
copy_env_file() {
    local source=$1
    local dest=$2
    local name=$3
    
    if [ -f "$dest" ]; then
        echo -e "${YELLOW}⚠️  File $name già esistente${NC}"
        read -p "Vuoi sovrascriverlo? (s/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Ss]$ ]]; then
            echo -e "${GREEN}✅ File $name mantenuto${NC}"
            return
        fi
    fi
    
    if [ -f "$source" ]; then
        cp "$source" "$dest"
        echo -e "${GREEN}✅ File $name creato${NC}"
    else
        echo -e "${RED}❌ File $source non trovato${NC}"
    fi
}

# Determina la directory del progetto
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📁 Directory progetto: $PROJECT_DIR"
echo ""

# Copia file .env backend
echo "1️⃣  Configurazione Backend..."
copy_env_file "$PROJECT_DIR/backend/.env.example" "$PROJECT_DIR/backend/.env" "backend/.env"
echo ""

# Copia file .env frontend
echo "2️⃣  Configurazione Frontend..."
copy_env_file "$PROJECT_DIR/frontend/.env.example" "$PROJECT_DIR/frontend/.env" "frontend/.env"
echo ""

# Chiedi il Telegram Token
echo "🤖 Configurazione Telegram Bot"
echo "================================"
echo ""
echo "Hai già creato il bot su Telegram con @BotFather?"
read -p "(s/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo "Inserisci il TOKEN ricevuto da BotFather:"
    echo "(Es: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)"
    read -r TELEGRAM_TOKEN
    
    if [ ! -z "$TELEGRAM_TOKEN" ]; then
        # Aggiorna il file .env backend con il token
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|TELEGRAM_TOKEN=\"\"|TELEGRAM_TOKEN=\"$TELEGRAM_TOKEN\"|" "$PROJECT_DIR/backend/.env"
        else
            # Linux
            sed -i "s|TELEGRAM_TOKEN=\"\"|TELEGRAM_TOKEN=\"$TELEGRAM_TOKEN\"|" "$PROJECT_DIR/backend/.env"
        fi
        echo -e "${GREEN}✅ Token Telegram configurato${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  Dovrai creare il bot seguendo le istruzioni in:${NC}"
    echo "   $PROJECT_DIR/ISTRUZIONI_BOTFATHER.md"
    echo ""
    echo "Poi modifica manualmente il file:"
    echo "   $PROJECT_DIR/backend/.env"
fi

echo ""
echo "================================"
echo "✨ Setup Completato!"
echo "================================"
echo ""
echo "📝 Prossimi passi:"
echo ""
echo "1. Se non l'hai fatto, crea il bot su Telegram"
echo "   Vedi: $PROJECT_DIR/ISTRUZIONI_BOTFATHER.md"
echo ""
echo "2. Verifica la configurazione:"
echo "   cat backend/.env"
echo "   cat frontend/.env"
echo ""
echo "3. Installa le dipendenze:"
echo "   cd backend && pip install -r requirements.txt"
echo "   cd frontend && yarn install"
echo ""
echo "4. Avvia l'applicazione:"
echo "   # Terminale 1 - Backend"
echo "   cd backend && python server.py"
echo ""
echo "   # Terminale 2 - Frontend"
echo "   cd frontend && yarn start"
echo ""
echo "📚 Documentazione completa:"
echo "   - Setup locale: $PROJECT_DIR/GUIDA_INSTALLAZIONE_LOCALE.md"
echo "   - Configurazione .env: $PROJECT_DIR/CONFIGURAZIONE_ENV.md"
echo "   - Guida rapida: $PROJECT_DIR/GUIDA_RAPIDA.md"
echo ""
echo "🎉 Buon lavoro con il CRAL Bot!"
