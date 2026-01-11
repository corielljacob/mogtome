import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Shield, RefreshCw, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { membersApi } from '../api/members';
import { Button } from '../components/Button';
import { MooglePom } from '../components/MooglePom';

export function Admin() {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [refreshMessage, setRefreshMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Fetch member stats
  const { data: membersData } = useQuery({
    queryKey: ['members', 1, 1],
    queryFn: () => membersApi.getMembers({ page: 1, pageSize: 1 }),
  });

  // Refresh members mutation
  const refreshMutation = useMutation({
    mutationFn: membersApi.refreshMembers,
    onSuccess: (data) => {
      setRefreshMessage({ type: 'success', text: `Successfully refreshed ${data.count} members!` });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setTimeout(() => setRefreshMessage(null), 5000);
    },
    onError: () => {
      setRefreshMessage({ type: 'error', text: 'Failed to refresh members. Please try again.' });
      setTimeout(() => setRefreshMessage(null), 5000);
    },
  });

  const totalMembers = membersData?.totalCount || 0;

  const stats = [
    {
      icon: Users,
      label: 'Total Members',
      value: totalMembers,
      gradient: 'from-primary to-primary/60',
    },
    {
      icon: Clock,
      label: 'Last Updated',
      value: 'Today',
      gradient: 'from-secondary to-secondary/60',
    },
    {
      icon: Shield,
      label: 'Admin Status',
      value: 'Active',
      gradient: 'from-accent to-accent/60',
      valueClass: 'text-success',
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <MooglePom size="sm" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-base-content/60">Welcome back, {user.username}!</p>
          </div>
        </motion.div>

        {/* Alert Message */}
        {refreshMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`alert mb-6 ${refreshMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}
          >
            {refreshMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{refreshMessage.text}</span>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map(({ icon: Icon, label, value, gradient, valueClass }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="card bg-base-100 shadow-lg"
            >
              <div className="card-body flex-row items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-base-content/60 text-sm">{label}</p>
                  <p className={`text-2xl font-bold ${valueClass || ''}`}>{value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-base-100 shadow-lg"
          >
            <div className="card-body">
              <h2 className="card-title">Member Management</h2>
              <p className="text-base-content/60 mb-4">
                Refresh member data from the Lodestone to sync the latest information
                about your FC members.
              </p>
              <div className="card-actions">
                <Button
                  onClick={() => refreshMutation.mutate()}
                  isLoading={refreshMutation.isPending}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Member Data
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-base-100 shadow-lg"
          >
            <div className="card-body">
              <h2 className="card-title">Quick Links</h2>
              <div className="space-y-2">
                <a
                  href="/members"
                  className="btn btn-ghost btn-block justify-start"
                >
                  View All Members →
                </a>
                <a
                  href="https://na.finalfantasyxiv.com/lodestone/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-block justify-start"
                >
                  Open Lodestone ↗
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
