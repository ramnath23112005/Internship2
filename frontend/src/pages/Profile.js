import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiSave } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { authAPI } from '../services/api';
import { getInitials } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
    skills: user?.skills?.join(', ') || '',
    interests: user?.interests?.join(', ') || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile({
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
      });
      updateUser(data.user);
      addToast('Profile updated successfully!');
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account settings.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
            {getInitials(user?.name)}
          </div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <Badge className="mt-2" variant="primary">{user?.role?.replace('_', ' ')}</Badge>
        </Card>

        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" icon={FiUser} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" icon={FiMail} value={user?.email || ''} disabled className="opacity-60" />
              <Input label="Phone" icon={FiPhone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              {user?.role === 'ngo_admin' && (
                <Input label="Organization" icon={FiBriefcase} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
              )}
            </div>
            <Input label="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. Teaching, Fundraising, Design" />
            <Input label="Interests (comma separated)" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="e.g. Education, Environment" />
            <Button type="submit" loading={loading} className="w-full"><FiSave className="mr-1" /> Save Changes</Button>
          </form>
        </Card>
      </div>
    </motion.div>
  );
};

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-white/10 text-gray-300',
    primary: 'bg-purple-500/20 text-purple-400',
  };
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>;
};

export default Profile;
