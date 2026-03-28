import { useState } from 'react';
import { toast } from 'sonner';
import { Bot } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [telegramId, setTelegramId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!telegramId) {
      toast.error('Inserisci il tuo Telegram ID');
      return;
    }

    setLoading(true);
    
    // Simulate login - in real app, verify with backend
    setTimeout(() => {
      onLogin(parseInt(telegramId));
      toast.success('Accesso effettuato con successo!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CRAL Lecce</h1>
          <p className="text-gray-600">Dashboard Amministrativa</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="telegram-id">
              Telegram ID
            </label>
            <input
              id="telegram-id"
              type="number"
              className="form-input"
              placeholder="Inserisci il tuo Telegram ID"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              data-testid="telegram-id-input"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-6 flex items-center justify-center"
            disabled={loading}
            data-testid="login-button"
          >
            {loading ? (
              <>
                <div className="loading-spinner mr-2" />
                Accesso in corso...
              </>
            ) : (
              'Accedi'
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-gray-700">
            <strong>ℹ️ Nota:</strong> Per ottenere il tuo Telegram ID, usa il bot{' '}
            <a 
              href="https://t.me/userinfobot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 font-semibold hover:underline"
            >
              @userinfobot
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
