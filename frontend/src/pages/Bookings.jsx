import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Plus, Ticket } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Bookings = ({ userTelegramId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    available_slots: ''
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await axios.get(`${API}/bookings`);
      setBookings(response.data);
    } catch (error) {
      toast.error('Errore nel caricamento delle prenotazioni');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.available_slots) {
      toast.error('Compila tutti i campi');
      return;
    }

    try {
      const submitData = {
        ...formData,
        available_slots: parseInt(formData.available_slots)
      };
      
      await axios.post(
        `${API}/bookings?telegram_id=${userTelegramId}`,
        submitData
      );
      toast.success('Prenotazione creata con successo!');
      setShowModal(false);
      setFormData({ title: '', description: '', available_slots: '' });
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Errore nella creazione della prenotazione');
    }
  };

  return (
    <Layout userTelegramId={userTelegramId}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Prenotazioni</h1>
          <p className="text-purple-100">Gestisci le prenotazioni per attività e servizi</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
          data-testid="create-booking-button"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuova Prenotazione
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state bg-white rounded-2xl">
          <Ticket className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3>Nessuna prenotazione</h3>
          <p>Crea la tua prima prenotazione per gestire le attività!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="bookings-list">
          {bookings.map((booking) => {
            const booked = booking.booked_by?.length || 0;
            const available = booking.available_slots - booked;
            const percentage = (booked / booking.available_slots) * 100;
            
            return (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{booking.title}</h3>
                  <span className={`badge ${available > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {available > 0 ? 'Disponibile' : 'Esaurito'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{booking.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Posti totali:</span>
                    <span className="font-bold text-gray-800">{booking.available_slots}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prenotati:</span>
                    <span className="font-bold text-indigo-600">{booked}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Disponibili:</span>
                    <span className="font-bold text-green-600">{available}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {percentage.toFixed(0)}% occupato
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Booking Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuova Prenotazione</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Titolo *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Es: Campo da Tennis"
                  data-testid="booking-title-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrizione *</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrizione della prenotazione..."
                  data-testid="booking-description-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Posti Disponibili *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.available_slots}
                  onChange={(e) => setFormData({ ...formData, available_slots: e.target.value })}
                  placeholder="Es: 10"
                  min="1"
                  data-testid="booking-slots-input"
                />
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  data-testid="submit-booking-button"
                >
                  Crea Prenotazione
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

export default Bookings;
