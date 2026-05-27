import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGrid, FiHeart, FiDollarSign, FiBarChart2, FiAward, FiUsers, FiSettings,
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { to: '/campaigns', icon: FiHeart, label: 'Campaigns' },
    { to: '/donations', icon: FiDollarSign, label: 'Donations' },
    { to: '/analytics', icon: FiBarChart2, label: 'Analytics' },
    { to: '/certificates', icon: FiAward, label: 'Certificates' },
    { to: '/users', icon: FiUsers, label: 'Users', adminOnly: true },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-dark-800/50 backdrop-blur-xl border-r border-white/5 hidden lg:block overflow-y-auto">
      <div className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          return (
            <Link key={item.to} to={item.to}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
