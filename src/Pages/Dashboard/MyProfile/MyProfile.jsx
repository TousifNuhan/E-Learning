import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiMail, FiCheckCircle, FiUser, FiShield, FiEdit2, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../../Firebase/Firebase.config';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyProfile = () => {
    const { user, refreshUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', photoURL: '' });

    const { data: profile = {}, isLoading } = useQuery({
        queryKey: ['my-profile', user?.email],
        enabled: !!user?.email && !!localStorage.getItem('access-token'),
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data;
        },
    });

    const displayName = profile?.name || user?.displayName || 'User Name';
    const displayEmail = profile?.email || user?.email || 'No email provided';
    const displayImage = profile?.photoURL || profile?.image || user?.photoURL || 'https://i.ibb.co/mJRk027/default-avatar.png';
    const displayRole = profile?.role || 'student';
    const displayStatus = profile?.status || (user?.emailVerified ? 'Verified' : 'Active');

    useEffect(() => {
        setFormData({
            name: displayName === 'User Name' ? '' : displayName,
            photoURL: displayImage.includes('default-avatar') ? '' : displayImage,
        });
    }, [profile?.name, profile?.photoURL, profile?.image]);

    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData) => {
            const res = await axiosSecure.patch(`/users/${user.email}`, updatedData);

            if (updatedData.name || updatedData.photoURL) {
                await updateProfile(auth.currentUser, {
                    ...(updatedData.name && { displayName: updatedData.name }),
                    ...(updatedData.photoURL && { photoURL: updatedData.photoURL }),
                });
            }

            return res.data;
        },
        onSuccess: () => {
            toast.success('Profile updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['my-profile', user?.email] });
            queryClient.invalidateQueries({ queryKey: ['dbUser', user?.email] }); 
            refreshUser();
            setIsEditing(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to update profile.');
        },
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCancel = () => {
        setFormData({
            name: displayName === 'User Name' ? '' : displayName,
            photoURL: displayImage.includes('default-avatar') ? '' : displayImage,
        });
        setIsEditing(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Name cannot be empty.');
            return;
        }

        const payload = {};
        if (formData.name.trim() !== displayName) payload.name = formData.name.trim();
        if (formData.photoURL.trim() && formData.photoURL.trim() !== displayImage) {
            payload.photoURL = formData.photoURL.trim();
        }

        if (Object.keys(payload).length === 0) {
            toast('No changes to save.');
            setIsEditing(false);
            return;
        }

        updateProfileMutation.mutate(payload);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 font-sans">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#07A698]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-6 font-sans">
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#07A698] to-[#162726] relative" />

                <div className="px-6 pb-6 pt-0 relative">
                    <div className="-mt-16 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <img
                            src={displayImage}
                            alt={displayName}
                            className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md bg-white shrink-0"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="capitalize px-4 py-1.5 bg-[#07A698]/10 text-[#07A698] border border-[#07A698]/20 text-xs font-bold rounded-full">
                                {displayRole} Account
                            </span>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
                                >
                                    <FiEdit2 className="w-3.5 h-3.5" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mb-6 space-y-0.5">
                        <h2 className="text-2xl font-black text-stone-900 tracking-tight break-words">{displayName}</h2>
                        <p className="text-xs font-semibold text-stone-400 capitalize">Role: {displayRole}</p>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="border-t border-stone-100 pt-6 space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#07A698] focus:ring-1 focus:ring-[#07A698]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                                    Profile Photo URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.photoURL}
                                    onChange={(e) => handleChange('photoURL', e.target.value)}
                                    placeholder="https://example.com/your-photo.jpg"
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#07A698] focus:ring-1 focus:ring-[#07A698]"
                                />
                                <p className="text-[11px] text-stone-400 mt-1">Paste a direct image link. Leave blank to keep your current photo.</p>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={updateProfileMutation.isPending}
                                    className="flex items-center gap-1.5 px-5 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    <FiSave className="w-3.5 h-3.5" />
                                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={updateProfileMutation.isPending}
                                    className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    <FiX className="w-3.5 h-3.5" />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-100 pt-6">
                            <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-100 rounded-xl">
                                <div className="p-2.5 bg-white text-[#07A698] rounded-lg border border-stone-200/60 shadow-xs shrink-0">
                                    <FiUser className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Full Name</p>
                                    <p className="text-sm font-bold text-stone-800 truncate">{displayName}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-100 rounded-xl">
                                <div className="p-2.5 bg-white text-[#07A698] rounded-lg border border-stone-200/60 shadow-xs shrink-0">
                                    <FiShield className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Role</p>
                                    <p className="text-sm font-bold text-stone-800 capitalize truncate">{displayRole}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-100 rounded-xl">
                                <div className="p-2.5 bg-white text-[#07A698] rounded-lg border border-stone-200/60 shadow-xs shrink-0">
                                    <FiMail className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Email Address</p>
                                    <p className="text-sm font-bold text-stone-800 truncate">{displayEmail}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-100 rounded-xl">
                                <div className="p-2.5 bg-white text-[#07A698] rounded-lg border border-stone-200/60 shadow-xs shrink-0">
                                    <FiCheckCircle className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Account Status</p>
                                    <p className="text-sm font-bold text-emerald-600 capitalize truncate">{displayStatus}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;