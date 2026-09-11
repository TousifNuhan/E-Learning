// import React, { useEffect, useState } from 'react';
// import { useLocation, Link, useNavigate } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from './CheckoutForm';
// import useCart from '../../../hooks/useCart';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import useAuth from '../../../hooks/useAuth';
// import toast from 'react-hot-toast';

// const stripeKey = import.meta.env.VITE_PAYMENT_GATEWAY_PK;
// const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// const Payment = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const axiosSecure = useAxiosSecure();
//     const { user } = useAuth();
//     const [cart] = useCart();

//     const [enrolledIds, setEnrolledIds] = useState([]);
//     const [loadingEnrollments, setLoadingEnrollments] = useState(true);

//     const stateData = location.state || {};
//     const passedItems = stateData.items || [];
//     const isDirectPurchase = stateData.isDirectPurchase || false;

//     // Fetch user's enrolled course IDs to check against current payment items
//     useEffect(() => {
//         if (user?.email) {
//             // Updated endpoint to /enrolled-classes/user/:email
//             axiosSecure.get(`/enrolled-classes/user/${encodeURIComponent(user.email)}`)
//                 .then(res => {
//                     // Expecting { success: true, classIds: [...] } from backend
//                     const ids = res.data?.classIds || [];
//                     setEnrolledIds(ids.map(id => String(id)));
//                 })
//                 .catch(err => {
//                     // toast.error("Failed to fetch enrolled class IDs:", err);
//                     setEnrolledIds([]);
//                 })
//                 .finally(() => setLoadingEnrollments(false));
//         } else {
//             setLoadingEnrollments(false);
//         }
//     }, [user?.email, axiosSecure]);

//     const itemsToPay = passedItems.length > 0 
//         ? passedItems 
//         : (cart || []).map(item => ({
//             cartId: item._id,
//             courseId: item.courseId || item.classId || item._id,
//             title: item.title,
//             price: Number(item.price) || 0,
//             image: item.image
//         }));

//     const totalAmount = stateData.totalAmount !== undefined 
//         ? Number(stateData.totalAmount) 
//         : itemsToPay.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

//     // Filter out items already purchased
//     const pendingItems = itemsToPay.filter(item => {
//         const itemId = String(item.courseId || item.classId || item._id);
//         return !enrolledIds.includes(itemId);
//     });

//     if (loadingEnrollments) {
//         return (
//             <div className="min-h-[50vh] flex items-center justify-center">
//                 <div className="w-8 h-8 border-3 border-[#07A698] border-t-transparent rounded-full animate-spin" />
//             </div>
//         );
//     }

//     // Render completion message if all items are already purchased
//     if (pendingItems.length === 0 && itemsToPay.length > 0) {
//         return (
//             <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
//                 <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">✓</div>
//                 <h2 className="text-2xl font-bold text-[#162726]">Payment Already Completed</h2>
//                 <p className="text-stone-500 text-sm">You are already enrolled in this course.</p>
//                 <Link
//                     to="/dashboard/enrolled-courses"
//                     className="px-6 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
//                 >
//                     View Enrolled Courses
//                 </Link>
//             </div>
//         );
//     }

//     if (!stripePromise) {
//         return (
//             <div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-2xl max-w-lg mx-auto my-12 font-semibold text-sm">
//                 Stripe Publishable Key is missing!
//             </div>
//         );
//     }

//     if (pendingItems.length === 0) {
//         return (
//             <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
//                 <h2 className="text-2xl font-bold text-[#162726]">Your Cart is Empty</h2>
//                 <Link
//                     to="/allCourses"
//                     className="px-6 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
//                 >
//                     Explore Courses
//                 </Link>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-4xl mx-auto p-6 space-y-8">
//             <div className="border-b border-stone-200/80 pb-4">
//                 <h1 className="text-2xl font-extrabold text-[#162726]">Checkout</h1>
//                 <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider pt-1">
//                     {isDirectPurchase ? 'Direct Purchase' : 'Cart Checkout'}
//                 </p>
//             </div>

//             <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
//                 <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Order Summary</h2>
//                 <div className="divide-y divide-stone-100">
//                     {pendingItems.map((item, idx) => (
//                         <div key={item.cartId || item.courseId || idx} className="py-3 flex justify-between items-center text-sm">
//                             <div className="flex items-center gap-3">
//                                 {item.image && (
//                                     <img src={item.image} alt={item.title} className="w-12 h-10 object-cover rounded-lg shrink-0" />
//                                 )}
//                                 <span className="font-bold text-[#162726]">{item.title}</span>
//                             </div>
//                             <span className="font-extrabold text-[#162726]">${Number(item.price).toFixed(2)}</span>
//                         </div>
//                     ))}
//                 </div>
//                 <div className="pt-3 border-t border-stone-100 flex justify-between items-center font-bold text-[#162726]">
//                     <span>Total Amount</span>
//                     <span className="text-xl text-[#07A698]">${Number(totalAmount).toFixed(2)}</span>
//                 </div>
//             </div>

//             <Elements stripe={stripePromise}>
//                 <CheckoutForm 
//                     items={pendingItems} 
//                     totalAmount={totalAmount} 
//                     isDirectPurchase={isDirectPurchase} 
//                 />
//             </Elements>
//         </div>
//     );
// };

