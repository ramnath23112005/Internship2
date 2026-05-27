import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun, FiLogOut, FiUser, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSocket } from '../../context/SocketContext';
import { notificationAPI } from '../../services/api';
import { getInitials } from '../../utils/helpers';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  React.useEffect(() => {
    if (user) {
      notificationAPI.getAll({ limit: 5 }).then(({ data }) => setNotifications(data.notifications || []));
    }
  }, [user]);

  React.useEffect(() => {
    if (socket) {
      socket.on('notification', (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      });
      return () => socket.off('notification');
    }
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(user
      ? [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/campaigns', label: 'Campaigns' },
        ]
      : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IX</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ImpactX
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {user ? (
              <>
                <div className="relative">
                  <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 relative">
                    <FiBell size={18} />
                    {notifications.filter((n) => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                        {notifications.filter((n) => !n.isRead).length}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-dark-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-white/5">
                          <p className="text-sm font-semibold text-white">Notifications</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="text-sm text-gray-400 p-4 text-center">No notifications</p>
                          ) : (
                            notifications.slice(0, 5).map((n) => (
                              <div key={n._id} className={`p-3 border-b border-white/5 ${!n.isRead ? 'bg-purple-500/5' : ''}`}>
                                <p className="text-sm text-white">{n.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(user.name)}
                    </div>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-dark-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-white/5">
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <div className="p-1">
                          <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <FiUser size={14} /> Profile
                          </button>
                          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                            <FiLogOut size={14} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all">Get Started</Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-dark-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  Logout
                </button>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-300 border border-white/10 rounded-xl">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
