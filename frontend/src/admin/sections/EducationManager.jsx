import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiXMark } from 'react-icons/hi2';
import { portfolioAPI } from '../../services/api';
import Modal from '../../components/Modal';

export default function EducationManager() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    period: '',
    description: '',
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const data = await portfolioAPI.getPortfolio();
      setEducation(data.education || []);
    } catch (error) {
      console.error('Error fetching education:', error);
      alert('Failed to load education data');
    } finally {
      setLoading(false);
    }
  };

  const saveEducation = async (updatedEducation) => {
    try {
      setSaving(true);
      await portfolioAPI.updateSection('education', updatedEducation);
      setEducation(updatedEducation);
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
    setFormData({ degree: '', institution: '', period: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      degree: item.degree,
      institution: item.institution,
      period: item.field || '',
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
        field: formData.period,
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
          field: formData.period,
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
    setFormData({ degree: '', institution: '', period: '', description: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Degree</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="form-input"
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Institution</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="form-input"
              placeholder="e.g., University Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Period</label>
            <input
              type="text"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="form-input"
              placeholder="e.g., 2019 - 2023"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="form-input resize-none"
              placeholder="Brief description of your studies..."
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
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
          <div key={item._id} className="glass-card p-6 rounded-2xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-200">{item.degree}</h3>
                <p className="text-sm text-[#00d4ff]">{item.institution}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-[#00d4ff] transition-colors"
                  disabled={saving}
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-red-400 transition-colors"
                  disabled={saving}
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-2">{item.field}</p>
            <p className="text-sm text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
