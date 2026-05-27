import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiDownload, FiShield, FiCheck } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { certificateAPI } from '../../services/api';
import { formatDate, getInitials } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const Certificates = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await certificateAPI.getAll();
        setCertificates(data.certificates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Loader className="min-h-[60vh]" size="lg" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Certificates</h1>
        <p className="text-gray-400 mt-1">Your verified impact certificates.</p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-20">
          <FiAward className="mx-auto text-gray-500 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-white mb-2">No Certificates Yet</h3>
          <p className="text-gray-400">Join campaigns and make donations to earn certificates.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card glow className="relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FiAward className="text-white" size={24} />
                    </div>
                    <FiShield className="text-green-400" size={20} />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 capitalize">{cert.type} Certificate</h3>
                  <p className="text-sm text-gray-400 mb-4">{cert.campaign?.title}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Certificate ID</span>
                      <span className="text-gray-300 font-mono text-xs">{cert.certificateId?.slice(0, 16)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Issued</span>
                      <span className="text-gray-300">{formatDate(cert.issuedDate)}</span>
                    </div>
                    {cert.metadata?.hoursContributed && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hours</span>
                        <span className="text-gray-300">{cert.metadata.hoursContributed}</span>
                      </div>
                    )}
                    {cert.metadata?.amountDonated && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount</span>
                        <span className="text-gray-300">${cert.metadata.amountDonated}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <Badge variant="success">
                      <FiCheck size={12} className="mr-1" /> Verified
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <FiDownload size={14} className="mr-1" /> Download
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Certificates;