// export default Payment;

import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiLock, FiAlertCircle } from 'react-icons/fi';
import useCart from '../../../hooks/useCart';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [cart] = useCart();

    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loadingEnrollments, setLoadingEnrollments] = useState(true);
    const [phone, setPhone] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const stateData = location.state || {};
    const passedItems = stateData.items || [];
    const isDirectPurchase = stateData.isDirectPurchase || false;

    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/enrolled-classes/user/${encodeURIComponent(user.email)}`)
                .then(res => {
                    const ids = res.data?.classIds || [];
                    setEnrolledIds(ids.map(id => String(id)));
                })
                .catch(() => setEnrolledIds([]))
                .finally(() => setLoadingEnrollments(false));
        } else {
            setLoadingEnrollments(false);
        }
    }, [user?.email, axiosSecure]);

    const itemsToPay = passedItems.length > 0
        ? passedItems
        : (cart || []).map(item => ({
            cartId: item._id,
            courseId: item.courseId || item.classId || item._id,
            title: item.title,
            price: Number(item.price) || 0,
            image: item.image
        }));

    const totalAmount = stateData.totalAmount !== undefined
        ? Number(stateData.totalAmount)
        : itemsToPay.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    const pendingItems = itemsToPay.filter(item => {
        const itemId = String(item.courseId || item.classId || item._id);
        return !enrolledIds.includes(itemId);
    });

    const handlePayNow = async () => {
        if (!phone.trim()) {
            setError('Please enter a contact phone number to continue.');
            return;
        }
        if (pendingItems.length === 0 || totalAmount <= 0) {
            setError('Your checkout session is empty or invalid.');
            return;
        }

        setError('');
        setProcessing(true);

        try {
            const payload = {
                items: pendingItems.map(item => ({
                    classId: item.courseId || item.classId || item._id,
                    title: item.title,
                    price: item.price
                })),
                totalAmount,
                isDirectPurchase,
                cartIds: isDirectPurchase ? [] : pendingItems.map(item => item.cartId || item._id).filter(Boolean),
                phone: phone.trim()
            };

            const res = await axiosSecure.post('/payment/init', payload);
            if (res.data?.gatewayUrl) {
                window.location.href = res.data.gatewayUrl;
            } else {
                setError('Could not start the payment session. Please try again.');
                setProcessing(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initialize payment.');
            toast.error(err.response?.data?.message || 'Failed to initialize payment');
            setProcessing(false);
        }
    };

    if (loadingEnrollments) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#07A698] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (pendingItems.length === 0 && itemsToPay.length > 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">✓</div>
                <h2 className="text-2xl font-bold text-[#162726]">Payment Already Completed</h2>
                <p className="text-stone-500 text-sm">You are already enrolled in this course.</p>
                <Link
                    to="/dashboard/myenroll-class"
                    className="px-6 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                    View Enrolled Courses
                </Link>
            </div>
        );
    }

    if (pendingItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
                <h2 className="text-2xl font-bold text-[#162726]">Your Cart is Empty</h2>
                <Link
                    to="/allCourses"
                    className="px-6 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                    Explore Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="border-b border-stone-200/80 pb-4">
                <h1 className="text-2xl font-extrabold text-[#162726]">Checkout</h1>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider pt-1">
                    {isDirectPurchase ? 'Direct Purchase' : 'Cart Checkout'} • Paid via SSLCommerz
                </p>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
                <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Order Summary</h2>
                <div className="divide-y divide-stone-100">
                    {pendingItems.map((item, idx) => (
                        <div key={item.cartId || item.courseId || idx} className="py-3 flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                                {item.image && (
                                    <img src={item.image} alt={item.title} className="w-12 h-10 object-cover rounded-lg shrink-0" />
                                )}
                                <span className="font-bold text-[#162726]">{item.title}</span>
                            </div>
                            <span className="font-extrabold text-[#162726]">৳{Number(item.price).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="pt-3 border-t border-stone-100 flex justify-between items-center font-bold text-[#162726]">
                    <span>Total Amount</span>
                    <span className="text-xl text-[#07A698]">৳{Number(totalAmount).toFixed(2)}</span>
                </div>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs max-w-lg mx-auto space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                        Contact Phone Number
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full p-3.5 border border-stone-200/90 rounded-xl bg-stone-50/50 focus:border-[#07A698] focus:ring-2 focus:ring-[#07A698]/20 focus:bg-white transition-all outline-none text-sm"
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200/80 p-3.5 rounded-xl">
                        <FiAlertCircle className="shrink-0 text-base" />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    onClick={handlePayNow}
                    disabled={processing || totalAmount <= 0}
                    className="w-full py-3.5 bg-[#07A698] hover:bg-[#05857a] disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-[#07A698]/20 flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Redirecting to SSLCommerz...</span>
                        </>
                    ) : (
                        <>
                            <FiLock className="text-sm" />
                            <span className='flex items-center'>Pay <span><FaBangladeshiTakaSign className='ml-1'/>
                            </span> {totalAmount.toFixed(2)} via SSLCommerz</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Payment;