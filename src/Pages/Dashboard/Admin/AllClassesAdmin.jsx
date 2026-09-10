import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  FiCheckCircle, FiXCircle, FiActivity, FiClock, FiEye, 
  FiSearch, FiLayers, FiAlertCircle, 
  FiUser, FiX, FiPlayCircle, FiFileText,
  FiVideo, FiList, FiAlertTriangle, FiPlay
} from 'react-icons/fi';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AllClassesAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null); 

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['admin-classes'],
    queryFn: async () => {
      const res = await axiosSecure.get('/classes');
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ classId, status, rejectionReason }) => {
      const res = await axiosSecure.patch(`/classes/status/${classId}`, {
        status,
        rejectionReason: rejectionReason || "",
      });
      return res.data;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Class status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to update class status.");
    },
  });

  const handleStatusChange = (item, newStatus) => {
    if (newStatus === 'accepted') {
      Swal.fire({
        title: 'Approve Course?',
        text: `"${item.title}" will be published live on the store.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Approve & Publish',
        confirmButtonColor: '#07A698',
        cancelButtonColor: '#78716c',
      }).then((result) => {
        if (result.isConfirmed) {
          updateStatusMutation.mutate({ classId: item._id, status: 'accepted' });
        }
      });
    } else if (newStatus === 'rejected') {
      Swal.fire({
        title: 'Reject Course Submission',
        text: 'Please provide feedback for the instructor:',
        html: `
          <select id="swal-reject-reason" class="swal2-select" style="display: flex; width: 80%; margin: 1em auto;">
            <option value="" disabled selected>Select primary reason</option>
            <option value="Low video/audio quality">Low video/audio quality</option>
            <option value="Incomplete syllabus or missing lessons">Incomplete syllabus or missing lessons</option>
            <option value="Potential copyright or policy violation">Potential copyright or policy violation</option>
            <option value="Inappropriate or harmful content">Inappropriate or harmful content</option>
            <option value="Custom">Other (type custom message)</option>
          </select>
          <textarea id="swal-custom-text" class="swal2-textarea" style="display: none; width: 80%; margin: 1em auto;" placeholder="Type specific details for the instructor..."></textarea>
        `,
        showCancelButton: true,
        confirmButtonText: 'Submit Rejection',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#78716c',
        didOpen: () => {
          const select = document.getElementById('swal-reject-reason');
          const customText = document.getElementById('swal-custom-text');

          select.addEventListener('change', (e) => {
            if (e.target.value === 'Custom') {
              customText.style.display = 'block';
              customText.focus();
            } else {
              customText.style.display = 'none';
            }
          });
        },
        preConfirm: () => {
          const reasonSelect = document.getElementById('swal-reject-reason').value;
          const customText = document.getElementById('swal-custom-text').value;

          if (!reasonSelect) {
            Swal.showValidationMessage('Please select a reason!');
            return false;
          }

          if (reasonSelect === 'Custom') {
            if (!customText.trim()) {
              Swal.showValidationMessage('Custom rejection message cannot be empty!');
              return false;
            }
            return customText.trim();
          }

          return reasonSelect;
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          updateStatusMutation.mutate({
            classId: item._id,
            status: 'rejected',
            rejectionReason: result.value
          });
        }
      });
    }
  };

  const getPromoVideoSource = (course) => {
    if (!course) return null;
    return course.videoUrl || course.promoVideo || course.previewUrl || course.video || null;
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const stats = useMemo(() => {
    const total = classes.length;
    const pending = classes.filter(c => (c.status || 'pending').toLowerCase() === 'pending').length;
    const approved = classes.filter(c => (c.status || '').toLowerCase() === 'accepted').length;
    const rejected = classes.filter(c => (c.status || '').toLowerCase() === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [classes]);

  const filteredClasses = useMemo(() => {
    return classes.filter(item => {
      const matchesSearch = 
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.teacherName && item.teacherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.teacherEmail && item.teacherEmail.toLowerCase().includes(searchTerm.toLowerCase()));

      const currentStatus = (item.status || 'pending').toLowerCase();
      const matchesFilter = 
        statusFilter === 'All' || 
        (statusFilter === 'Pending' && currentStatus === 'pending') ||
        (statusFilter === 'Approved' && (currentStatus === 'accepted' || currentStatus === 'approved')) ||
        (statusFilter === 'Rejected' && currentStatus === 'rejected');

      return matchesSearch && matchesFilter;
    });
  }, [classes, searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center py-24 font-sans">
        <div className="animate-spin h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm font-semibold text-stone-600">Loading LMS Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#fafbfb] min-h-screen p-2 md:p-6 font-sans text-stone-800">
      
      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Submissions</p>
            <p className="text-2xl font-black text-stone-900 mt-1">{stats.total}</p>
          </div>
          <div className="p-3 bg-stone-100 rounded-xl text-stone-600 shrink-0"><FiLayers className="text-xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#07A698] uppercase tracking-wider">Pending Review</p>
            <p className="text-2xl font-black text-[#07A698] mt-1">{stats.pending}</p>
          </div>
          <div className="p-3 bg-[#07A698]/10 rounded-xl text-[#07A698] shrink-0"><FiClock className="text-xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Approved Live</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{stats.approved}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0"><FiCheckCircle className="text-xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{stats.rejected}</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-500 shrink-0"><FiXCircle className="text-xl" /></div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        
        {/* Controls Toolbar */}
        <div className="p-5 border-b border-stone-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-base shrink-0" />
            <input
              type="text"
              placeholder="Search by course, instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#07A698] focus:bg-white transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === status 
                    ? 'bg-[#07A698] text-white shadow-xs' 
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Course Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                <th className="p-4">Course Info</th>
                <th className="p-4">Instructor Details</th>
                <th className="p-4">Category & Price</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Quality Audit</th>
                <th className="p-4 text-center">Review Actions</th>
                <th className="p-4 text-center">Analytics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((item) => {
                  const status = (item.status || 'pending').toLowerCase();
                  return (
                    <tr key={item._id} className="hover:bg-stone-50/50 transition-colors">
                      
                      {/* Title & Cover */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-10 object-cover rounded-lg border border-stone-200/80 shrink-0"
                          />
                          <div className="max-w-xs min-w-0">
                            <p className="font-bold text-stone-900 line-clamp-1">{item.title}</p>
                            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{item.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Instructor Info */}
                      <td className="p-4">
                        <p className="font-bold text-stone-800 break-words">{item.teacherName || item.name || 'Instructor'}</p>
                        <p className="text-[11px] text-stone-400 font-mono mt-0.5 break-all">{item.teacherEmail || item.email}</p>
                      </td>

                      {/* Metadata */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-block text-[10px] font-bold uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded mb-1">
                          {item.category || 'General'}
                        </span>
                        <p className="font-extrabold text-stone-900">
                          {Number(item.price) === 0 ? 'FREE' : `৳${Math.round(Number(item.price))}`}
                        </p>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4 text-center whitespace-nowrap">
                        {status === 'accepted' || status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                            <FiCheckCircle className="shrink-0" /> Live
                          </span>
                        ) : status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-full" title={item.rejectionReason}>
                            <FiXCircle className="shrink-0" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 font-bold bg-[#07A698]/10 text-[#07A698] border border-[#07A698]/20 rounded-full">
                            <FiClock className="shrink-0" /> Pending
                          </span>
                        )}
                      </td>

                      {/* Full Audit Drawer Trigger */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedCourse(item);
                            setActiveVideo(null);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <FiEye className="text-stone-500 shrink-0" /> Preview
                        </button>
                      </td>

                      {/* Action Approval Buttons */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => handleStatusChange(item, 'accepted')}
                            disabled={status === 'accepted'}
                            className="px-2.5 py-1.5 font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(item, 'rejected')}
                            disabled={status === 'rejected'}
                            className="px-2.5 py-1.5 font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                      </td>

                      {/* Progress/Analytics Link */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/dashboard/class/${item._id}`)}
                          disabled={status !== 'accepted'}
                          className="inline-flex items-center gap-1 px-3 py-1.5 font-bold bg-[#07A698] hover:bg-[#05857a] text-white rounded-lg transition-colors shadow-xs cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none disabled:cursor-not-allowed"
                        >
                          <FiActivity className="shrink-0" /> Stats
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-stone-400">
                    No course submissions match the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Admin Audit Drawer */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end transition-opacity font-sans">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-stone-100 pb-4 gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-[#07A698]/10 text-[#07A698] px-2.5 py-0.5 rounded-md">
                      {selectedCourse.category || 'General'}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                      (selectedCourse.status || 'pending').toLowerCase() === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      (selectedCourse.status || 'pending').toLowerCase() === 'rejected' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedCourse.status || 'Pending Review'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-stone-900 break-words">{selectedCourse.title}</h3>
                  <p className="text-xs text-stone-400 font-mono break-all">ID: {selectedCourse._id}</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCourse(null);
                    setActiveVideo(null);
                  }}
                  className="p-1.5 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors cursor-pointer shrink-0"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {/* Dynamic Video / Promo / Lesson Player Frame */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1.5 truncate">
                    <FiVideo className="text-[#07A698] shrink-0" /> 
                    <span className="truncate">{activeVideo ? `Auditing: ${activeVideo.title}` : 'Course Preview & Media Audit'}</span>
                  </span>
                  {activeVideo && (
                    <button 
                      onClick={() => setActiveVideo(null)} 
                      className="text-[10px] font-bold text-[#07A698] hover:underline cursor-pointer shrink-0"
                    >
                      Reset to Cover
                    </button>
                  )}
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-950 border border-stone-200/80 shadow-inner">
                  {(() => {
                    const promoUrl = getPromoVideoSource(selectedCourse);
                    const currentVideoUrl = activeVideo ? activeVideo.url : null;
                    const embedUrl = getEmbedUrl(currentVideoUrl);

                    if (activeVideo && currentVideoUrl) {
                      if (embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com')) {
                        return (
                          <iframe
                            src={`${embedUrl}?autoplay=1`}
                            title={activeVideo.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        );
                      }
                      return (
                        <video
                          src={currentVideoUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                        >
                          Your browser does not support the video tag.
                        </video>
                      );
                    }

                    return (
                      <div className="relative w-full h-full group">
                        <img 
                          src={selectedCourse.image} 
                          alt={selectedCourse.title} 
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                        />
                        {promoUrl ? (
                          <button
                            onClick={() => setActiveVideo({ url: promoUrl, title: 'Course Intro / Promo Video' })}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/95 rounded-full shadow-xl text-[#07A698] font-black text-xs uppercase tracking-wider transform group-hover:scale-105 transition-transform">
                              <FiPlayCircle className="text-2xl shrink-0" /> Play Promo Preview
                            </div>
                          </button>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-semibold">
                            <FiVideo className="text-lg mr-2 shrink-0" /> No promo video uploaded
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Quick Metrics Dashboard */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-center">
                  <FaBangladeshiTakaSign className="text-stone-400 mx-auto mb-1 text-sm shrink-0" />
                  <p className="text-[10px] font-bold uppercase text-stone-400">Price</p>
                  <p className="font-black text-stone-800 text-sm mt-0.5 whitespace-nowrap">
                    {Number(selectedCourse.price) === 0 ? 'FREE' : `৳${Math.round(Number(selectedCourse.price))}`}
                  </p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-center">
                  <FiClock className="text-stone-400 mx-auto mb-1 text-base shrink-0" />
                  <p className="text-[10px] font-bold uppercase text-stone-400">Duration / Level</p>
                  <p className="font-bold text-stone-800 text-xs mt-0.5 line-clamp-1">
                    {selectedCourse.duration || 'N/A'} • {selectedCourse.level || 'All Levels'}
                  </p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-center">
                  <FiUser className="text-stone-400 mx-auto mb-1 text-base shrink-0" />
                  <p className="text-[10px] font-bold uppercase text-stone-400">Enrolled</p>
                  <p className="font-black text-stone-800 text-sm mt-0.5 whitespace-nowrap">
                    {selectedCourse.totalEnrollment || 0} Students
                  </p>
                </div>
              </div>

              {/* Course Overview & Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <FiFileText className="shrink-0" /> Course Synopsis
                </h4>
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/60 text-xs text-stone-700 leading-relaxed whitespace-pre-line break-words">
                  {selectedCourse.description || 'No detailed description provided by instructor.'}
                </div>
              </div>

              {/* Instructor Verification Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <FiUser className="shrink-0" /> Instructor Profile
                </h4>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#07A698]/10 text-[#07A698] font-black flex items-center justify-center text-sm shrink-0">
                      {(selectedCourse.teacherName || selectedCourse.name || 'I').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 truncate">{selectedCourse.teacherName || selectedCourse.name || 'Instructor'}</p>
                      <p className="text-xs text-stone-500 font-mono truncate">{selectedCourse.teacherEmail || selectedCourse.email}</p>
                    </div>
                  </div>
                  {selectedCourse.teacherRole && (
                    <span className="text-[10px] font-bold bg-stone-200 text-stone-700 px-2 py-1 rounded shrink-0 whitespace-nowrap">
                      {selectedCourse.teacherRole}
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Curriculum Breakdown Audit with Video Verification */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <FiList className="shrink-0" /> Module Video Quality Inspector
                  </h4>
                  <span className="text-[11px] font-bold text-stone-500 shrink-0">
                    {(selectedCourse.syllabus || selectedCourse.modules || []).length} Modules
                  </span>
                </div>
                
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 max-h-72 overflow-y-auto space-y-3">
                  {(selectedCourse.syllabus || selectedCourse.modules || []).length > 0 ? (
                    (selectedCourse.syllabus || selectedCourse.modules).map((module, idx) => {
                      const lessons = module.lessons || module.lectures || module.videos || [];
                      return (
                        <div key={idx} className="bg-white rounded-xl border border-stone-200/80 p-3 space-y-2">
                          <div className="flex items-center justify-between border-b border-stone-100 pb-2 gap-2">
                            <p className="font-bold text-stone-900 text-xs truncate">
                              <span className="text-[#07A698] mr-1">Module {idx + 1}:</span>
                              {module.title || module.moduleTitle || `Module Title ${idx + 1}`}
                            </p>
                            <span className="text-[10px] font-semibold text-stone-400 shrink-0 whitespace-nowrap">
                              {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}
                            </span>
                          </div>

                          {lessons.length > 0 ? (
                            <div className="space-y-1.5 pt-1">
                              {lessons.map((lesson, lIdx) => {
                                const lessonVideo = lesson.videoUrl || lesson.video || lesson.url || null;
                                const lessonTitle = lesson.title || lesson.lessonTitle || `Lesson ${lIdx + 1}`;
                                const isCurrentActive = activeVideo?.url === lessonVideo;

                                return (
                                  <div 
                                    key={lIdx} 
                                    className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors gap-2 ${
                                      isCurrentActive ? 'bg-[#07A698]/10 border border-[#07A698]/30' : 'bg-stone-50 hover:bg-stone-100'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <FiVideo className={`shrink-0 ${isCurrentActive ? 'text-[#07A698]' : 'text-stone-400'}`} />
                                      <span className="font-medium text-stone-700 truncate">{lessonTitle}</span>
                                    </div>

                                    {lessonVideo ? (
                                      <button
                                        onClick={() => setActiveVideo({ url: lessonVideo, title: lessonTitle })}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                                          isCurrentActive
                                            ? 'bg-[#07A698] text-white'
                                            : 'bg-stone-200/80 hover:bg-[#07A698] hover:text-white text-stone-700'
                                        }`}
                                      >
                                        <FiPlay className="text-[9px] shrink-0" /> 
                                        {isCurrentActive ? 'Playing' : 'Audit Video'}
                                      </button>
                                    ) : (
                                      <span className="text-[10px] text-rose-500 font-semibold italic shrink-0 whitespace-nowrap">
                                        No Video Link
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-[11px] text-stone-400 italic py-1">
                              No individual lesson videos found in this module.
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-stone-400 italic text-center py-4">
                      No explicit module breakdown uploaded. Please check the promo video above for content verification.
                    </p>
                  )}
                </div>
              </div>

              {/* Existing Rejection History Reason (if currently rejected) */}
              {selectedCourse.rejectionReason && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <FiAlertTriangle className="text-rose-600 shrink-0" /> Previous Rejection Feedback:
                  </p>
                  <p className="text-xs text-rose-700 italic break-words">{selectedCourse.rejectionReason}</p>
                </div>
              )}

              {/* Admin Decision Guidelines */}
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-start gap-3">
                <FiAlertCircle className="text-amber-600 text-lg shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Compliance Verification Checklist</p>
                  <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                    <li>Click <strong>Audit Video</strong> on lesson modules to confirm playback and audio quality.</li>
                    <li>Verify pricing matches course depth and platform standards.</li>
                    <li>Ensure content does not violate copyright or platform policies.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Controls */}
            <div className="pt-4 border-t border-stone-100 flex gap-3 bg-white sticky bottom-0">
              <button
                onClick={() => handleStatusChange(selectedCourse, 'accepted')}
                disabled={selectedCourse.status === 'accepted'}
                className="flex-1 py-3 text-xs font-bold bg-[#07A698] hover:bg-[#05857a] text-white rounded-xl transition-colors shadow-xs cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none disabled:cursor-not-allowed"
              >
                Approve & Publish Course
              </button>
              <button
                onClick={() => handleStatusChange(selectedCourse, 'rejected')}
                disabled={selectedCourse.status === 'rejected'}
                className="flex-1 py-3 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Submission
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AllClassesAdmin;