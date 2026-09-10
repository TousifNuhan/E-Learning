import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FiSearch, 
  FiUserX,
  FiUserCheck as FiReactivate,
  FiShield, 
  FiUserCheck, 
  FiUsers, 
  FiBookOpen
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      const res = await axiosSecure.patch(`/users/role/${userId}`, { role: newRole });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`User role updated to ${variables.newRole}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update user role');
    },
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }) => {
      const res = await axiosSecure.patch(`/users/status/${userId}`, { status });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      Swal.fire({
        title: data.message?.includes('deactivated') ? 'Deactivated!' : 'Reactivated!',
        text: data.message,
        icon: 'success',
        confirmButtonColor: '#07A698',
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    },
  });

  const handleRoleChange = (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;

    Swal.fire({
      title: 'Change User Role?',
      text: `Are you sure you want to change this user's role to ${newRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07A698',
      cancelButtonColor: '#78716c',
      confirmButtonText: 'Yes, Change Role',
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserRoleMutation.mutate({ userId, newRole });
      }
    });
  };

  const handleToggleStatus = (user) => {
    const isDeactivated = user.status === 'deactivated';
    const newStatus = isDeactivated ? 'active' : 'deactivated';

    Swal.fire({
      title: isDeactivated ? 'Reactivate User?' : 'Deactivate User?',
      html: isDeactivated
        ? `<b>${user.name || user.email}</b> will regain access to their account.`
        : `<b>${user.name || user.email}</b> will be blocked from logging in.${
            user.role === 'teacher'
              ? '<br/><br/>Their existing courses will remain available to enrolled students, but no new students will be able to enroll.'
              : ''
          }`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isDeactivated ? '#07A698' : '#ef4444',
      cancelButtonColor: '#78716c',
      confirmButtonText: isDeactivated ? 'Yes, Reactivate' : 'Yes, Deactivate',
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserStatusMutation.mutate({ userId: user._id, status: newStatus });
      }
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const userRole = u.role || 'student';
    const matchesRole = roleFilter === 'all' || userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const teacherCount = users.filter((u) => u.role === 'teacher').length;
  const studentCount = users.filter((u) => !u.role || u.role === 'student').length;

  return (
    <div className="space-y-6 font-sans text-stone-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#162726] tracking-tight">Manage Users</h2>
          <p className="text-stone-500 text-xs mt-1">View user accounts, adjust permissions, and monitor roles.</p>
        </div>
        <div className="bg-[#07A698]/10 text-[#07A698] border border-[#07A698]/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 self-start md:self-auto shrink-0">
          <FiUsers className="w-4 h-4 shrink-0" />
          <span>Total Registered: {totalUsers}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <FiShield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Admins</p>
            <h3 className="text-2xl font-black text-stone-900 mt-0.5">{adminCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <FiBookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Teachers</p>
            <h3 className="text-2xl font-black text-stone-900 mt-0.5">{teacherCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-[#07A698] rounded-xl shrink-0">
            <FiUserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Students</p>
            <h3 className="text-2xl font-black text-stone-900 mt-0.5">{studentCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-[#07A698] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-none">
          {['all', 'student', 'teacher', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                roleFilter === role
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-stone-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#07A698] border-t-transparent mb-2" />
            <p className="text-xs font-semibold">Loading users...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-rose-500 text-xs font-semibold">
            Failed to load users. Please refresh or try again later.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs font-semibold">
            No users found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[820px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200/80 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">#</th>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Current Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-center">Change Role</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {filteredUsers.map((item, index) => {
                  const currentRole = item.role || 'student';
                  const isDeactivated = item.status === 'deactivated';

                  return (
                    <tr key={item._id} className={`hover:bg-stone-50/60 transition-colors ${isDeactivated ? 'opacity-60' : ''}`}>
                      <td className="py-4 px-6 font-semibold text-stone-400">
                        {index + 1}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.photoURL || 'https://i.ibb.co/mJRk027/default-avatar.png'}
                            alt={item.name || 'User'}
                            className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 break-words">{item.name || 'N/A'}</p>
                            <p className="text-[11px] text-stone-400 font-mono">ID: {item._id?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-medium text-stone-600 break-all">
                        {item.email}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                            currentRole === 'admin'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : currentRole === 'teacher'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-[#07A698] border border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              currentRole === 'admin'
                                ? 'bg-blue-600'
                                : currentRole === 'teacher'
                                ? 'bg-amber-600'
                                : 'bg-[#07A698]'
                            }`}
                          />
                          {currentRole}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isDeactivated
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isDeactivated ? 'bg-rose-600' : 'bg-emerald-600'}`} />
                          {isDeactivated ? 'Deactivated' : 'Active'}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleRoleChange(item._id, currentRole, 'admin')}
                            disabled={currentRole === 'admin'}
                            title="Make Admin"
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentRole === 'admin'
                                ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                            }`}
                          >
                            Admin
                          </button>

                          <button
                            onClick={() => handleRoleChange(item._id, currentRole, 'teacher')}
                            disabled={currentRole === 'teacher'}
                            title="Make Teacher"
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentRole === 'teacher'
                                ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                                : 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'
                            }`}
                          >
                            Teacher
                          </button>

                          <button
                            onClick={() => handleRoleChange(item._id, currentRole, 'student')}
                            disabled={currentRole === 'student'}
                            title="Make Student"
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentRole === 'student'
                                ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                                : 'bg-emerald-50 text-[#07A698] hover:bg-[#07A698] hover:text-white'
                            }`}
                          >
                            Student
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            isDeactivated
                              ? 'text-stone-400 hover:text-[#07A698] hover:bg-emerald-50'
                              : 'text-stone-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={isDeactivated ? 'Reactivate User' : 'Deactivate User'}
                        >
                          {isDeactivated ? (
                            <FiReactivate className="w-4 h-4" />
                          ) : (
                            <FiUserX className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;