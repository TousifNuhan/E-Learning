// src/Pages/Dashboard/Admin/PlatformFeeSettings.jsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPercent, FiSave, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PlatformFeeSettings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['platform-fee'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/settings/platform-fee');
      return res.data;
    },
  });

  useEffect(() => {
    if (data?.platformFeePercentage !== undefined) {
      setInputValue((data.platformFeePercentage * 100).toString());
    }
  }, [data]);

  const updateFeeMutation = useMutation({
    mutationFn: async (feePercentage) => {
      const res = await axiosSecure.patch('/admin/settings/platform-fee', { feePercentage });
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Platform fee updated');
      queryClient.invalidateQueries({ queryKey: ['platform-fee'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update platform fee');
    }
  });

  const handleSave = () => {
    const percent = parseFloat(inputValue);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      toast.error('Please enter a valid percentage between 0 and 100');
      return;
    }
    updateFeeMutation.mutate(percent / 100);
  };

  if (isLoading) {
    return <div className="text-xs text-stone-500">Loading platform fee settings...</div>;
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
      <div className="flex items-center gap-2">
        <FiPercent className="text-[#07A698]" />
        <h3 className="text-sm font-bold text-stone-900">Platform Commission Fee</h3>
      </div>
      <p className="text-xs text-stone-500">
        This percentage is deducted from every new course sale. Existing transactions keep the rate that was active at the time they were made.
      </p>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-[160px]">
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2.5 pr-8 border border-stone-300 rounded-lg text-sm font-bold outline-none focus:border-[#07A698]"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-bold">%</span>
        </div>
        <button
          onClick={handleSave}
          disabled={updateFeeMutation.isPending}
          className="px-4 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
        >
          <FiSave className="text-sm" />
          {updateFeeMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div className="flex items-start gap-1.5 text-[11px] text-stone-400 bg-stone-50 border border-stone-100 rounded-lg p-2.5">
        <FiInfo className="shrink-0 mt-0.5" />
        <span>
          Current active rate: <span className="font-bold text-stone-600">{(data?.platformFeePercentage * 100).toFixed(1)}%</span>. 
          Changing this will not retroactively change past sales or already-calculated teacher earnings.
        </span>
      </div>
    </div>
  );
};

export default PlatformFeeSettings;