import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Plus, Trash2, BarChart2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Polls = ({ userTelegramId }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poll_type: 'yes_no',
    options: []
  });
  const [optionText, setOptionText] = useState('');

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      const response = await axios.get(`${API}/polls`);
      setPolls(response.data);
    } catch (error) {
      toast.error('Errore nel caricamento dei sondaggi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Inserisci un titolo');
      return;
    }

    if (formData.poll_type === 'multiple_choice' && formData.options.length < 2) {
      toast.error('Aggiungi almeno 2 opzioni');
      return;
    }

    try {
      await axios.post(
        `${API}/polls?telegram_id=${userTelegramId}`,
        formData
      );
      toast.success('Sondaggio creato con successo!');
      setShowModal(false);
      setFormData({ title: '', description: '', poll_type: 'yes_no', options: [] });
      loadPolls();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Errore nella creazione del sondaggio');
    }
  };

  const handleDelete = async (pollId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo sondaggio?')) {
      return;
    }

    try {
      await axios.delete(`${API}/polls/${pollId}?telegram_id=${userTelegramId}`);
      toast.success('Sondaggio eliminato');
      loadPolls();
    } catch (error) {
      toast.error('Errore nell\'eliminazione del sondaggio');
    }
  };

  const addOption = () => {
    if (optionText.trim()) {
      setFormData({
        ...formData,
        options: [...formData.options, optionText.trim()]
      });
      setOptionText('');
    }
  };

  const removeOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  const getPollTypeLabel = (type) => {
    const labels = {
      'yes_no': 'Sì/No',
      'multiple_choice': 'Scelta Multipla',
      'text_response': 'Risposta Testuale'
    };
    return labels[type] || type;
  };

  return (
    <Layout userTelegramId={userTelegramId}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Sondaggi</h1>
          <p className="text-purple-100">Gestisci i sondaggi per i membri del CRAL</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
          data-testid="create-poll-button"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuovo Sondaggio
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} />
        </div>
      ) : polls.length === 0 ? (
        <div className="empty-state bg-white rounded-2xl">
          <Vote className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3>Nessun sondaggio</h3>
          <p>Crea il tuo primo sondaggio per coinvolgere i membri!</p>
        </div>
      ) : (
        <div className="table-container" data-testid="polls-list">
          <table className="data-table">
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Tipo</th>
                <th>Voti</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((poll) => (
                <tr key={poll.id}>
                  <td>
                    <div>
                      <div className="font-semibold text-gray-800">{poll.title}</div>
                      {poll.description && (
                        <div className="text-sm text-gray-500">{poll.description}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {getPollTypeLabel(poll.poll_type)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <BarChart2 className="w-4 h-4 mr-2 text-gray-500" />
                      {Object.keys(poll.votes || {}).length}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${poll.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {poll.is_active ? 'Attivo' : 'Chiuso'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(poll.id)}
                      className="text-red-600 hover:text-red-800"
                      data-testid="delete-poll-button"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Poll Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuovo Sondaggio</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Titolo *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Es: Preferenza data evento annuale"
                  data-testid="poll-title-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrizione</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrizione del sondaggio..."
                  data-testid="poll-description-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo di Sondaggio *</label>
                <select
                  className="form-select"
                  value={formData.poll_type}
                  onChange={(e) => setFormData({ ...formData, poll_type: e.target.value, options: [] })}
                  data-testid="poll-type-select"
                >
                  <option value="yes_no">Sì/No</option>
                  <option value="multiple_choice">Scelta Multipla</option>
                  <option value="text_response">Risposta Testuale</option>
                </select>
              </div>

              {formData.poll_type === 'multiple_choice' && (
                <div className="form-group">
                  <label className="form-label">Opzioni *</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      className="form-input"
                      value={optionText}
                      onChange={(e) => setOptionText(e.target.value)}
                      placeholder="Aggiungi un'opzione"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                      data-testid="option-input"
                    />
                    <button
                      type="button"
                      onClick={addOption}
                      className="btn-secondary"
                      data-testid="add-option-button"
                    >
                      Aggiungi
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">{option}</span>
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-8">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  data-testid="submit-poll-button"
                >
                  Crea Sondaggio
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

export default Polls;
