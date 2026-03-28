import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Plus, Trash2, Users as UsersIcon, MapPin } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Events = ({ userTelegramId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_participants: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
    } catch (error) {
      toast.error('Errore nel caricamento degli eventi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.event_date) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }

    try {
      const submitData = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
      };
      
      await axios.post(
        `${API}/events?telegram_id=${userTelegramId}`,
        submitData
      );
      toast.success('Evento creato con successo!');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        max_participants: ''
      });
      loadEvents();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Errore nella creazione dell\'evento');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'upcoming': { label: 'Prossimo', class: 'badge-info' },
      'ongoing': { label: 'In Corso', class: 'badge-success' },
      'completed': { label: 'Completato', class: 'badge-warning' },
      'cancelled': { label: 'Annullato', class: 'badge-danger' }
    };
    const badge = badges[status] || badges['upcoming'];
    return <span className={`badge ${badge.class}`}>{badge.label}</span>;
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
    <Layout userTelegramId={userTelegramId}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Eventi</h1>
          <p className="text-purple-100">Organizza eventi per i membri del CRAL</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
          data-testid="create-event-button"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuovo Evento
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} />
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state bg-white rounded-2xl">
          <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3>Nessun evento</h3>
          <p>Crea il tuo primo evento per coinvolgere i membri!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="events-list">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg p-6 card-hover">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                {getStatusBadge(event.status)}
              </div>
              
              <p className="text-gray-600 mb-4">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-700">
                  <span className="mr-2">🕒</span>
                  <span className="text-sm">{formatDate(event.event_date)}</span>
                </div>
                
                {event.location && (
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-700">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {event.participants?.length || 0}
                    {event.max_participants && ` / ${event.max_participants}`} iscritti
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all"
                    style={{
                      width: event.max_participants 
                        ? `${Math.min((event.participants?.length || 0) / event.max_participants * 100, 100)}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuovo Evento</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Titolo *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Es: Cena di Natale 2026"
                  data-testid="event-title-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrizione *</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrizione dell'evento..."
                  data-testid="event-description-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data e Ora *</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  data-testid="event-date-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Luogo</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Es: Ristorante La Bella Vista, Lecce"
                  data-testid="event-location-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Numero Massimo Partecipanti</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                  placeholder="Lascia vuoto per illimitato"
                  data-testid="event-max-participants-input"
                />
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  data-testid="submit-event-button"
                >
                  Crea Evento
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Events;
