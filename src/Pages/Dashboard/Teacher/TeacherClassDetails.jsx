import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiUsers, FiBookOpen, FiClipboard, FiTrendingUp,
  FiArrowLeft, FiPlusCircle, FiEye, FiCheckSquare,
  FiEdit2, FiTrash2, FiX
} from 'react-icons/fi';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const TeacherClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: progress = {}, isLoading: progressLoading } = useQuery({
    queryKey: ['class-progress', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/classes/progress/${id}`);
      return res.data;
    },
  });

  const { data: assignments = [], isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery({
    queryKey: ['class-assignments', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/assignments/class/${id}`);
      return res.data;
    },
  });

  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    setSubmitting(true);
    try {
      await axiosSecure.post('/assignments', {
        classId: id,
        title: newTitle.trim(),
        description: newDescription.trim(),
      });
      setNewTitle('');
      setNewDescription('');
      setShowAddAssignment(false);
      refetchAssignments();
      toast.success('Assignment created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setEditTitle(assignment.title);
    setEditDescription(assignment.description);
  };

  const closeEditModal = () => {
    setEditingAssignment(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDescription.trim()) return;

    setSavingEdit(true);
    try {
      await axiosSecure.patch(`/assignments/${editingAssignment._id}`, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      toast.success('Assignment updated successfully!');
      closeEditModal();
      refetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update assignment');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId, title) => {
    const initialConfirm = await Swal.fire({
      title: `Delete "${title}"?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#78716c',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });
    if (!initialConfirm.isConfirmed) return;

    setDeletingId(assignmentId);
    try {
      await axiosSecure.delete(`/assignments/${assignmentId}`);
      toast.success('Assignment deleted.');
      refetchAssignments();
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 422 && data?.blocked) {
        Swal.fire({
          title: 'Cannot Delete',
          text: data.message || 'This assignment cannot be deleted.',
          icon: 'error',
          confirmButtonColor: '#07A698'
        });
      } else if (status === 409 && data?.requiresConfirmation) {
        const forceConfirm = await Swal.fire({
          title: 'Students Will Be Affected',
          text: data.message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#e11d48',
          cancelButtonColor: '#78716c',
          confirmButtonText: 'Delete anyway',
          cancelButtonText: 'Cancel'
        });

        if (forceConfirm.isConfirmed) {
          try {
            await axiosSecure.delete(`/assignments/${assignmentId}?force=true`);
            toast.success('Assignment deleted.');
            refetchAssignments();
          } catch (forceErr) {
            toast.error(forceErr.response?.data?.message || 'Failed to delete assignment');
          }
        }
      } else {
        toast.error(data?.message || 'Failed to delete assignment');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const isLoading = progressLoading || assignmentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-3 border-[#07A698] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans">
      <div className="border-b border-stone-200 pb-4">
        <button
          onClick={() => navigate('/dashboard/my-classes')}
          className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-800 mb-3 cursor-pointer"
        >
          <FiArrowLeft className="w-3 h-3" /> Back to My Classes
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#162726]">Class Overview</h1>
            <p className="text-xs text-stone-500 pt-1 font-medium">
              Manage students, assignments, and track engagement for this course.
            </p>
          </div>

          <Link to={`/dashboard/grade-submissions/${id}`}>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs">
              <FiCheckSquare className="w-4 h-4" /> Grade Submissions
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Enrolled Students</span>
            <FiUsers className="text-[#07A698]" />
          </div>
          <p className="text-2xl font-black text-[#162726]">{progress.totalEnrollment ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Assignments</span>
            <FiClipboard className="text-[#07A698]" />
          </div>
          <p className="text-2xl font-black text-[#162726]">{progress.totalAssignment ?? assignments.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Avg. Daily Submissions</span>
            <FiTrendingUp className="text-[#07A698]" />
          </div>
          <p className="text-2xl font-black text-[#162726]">{progress.perDaySubmission ?? 0}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-stone-100 rounded-xl text-stone-600">
            <FiUsers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-800 text-sm">Enrolled Students</h3>
            <p className="text-xs text-stone-500">View who's enrolled and when they joined.</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/dashboard/my-class/${id}/students`)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          <FiEye className="w-4 h-4" /> View Students
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiBookOpen className="text-[#07A698]" />
            <h3 className="font-bold text-stone-800">Assignments</h3>
          </div>
          <button
            onClick={() => setShowAddAssignment((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#07A698] hover:text-[#05857a] cursor-pointer"
          >
            <FiPlusCircle className="w-4 h-4" /> New Assignment
          </button>
        </div>

        {showAddAssignment && (
          <form onSubmit={handleAddAssignment} className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Assignment title"
              className="w-full p-2.5 border border-stone-300 rounded-lg text-sm"
            />
            <textarea
              required
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Assignment description / instructions"
              className="w-full p-2.5 border border-stone-300 rounded-lg text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddAssignment(false)}
                className="px-4 py-2 bg-stone-200 text-stone-700 font-bold text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs rounded-lg cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </form>
        )}

        {assignments.length === 0 ? (
          <div className="p-6 text-center text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-xs">
            No assignments created yet for this class.
          </div>
        ) : (
          <div className="space-y-2">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200 gap-3"
              >
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="font-bold text-sm text-stone-800 break-words">{assignment.title}</p>
                  <p className="text-xs text-stone-500 line-clamp-1">{assignment.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/dashboard/grade-submissions/${id}?assignmentId=${assignment._id}`)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Submissions
                  </button>
                  <button
                    onClick={() => openEditModal(assignment)}
                    className="p-2 bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 rounded-lg transition-all cursor-pointer"
                    title="Edit assignment"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment._id, assignment.title)}
                    disabled={deletingId === assignment._id}
                    className="p-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                    title="Delete assignment"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-[#162726]">Edit Assignment</h3>
              <button
                onClick={closeEditModal}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-all cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleUpdateAssignment} className="space-y-3">
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Assignment title"
                className="w-full p-2.5 border border-stone-300 rounded-lg text-sm"
              />
              <textarea
                required
                rows={4}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Assignment description / instructions"
                className="w-full p-2.5 border border-stone-300 rounded-lg text-sm"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold text-xs rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 bg-[#07A698] hover:bg-[#05857a] text-white font-bold text-xs rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassDetails;