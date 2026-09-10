import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { Eye, Check, X, ExternalLink, Search, FileText } from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const TeacherRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['teacher-applications'],
    queryFn: async () => {
      const res = await axiosSecure.get('/teacher-applications');
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/teacher-applications/approve/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-applications'] });
      toast.success('Teacher approved successfully!');
      setSelectedApplicant(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Approval failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/teacher-applications/reject/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-applications'] });
      toast.success('Application rejected.');
      setSelectedApplicant(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Rejection failed'),
  });

  const handleAction = (item, actionType) => {
    const isApprove = actionType === 'approved';
    Swal.fire({
      title: `${isApprove ? 'Approve' : 'Reject'} Application?`,
      text: `Are you sure you want to ${isApprove ? 'approve' : 'reject'} ${item.name}?`,
      icon: isApprove ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: isApprove ? 'Yes, Approve' : 'Yes, Reject',
      confirmButtonColor: isApprove ? '#07A698' : '#e11d48',
      cancelButtonColor: '#78716c',
    }).then((result) => {
      if (result.isConfirmed) {
        if (isApprove) approveMutation.mutate(item._id);
        else rejectMutation.mutate(item._id);
      }
    });
  };

  const filteredRequests = requests.filter((item) => {
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] font-sans">
        <div className="w-8 h-8 border-3 border-[#07A698] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6 font-sans text-stone-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#162726] tracking-tight">Teacher Applications</h2>
          <p className="text-xs text-stone-500 mt-0.5">Review and manage instructor onboarding requests.</p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold overflow-x-auto scrollbar-none w-full sm:w-auto">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === status ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by name, email, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-[#07A698] focus:bg-white transition-all"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-400 font-bold">
              <th className="p-3">Applicant</th>
              <th className="p-3">Title & Category</th>
              <th className="p-3">Experience</th>
              <th className="p-3">Resume</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-stone-400 text-xs">
                  No applications found matching criteria.
                </td>
              </tr>
            ) : (
              filteredRequests.map((item) => (
                <tr key={item._id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || item.photoURL || 'https://i.ibb.co/mJRk027/default-avatar.png'}
                        alt={item.name}
                        className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-stone-900 break-words">{item.name}</p>
                        <p className="text-[11px] text-stone-400 font-mono break-all">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-stone-800 break-words">{item.title}</p>
                    <span className="inline-block px-2 py-0.5 mt-1 bg-stone-100 text-stone-600 rounded text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 capitalize text-stone-600 font-medium whitespace-nowrap">{item.experience}</td>
                  
                  <td className="p-3 whitespace-nowrap">
                    {item.resume && item.resume.trim() !== "" ? (
                      <a
                        href={item.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#07A698] bg-[#07A698]/10 hover:bg-[#07A698]/20 border border-[#07A698]/20 rounded-lg transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        PDF <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-stone-400 font-medium">N/A</span>
                    )}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full capitalize ${
                      item.status === 'approved' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : item.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status || 'pending'}
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <div className="flex justify-center items-center gap-1.5">
                      <button
                        onClick={() => setSelectedApplicant(item)}
                        className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleAction(item, 'approved')}
                        disabled={item.status === 'approved'}
                        className="p-1.5 text-[#07A698] hover:bg-[#07A698]/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleAction(item, 'rejected')}
                        disabled={item.status === 'rejected'}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 relative border border-stone-200">
            <button
              onClick={() => setSelectedApplicant(null)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 min-w-0 pr-8">
              <img
                src={selectedApplicant.image || selectedApplicant.photoURL || 'https://i.ibb.co/mJRk027/default-avatar.png'}
                alt={selectedApplicant.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-stone-100 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-lg font-black text-stone-900 break-words">{selectedApplicant.name}</h3>
                <p className="text-xs text-stone-500 font-mono break-all">{selectedApplicant.email}</p>
                <p className="text-xs text-[#07A698] font-bold mt-0.5 break-words">{selectedApplicant.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Experience</span>
                <span className="font-bold text-stone-800 capitalize truncate block">{selectedApplicant.experience}</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Category</span>
                <span className="font-bold text-stone-800 truncate block">{selectedApplicant.category}</span>
              </div>
              {selectedApplicant.phone && (
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Phone</span>
                  <span className="font-bold text-stone-800 truncate block">{selectedApplicant.phone}</span>
                </div>
              )}
              {selectedApplicant.portfolio && (
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Portfolio</span>
                  <a
                    href={selectedApplicant.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#07A698] hover:underline flex items-center gap-1 truncate"
                  >
                    <span className="truncate">View Link</span> <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            {selectedApplicant.resume && selectedApplicant.resume.trim() !== "" && (
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-[#07A698] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-800 truncate">Resume / CV Document</p>
                    <p className="text-[10px] text-stone-400">Attached by applicant</p>
                  </div>
                </div>
                <a
                  href={selectedApplicant.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#07A698] hover:bg-[#05857a] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shrink-0 shadow-xs"
                >
                  View File <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}

            {selectedApplicant.bio && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Biography / Overview</h4>
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/60 max-h-28 overflow-y-auto break-words">
                  {selectedApplicant.bio}
                </p>
              </div>
            )}

            <div className="flex gap-2.5 pt-2 border-t border-stone-100">
              <button
                onClick={() => handleAction(selectedApplicant, 'approved')}
                disabled={selectedApplicant.status === 'approved'}
                className="flex-1 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs disabled:opacity-40 cursor-pointer"
              >
                Approve Instructor
              </button>
              <button
                onClick={() => handleAction(selectedApplicant, 'rejected')}
                disabled={selectedApplicant.status === 'rejected'}
                className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherRequests;