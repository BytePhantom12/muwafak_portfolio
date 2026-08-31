import { useState, useEffect } from 'react';
import { HiPencil, HiCheck, HiXMark, HiTrash } from 'react-icons/hi2';
import { portfolioAPI } from '../../services/api';
import { usePortfolioData } from '../../context/usePortfolioData';
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
    highlights: [''],
  });

  useEffect(() => {
    if (!portfolioData) return;

    setFormData({
      introHeading: portfolioData.about?.introHeading || portfolioData.about?.description || '',
      introHeadingHighlight: portfolioData.about?.introHeadingHighlight || '',
      introDescription: portfolioData.about?.introDescription || '',
      location: portfolioData.about?.location || portfolioData.profile?.location || '',
      role: portfolioData.about?.role || '',
      education: portfolioData.about?.education || portfolioData.education?.[0]?.degree || '',
      languages: portfolioData.about?.languages || portfolioData.profile?.languages || '',
      yearsOfExperience: portfolioData.about?.yearsOfExperience || '',
      projectsDone: portfolioData.about?.projectsDone || '',
      highlights: portfolioData.about?.highlights?.length ? portfolioData.about.highlights : [''],
    });
    setLoading(false);
  }, [portfolioData]);

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const updateHighlight = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const removeHighlight = (index) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) });
  };

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
          highlights: formData.highlights.filter((h) => h.trim() !== ''),
          location: formData.location,
          role: formData.role,
          education: formData.education,
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
      <div className="flex flex-col gap-3 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between mb-6">
        <h2 className="text-2xl font-bold font-display text-gradient">About Section</h2>
        <button onClick={openModal} className="btn-primary text-sm" disabled={loading}>
          <HiPencil className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Display Card */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl space-y-6">
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
          <p className="text-text-primary whitespace-pre-line">{formData.introDescription || 'Not set'}</p>
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Highlights</label>
          {formData.highlights.filter((h) => h.trim() !== '').length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {formData.highlights.filter((h) => h.trim() !== '').map((item) => (
                <li key={item} className="text-text-primary text-sm">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-text-primary">Not set</p>
          )}
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Focus</label>
            <p className="text-text-primary">{formData.role || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Education</label>
            <p className="text-text-primary">{formData.education || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Location</label>
            <p className="text-text-primary">{formData.location || 'Not set'}</p>
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
                placeholder="e.g., From IT Support to"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Heading Highlight</label>
              <input
                type="text"
                value={formData.introHeadingHighlight}
                onChange={(e) => setFormData({ ...formData, introHeadingHighlight: e.target.value })}
                className="form-input"
                placeholder="e.g., Data & Backend Development"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
            <textarea
              value={formData.introDescription}
              onChange={(e) => setFormData({ ...formData, introDescription: e.target.value })}
              rows={6}
              className="form-input resize-none"
              placeholder="Two short paragraphs about your background and focus. Leave a blank line between paragraphs."
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Highlights</label>
            <div className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    className="form-input flex-1"
                    placeholder="e.g., Designing reliable backend systems and REST APIs"
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      onClick={() => removeHighlight(index)}
                      className="p-3 rounded-xl hover:bg-border-base/30 text-text-muted hover:text-red-500 transition-colors"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addHighlight}
                className="text-sm text-accent hover:text-[#1D4ED8] transition-colors"
              >
                + Add Highlight
              </button>
            </div>
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
              <label className="block text-sm font-medium text-text-primary mb-2">Focus</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-input"
                placeholder="e.g., Data Analytics & Backend Development"
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

        <div className="mt-6 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2">
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
