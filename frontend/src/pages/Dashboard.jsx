import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { BarChart3, Users, Calendar, Vote, CreditCard } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ userTelegramId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API}/statistics?telegram_id=${userTelegramId}`);
      setStats(response.data);
    } catch (error) {
      toast.error('Errore nel caricamento delle statistiche');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Membri Totali',
      value: stats?.total_members || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Sondaggi Attivi',
      value: stats?.active_polls || 0,
      icon: Vote,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Eventi Prossimi',
      value: stats?.upcoming_events || 0,
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Prenotazioni Attive',
      value: stats?.active_bookings || 0,
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Quote Non Pagate',
      value: stats?.unpaid_fees || 0,
      icon: CreditCard,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <Layout userTelegramId={userTelegramId}>
      <div className="mb-8" data-testid="dashboard">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-purple-100">Benvenuto nella dashboard del CRAL</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="stat-card card-hover"
                data-testid={`stat-card-${index}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">{stat.title}</p>
                    <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                    <Icon className="w-8 h-8 text-gray-700" />
                  </div>
                </div>
                <div className={`mt-4 h-2 bg-gradient-to-r ${stat.color} rounded-full`} />
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Benvenuto!</h2>
        <p className="text-gray-600 mb-6">
          Questa è la dashboard amministrativa del bot Telegram del CRAL del Palazzo di Giustizia di Lecce.
          Usa il menu laterale per gestire sondaggi, eventi, prenotazioni e altro.
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📝 Funzionalità disponibili:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <span className="mr-3">✅</span>
              <span>Creazione e gestione sondaggi (sì/no, scelta multipla, testuali)</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3">✅</span>
              <span>Organizzazione eventi con iscrizioni</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3">✅</span>
              <span>Sistema prenotazioni per attività</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3">✅</span>
              <span>Gestione membri e quote associative</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3">✅</span>
              <span>Invio notifiche broadcast a tutti i membri</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
