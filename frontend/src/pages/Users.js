import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShield, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { userAPI } from '../services/api';
import { useToast } from '../components/ui/Toast';
import { formatDate, getInitials } from '../utils/helpers';

const Users = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const params = {};
        if (roleFilter !== 'all') params.role = roleFilter;
        const { data } = await userAPI.getAll(params);
        setUsers(data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAPI.updateRole(userId, newRole);
      addToast('User role updated');
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch {
      addToast('Failed to update role', 'error');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const { data } = await userAPI.toggleStatus(userId);
      addToast(`User ${data.user.isActive ? 'activated' : 'deactivated'}`);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: data.user.isActive } : u)));
    } catch {
      addToast('Failed to toggle status', 'error');
    }
  };

  if (loading) return <Loader className="min-h-[60vh]" size="lg" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 mt-1">Manage users and their roles.</p>
      </div>

      <div className="flex gap-2">
        {['all', 'volunteer', 'ngo_admin', 'super_admin'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              roleFilter === r ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-gray-400 border border-white/10'
            }`}
          >
            {r.replace('_', ' ')}
          </button>
        ))}
      </div>

      <Card>
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(u.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={u.role === 'super_admin' ? 'danger' : u.role === 'ngo_admin' ? 'primary' : 'default'}>
                  {u.role.replace('_', ' ')}
                </Badge>
                {u.role !== 'super_admin' && (
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="ngo_admin">NGO Admin</option>
                  </select>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(u._id)}>
                  {u.isActive ? <FiToggleRight className="text-green-400" /> : <FiToggleLeft className="text-red-400" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default Users;
