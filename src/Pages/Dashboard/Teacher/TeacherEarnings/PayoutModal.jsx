import React, { useState } from 'react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

const PayoutModal = ({ isOpen, onClose, netEarnings, refetch, onSuccess, user, hasPayoutMethod }) => {
  const axiosSecure = useAxiosSecure();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleConfirmTransfer = async () => {
    try {
      setSubmitting(true);
      setErrorMessage('');

      const res = await axiosSecure.post(`/teacher/payouts/request/${user?.email}`, {
        amount: netEarnings
      });

      if (res.data.success) {
        refetch();
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Payout request failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
        <h3 className="text-xl font-bold mb-4">Confirm Payout Request</h3>

        <div className="mb-4">
          <p className="text-sm text-gray-600">Payout Amount</p>
          <p className="text-3xl font-extrabold text-green-600 flex items-center gap-1">
            <FaBangladeshiTakaSign className="text-2xl" />
            {Number(netEarnings || 0).toFixed(2)}
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          This request will be sent to the admin, who will process it manually via bKash to your
          registered number.
        </p>

        {!hasPayoutMethod && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
            You haven't added a bKash number yet. Please set one up before requesting a payout.
          </p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmTransfer}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            disabled={submitting || !hasPayoutMethod || netEarnings <= 0}
          >
            {submitting ? 'Submitting...' : 'Request Payout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayoutModal;