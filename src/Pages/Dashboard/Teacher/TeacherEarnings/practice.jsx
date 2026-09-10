import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';
import PayoutModal from './PayoutModal';

const TeacherEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(false);

  const { data: earningsData = {}, refetch, isLoading } = useQuery({
    queryKey: ['teacherEarnings', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/teacher/earnings/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const handleConnectStripe = async () => {
    try {
      setLoadingStripe(true);
      const res = await axiosSecure.post(`/teacher/create-connect-account/${user?.email}`);
      if (res.data?.url) {
        window.location.href = res.data.url; // Redirect to Stripe Onboarding
      }
    } catch (error) {
      // console.error('Failed to initiate Stripe onboarding:', error);
    } finally {
      setLoadingStripe(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading earnings...</div>;

  // Extract variables safely with fallbacks
  const netEarnings = earningsData.netEarnings || 0;
  const hasStripeAccount = Boolean(earningsData.hasStripeAccount);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Teacher Earnings</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded-lg border">
          <p className="text-gray-500 text-sm">Available Net Balance</p>
          <h2 className="text-2xl font-bold text-green-600">${netEarnings}</h2>
        </div>
        <div className="p-4 bg-white shadow rounded-lg border">
          <p className="text-gray-500 text-sm">Total Gross Sales</p>
          <h2 className="text-2xl font-bold">${earningsData.totalGross || 0}</h2>
        </div>
        <div className="p-4 bg-white shadow rounded-lg border">
          <p className="text-gray-500 text-sm">Total Paid Out</p>
          <h2 className="text-2xl font-bold text-blue-600">${earningsData.totalPaidOut || 0}</h2>
        </div>
      </div>

      {/* Stripe Status Section */}
      <div className="mb-6 p-6 bg-white border rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800">Payout Account</h3>
          <p className="text-sm text-gray-500 mt-1">
            {hasStripeAccount 
              ? 'Your Stripe Account is linked and ready for automated payouts.' 
              : 'Link or complete setting up your bank account via Stripe to receive payouts.'}
          </p>
        </div>

        {!hasStripeAccount ? (
          <button
            onClick={handleConnectStripe}
            disabled={loadingStripe}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loadingStripe ? 'Redirecting...' : 'Complete Bank Onboarding'}
          </button>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={netEarnings <= 0}
            className="px-5 py-2.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Request Payout
          </button>
        )}
      </div>

      {/* Payout Modal */}
      <PayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        netEarnings={netEarnings}
        refetch={refetch}
        user={user}
      />
    </div>
  );
};

export default TeacherEarnings;