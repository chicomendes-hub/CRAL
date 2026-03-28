import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Send, Bell } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Notifications = ({ userTelegramId }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Inserisci un messaggio');
      return;
    }

    if (!window.confirm('Sei sicuro di voler inviare questa notifica a tutti i membri?')) {
      return;
    }

    setSending(true);
    
    try {
      const response = await axios.post(
        `${API}/notifications/send?telegram_id=${userTelegramId}`,
        {
          message: message,
          send_to_all: true
        }
      );
      
      toast.success(response.data.message || 'Notifica inviata con successo!');
      setMessage('');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Errore nell\'invio della notifica');
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout userTelegramId={userTelegramId}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Notifiche</h1>
        <p className="text-purple-100">Invia messaggi broadcast a tutti i membri del CRAL</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mr-4">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Invia Notifica Broadcast</h2>
              <p className="text-gray-600 text-sm">Il messaggio verrà inviato a tutti i membri attivi</p>
            </div>
          </div>

          <form onSubmit={handleSend}>
            <div className="form-group">
              <label className="form-label">Messaggio *</label>
              <textarea
                className="form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Scrivi qui il messaggio da inviare a tutti i membri..."
                rows="8"
                disabled={sending}
                data-testid="notification-message-input"
              />
              <p className="text-sm text-gray-500 mt-2">
                {message.length} caratteri
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
              disabled={sending}
              data-testid="send-notification-button"
            >
              {sending ? (
                <>
                  <div className="loading-spinner mr-2" />
                  Invio in corso...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Invia Notifica
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              ⚠️ Importante
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Il messaggio verrà inviato a <strong>tutti i membri attivi</strong> del CRAL</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Verifica attentamente il contenuto prima di inviare</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Il messaggio non può essere annullato una volta inviato</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Usa questa funzione in modo responsabile</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-bold text-gray-800 mb-3">💡 Suggerimenti per messaggi efficaci</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Inizia con un saluto amichevole</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Sii chiaro e conciso nel messaggio</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Includi eventuali call-to-action (es: "Vota al sondaggio")</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Usa emoji per rendere il messaggio più coinvolgente 🎉</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
