import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Plus, Users, Trash2, Edit, Eye } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Groups = ({ userTelegramId }) => {
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    member_telegram_ids: []
  });
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    loadGroups();
    loadMembers();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await axios.get(`${API}/groups?telegram_id=${userTelegramId}`);
      setGroups(response.data);
    } catch (error) {
      toast.error('Errore nel caricamento dei gruppi');
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const response = await axios.get(`${API}/members?telegram_id=${userTelegramId}`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Inserisci un nome per il gruppo');
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error('Seleziona almeno un membro');
      return;
    }

    try {
      const submitData = {
        ...formData,
        member_telegram_ids: selectedMembers
      };
      
      await axios.post(
        `${API}/groups?telegram_id=${userTelegramId}`,
        submitData
      );
      toast.success('Gruppo creato con successo!');
      setShowModal(false);
      setFormData({ name: '', description: '', member_telegram_ids: [] });
      setSelectedMembers([]);
      loadGroups();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Errore nella creazione del gruppo');
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo gruppo?')) {
      return;
    }

    try {
      await axios.delete(`${API}/groups/${groupId}?telegram_id=${userTelegramId}`);
      toast.success('Gruppo eliminato');
      loadGroups();
    } catch (error) {
      toast.error('Errore nell\'eliminazione del gruppo');
    }
  };

  const viewGroupMembers = async (group) => {
    try {
      const response = await axios.get(
        `${API}/groups/${group.id}/members?telegram_id=${userTelegramId}`
      );
      setGroupMembers(response.data.members);
      setSelectedGroup(group);
      setShowMembersModal(true);
    } catch (error) {
      toast.error('Errore nel caricamento dei membri');
    }
  };

  const toggleMemberSelection = (telegramId) => {
    setSelectedMembers(prev => 
      prev.includes(telegramId)
        ? prev.filter(id => id !== telegramId)
        : [...prev, telegramId]
    );
  };

  return (
    <Layout userTelegramId={userTelegramId}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Gruppi Utenti</h1>
          <p className="text-purple-100">Crea gruppi per notifiche mirate</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
          data-testid="create-group-button"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuovo Gruppo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} />
        </div>
      ) : groups.length === 0 ? (
        <div className="empty-state bg-white rounded-2xl">
          <Users className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3>Nessun gruppo</h3>
          <p>Crea il tuo primo gruppo per organizzare i membri!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="groups-list">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-2xl shadow-lg p-6 card-hover">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{group.name}</h3>
                <span className="badge badge-info">
                  {group.members?.length || 0} membri
                </span>
              </div>
              
              {group.description && (
                <p className="text-gray-600 mb-4">{group.description}</p>
              )}
              
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => viewGroupMembers(group)}
                  className="btn-secondary flex-1 text-sm py-2 flex items-center justify-center"
                  data-testid="view-members-button"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Vedi Membri
                </button>
                <button
                  onClick={() => handleDelete(group.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                  data-testid="delete-group-button"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuovo Gruppo</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nome Gruppo *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Es: Membri Attivi"
                  data-testid="group-name-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrizione</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrizione del gruppo..."
                  data-testid="group-description-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Seleziona Membri *</label>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {members.map((member) => (
                    <label
                      key={member.telegram_id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.telegram_id)}
                        onChange={() => toggleMemberSelection(member.telegram_id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {member.first_name} {member.last_name}
                        </div>
                        {member.username && (
                          <div className="text-sm text-gray-500">@{member.username}</div>
                        )}
                      </div>
                      <span className={`badge ${member.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                        {member.role}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedMembers.length} membri selezionati
                </p>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  data-testid="submit-group-button"
                >
                  Crea Gruppo
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

      {/* View Members Modal */}
      {showMembersModal && selectedGroup && (
        <div className="modal-overlay" onClick={() => setShowMembersModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Membri di "{selectedGroup.name}"
            </h2>
            <p className="text-gray-600 mb-6">
              {groupMembers.length} membri in questo gruppo
            </p>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {groupMembers.map((member) => (
                <div
                  key={member.telegram_id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {member.first_name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {member.first_name} {member.last_name}
                    </div>
                    {member.username && (
                      <div className="text-sm text-indigo-600">@{member.username}</div>
                    )}
                  </div>
                  <span className={`badge ${member.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                    {member.role === 'admin' ? 'Admin' : member.role === 'event_manager' ? 'Gestore' : 'Membro'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowMembersModal(false)}
              className="btn-secondary w-full mt-6"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Groups;
