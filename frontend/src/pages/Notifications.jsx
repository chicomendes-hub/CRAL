import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Send, Bell, Users } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Notifications = ({ userTelegramId }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendToAll, setSendToAll] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await axios.get(`${API}/groups?telegram_id=${userTelegramId}`);
      setGroups(response.data);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Inserisci un messaggio');
      return;
    }

    if (!sendToAll && selectedGroups.length === 0) {
      toast.error('Seleziona almeno un gruppo o scegli "Tutti i membri"');
      return;
    }

    const confirmMessage = sendToAll 
      ? 'Sei sicuro di voler inviare questa notifica a tutti i membri?'
      : `Sei sicuro di voler inviare questa notifica a ${selectedGroups.length} gruppo/i?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setSending(true);
    
    try {
      const response = await axios.post(
        `${API}/notifications/send?telegram_id=${userTelegramId}`,
        {
          message: message,
          send_to_all: sendToAll,
          group_ids: sendToAll ? [] : selectedGroups
        }
      );
      
      toast.success(response.data.message || 'Notifica inviata con successo!');
      setMessage('');
      setSelectedGroups([]);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Errore nell\'invio della notifica');
    } finally {
      setSending(false);
    }
  };

  const toggleGroupSelection = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <Layout userTelegramId={userTelegramId}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Notifiche</h1>
        <p className="text-purple-100">Invia messaggi broadcast ai membri del CRAL</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mr-4">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Invia Notifica</h2>
              <p className="text-gray-600 text-sm">
                {sendToAll ? 'A tutti i membri attivi' : `A ${selectedGroups.length} gruppo/i selezionato/i`}
              </p>
            </div>
          </div>

          <form onSubmit={handleSend}>
            {/* Send to options */}
            <div className="form-group">
              <label className="form-label">Destinatari</label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                  <input
                    type="radio"
                    checked={sendToAll}
                    onChange={() => setSendToAll(true)}
                    className="mr-3"
                    data-testid="send-to-all-radio"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">Tutti i membri</div>
                    <div className="text-sm text-gray-500">Invia a tutti i membri attivi del CRAL</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                  <input
                    type="radio"
                    checked={!sendToAll}
                    onChange={() => setSendToAll(false)}
                    className="mr-3"
                    data-testid="send-to-groups-radio"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">Gruppi specifici</div>
                    <div className="text-sm text-gray-500">Seleziona uno o più gruppi</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Group selection */}
            {!sendToAll && (
              <div className="form-group">
                <label className="form-label">Seleziona Gruppi *</label>
                {groups.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Non hai ancora creato gruppi. Vai alla sezione "Gruppi" per crearne uno.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {groups.map((group) => (
                      <label
                        key={group.id}
                        className="flex items-center p-3 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGroups.includes(group.id)}
                          onChange={() => toggleGroupSelection(group.id)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{group.name}</div>
                          {group.description && (
                            <div className="text-sm text-gray-500">{group.description}</div>
                          )}
                        </div>
                        <span className="badge badge-info">
                          {group.members?.length || 0} membri
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {selectedGroups.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedGroups.length} gruppo/i selezionato/i
                  </p>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Messaggio *</label>
              <textarea
                className="form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Scrivi qui il messaggio da inviare..."
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
              disabled={sending || (!sendToAll && selectedGroups.length === 0)}
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
                <span>Il messaggio verrà inviato ai membri {sendToAll ? 'attivi' : 'dei gruppi selezionati'}</span>
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
