import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Users, Shield, User } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Members = ({ userTelegramId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await axios.get(`${API}/members?telegram_id=${userTelegramId}`);
      setMembers(response.data);
    } catch (error) {
      toast.error('Errore nel caricamento dei membri');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    
    if (!window.confirm(`Sei sicuro di voler cambiare il ruolo a ${newRole}?`)) {
      return;
    }

    try {
      await axios.patch(
        `${API}/members/${userId}/role?telegram_id=${userTelegramId}`,
        null,
        { params: { role: newRole } }
      );
      toast.success('Ruolo aggiornato con successo!');
      loadMembers();
    } catch (error) {
      toast.error('Errore nell\'aggiornamento del ruolo');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Layout userTelegramId={userTelegramId}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Membri</h1>
        <p className="text-purple-100">Gestisci i membri del CRAL</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} />
        </div>
      ) : members.length === 0 ? (
        <div className="empty-state bg-white rounded-2xl">
          <Users className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3>Nessun membro</h3>
          <p>I membri appariranno qui quando interagiranno con il bot</p>
        </div>
      ) : (
        <div className="table-container" data-testid="members-list">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Totale membri: {members.length}
            </h3>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Username</th>
                <th>Telegram ID</th>
                <th>Ruolo</th>
                <th>Stato</th>
                <th>Registrato il</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {member.first_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {member.first_name || 'Unknown'} {member.last_name || ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {member.username ? (
                      <span className="text-indigo-600">@{member.username}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {member.telegram_id}
                    </code>
                  </td>
                  <td>
                    {member.role === 'admin' ? (
                      <span className="badge badge-danger flex items-center w-fit">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </span>
                    ) : (
                      <span className="badge badge-info flex items-center w-fit">
                        <User className="w-3 h-3 mr-1" />
                        Membro
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${member.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {member.is_active ? 'Attivo' : 'Inattivo'}
                    </span>
                  </td>
                  <td className="text-gray-600">
                    {formatDate(member.registered_at)}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleRole(member.id, member.role)}
                      className="btn-secondary text-sm py-2 px-3"
                      data-testid="toggle-role-button"
                    >
                      {member.role === 'admin' ? 'Rimuovi Admin' : 'Rendi Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Members;
