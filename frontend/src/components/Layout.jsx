import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Vote, 
  Calendar, 
  Ticket, 
  Users, 
  CreditCard, 
  Bell, 
  LogOut,
  Bot,
  UsersRound
} from 'lucide-react';

const Layout = ({ children, userTelegramId }) => {
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/polls', label: 'Sondaggi', icon: Vote },
    { path: '/events', label: 'Eventi', icon: Calendar },
    { path: '/bookings', label: 'Prenotazioni', icon: Ticket },
    { path: '/members', label: 'Membri', icon: Users },
    { path: '/groups', label: 'Gruppi', icon: UsersRound },
    { path: '/fees', label: 'Quote', icon: CreditCard },
    { path: '/notifications', label: 'Notifiche', icon: Bell }
  ];

  const handleLogout = () => {
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">CRAL Lecce</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentPath(item.path)}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="nav-item w-full"
            data-testid="logout-button"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Esci
          </button>
          <div className="mt-3 px-4 py-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">ID: {userTelegramId}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
