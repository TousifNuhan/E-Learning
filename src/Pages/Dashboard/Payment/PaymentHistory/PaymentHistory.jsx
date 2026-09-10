import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FiFileText, 
  FiPrinter, 
  FiX, 
  FiCheckCircle, 
  FiShield, 
  FiCreditCard, 
  FiCornerUpLeft, 
  FiClock, 
  FiAlertCircle 
} from 'react-icons/fi';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [refundModalPayment, setRefundModalPayment] = useState(null);
  const [refundReason, setRefundReason] = useState('Technical Issue');
  const [refundDetails, setRefundDetails] = useState('');
  const [submittingRefund, setSubmittingRefund] = useState(false);

  const printRef = useRef(null);
  const hasShownStatusToast = useRef(false);

  const fetchPaymentHistory = () => {
    if (user?.email) {
      axiosSecure.get(`/payments/${user?.email}`)
        .then(res => setPayments(res.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [user?.email, axiosSecure]);

  useEffect(() => {
    if (hasShownStatusToast.current) return;

    const status = searchParams.get('status');
    if (!status) return;

    hasShownStatusToast.current = true;

    if (status === 'success') {
      toast.success('Payment successful! You are now enrolled.');
    } else if (status === 'fail') {
      toast.error('Payment failed. Please try again.');
    } else if (status === 'cancel') {
      toast('Payment was cancelled.', { icon: '⚠️' });
    }

    searchParams.delete('status');
    searchParams.delete('tran_id');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const isEligibleForRefund = (paidAtDate) => {
    if (!paidAtDate) return false;
    const purchaseDate = new Date(paidAtDate);
    const currentDate = new Date();
    const diffInDays = (currentDate - purchaseDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  const handleOpenRefundModal = (payment) => {
    setRefundModalPayment(payment);
    setRefundReason('Technical Issue');
    setRefundDetails('');
  };

  const handleSubmitRefundRequest = async (e) => {
    e.preventDefault();
    if (!refundModalPayment) return;

    setSubmittingRefund(true);

    const payload = {
      paymentId: refundModalPayment._id,
      transactionId: refundModalPayment.transactionId,
      userEmail: user?.email,
      userName: user?.displayName || 'Student',
      courseTitle: refundModalPayment.items?.[0]?.title || refundModalPayment.courseTitle || 'Course Access',
      amount: refundModalPayment.price || refundModalPayment.amount || 0,
      reason: refundReason,
      explanation: refundDetails,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    try {
      const res = await axiosSecure.post('/refund-requests', payload);
      if (res.data?.success) {
        toast.success('Refund request submitted successfully! Our team will review it shortly.');
        setRefundModalPayment(null);
        fetchPaymentHistory();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit refund request. Please try again.');
    } finally {
      setSubmittingRefund(false);
    }
  };

  const handlePrintInvoice = () => {
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
            @page { size: auto; margin: 0mm; }
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 font-sans">
      <div className="border-b border-stone-200/80 pb-4">
        <h1 className="text-2xl font-black text-[#162726]">Purchase & Payment History</h1>
        <p className="text-xs text-stone-500 pt-1 font-medium">
          View all your past course enrollments, download official receipts, or submit refund requests.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white rounded-2xl border border-stone-200">
          <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center text-xl">
            <FiCreditCard />
          </div>
          <h3 className="text-lg font-bold text-[#162726]">No Transactions Found</h3>
          <p className="text-stone-500 text-xs">You haven't purchased any courses yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Course Item(s)</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[#162726]">
                {payments.map((pay) => {
                  const eligible = isEligibleForRefund(pay.paidAt || pay.date || pay.createdAt);
                  const isRefunded = pay.status?.toLowerCase() === 'refunded';
                  const isPendingRefund = pay.refundRequested || pay.status?.toLowerCase() === 'refund_pending';

                  return (
                    <tr key={pay._id || pay.transactionId} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-4 font-medium text-stone-500 whitespace-nowrap">
                        {new Date(pay.paidAt || pay.date || pay.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4 font-bold max-w-xs truncate">
                        {pay.items?.[0]?.title || pay.courseTitle || 'Course Access & Enrollment'}
                      </td>
                      <td className="p-4 font-mono text-stone-500 truncate max-w-[150px]">
                        {pay.transactionId}
                      </td>
                      <td className="p-4 font-extrabold text-[#162726]">
                        ৳{Number(pay.price || pay.amount || 0).toFixed(2)}
                      </td>
                      <td className="p-4">
                        {isRefunded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 font-bold text-[11px] rounded-full border border-rose-200">
                            <FiX className="text-rose-600" /> Refunded
                          </span>
                        ) : isPendingRefund ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-full border border-amber-200">
                            <FiClock className="text-amber-600" /> Refund Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-full border border-emerald-200">
                            <FiCheckCircle className="text-emerald-600" /> Paid
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {!isRefunded && !isPendingRefund && eligible && (
                            <button
                              onClick={() => handleOpenRefundModal(pay)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all cursor-pointer"
                              title="Request a refund within 7 days"
                            >
                              <FiCornerUpLeft /> Request Refund
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedPayment(pay)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-[#162726] hover:text-white text-[#162726] font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            <FiFileText /> Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {refundModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
              <h3 className="text-base font-bold text-[#162726] flex items-center gap-2">
                <FiCornerUpLeft className="text-rose-600" /> Course Refund Request
              </h3>
              <button
                onClick={() => setRefundModalPayment(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-all cursor-pointer text-lg"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmitRefundRequest} className="space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-amber-800">
                <FiAlertCircle className="text-lg shrink-0 mt-0.5 text-amber-600" />
                <p>
                  Refund requests are valid within <strong>7 days</strong> of purchase, and only if you've viewed{' '}
                  <strong>less than 25%</strong> of the course content.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-600">Selected Course</label>
                <input
                  type="text"
                  disabled
                  value={refundModalPayment.items?.[0]?.title || refundModalPayment.courseTitle || 'Course Access'}
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl p-2.5 text-stone-700 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-600">Reason for Refund</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-[#162726] font-semibold outline-none focus:border-[#07A698]"
                >
                  <option value="Technical Issue">Technical Issue (Playback, broken content)</option>
                  <option value="Content Mismatch">Content Mismatch (Different from syllabus)</option>
                  <option value="Accidental Purchase">Accidental Duplicate Purchase</option>
                  <option value="Instructor Unresponsive">Instructor Unresponsiveness</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-600">Detailed Explanation</label>
                <textarea
                  required
                  rows={3}
                  value={refundDetails}
                  onChange={(e) => setRefundDetails(e.target.value)}
                  placeholder="Please describe why you are requesting a refund..."
                  className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-[#162726] font-medium outline-none focus:border-[#07A698]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setRefundModalPayment(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRefund}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingRefund ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
              <h3 className="text-base font-bold text-[#162726] flex items-center gap-2">
                <FiFileText className="text-[#07A698]" /> Official Invoice
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#162726] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  <FiPrinter /> Print / PDF
                </button>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-all cursor-pointer text-lg"
                >
                  <FiX />
                </button>
              </div>
            </div>

            <div ref={printRef} className="bg-white border border-stone-200 rounded-xl p-8 space-y-8">
              <div className="flex justify-between items-start border-b border-stone-200/80 pb-6">
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

                <div className="text-right space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                    <FiCheckCircle className="text-emerald-600" /> Paid
                  </span>
                  <p className="text-xs text-stone-500 pt-1 font-medium">
                    Date: {new Date(selectedPayment.paidAt || selectedPayment.date || selectedPayment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50 rounded-xl p-5 border border-stone-200/60 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">Billed To</p>
                  <p className="font-extrabold text-[#162726] text-sm">{user?.displayName || 'Student'}</p>
                  <p className="text-stone-500 font-medium">{selectedPayment.userEmail}</p>
                </div>

                <div className="space-y-1 md:text-right">
                  <p className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">Order Details</p>
                  <p className="font-mono font-bold text-[#162726] text-xs break-all">
                    ID: {selectedPayment.transactionId}
                  </p>
                  <p className="text-stone-500 font-medium flex items-center md:justify-end gap-1 pt-0.5">
                    <FiShield className="text-emerald-600" /> Payment Provider: SSLCommerz Secure Gateway
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
                      {selectedPayment.items && selectedPayment.items.length > 0 ? (
                        selectedPayment.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-3.5 font-bold">{item.title || 'Course Enrollment'}</td>
                            <td className="p-3.5 text-right font-extrabold">৳{Number(item.price || selectedPayment.price).toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="p-3.5 font-bold">{selectedPayment.courseTitle || 'Course Access & Lifetime Enrollment'}</td>
                          <td className="p-3.5 text-right font-extrabold">৳{Number(selectedPayment.price || selectedPayment.amount || 0).toFixed(2)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2 border-t border-stone-200/80 pt-4">
                <div className="w-full md:w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#162726]">
                      ৳{Number(selectedPayment.price || selectedPayment.amount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Tax / VAT (0%)</span>
                    <span className="font-bold text-[#162726]">৳0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-stone-200/80 text-sm font-bold text-[#162726]">
                    <span>Total Paid</span>
                    <span className="text-xl font-black text-[#07A698]">
                      ৳{Number(selectedPayment.price || selectedPayment.amount || 0).toFixed(2)}
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
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;