import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiDollarSign, FiHeart } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { analyticsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { useAuth } from '../../context/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = user?.role === 'ngo_admin' || user?.role === 'super_admin'
          ? await analyticsAPI.getDashboard()
          : await analyticsAPI.getVolunteer();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <Loader className="min-h-[60vh]" size="lg" />;

  const isAdmin = user?.role === 'ngo_admin' || user?.role === 'super_admin';
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
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Data-driven insights into your impact.</p>
      </div>

      {isAdmin ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Revenue', value: formatCurrency(data?.stats?.totalRevenue || 0), icon: FiDollarSign, color: 'from-purple-500 to-blue-500' },
              { label: 'Total Users', value: data?.stats?.totalUsers || 0, icon: FiUsers, color: 'from-emerald-500 to-teal-500' },
              { label: 'Campaigns', value: data?.stats?.totalCampaigns || 0, icon: FiHeart, color: 'from-amber-500 to-orange-500' },
              { label: 'Active', value: data?.stats?.activeCampaigns || 0, icon: FiTrendingUp, color: 'from-pink-500 to-rose-500' },
            ].map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Monthly Donations</h2>
              <BarChart data={monthlyData} dataKey="value" />
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Campaign Categories</h2>
              <PieChart data={categoryData} />
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card glow>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Campaigns Joined</p>
                  <p className="text-2xl font-bold text-white mt-1">{data?.stats?.joinedCampaigns || 0}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <FiHeart className="text-white" size={20} />
                </div>
              </div>
            </Card>
            <Card glow>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Donated</p>
                  <p className="text-2xl font-bold text-white mt-1">{formatCurrency(data?.stats?.totalDonated || 0)}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="text-white" size={20} />
                </div>
              </div>
            </Card>
            <Card glow>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Donations</p>
                  <p className="text-2xl font-bold text-white mt-1">{data?.stats?.donationCount || 0}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <FiTrendingUp className="text-white" size={20} />
                </div>
              </div>
            </Card>
          </div>

          {data?.activeCampaigns?.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Your Active Campaigns</h2>
              <div className="space-y-3">
                {data.activeCampaigns.map((camp) => (
                  <div key={camp._id} className="p-3 bg-white/5 rounded-xl">
                    <p className="text-sm font-medium text-white">{camp.title}</p>
                    <p className="text-xs text-gray-400">{camp.createdBy?.organization || camp.createdBy?.name}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Analytics;
