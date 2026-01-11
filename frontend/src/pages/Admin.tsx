import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, RefreshCw, Users, Clock, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { membersApi } from '../api/members';
import { Button } from '../components/Button';
import { Card, CardBody, CardHeader } from '../components/Card';
import { MooglePom } from '../components/MooglePom';

export function Admin() {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

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
      setRefreshMessage(`Successfully refreshed ${data.count} members!`);
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setTimeout(() => setRefreshMessage(null), 5000);
    },
    onError: () => {
      setRefreshMessage('Failed to refresh members. Please try again.');
      setTimeout(() => setRefreshMessage(null), 5000);
    },
  });

  const totalMembers = membersData?.totalCount || 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-moogle-gold to-moogle-gold-dark rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <MooglePom size="sm" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Admin Dashboard</h1>
            <p className="text-text-light">Welcome back, {user.username}!</p>
          </div>
        </div>

        {/* Alert Message */}
        {refreshMessage && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            refreshMessage.includes('Failed') 
              ? 'bg-red-50 border border-red-200 text-red-600' 
              : 'bg-green-50 border border-green-200 text-green-600'
          }`}>
            <CheckCircle className="w-5 h-5" />
            {refreshMessage}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-moogle-purple to-moogle-lavender rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-text-light text-sm">Total Members</p>
                <p className="text-3xl font-bold text-text-dark">{totalMembers}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-moogle-pink to-moogle-coral rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-text-light text-sm">Last Updated</p>
                <p className="text-lg font-bold text-text-dark">Today</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-moogle-gold to-moogle-gold-dark rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-text-light text-sm">Admin Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-text-dark">Member Management</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-text-light">
                Refresh member data from the Lodestone to sync the latest information
                about your FC members.
              </p>
              <Button
                onClick={() => refreshMutation.mutate()}
                isLoading={refreshMutation.isPending}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Member Data
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-text-dark">Quick Links</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <a
                href="/members"
                className="block p-3 bg-moogle-lavender/20 rounded-xl hover:bg-moogle-lavender/40 transition-colors"
              >
                <span className="font-medium text-text-dark">View All Members →</span>
              </a>
              <a
                href="https://na.finalfantasyxiv.com/lodestone/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-moogle-lavender/20 rounded-xl hover:bg-moogle-lavender/40 transition-colors"
              >
                <span className="font-medium text-text-dark">Open Lodestone ↗</span>
              </a>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
