import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiTrash2,
    FiArrowLeft,
    FiShield,
    FiShoppingCart,
    FiBookOpen
} from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useCart from '../../../hooks/useCart';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

const Cart = () => {
    const [cart, refetch, isLoading] = useCart();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleDeleteItem = id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axiosSecure.delete(`/carts/${id}`)
                        .then(res => {
                            if (res.data.acknowledged) {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Your course has been deleted from the cart",
                                    icon: "success"
                                });
                                refetch();
                            }
                        });
                }
            });
    };

    const grandTotal = Math.round(cart?.reduce((sum, item) => sum + (Number(item.price) || 0), 0) || 0);
    const originalSubtotal = Math.round(cart?.reduce((sum, item) => sum + (Number(item.originalPrice) || Number(item.price) || 0), 0) || 0);
    const savingsFromDiscount = Math.round(originalSubtotal - grandTotal);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center space-y-4 pt-28">
                <div className="h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
                    Loading your cart...
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#F8F9FB] pb-20 min-h-screen text-stone-800 font-sans antialiased">
            <Helmet>
                <title>EdCare | My Shopping Cart</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#162726] tracking-tight">
                            Shopping Cart
                        </h1>
                        <p className="text-sm text-stone-500 font-medium pt-1">
                            {cart?.length || 0} {cart?.length === 1 ? 'course' : 'courses'} in your cart
                        </p>
                    </div>

                    <Link
                        to="/allCourses"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#07A698] hover:text-[#05857a] transition-colors"
                    >
                        <FiArrowLeft className="text-sm" /> Continue Browsing
                    </Link>
                </div>

                {!cart || cart.length === 0 ? (
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-5 shadow-xs">
                        <div className="w-16 h-16 bg-[#07A698]/10 text-[#07A698] rounded-full flex items-center justify-center mx-auto">
                            <FiShoppingCart className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-[#162726]">Your Cart is Empty</h2>
                            <p className="text-sm text-stone-500 font-medium">
                                Looks like you haven't added any courses to your learning list yet.
                            </p>
                        </div>
                        <Link
                            to="/allCourses"
                            className="inline-block px-6 py-3 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                        >
                            Explore Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        <div className="lg:col-span-8 space-y-4">
                            {cart.map((item) => {
                                const itemPrice = Math.round(Number(item.price) || 0);
                                const origPrice = Math.round(Number(item.originalPrice) || 0);

                                return (
                                    <div
                                        key={item._id}
                                        className="bg-white border border-stone-200/80 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-xs hover:border-[#07A698]/40 transition-all duration-200"
                                    >
                                        <div className="w-full sm:w-36 aspect-video sm:aspect-4/3 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                                            <img
                                                src={item.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300"}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-2 w-full">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold bg-[#07A698]/10 text-[#07A698] px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {item.category || 'Development'}
                                                </span>
                                                {item.duration && (
                                                    <span className="text-xs text-stone-400 font-medium">
                                                        • {item.duration}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-bold text-base text-[#162726] line-clamp-1 hover:text-[#07A698] transition-colors cursor-pointer" onClick={() => navigate(`/class/${item.courseId}`)}>
                                                {item.title}
                                            </h3>

                                            <p className="text-xs text-stone-500 font-medium">
                                                By <span className="text-stone-700 font-semibold">{item.instructor?.name || 'Instructor'}</span>
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
                                                <span className="flex items-center gap-1">
                                                    <FiBookOpen className="text-stone-400" />
                                                    {item.stats?.totalLessons || 0} Lessons
                                                </span>
                                                <span>•</span>
                                                <span className="capitalize">{item.skillLevel || 'All Levels'}</span>
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100 gap-3">
                                            <div className="text-left sm:text-right">
                                                <div className="text-lg font-black text-[#162726] flex items-center sm:justify-end gap-0.5">
                                                    {itemPrice === 0 ? "Free" : (
                                                        <>
                                                            <FaBangladeshiTakaSign className="text-base" />
                                                            <span>{itemPrice}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {origPrice > itemPrice && (
                                                    <div className="text-xs text-stone-400 line-through font-medium flex items-center sm:justify-end gap-0.5">
                                                        <FaBangladeshiTakaSign className="text-[10px]" />
                                                        <span>{origPrice}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleDeleteItem(item._id)}
                                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                                title="Remove Course"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
                            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                                <h2 className="text-lg font-bold text-[#162726] border-b border-stone-100 pb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-stone-600">
                                        <span>Original Price</span>
                                        <span className="font-semibold text-stone-800 flex items-center gap-0.5">
                                            <FaBangladeshiTakaSign className="text-xs" />
                                            <span>{originalSubtotal}</span>
                                        </span>
                                    </div>

                                    {savingsFromDiscount > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-medium">
                                            <span>Course Discounts</span>
                                            <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                                                <span>-</span>
                                                <FaBangladeshiTakaSign className="text-xs" />
                                                <span>{savingsFromDiscount}</span>
                                            </span>
                                        </div>
                                    )}

                                    <div className="border-t border-stone-100 pt-3 flex justify-between items-baseline">
                                        <span className="font-bold text-[#162726] text-base">Total:</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-[#162726] flex items-center justify-end gap-0.5">
                                                <FaBangladeshiTakaSign className="text-xl" />
                                                <span>{grandTotal < 0 ? 0 : grandTotal}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/dashboard/payment', {
                                        state: {
                                            items: cart.map(item => ({
                                                cartId: item._id,
                                                courseId: item.courseId,
                                                title: item.title,
                                                price: Math.round(Number(item.price) || 0),
                                                image: item.image
                                            })),
                                            totalAmount: grandTotal,
                                            isDirectPurchase: false
                                        }
                                    })}
                                    className="w-full py-3.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-[#07A698]/20"
                                >
                                    PROCEED TO CHECKOUT
                                </button>

                                <div className="flex items-center justify-center gap-2 text-xs text-stone-400 font-medium pt-2">
                                    <FiShield className="text-lg text-emerald-600" />
                                    <span>30-Day Guarantee • Secure Payment</span>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default Cart;