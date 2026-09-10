import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiClock, 
  FiMessageSquare, 
  FiBookOpen, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiX, 
  FiLoader,
  FiPlusCircle,
  FiLayers,
  FiFileText,
  FiExternalLink,
  FiCheckSquare,
  FiClipboard
} from 'react-icons/fi';
import useAuth from '../../../hooks/useAuth'; 
import useAxiosSecure from '../../../hooks/useAxiosSecure'; 
import { FaBangladeshiTakaSign } from 'react-icons/fa6';

const MyAddedClasses = () => {
  const { user, initializing } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['my-classes', user?.email],
    enabled: !initializing && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-classes/${user?.email}`);
      return res.data;
    },
  });

  const handleShowFeedback = (title, reason) => {
    Swal.fire({
      title: 'Rejection Feedback',
      html: `
        <div class="text-left mt-2">
          <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Course Title</p>
          <p class="font-bold text-stone-800 text-base mb-4">${title}</p>
          <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Feedback / Reason</p>
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-sm leading-relaxed">
            ${reason || 'No specific feedback was provided by the administrator.'}
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Understand & Close',
      confirmButtonColor: '#07A698',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl text-sm font-semibold px-5 py-2.5'
      }
    });
  };

  const handleOpenUpdate = (cls) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title || '',
      category: cls.category || '',
      price: cls.price !== undefined ? Math.round(Number(cls.price)) : '',
      originalPrice: cls.originalPrice !== undefined ? Math.round(Number(cls.originalPrice)) : '',
      duration: cls.duration || '12 weeks',
      language: cls.language || 'English',
      skillLevel: cls.skillLevel || 'Advanced',
      certificate: cls.certificate || 'Yes',
      shortDescription: cls.shortDescription || '',
      description: cls.description || '',
      image: cls.image || cls.thumbnail || '',
      previewVideoUrl: cls.previewVideoUrl || '',
      instructorDetails: {
        title: cls.instructorDetails?.title || user?.title || user?.designation || '',
        bio: cls.instructorDetails?.bio || user?.bio || ''
      },
      objectives: cls.objectives && cls.objectives.length > 0 ? [...cls.objectives] : [''],
      requirements: cls.requirements && cls.requirements.length > 0 ? [...cls.requirements] : [''],
      modules: cls.modules && cls.modules.length > 0 ? cls.modules : [
        {
          title: '',
          lessons: [{ id: `les-${Date.now()}`, title: '', duration: '', isFree: false, videoUrl: '' }]
        }
      ]
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleObjectiveChange = (idx, value) => {
    const updated = [...(formData.objectives || [])];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, objectives: updated }));
  };

  const handleAddObjective = () => {
    setFormData((prev) => ({ ...prev, objectives: [...(prev.objectives || []), ''] }));
  };

  const handleRemoveObjective = (idx) => {
    const updated = (formData.objectives || []).filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, objectives: updated }));
  };

  const handleRequirementChange = (idx, value) => {
    const updated = [...(formData.requirements || [])];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, requirements: updated }));
  };

  const handleAddRequirement = () => {
    setFormData((prev) => ({ ...prev, requirements: [...(prev.requirements || []), ''] }));
  };

  const handleRemoveRequirement = (idx) => {
    const updated = (formData.requirements || []).filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, requirements: updated }));
  };

  const handleModuleTitleChange = (modIdx, val) => {
    const updated = [...formData.modules];
    updated[modIdx].title = val;
    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const handleAddModule = () => {
    const newMod = {
      title: '',
      lessons: [{ id: `les-${Date.now()}`, title: '', duration: '', isFree: false, videoUrl: '' }]
    };
    setFormData((prev) => ({ ...prev, modules: [...prev.modules, newMod] }));
  };

  const handleRemoveModule = (modIdx) => {
    const updated = formData.modules.filter((_, idx) => idx !== modIdx);
    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const handleAddLesson = (modIdx) => {
    const updated = [...formData.modules];
    updated[modIdx].lessons = [
      ...(updated[modIdx].lessons || []),
      { id: `les-${Date.now()}-${Math.random()}`, title: '', duration: '', isFree: false, videoUrl: '' }
    ];
    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const handleRemoveLesson = (modIdx, lesIdx) => {
    const updated = [...formData.modules];
    updated[modIdx].lessons = updated[modIdx].lessons.filter((_, idx) => idx !== lesIdx);
    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const handleLessonChange = (modIdx, lesIdx, field, value) => {
    const updated = [...formData.modules];
    updated[modIdx].lessons[lesIdx][field] = value;
    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const updateClassMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await axiosSecure.patch(`/classes/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-classes', user?.email]);
      setEditingClass(null);
      setIsSubmitting(false);
      Swal.fire({
        icon: 'success',
        title: 'Class Updated!',
        text: 'Your class details have been updated successfully.',
        confirmButtonColor: '#07A698',
        customClass: { popup: 'rounded-2xl' }
      });
    },
    onError: (error) => {
      setIsSubmitting(false);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error?.response?.data?.message || 'Failed to update class details.',
        confirmButtonColor: '#07A698',
        customClass: { popup: 'rounded-2xl' }
      });
    }
  });

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let calculatedLessonsCount = 0;
    (formData.modules || []).forEach((mod) => {
      calculatedLessonsCount += mod.lessons?.length || 0;
    });

    const cleanedObjectives = (formData.objectives || []).filter((o) => o && o.trim() !== '');
    const cleanedRequirements = (formData.requirements || []).filter((r) => r && r.trim() !== '');

    const payload = {
      ...formData,
      objectives: cleanedObjectives,
      requirements: cleanedRequirements,
      teacherId: user?._id || user?.uid || editingClass?.teacherId,
      name: user?.displayName || user?.name || editingClass?.name,
      email: user?.email || editingClass?.email,
      teacherImage: user?.photoURL || user?.image || editingClass?.teacherImage,
      price: Math.round(parseFloat(formData.price)) || 0,
      originalPrice: Math.round(parseFloat(formData.originalPrice)) || 0,
      totalLessons: calculatedLessonsCount,
      updatedAt: new Date().toISOString(),
    };

    updateClassMutation.mutate({
      id: editingClass._id,
      updatedData: payload
    });
  };

  const handleDeleteClass = (id, title) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl text-sm font-semibold px-5 py-2.5',
        cancelButton: 'rounded-xl text-sm font-semibold px-5 py-2.5'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/classes/${id}`);
          if (res.data?.deletedCount > 0 || res.status === 200) {
            queryClient.invalidateQueries(['my-classes', user?.email]);
            Swal.fire({
              title: 'Deleted!',
              text: 'The class has been removed.',
              icon: 'success',
              confirmButtonColor: '#07A698',
              customClass: { popup: 'rounded-2xl' }
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.message || 'Failed to delete class.',
            icon: 'error',
            confirmButtonColor: '#07A698',
            customClass: { popup: 'rounded-2xl' }
          });
        }
      }
    });
  };

  if (initializing || isLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center py-24 font-sans">
        <div className="animate-spin h-10 w-10 border-4 border-[#07A698] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm font-semibold text-stone-600">Loading your added classes...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">My Added Classes</h2>
        <p className="text-xs text-stone-500 mt-1">Manage and track your submitted courses</p>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3 text-stone-400">
            <FiBookOpen size={24} />
          </div>
          <h3 className="text-base font-bold text-stone-800">No Classes Found</h3>
          <p className="text-xs text-stone-500 mt-1">You haven't submitted any courses or classes yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((cls) => {
            const statusRaw = (cls?.status || 'pending').toLowerCase();
            const isApproved = statusRaw === 'accepted' || statusRaw === 'approved';
            const isRejected = statusRaw === 'rejected';
            const isPending = !isApproved && !isRejected;

            const feedbackReason = cls.rejectionReason || cls.reason || cls.feedback || '';

            return (
              <div 
                key={cls._id || Math.random()} 
                className="p-5 border border-stone-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between bg-white shadow-xs hover:shadow-md transition-all gap-4"
              >
                <div className="flex items-start gap-4">
                  {cls.image || cls.thumbnail ? (
                    <img 
                      src={cls.image || cls.thumbnail} 
                      alt={cls.title} 
                      className="w-20 h-20 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 flex-shrink-0">
                      <FiBookOpen size={24} />
                    </div>
                  )}

                  <div className="space-y-1">
                    <h4 className="font-bold text-stone-800 text-base line-clamp-1">{cls.title || 'Untitled Class'}</h4>
                    
                    <p className="text-xs text-stone-500 line-clamp-1 max-w-md">
                      {cls.shortDescription || cls.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center gap-3 pt-1 flex-wrap">
                      <span className="text-xs font-semibold text-stone-600">
                        Instructor: <span className="font-normal">{user?.displayName || cls.name || 'N/A'}</span>
                      </span>

                      <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        <FaBangladeshiTakaSign className="text-[11px]" />
                        <span>{cls.price !== undefined ? Math.round(Number(cls.price)) : 0}</span>
                      </span>

                      <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 font-bold rounded-full capitalize ${
                        isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isRejected ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isApproved && <FiCheckCircle size={12} />}
                        {isRejected && <FiAlertCircle size={12} />}
                        {isPending && <FiClock size={12} />}
                        {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                  {isRejected && (
                    <button
                      type="button"
                      onClick={() => handleShowFeedback(cls.title, feedbackReason)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition cursor-pointer"
                    >
                      <FiMessageSquare size={14} />
                      Feedback
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenUpdate(cls)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition cursor-pointer"
                  >
                    <FiEdit size={14} />
                    Update
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteClass(cls._id, cls.title)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>

                  {isApproved ? (
                    <Link
                      to={`/dashboard/my-class/${cls._id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#07A698] hover:bg-[#05857a] text-white rounded-xl transition cursor-pointer shadow-xs"
                    >
                      <FiEye size={14} />
                      See Details
                    </Link>
                  ) : (
                    <button
                      disabled
                      title="See Details will be enabled after Admin approves the class"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-stone-100 text-stone-400 border border-stone-200 rounded-xl cursor-not-allowed opacity-70"
                    >
                      <FiEye size={14} />
                      See Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingClass && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3 sticky top-0 bg-white dark:bg-stone-900 z-10">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">Update Course Details</h3>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-6">
              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center gap-3">
                <img
                  src={user?.photoURL || user?.image || editingClass?.teacherImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
                  alt="Instructor"
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm">
                    {user?.displayName || user?.name || editingClass?.name} (Read-only)
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {user?.email || editingClass?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-stone-700 dark:text-stone-300 border-b pb-2 text-sm uppercase tracking-wider">Basic Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Course Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      required
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      required
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                    >
                      <option value="" disabled>Select Category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="AI">AI</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Design">Design</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Price (৳)</label>
                    <input
                      type="number"
                      step="1"
                      value={formData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      required
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Original Price (৳)</label>
                    <input
                      type="number"
                      step="1"
                      value={formData.originalPrice}
                      onChange={(e) => handleChange('originalPrice', e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleChange('duration', e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Skill Level</label>
                    <select
                      value={formData.skillLevel}
                      onChange={(e) => handleChange('skillLevel', e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Language</label>
                    <input
                      type="text"
                      value={formData.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Certificate Provided?</label>
                    <select
                      value={formData.certificate}
                      onChange={(e) => handleChange('certificate', e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => handleChange('shortDescription', e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Preview Video URL</label>
                    <input
                      type="url"
                      value={formData.previewVideoUrl}
                      onChange={(e) => handleChange('previewVideoUrl', e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <FiCheckSquare /> What You'll Learn
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <FiPlusCircle size={14} /> Add Objective
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.objectives || []).map((obj, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={obj}
                        onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                        placeholder={`e.g. Build and deploy a full-stack MERN application`}
                        className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                      />
                      {(formData.objectives || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveObjective(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <FiClipboard /> Requirements
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <FiPlusCircle size={14} /> Add Requirement
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.requirements || []).map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleRequirementChange(idx, e.target.value)}
                        placeholder={`e.g. Basic knowledge of JavaScript and HTML/CSS`}
                        className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-white text-sm focus:outline-none focus:border-[#07A698]"
                      />
                      {(formData.requirements || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <FiLayers /> Course Curriculum (Modules & Lessons)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <FiPlusCircle size={14} /> Add Module
                  </button>
                </div>

                {formData.modules?.map((mod, modIdx) => (
                  <div key={modIdx} className="p-4 border rounded-xl bg-stone-50/50 dark:bg-stone-800/30 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => handleModuleTitleChange(modIdx, e.target.value)}
                        placeholder={`Module ${modIdx + 1} Title`}
                        className="w-full p-2 text-sm font-semibold border rounded-lg bg-white dark:bg-stone-800 dark:text-white"
                      />
                      {formData.modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(modIdx)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="pl-3 border-l-2 border-teal-500 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-500">Lessons</span>
                        <button
                          type="button"
                          onClick={() => handleAddLesson(modIdx)}
                          className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <FiPlusCircle size={12} /> Add Lesson
                        </button>
                      </div>

                      {mod.lessons?.map((les, lesIdx) => (
                        <div key={les.id || lesIdx} className="p-2 border rounded-lg bg-white dark:bg-stone-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 items-center">
                          <input
                            type="text"
                            value={les.title}
                            onChange={(e) => handleLessonChange(modIdx, lesIdx, 'title', e.target.value)}
                            placeholder="Lesson Title"
                            className="p-1.5 border rounded text-xs dark:bg-stone-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={les.duration}
                            onChange={(e) => handleLessonChange(modIdx, lesIdx, 'duration', e.target.value)}
                            placeholder="Duration (e.g. 15 mins)"
                            className="p-1.5 border rounded text-xs dark:bg-stone-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={les.videoUrl}
                            onChange={(e) => handleLessonChange(modIdx, lesIdx, 'videoUrl', e.target.value)}
                            placeholder="Video URL"
                            className="p-1.5 border rounded text-xs dark:bg-stone-900 dark:text-white"
                          />
                          <div className="flex items-center justify-between gap-1">
                            <label className="flex items-center gap-1 text-[11px] cursor-pointer text-stone-600 dark:text-stone-300">
                              <input
                                type="checkbox"
                                checked={les.isFree || false}
                                onChange={(e) => handleLessonChange(modIdx, lesIdx, 'isFree', e.target.checked)}
                                className="rounded"
                              />
                              Free
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveLesson(modIdx, lesIdx)}
                              className="text-rose-500 hover:text-rose-700 cursor-pointer"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-indigo-600 shrink-0">
                      <FiFileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-900">Manage assignments from the class dashboard</p>
                      <p className="text-xs text-indigo-700 mt-0.5">
                        Assignments, submissions, and grading are handled on the "My Class" page for this course, not here.
                      </p>
                    </div>
                  </div>
                  {editingClass?._id && (
                    <Link
                      to={`/dashboard/my-class/${editingClass._id}`}
                      onClick={() => setEditingClass(null)}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer"
                    >
                      <FiExternalLink size={14} />
                      Open Dashboard
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-500 flex items-center justify-between">
                <span>Current Status:</span>
                <span className="font-bold uppercase text-stone-700">{editingClass.status || 'pending'}</span>
              </div>

              <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-stone-900 pb-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="flex-1 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs uppercase rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-semibold text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin text-sm" /> Saving Changes...
                    </>
                  ) : (
                    'Save All Updates'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedClasses;