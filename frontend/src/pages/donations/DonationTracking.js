import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { donationAPI } from '../../services/api';
import { formatCurrency, formatDateShort } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const DonationTracking = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donRes, statsRes] = await Promise.all([
          donationAPI.getAll({ page, limit: 10 }),
          donationAPI.getStats(),
        ]);
        setDonations(donRes.data.donations);
        setTotalPages(donRes.data.pages || 1);
        setStats(statsRes.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  if (loading) return <Loader className="min-h-[60vh]" size="lg" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Donation Tracking</h1>
        <p className="text-gray-400 mt-1">Track all donations and their impact.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card glow>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <FiDollarSign className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Donations</p>
              <p className="text-xl font-bold text-white">{stats?.totalDonations || 0}</p>
            </div>
          </div>
        </Card>
        <Card glow>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats?.totalAmount || 0)}</p>
            </div>
          </div>
        </Card>
        <Card glow>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <FiBarChart2 className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Average</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats?.avgAmount || 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Donation History</h2>
        {donations.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No donations yet.</p>
        ) : (
          <div className="space-y-3">
            {donations.map((don, i) => (
              <motion.div
                key={don._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                    <FiDollarSign className="text-purple-400" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{formatCurrency(don.amount)}</p>
                    <p className="text-xs text-gray-400">{don.campaign?.title || 'Campaign'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{formatDateShort(don.createdAt)}</p>
                  <span className="text-xs text-green-400">{don.paymentStatus}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default DonationTracking;
