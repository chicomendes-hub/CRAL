import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Users, Trash2, X, Calendar, MapPin, UserPlus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EventParticipants = ({ event, onClose, userTelegramId }) => {
  const [participants, setParticipants] = useState([]);
  const [managers, setManagers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddManager, setShowAddManager] = useState(false);
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);

  useEffect(() => {
    loadData();
  }, [event.id]);

  const loadData = async () => {
    try {
      // Load participants
      const partResponse = await axios.get(
        `${API}/events/${event.id}/participants?telegram_id=${userTelegramId}`
      );
      setParticipants(partResponse.data.participants);

      // Load all members for manager assignment
      const membersResponse = await axios.get(
        `${API}/members?telegram_id=${userTelegramId}`
      );
      setAllMembers(membersResponse.data);

      // Get managers info
      const managersList = [];
      for (const managerId of event.managers || []) {
        const manager = membersResponse.data.find(m => m.telegram_id === managerId);
        if (manager) {
          managersList.push(manager);
        }
      }
      setManagers(managersList);
      setSelectedManagerIds(event.managers || []);
    } catch (error) {
      toast.error('Errore nel caricamento dei dati');
    } finally {
      setLoading(false);
    }
  };

  const removeParticipant = async (telegramId) => {
    if (!window.confirm('Sei sicuro di voler rimuovere questo partecipante?')) {
      return;
    }

    try {
      await axios.delete(
        `${API}/events/${event.id}/participants/${telegramId}?telegram_id=${userTelegramId}`
      );
      toast.success('Partecipante rimosso');
      loadData();
    } catch (error) {
      toast.error('Errore nella rimozione del partecipante');
    }
  };

  const saveManagers = async () => {
    try {
      await axios.patch(
        `${API}/events/${event.id}/managers?telegram_id=${userTelegramId}`,
        { manager_telegram_ids: selectedManagerIds }
      );
      toast.success('Gestori aggiornati con successo!');
      setShowAddManager(false);
      loadData();
    } catch (error) {
      toast.error('Errore nell\'aggiornamento dei gestori');
    }
  };

  const toggleManagerSelection = (telegramId) => {
    setSelectedManagerIds(prev =>
      prev.includes(telegramId)
        ? prev.filter(id => id !== telegramId)
        : [...prev, telegramId]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content max-w-4xl" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(event.event_date)}
              </div>
              {event.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Event Managers Section */}
        <div className="mb-6 p-4 bg-purple-50 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Gestori Evento
            </h3>
            <button
              onClick={() => setShowAddManager(!showAddManager)}
              className="btn-secondary text-sm py-2 px-3"
            >
              {showAddManager ? 'Annulla' : 'Modifica Gestori'}
            </button>
          </div>

          {showAddManager ? (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Seleziona i membri che possono gestire questo evento
              </p>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white">
                {allMembers
                  .filter(m => m.role === 'event_manager' || m.role === 'admin')
                  .map((member) => (
                    <label
                      key={member.telegram_id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedManagerIds.includes(member.telegram_id)}
                        onChange={() => toggleManagerSelection(member.telegram_id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">
                          {member.first_name} {member.last_name}
                        </div>
                        {member.username && (
                          <div className="text-xs text-gray-500">@{member.username}</div>
                        )}
                      </div>
                      <span className={`badge text-xs ${member.role === 'admin' ? 'badge-danger' : 'badge-warning'}`}>
                        {member.role === 'admin' ? 'Admin' : 'Gestore'}
                      </span>
                    </label>
                  ))}
              </div>
              <button
                onClick={saveManagers}
                className="btn-primary w-full mt-3"
              >
                Salva Gestori
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {managers.length === 0 ? (
                <p className="text-sm text-gray-600">Nessun gestore assegnato</p>
              ) : (
                managers.map((manager) => (
                  <div
                    key={manager.telegram_id}
                    className="flex items-center p-2 bg-white rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {manager.first_name?.charAt(0) || 'G'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-sm">
                        {manager.first_name} {manager.last_name}
                      </div>
                      {manager.username && (
                        <div className="text-xs text-gray-500">@{manager.username}</div>
                      )}
                    </div>
                    <span className={`badge text-xs ${manager.role === 'admin' ? 'badge-danger' : 'badge-warning'}`}>
                      {manager.role === 'admin' ? 'Admin' : 'Gestore'}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Participants Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Partecipanti ({participants.length}
              {event.max_participants && `/${event.max_participants}`})
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="loading-spinner" />
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nessun partecipante iscritto</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {participants.map((participant) => (
                <div
                  key={participant.telegram_id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {participant.first_name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {participant.first_name} {participant.last_name}
                    </div>
                    {participant.username && (
                      <div className="text-sm text-indigo-600">
                        @{participant.username}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeParticipant(participant.telegram_id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Rimuovi partecipante"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="btn-secondary w-full mt-6"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};

export default EventParticipants;
