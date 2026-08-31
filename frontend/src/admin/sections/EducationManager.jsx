import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiXMark } from 'react-icons/hi2';
import { portfolioAPI } from '../../services/api';
import Modal from '../../components/Modal';
import { usePortfolioData } from '../../context/usePortfolioData';

export default function EducationManager() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const { portfolioData, updateLocalPortfolio } = usePortfolioData();

  // Convert a stored Date to a <input type="month"> value (YYYY-MM)
  const toMonthInputValue = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const formatPeriod = (item) => {
    const start = toMonthInputValue(item.startDate);
    const end = toMonthInputValue(item.endDate);
    return [start, end].filter(Boolean).join(' – ');
  };

  useEffect(() => {
    if (portfolioData?.education) {
      setEducation(portfolioData.education);
      setLoading(false);
    }
  }, [portfolioData]);

  const saveEducation = async (updatedEducation) => {
    try {
      setSaving(true);
      await portfolioAPI.updateSection('education', updatedEducation);
      setEducation(updatedEducation);
      try { updateLocalPortfolio({ education: updatedEducation }); } catch {}
      alert('Education updated successfully!');
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save education: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ degree: '', institution: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      degree: item.degree,
      institution: item.institution,
      fieldOfStudy: item.field || '',
      startDate: toMonthInputValue(item.startDate),
      endDate: toMonthInputValue(item.endDate),
      description: item.description,
    });
    setShowModal(true);
  };

  const handleAdd = async () => {
    if (saving) return; // Prevent duplicate submissions

    try {
      setSaving(true);
      const newEducation = {
        institution: formData.institution,
        degree: formData.degree,
        field: formData.fieldOfStudy,
        startDate: formData.startDate ? new Date(`${formData.startDate}-01`) : null,
        endDate: formData.endDate ? new Date(`${formData.endDate}-01`) : null,
        description: formData.description,
      };
      const updatedEducation = [...education, newEducation];
      await saveEducation(updatedEducation);
      closeModal();
    } catch (error) {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (saving) return; // Prevent duplicate submissions

    try {
      setSaving(true);
      const updatedEducation = education.map(item =>
        item._id === editingId ? {
          ...item,
          institution: formData.institution,
          degree: formData.degree,
          field: formData.fieldOfStudy,
          startDate: formData.startDate ? new Date(`${formData.startDate}-01`) : null,
          endDate: formData.endDate ? new Date(`${formData.endDate}-01`) : null,
          description: formData.description,
        } : item
      );
      await saveEducation(updatedEducation);
      closeModal();
    } catch (error) {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (saving) return; // Prevent duplicate operations
    if (confirm('Are you sure you want to delete this education entry?')) {
      const updatedEducation = education.filter(item => item._id !== id);
      await saveEducation(updatedEducation);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ degree: '', institution: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between mb-6">
        <h2 className="text-2xl font-bold font-display text-gradient">Education</h2>
        <button onClick={openAddModal} className="btn-primary text-sm" disabled={saving}>
          <HiPlus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingId ? 'Edit Education' : 'Add New Education'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Degree</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="form-input"
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Institution</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="form-input"
              placeholder="e.g., University Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Field of Study</label>
            <input
              type="text"
              value={formData.fieldOfStudy}
              onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
              className="form-input"
              placeholder="e.g., Computer Science"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Start Date</label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">End Date</label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="form-input resize-none"
              placeholder="Brief description of your studies..."
            />
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4 min-[430px]:grid-cols-2">
            <button onClick={closeModal} className="btn-outline text-sm" disabled={saving}>
              <HiXMark className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="btn-primary text-sm"
              disabled={saving || !formData.degree.trim() || !formData.institution.trim()}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <HiCheck className="w-4 h-4" />
                  {editingId ? 'Update' : 'Add'}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Education List */}
      <div className="space-y-4">
        {education.map((item) => (
          <div key={item._id} className="glass-card p-4 sm:p-6 rounded-2xl">
            <div className="mb-3 flex flex-col gap-2 min-[430px]:flex-row min-[430px]:items-start min-[430px]:justify-between">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-text-primary">{item.degree}</h3>
                <p className="text-sm text-accent">{item.institution}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-lg hover:bg-border-base/30 text-text-muted hover:text-accent transition-colors"
                  disabled={saving}
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg hover:bg-border-base/30 text-text-muted hover:text-red-500 transition-colors"
                  disabled={saving}
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-text-muted mb-1">{item.field}</p>
            {formatPeriod(item) && <p className="text-xs text-text-muted mb-2">{formatPeriod(item)}</p>}
            <p className="text-sm text-text-muted/80">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
