import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiHeart, FiDollarSign, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { analyticsAPI, campaignAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await analyticsAPI.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader className="min-h-[60vh]" size="lg" />;

  const stats = data?.stats;
  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'from-purple-500 to-blue-500' },
    { label: 'Total Campaigns', value: stats?.totalCampaigns || 0, icon: FiHeart, color: 'from-emerald-500 to-teal-500' },
    { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: FiDollarSign, color: 'from-amber-500 to-orange-500' },
    { label: 'Active Campaigns', value: stats?.activeCampaigns || 0, icon: FiTarget, color: 'from-pink-500 to-rose-500' },
  ];

  const monthlyData = data?.monthlyDonations?.map((m) => ({
    name: m._id,
    value: m.total,
  })) || [];

  const categoryData = data?.categoryStats?.map((c) => ({
    name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
    value: c.count,
  })) || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Complete overview of your platform metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card glow>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">{card.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="text-white" size={20} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Link to="/campaigns/new">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-purple-600/20 via-dark-800 to-blue-600/20 border border-purple-500/20 rounded-2xl p-6 text-center cursor-pointer"
        >
          <FiHeart className="inline text-purple-400 mb-2" size={24} />
          <h3 className="text-lg font-semibold text-white">Create New Campaign</h3>
          <p className="text-sm text-gray-400">Launch a new impact campaign with AI assistance</p>
        </motion.div>
      </Link>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-purple-400" /> Monthly Donations
          </h2>
          <BarChart data={monthlyData} dataKey="value" color="#6c3bff" />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Campaign Categories</h2>
          <PieChart data={categoryData} />
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Campaigns</h2>
        {data?.recentCampaigns?.length > 0 ? (
          <div className="space-y-3">
            {data.recentCampaigns.map((camp) => (
              <Link key={camp._id} to={`/campaigns/${camp._id}`}>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">{camp.title}</p>
                    <p className="text-xs text-gray-400">by {camp.createdBy?.name}</p>
                  </div>
                  <span className="text-xs text-gray-500">{camp.status}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No campaigns created yet.</p>
        )}
      </Card>
    </motion.div>
  );
};

export default AdminDashboard;
