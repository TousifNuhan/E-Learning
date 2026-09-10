import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiArrowLeft, FiPrinter, FiShield, FiFileText } from 'react-icons/fi';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const Invoice = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const printRef = useRef(null);

    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const stateData = location.state || {};
    const transactionId = stateData.transactionId || searchParams.get('tran_id') || searchParams.get('transactionId');

    useEffect(() => {
        if (transactionId && user?.email) {
            axiosSecure.get(`/payments/${user.email}`)
                .then(res => {
                    const matchedPayment = res.data?.find(p => p.transactionId === transactionId);
                    setPaymentDetails(matchedPayment || null);
                })
                .catch(err => {
                    toast.error(err?.response?.data?.message || 'Failed to fetch invoice details.');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [transactionId, user?.email, axiosSecure]);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';

        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>EdCare - Receipt</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @page { 
                            size: auto; 
                            margin: 0mm; 
                        }
                        body { 
                            font-family: ui-sans-serif, system-ui, sans-serif; 
                            background: white; 
                            margin: 0; 
                            padding: 20mm; 
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    </style>
                </head>
                <body>
                    <div style="max-width: 800px; margin: 0 auto;">
                        ${printContent.innerHTML}
                    </div>
                </body>
            </html>
        `);
        doc.close();

        iframe.contentWindow.focus();
        setTimeout(() => {
            iframe.contentWindow.print();
            document.body.removeChild(iframe);
        }, 500);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center font-sans">
                <div className="w-8 h-8 border-3 border-[#07A698] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!paymentDetails && !transactionId) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4 font-sans">
                <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center text-xl shrink-0">
                    <FiFileText />
                </div>
                <h2 className="text-2xl font-bold text-[#162726]">No Invoice Found</h2>
                <p className="text-stone-500 text-sm">Please complete a purchase to view your receipt.</p>
                <button
                    onClick={() => navigate('/dashboard/myenroll-class')}
                    className="px-5 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
                >
                    View Enrolled Courses
                </button>
            </div>
        );
    }

    const receiptData = paymentDetails || {
        transactionId: transactionId || 'N/A',
        price: stateData.totalAmount || 0,
        paidAt: new Date().toISOString(),
        items: stateData.items || []
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
                <button
                    onClick={() => navigate('/dashboard/myenroll-class')}
                    className="inline-flex items-center gap-2 text-stone-500 hover:text-[#162726] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                    <FiArrowLeft className="text-base shrink-0" /> Back to My Courses
                </button>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#162726] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                >
                    <FiPrinter className="text-base shrink-0" /> Print / Save PDF
                </button>
            </div>

            <div ref={printRef} className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-stone-200/80 pb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-[#162726]">EdCare</span>
                            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-teal-50 text-[#07A698] rounded-md border border-teal-200/60">
                                Official Receipt
                            </span>
                        </div>
                        <p className="text-xs text-stone-400 font-medium pt-1">
                            EdCare Inc. • Online Learning Platform
                        </p>
                    </div>

                    <div className="text-left sm:text-right space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                            <FiCheckCircle className="text-emerald-600 shrink-0" /> Paid
                        </span>
                        <p className="text-xs text-stone-500 pt-1 font-medium whitespace-nowrap">
                            Date: {new Date(receiptData.paidAt || receiptData.date || receiptData.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50 rounded-xl p-5 border border-stone-200/60 text-xs">
                    <div className="space-y-1 min-w-0">
                        <p className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">Billed To</p>
                        <p className="font-extrabold text-[#162726] text-sm break-words">{user?.displayName || 'Student'}</p>
                        <p className="text-stone-500 font-medium break-all">{receiptData.userEmail || user?.email}</p>
                    </div>

                    <div className="space-y-1 md:text-right min-w-0">
                        <p className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">Order Details</p>
                        <p className="font-mono font-bold text-[#162726] text-xs break-all">
                            ID: {receiptData.transactionId}
                        </p>
                        <p className="text-stone-500 font-medium flex items-center md:justify-end gap-1 pt-0.5">
                            <FiShield className="text-emerald-600 shrink-0" /> 
                            <span>Payment Provider: SSLCommerz Secure Gateway</span>
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Summary</h3>
                    <div className="overflow-hidden border border-stone-200/80 rounded-xl">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-stone-50 border-b border-stone-200/80 text-stone-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-3.5">Item Description</th>
                                    <th className="p-3.5 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-[#162726]">
                                {receiptData.items && receiptData.items.length > 0 ? (
                                    receiptData.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-stone-50/50">
                                            <td className="p-3.5 font-bold break-words">{item.title || 'Course Enrollment'}</td>
                                            <td className="p-3.5 text-right font-extrabold whitespace-nowrap">
                                                ৳{Number(item.price ?? receiptData.price).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="p-3.5 font-bold break-words">
                                            {receiptData.courseTitle || 'Course Access & Lifetime Enrollment'}
                                        </td>
                                        <td className="p-3.5 text-right font-extrabold whitespace-nowrap">
                                            ৳{Number(receiptData.price || receiptData.amount || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col items-end space-y-2 border-t border-stone-200/80 pt-4">
                    <div className="w-full sm:w-64 space-y-2 text-xs">
                        <div className="flex justify-between text-stone-500">
                            <span>Subtotal</span>
                            <span className="font-bold text-[#162726]">
                                ৳{Number(receiptData.price || receiptData.amount || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-stone-500">
                            <span>Tax / VAT (0%)</span>
                            <span className="font-bold text-[#162726]">৳0.00</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-stone-200/80 text-sm font-bold text-[#162726]">
                            <span>Total Paid</span>
                            <span className="text-xl font-black text-[#07A698]">
                                ৳{Number(receiptData.price || receiptData.amount || 0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-center border-t border-stone-100 pt-6 text-[11px] text-stone-400 space-y-1">
                    <p>Thank you for learning with EdCare!</p>
                    <p>If you have any questions about this receipt, contact support at support@edcare.com</p>
                </div>
            </div>
        </div>
    );
};

export default Invoice;