import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  Percent, 
  CreditCard, 
  BookOpen, 
  Clock, 
  Download, 
  CheckCircle,
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import PayoutModal from './PayoutModal';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

const TeacherEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingPayout, setIsEditingPayout] = useState(false);
  const [bkashNumber, setBkashNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [savingPayoutMethod, setSavingPayoutMethod] = useState(false);

  const { data: userData = {}, isLoading: isUserLoading } = useQuery({
    queryKey: ['userInfo', user?.email],
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    }
  });

  const { data: rawStats = {}, isLoading: isStatsLoading, isFetching, refetch } = useQuery({
    queryKey: ['teacherEarnings', user?.email],
    enabled: !!user?.email,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await axiosSecure.get(`/teacher/earnings/${user?.email}`);
      return res.data;
    }
  });

  const hasPayoutMethod = Boolean(
    rawStats.hasPayoutMethod || userData?.payoutMethod?.number
  );

  const payoutMethod = rawStats.payoutMethod || userData?.payoutMethod || null;

  // Pre-fill the edit form with existing values whenever they load/change
  useEffect(() => {
    if (payoutMethod) {
      setBkashNumber(payoutMethod.number || '');
      setAccountName(payoutMethod.accountName || '');
    }
  }, [payoutMethod?.number, payoutMethod?.accountName]);

  const courses = (rawStats.courses || []).map((course) => {
    const price = Number(course.price || 0);
    const gross = Number(course.grossSales || 0);
    const net = Number(course.netRevenue || (gross * 0.90));
    const enrolled = Number(course.salesCount || course.enrolled || 0);

    return {
      ...course,
      title: course.title || course.courseName || course.name || 'Untitled Class',
      price,
      grossSales: gross,
      netRevenue: net,
      enrolled
    };
  });

  const payouts = rawStats.payoutHistory || rawStats.payouts || [];

  const totalGross = rawStats.totalGrossSales !== undefined 
    ? Number(rawStats.totalGrossSales) 
    : rawStats.totalGross !== undefined 
    ? Number(rawStats.totalGross)
    : courses.reduce((sum, c) => sum + c.grossSales, 0);

  const platformFee = rawStats.platformFee !== undefined 
    ? Number(rawStats.platformFee) 
    : (totalGross * 0.10);

  const totalPaidOut = rawStats.totalPaidOut !== undefined 
    ? Number(rawStats.totalPaidOut) 
    : payouts.reduce((sum, p) => (p.status !== 'Failed' ? sum + Number(p.amount || 0) : sum), 0);

  const availableNetBalance = rawStats.availableNetBalance !== undefined
    ? Number(rawStats.availableNetBalance)
    : Math.max(0, (totalGross - platformFee) - totalPaidOut);

  const handleManualRefresh = async () => {
    const { isSuccess } = await refetch();
    if (isSuccess) {
      toast.success('Earnings data updated!');
    } else {
      toast.error('Failed to update earnings data.');
    }
  };

  const handlePayoutSuccess = () => {
    toast.success('Payout request submitted successfully!');
    refetch(); 
  };

  const handleSavePayoutMethod = async () => {
    if (!bkashNumber.trim() || !accountName.trim()) {
      toast.error('Please enter both bKash number and account name.');
      return;
    }

    const bkashRegex = /^01[3-9]\d{8}$/;
    if (!bkashRegex.test(bkashNumber.trim())) {
      toast.error('Please enter a valid 11-digit bKash number (e.g. 01712345678)');
      return;
    }

    try {
      setSavingPayoutMethod(true);
      const res = await axiosSecure.patch(`/teacher/payout-method/${user?.email}`, {
        bkashNumber: bkashNumber.trim(),
        accountName: accountName.trim()
      });

      if (res.data?.success) {
        toast.success('Payout method saved!');
        setIsEditingPayout(false);
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save payout method');
    } finally {
      setSavingPayoutMethod(false);
    }
  };

  const handleExportCSV = () => {
    const csvRows = [];

    csvRows.push(['--- FINANCIAL SUMMARY ---']);
    csvRows.push(['Net Earnings (Available)', `${availableNetBalance.toFixed(2)}`]);
    csvRows.push(['Total Gross Revenue', `${totalGross.toFixed(2)}`]);
    csvRows.push(['Platform Fee Deducted', `-${platformFee.toFixed(2)}`]);
    csvRows.push(['Total Paid Out', `${totalPaidOut.toFixed(2)}`]);
    csvRows.push([]);

    csvRows.push(['--- PER-COURSE SALES BREAKDOWN ---']);
    csvRows.push(['Course Name', 'Price', 'Sales / Enrolled', 'Gross Sales', 'Net Revenue']);
    courses.forEach((course) => {
      const courseTitle = (course.title || '').replace(/"/g, '""');
      csvRows.push([
        `"${courseTitle}"`,
        `${course.price.toFixed(2)}`,
        course.enrolled,
        `${course.grossSales.toFixed(2)}`,
        `${course.netRevenue.toFixed(2)}`
      ]);
    });
    csvRows.push([]);

    csvRows.push(['--- PAYOUT HISTORY ---']);
    csvRows.push(['Payout ID', 'Date', 'Amount', 'Method', 'Status']);
    payouts.forEach((payout) => {
      const payoutLabel = (payout.method || 'bKash').replace(/"/g, '""');
      csvRows.push([
        payout.payoutId || payout._id,
        new Date(payout.createdAt || payout.date).toLocaleDateString(),
        `${Number(payout.amount || 0).toFixed(2)}`,
        `"${payoutLabel}"`,
        payout.status || 'Completed'
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((row) => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Earnings_Statement_${user?.email || 'teacher'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Statement exported successfully!');
  };

  if (isStatsLoading || isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] font-sans">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teacher Earnings & Payouts</h1>
          <p className="text-gray-500 text-sm">Track sales, manage earnings, platform fees, and payout account status.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isFetching}
            className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Statement (CSV)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Available Net Balance</span>
            <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
              <FaBangladeshiTakaSign className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-0.5">
            <FaBangladeshiTakaSign className="text-2xl" />
            {availableNetBalance.toFixed(2)}
          </h2>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Ready for withdrawal
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Gross Sales</span>
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-0.5">
            <FaBangladeshiTakaSign className="text-2xl" />
            {totalGross.toFixed(2)}
          </h2>
          <p className="text-xs text-gray-400 mt-1">Total revenue generated</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Platform Fee (10%)</span>
            <div className="p-3 bg-amber-50 rounded-full text-amber-600">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-amber-600 flex items-center gap-0.5">
            - <FaBangladeshiTakaSign className="text-2xl" />
            {platformFee.toFixed(2)}
          </h2>
          <p className="text-xs text-gray-400 mt-1">Deducted service commission</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Paid Out</span>
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-0.5">
            <FaBangladeshiTakaSign className="text-2xl" />
            {totalPaidOut.toFixed(2)}
          </h2>
          <p className="text-xs text-gray-400 mt-1">Successfully transferred</p>
        </div>
      </div>

      {/* Payout Account section — bKash instead of Stripe */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-50 rounded-xl text-pink-600">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Payout Account (bKash)</h3>
              {hasPayoutMethod && !isEditingPayout ? (
                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Payouts go to <span className="font-semibold text-gray-700">{payoutMethod?.number}</span>
                    {payoutMethod?.accountName ? ` (${payoutMethod.accountName})` : ''}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-0.5">
                  Add your bKash number to receive payouts. An admin processes requests manually.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditingPayout && (
              <>
                <button
                  onClick={() => setIsEditingPayout(true)}
                  className="px-5 py-2.5 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition cursor-pointer text-sm"
                >
                  {hasPayoutMethod ? 'Update bKash Number' : 'Add bKash Number'}
                </button>
                {hasPayoutMethod && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={availableNetBalance <= 0}
                    className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
                  >
                    Request Payout
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {isEditingPayout && (
          <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
                bKash Number
              </label>
              <input
                type="tel"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                placeholder="01712345678"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
                Account Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Name on the bKash account"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditingPayout(false);
                  setBkashNumber(payoutMethod?.number || '');
                  setAccountName(payoutMethod?.accountName || '');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm cursor-pointer"
                disabled={savingPayoutMethod}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePayoutMethod}
                disabled={savingPayoutMethod}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:opacity-50 text-sm cursor-pointer"
              >
                {savingPayoutMethod ? 'Saving...' : 'Save Payout Method'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-800">Per-Course Sales Breakdown</h3>
          </div>
          <span className="text-xs text-gray-400 font-medium">{courses.length} Active Courses</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Sales / Enrolled</th>
                <th className="py-3 px-4">Gross Sales</th>
                <th className="py-3 px-4">Net Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr key={course._id || index} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-4 font-medium text-gray-900">{course.title}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center">
                        <FaBangladeshiTakaSign className="text-xs mr-0.5" />
                        {course.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{course.enrolled}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      <span className="inline-flex items-center">
                        <FaBangladeshiTakaSign className="text-xs mr-0.5" />
                        {course.grossSales.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">
                      <span className="inline-flex items-center">
                        <FaBangladeshiTakaSign className="text-xs mr-0.5" />
                        {course.netRevenue.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    No course sales recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Payout History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                <th className="py-3 px-4">Payout ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {payouts.length > 0 ? (
                payouts.map((payout, index) => (
                  <tr key={payout._id || payout.payoutId || index} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{payout.payoutId || payout._id}</td>
                    <td className="py-3 px-4">{new Date(payout.createdAt || payout.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      <span className="inline-flex items-center">
                        <FaBangladeshiTakaSign className="text-xs mr-0.5" />
                        {Number(payout.amount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {payout.method || 'bKash'}
                      {payout.bkashNumber ? ` (${payout.bkashNumber})` : ''}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        payout.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : payout.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {payout.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    No past payout history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        netEarnings={availableNetBalance}
        refetch={refetch}
        onSuccess={handlePayoutSuccess}
        user={user}
        hasPayoutMethod={hasPayoutMethod}
      />
    </div>
  );
};

export default TeacherEarnings;