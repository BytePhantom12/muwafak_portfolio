import { useState, useEffect } from 'react';
import { HiPencil, HiCheck, HiXMark } from 'react-icons/hi2';
import { portfolioAPI } from '../../services/api';
import { usePortfolioData } from '../../context/PortfolioContext';
import Modal from '../../components/Modal';

export default function AboutManager() {
  const { portfolioData, updateLocalPortfolio } = usePortfolioData();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    introHeading: '',
    introHeadingHighlight: '',
    introDescription: '',
    location: '',
    role: '',
    education: '',
    languages: '',
    yearsOfExperience: '',
    projectsDone: '',
  });

  useEffect(() => {
    if (!portfolioData) return;

    setFormData({
      introHeading: portfolioData.about?.introHeading || portfolioData.about?.description || '',
      introHeadingHighlight: portfolioData.about?.introHeadingHighlight || portfolioData.about?.highlights?.[0] || '',
      introDescription: portfolioData.about?.introDescription || portfolioData.about?.highlights?.[1] || '',
      location: portfolioData.about?.location || portfolioData.profile?.location || '',
      role: portfolioData.role || portfolioData.profile?.title || '',
      education: portfolioData.education?.[0]?.degree || '',
      languages: portfolioData.about?.languages || portfolioData.profile?.languages || '',
      yearsOfExperience: portfolioData.about?.yearsOfExperience || portfolioData.profile?.yearsOfExperience || '',
      projectsDone: portfolioData.about?.projectsDone || portfolioData.profile?.projectsDone || '',
    });
    setLoading(false);
  }, [portfolioData]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    if (saving) return; // Prevent duplicate submissions
    
    try {
      setSaving(true);
      const updateData = {
        about: {
          introHeading: formData.introHeading,
          introHeadingHighlight: formData.introHeadingHighlight,
          introDescription: formData.introDescription,
          highlights: [formData.introHeadingHighlight, formData.introDescription],
          location: formData.location,
          role: formData.role,
          education: formData.education,
          languages: formData.languages,
          yearsOfExperience: formData.yearsOfExperience,
          projectsDone: formData.projectsDone,
        },
        profile: {
          location: formData.location,
          title: formData.role,
          languages: formData.languages,
          yearsOfExperience: formData.yearsOfExperience,
          projectsDone: formData.projectsDone,
        },
      };
      await portfolioAPI.updatePortfolio(updateData);
      updateLocalPortfolio(updateData);
      alert('About section updated successfully!');
      closeModal();
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Failed to save about data: ' + error.message);
    } finally {
      setSaving(false);
    }
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display text-gradient">About Section</h2>
        <button onClick={openModal} className="btn-primary text-sm" disabled={loading}>
          <HiPencil className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Display Card */}
      <div className="glass-card p-6 rounded-2xl space-y-6">
        {/* Intro Heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Intro Heading</label>
            <p className="text-text-primary">{formData.introHeading || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Heading Highlight</label>
            <p className="text-text-primary">{formData.introHeadingHighlight || 'Not set'}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Description</label>
          <p className="text-text-primary">{formData.introDescription || 'Not set'}</p>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Location</label>
            <p className="text-text-primary">{formData.location || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Role</label>
            <p className="text-text-primary">{formData.role || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Education</label>
            <p className="text-text-primary">{formData.education || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Languages</label>
            <p className="text-text-primary">{formData.languages || 'Not set'}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Years of Experience</label>
            <p className="text-text-primary">{formData.yearsOfExperience || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Projects Done</label>
            <p className="text-text-primary">{formData.projectsDone || 'Not set'}</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Edit About Section"
        size="lg"
      >
        <div className="space-y-6">
          {/* Intro Heading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Intro Heading</label>
              <input
                type="text"
                value={formData.introHeading}
                onChange={(e) => setFormData({ ...formData, introHeading: e.target.value })}
                className="form-input"
                placeholder="e.g., I am a dedicated full-stack developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Heading Highlight</label>
              <input
                type="text"
                value={formData.introHeadingHighlight}
                onChange={(e) => setFormData({ ...formData, introHeadingHighlight: e.target.value })}
                className="form-input"
                placeholder="e.g., 3+ years of professional experience"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
            <textarea
              value={formData.introDescription}
              onChange={(e) => setFormData({ ...formData, introDescription: e.target.value })}
              rows={4}
              className="form-input resize-none"
              placeholder="Brief description about yourself..."
            />
          </div>

          {/* Quick Facts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input"
                placeholder="e.g., New York, USA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-input"
                placeholder="e.g., Full Stack Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Education</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="form-input"
                placeholder="e.g., Bachelor of Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Languages</label>
              <input
                type="text"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                className="form-input"
                placeholder="e.g., English, Spanish"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Years of Experience</label>
              <input
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                className="form-input"
                placeholder="e.g., 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Projects Done</label>
              <input
                type="number"
                value={formData.projectsDone}
                onChange={(e) => setFormData({ ...formData, projectsDone: e.target.value })}
                className="form-input"
                placeholder="e.g., 50"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={closeModal} className="btn-outline text-sm" disabled={saving}>
            <HiXMark className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary text-sm"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <HiCheck className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}
