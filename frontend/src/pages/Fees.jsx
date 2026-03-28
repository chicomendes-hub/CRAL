import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Plus, CreditCard, Check, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Fees = ({ userTelegramId }) => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user_telegram_id: '',
    amount: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      const response = await axios.get(`${API}/fees?telegram_id=${userTelegramId}`);
      setFees(response.data);
    } catch (error) {
      toast.error('Errore nel caricamento delle quote');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.user_telegram_id || !formData.amount || !formData.year) {
      toast.error('Compila tutti i campi');
      return;
    }

    try {
      const submitData = {
        user_telegram_id: parseInt(formData.user_telegram_id),
        amount: parseFloat(formData.amount),
        year: parseInt(formData.year)
      };
      
      await axios.post(
        `${API}/fees?telegram_id=${userTelegramId}`,
        submitData
      );
      toast.success('Quota aggiunta con successo!');
      setShowModal(false);
      setFormData({
        user_telegram_id: '',
        amount: '',
        year: new Date().getFullYear()
      });
      loadFees();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Errore nell\'aggiunta della quota');
    }
  };

  const markAsPaid = async (feeId) => {
    if (!window.confirm('Confermi che questa quota è stata pagata?')) {
      return;
    }

    try {
      await axios.patch(`${API}/fees/${feeId}/pay?telegram_id=${userTelegramId}`);
      toast.success('Quota contrassegnata come pagata!');
      loadFees();
    } catch (error) {
      toast.error('Errore nell\'aggiornamento della quota');
    }
  };

  const getTotalStats = () => {
    const total = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paid = fees.filter(f => f.is_paid).reduce((sum, fee) => sum + fee.amount, 0);
    const unpaid = total - paid;
    
    return { total, paid, unpaid, count: fees.length };
  };

  const stats = getTotalStats();

  return (
    <Layout userTelegramId={userTelegramId}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Quote Associative</h1>
          <p className="text-purple-100">Gestisci le quote associative dei membri</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
          data-testid="create-fee-button"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuova Quota
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-sm text-gray-600 mb-1">Quote Totali</p>
          <p className="text-3xl font-bold text-gray-800">{stats.count}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-600 mb-1">Importo Totale</p>
          <p className="text-3xl font-bold text-indigo-600">€{stats.total.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-600 mb-1">Pagate</p>
          <p className="text-3xl font-bold text-green-600">€{stats.paid.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-600 mb-1">Da Pagare</p>
          <p className="text-3xl font-bold text-red-600">€{stats.unpaid.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} />
        </div>
      ) : fees.length === 0 ? (
        <div className="empty-state bg-white rounded-2xl">
          <CreditCard className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3>Nessuna quota</h3>
          <p>Aggiungi la prima quota associativa!</p>
        </div>
      ) : (
        <div className="table-container" data-testid="fees-list">
          <table className="data-table">
            <thead>
              <tr>
                <th>Telegram ID</th>
                <th>Anno</th>
                <th>Importo</th>
                <th>Stato</th>
                <th>Data Pagamento</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id}>
                  <td>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {fee.user_telegram_id}
                    </code>
                  </td>
                  <td>
                    <span className="font-semibold text-gray-800">{fee.year}</span>
                  </td>
                  <td>
                    <span className="font-bold text-indigo-600">€{fee.amount.toFixed(2)}</span>
                  </td>
                  <td>
                    {fee.is_paid ? (
                      <span className="badge badge-success flex items-center w-fit">
                        <Check className="w-3 h-3 mr-1" />
                        Pagata
                      </span>
                    ) : (
                      <span className="badge badge-danger flex items-center w-fit">
                        <X className="w-3 h-3 mr-1" />
                        Non Pagata
                      </span>
                    )}
                  </td>
                  <td className="text-gray-600">
                    {fee.paid_at ? (
                      new Date(fee.paid_at).toLocaleDateString('it-IT')
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    {!fee.is_paid && (
                      <button
                        onClick={() => markAsPaid(fee.id)}
                        className="btn-primary text-sm py-2 px-4"
                        data-testid="mark-paid-button"
                      >
                        Segna come Pagata
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Fee Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuova Quota Associativa</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Telegram ID Utente *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.user_telegram_id}
                  onChange={(e) => setFormData({ ...formData, user_telegram_id: e.target.value })}
                  placeholder="Es: 123456789"
                  data-testid="fee-telegram-id-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Importo (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Es: 50.00"
                  data-testid="fee-amount-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Anno *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="Es: 2026"
                  data-testid="fee-year-input"
                />
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  data-testid="submit-fee-button"
                >
                  Aggiungi Quota
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

export default Fees;
