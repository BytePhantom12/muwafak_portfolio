import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiXMark } from 'react-icons/hi2';
import { portfolioAPI } from '../../services/api';
import Modal from '../../components/Modal';
import { usePortfolioData } from '../../context/usePortfolioData';

export default function CertificationsManager() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
    credentialId: '',
    skills: [''],
  });

  const { portfolioData, updateLocalPortfolio } = usePortfolioData();

  useEffect(() => {
    if (portfolioData?.certifications) {
      setCertifications(portfolioData.certifications);
      setLoading(false);
    }
  }, [portfolioData]);

  // Convert a stored Date to a <input type="month"> value (YYYY-MM)
  const toMonthInputValue = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const formatIssueDate = (item) => toMonthInputValue(item.issueDate) || 'Date not set';

  const saveCertifications = async (updatedCertifications) => {
    try {
      setSaving(true);
      await portfolioAPI.updateSection('certifications', updatedCertifications);
      setCertifications(updatedCertifications);
      try { updateLocalPortfolio({ certifications: updatedCertifications }); } catch {}
      alert('Certifications updated successfully!');
    } catch (error) {
      console.error('Error saving certifications:', error);
      alert('Failed to save certifications: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', issuer: '', issueDate: '', credentialUrl: '', credentialId: '', skills: [''] });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title || '',
      issuer: item.issuer || '',
      issueDate: toMonthInputValue(item.issueDate),
      credentialUrl: item.credentialUrl || '',
      credentialId: item.credentialId || '',
      skills: item.skills?.length ? item.skills : [''],
    });
    setShowModal(true);
  };

  const handleAdd = async () => {
    if (saving) return; // Prevent duplicate submissions

    try {
      setSaving(true);
      const newCertification = {
        title: formData.title,
        issuer: formData.issuer,
        issueDate: formData.issueDate ? new Date(`${formData.issueDate}-01`) : null,
        credentialUrl: formData.credentialUrl,
        credentialId: formData.credentialId,
        skills: formData.skills.filter(s => s.trim() !== ''),
      };
      const updatedCertifications = [...certifications, newCertification];
      await saveCertifications(updatedCertifications);
      closeModal();
    } catch (error) {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (saving) return; // Prevent duplicate submissions

    try {
      setSaving(true);
      const updatedCertifications = certifications.map(item =>
        item._id === editingId ? {
          ...item,
          title: formData.title,
          issuer: formData.issuer,
          issueDate: formData.issueDate ? new Date(`${formData.issueDate}-01`) : null,
          credentialUrl: formData.credentialUrl,
          credentialId: formData.credentialId,
          skills: formData.skills.filter(s => s.trim() !== ''),
        } : item
      );
      await saveCertifications(updatedCertifications);
      closeModal();
    } catch (error) {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (saving) return; // Prevent duplicate operations
    if (confirm('Are you sure you want to delete this certification?')) {
      const updatedCertifications = certifications.filter(item => item._id !== id);
      await saveCertifications(updatedCertifications);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', issuer: '', issueDate: '', credentialUrl: '', credentialId: '', skills: [''] });
  };

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ''] });
  };

  const updateSkill = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const removeSkill = (index) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
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
        <h2 className="text-2xl font-bold font-display text-gradient">Certifications</h2>
        <button onClick={openAddModal} className="btn-primary text-sm" disabled={saving}>
          <HiPlus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingId ? 'Edit Certification' : 'Add New Certification'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                placeholder="e.g., Google Data Analytics Certificate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Issuer</label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="form-input"
                placeholder="e.g., Google / Coursera"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Issue Date</label>
              <input
                type="month"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Credential ID</label>
              <input
                type="text"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                className="form-input"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Credential URL</label>
            <input
              type="url"
              value={formData.credentialUrl}
              onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
              className="form-input"
              placeholder="https://credential-link.example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Related Skills</label>
            <div className="space-y-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    className="form-input flex-1"
                    placeholder="e.g., SQL"
                  />
                  {formData.skills.length > 1 && (
                    <button
                      onClick={() => removeSkill(index)}
                      className="p-3 rounded-xl hover:bg-border-base/30 text-text-muted hover:text-red-500 transition-colors"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addSkill}
                className="text-sm text-accent hover:text-[#1D4ED8] transition-colors"
              >
                + Add Skill
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4 min-[430px]:grid-cols-2">
            <button onClick={closeModal} className="btn-outline text-sm" disabled={saving}>
              <HiXMark className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="btn-primary text-sm"
              disabled={saving || !formData.title.trim() || !formData.issuer.trim()}
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

      {/* Certifications List */}
      {certifications.length === 0 ? (
        <div className="glass-card p-6 rounded-2xl text-center text-sm text-text-muted">
          No certifications yet. Add your first one above.
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((item) => (
            <div key={item._id} className="glass-card p-4 sm:p-6 rounded-2xl">
              <div className="mb-3 flex flex-col gap-2 min-[430px]:flex-row min-[430px]:items-start min-[430px]:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-text-primary break-words">{item.title}</h3>
                  <p className="text-sm text-accent">{item.issuer}</p>
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
              <p className="text-sm text-text-muted mb-1">{formatIssueDate(item)}</p>
              {item.credentialId && <p className="text-xs text-text-muted mb-2 break-all">Credential ID: {item.credentialId}</p>}
              {item.skills && item.skills.length > 0 && (
                <ul className="flex flex-wrap gap-2 mt-2">
                  {item.skills.map((skill, idx) => (
                    <li key={idx} className="text-xs px-2 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20">
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
