import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const ManagePayouts = () => {
    const axiosSecure = useAxiosSecure();
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPayouts = async () => {
        try {
            const res = await axiosSecure.get('/admin/payouts');
            setPayouts(res.data || []);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to fetch payout requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, [axiosSecure]);

    const handleComplete = async (item) => {
        const { value: bkashTrxId } = await Swal.fire({
            title: 'Mark Payout as Completed',
            html: `
                <div class="text-left mt-2">
                    <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Teacher</p>
                    <p class="font-bold text-stone-800 text-sm mb-3">${item.teacherName || item.teacherEmail}</p>
                    <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Amount</p>
                    <p class="font-bold text-stone-800 text-base mb-3">৳${Number(item.amount || 0).toFixed(2)}</p>
                    <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">bKash Number</p>
                    <p class="font-bold text-stone-800 text-sm">${item.bkashNumber || 'N/A'}</p>
                </div>
            `,
            input: 'text',
            inputLabel: 'bKash Transaction ID',
            inputPlaceholder: 'e.g. 9G7H3K2L1M',
            inputValidator: (value) => {
                if (!value || !value.trim()) {
                    return 'You must enter the bKash transaction ID to confirm this payout';
                }
            },
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#07A698',
            cancelButtonColor: '#78716c',
            confirmButtonText: 'Confirm Completed',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rounded-2xl font-sans',
                confirmButton: 'rounded-xl px-4 py-2 text-xs font-bold cursor-pointer',
                cancelButton: 'rounded-xl px-4 py-2 text-xs font-bold cursor-pointer'
            }
        });

        if (!bkashTrxId) return;

        try {
            const res = await axiosSecure.patch(`/admin/payouts/${item._id}/complete`, {
                bkashTrxId: bkashTrxId.trim()
            });

            if (res.data?.success) {
                toast.success('Payout marked as completed!');
                fetchPayouts();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to complete payout');
        }
    };

    const handleReject = async (item) => {
        const { value: reason, isConfirmed } = await Swal.fire({
            title: 'Reject Payout Request?',
            html: `
                <div class="text-left mt-2">
                    <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Teacher</p>
                    <p class="font-bold text-stone-800 text-sm mb-3">${item.teacherName || item.teacherEmail}</p>
                    <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Amount</p>
                    <p class="font-bold text-stone-800 text-base">৳${Number(item.amount || 0).toFixed(2)}</p>
                </div>
            `,
            input: 'textarea',
            inputLabel: 'Reason (optional)',
            inputPlaceholder: 'e.g. Incorrect bKash number, insufficient balance, etc.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#78716c',
            confirmButtonText: 'Yes, Reject',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rounded-2xl font-sans',
                confirmButton: 'rounded-xl px-4 py-2 text-xs font-bold cursor-pointer',
                cancelButton: 'rounded-xl px-4 py-2 text-xs font-bold cursor-pointer'
            }
        });

        if (!isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/admin/payouts/${item._id}/reject`, {
                reason: reason?.trim() || 'Not specified'
            });

            if (res.data?.success) {
                toast.success('Payout request rejected');
                fetchPayouts();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reject payout');
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center font-sans">
                <div className="w-8 h-8 border-3 border-[#07A698] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6 font-sans text-stone-800">
            <div className="border-b border-stone-200/80 pb-4">
                <h1 className="text-2xl font-black text-[#162726] flex items-center gap-2">
                    <FiCreditCard className="text-[#07A698] shrink-0" /> Teacher Payout Management
                </h1>
                <p className="text-xs text-stone-500 pt-1 font-medium">
                    Review and process bKash payout requests submitted by teachers.
                </p>
            </div>

            {payouts.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                    No payout requests submitted yet.
                </div>
            ) : (
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[820px]">
                            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Teacher</th>
                                    <th className="p-4">bKash Number</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Requested</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-[#162726]">
                                {payouts.map((item) => {
                                    const requestedDate = item.createdAt || item.date;
                                    const formattedDate = requestedDate
                                        ? new Date(requestedDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })
                                        : 'N/A';

                                    return (
                                        <tr key={item._id} className="hover:bg-stone-50/60 transition-colors">
                                            <td className="p-4">
                                                <p className="font-bold break-words">{item.teacherName || 'Teacher'}</p>
                                                <p className="text-[#07A698] text-[11px] font-mono break-all">{item.teacherEmail}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-stone-700">
                                                    <FiSmartphone className="text-pink-500 shrink-0" />
                                                    {item.bkashNumber || 'N/A'}
                                                </span>
                                                {item.accountName && (
                                                    <p className="text-[11px] text-stone-400 mt-0.5">{item.accountName}</p>
                                                )}
                                            </td>
                                            <td className="p-4 font-extrabold text-[#162726] whitespace-nowrap">
                                                ৳{Number(item.amount || 0).toFixed(2)}
                                            </td>
                                            <td className="p-4 text-stone-500 whitespace-nowrap">
                                                {formattedDate}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                {item.status === 'Completed' ? (
                                                    <div>
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-full border border-emerald-200">
                                                            <FiCheckCircle className="shrink-0" /> Completed
                                                        </span>
                                                        {item.bkashTrxId && (
                                                            <p className="text-[10px] text-stone-400 font-mono mt-1">TrxID: {item.bkashTrxId}</p>
                                                        )}
                                                    </div>
                                                ) : item.status === 'Rejected' ? (
                                                    <div>
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 font-bold text-[11px] rounded-full border border-rose-200">
                                                            <FiXCircle className="shrink-0" /> Rejected
                                                        </span>
                                                        {item.rejectionReason && (
                                                            <p className="text-[10px] text-stone-400 mt-1 max-w-[160px] truncate" title={item.rejectionReason}>
                                                                {item.rejectionReason}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-full border border-amber-200">
                                                        <FiClock className="shrink-0" /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right whitespace-nowrap">
                                                {item.status === 'Pending' ? (
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleComplete(item)}
                                                            className="px-3 py-1.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                                                        >
                                                            Complete
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(item)}
                                                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-stone-400 font-medium text-[11px]">Processed</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePayouts;