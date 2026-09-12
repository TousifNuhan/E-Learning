import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiCornerUpLeft } from 'react-icons/fi';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const ManageRefunds = () => {
    const axiosSecure = useAxiosSecure();
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRefunds = async () => {
        try {
            const res = await axiosSecure.get('/refund-requests');
            setRefunds(res.data || []);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to fetch refund requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefunds();
    }, [axiosSecure]);

    const handleAction = async (id, paymentId, actionStatus) => {
        const isApprove = actionStatus === 'approved';

        const result = await Swal.fire({
            title: `Mark request as ${actionStatus}?`,
            text: `This action will set the refund status to ${actionStatus}.`,
            icon: isApprove ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonColor: isApprove ? '#07A698' : '#e11d48',
            cancelButtonColor: '#78716c',
            confirmButtonText: `Yes, ${actionStatus}!`,
            cancelButtonText: 'Cancel',
            borderRadius: '1rem',
            customClass: {
                popup: 'rounded-2xl font-sans',
                confirmButton: 'rounded-xl px-4 py-2 text-xs font-bold cursor-pointer',
                cancelButton: 'rounded-xl px-4 py-2 text-xs font-bold cursor-pointer'
            }
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/refund-requests/${id}`, {
                status: actionStatus,
                paymentId
            });

            if (res.data?.success) {
                toast.success(`Request ${actionStatus} successfully!`);
                fetchRefunds();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
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
                    <FiCornerUpLeft className="text-[#07A698] shrink-0" /> Refund Request Management
                </h1>
                <p className="text-xs text-stone-500 pt-1 font-medium">
                    Review and process student refund claims.
                </p>
            </div>

            {refunds.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                    No refund requests submitted yet.
                </div>
            ) : (
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[760px]">
                            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Course</th>
                                    <th className="p-4">Reason & Detail</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-[#162726]">
                                {refunds.map((item) => (
                                    <tr key={item._id} className="hover:bg-stone-50/60 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold break-words">{item.userName}</p>
                                            <p className="text-[#07A698] text-[11px] font-mono break-all">{item.userEmail}</p>
                                        </td>
                                        <td className="p-4 font-bold max-w-xs truncate">
                                            {item.courseTitle}
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <span className="font-bold block text-stone-700">{item.reason}</span>
                                            <p className="text-stone-500 truncate text-[11px]">{item.explanation}</p>
                                        </td>
                                        <td className="p-4 font-extrabold text-[#162726] whitespace-nowrap">
                                            <span className="inline-flex items-center gap-0.5">
                                                <FaBangladeshiTakaSign className="text-xs" />
                                                <span>{Number(item.amount || 0).toFixed(2)}</span>
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {item.status === 'approved' ? (
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-full border border-emerald-200">
                                                        <FiCheckCircle className="shrink-0" /> Approved
                                                    </span>
                                                    {item.sslcommerzRefundSucceeded === false && (
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 w-fit">
                                                            <FiClock className="shrink-0" /> Needs manual refund
                                                        </span>
                                                    )}
                                                </div>
                                            ) : item.status === 'rejected' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 font-bold text-[11px] rounded-full border border-rose-200">
                                                    <FiXCircle className="shrink-0" /> Rejected
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-full border border-amber-200">
                                                    <FiClock className="shrink-0" /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right whitespace-nowrap">
                                            {item.status === 'pending' ? (
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleAction(item._id, item.paymentId, 'approved')}
                                                        className="px-3 py-1.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(item._id, item.paymentId, 'rejected')}
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRefunds;