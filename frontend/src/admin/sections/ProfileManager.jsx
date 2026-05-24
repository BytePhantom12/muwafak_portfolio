import { useState, useEffect } from 'react';
import { HiPencil, HiCheck, HiXMark, HiPlus, HiTrash, HiEye } from 'react-icons/hi2';
import { portfolioAPI, uploadAPI } from '../../services/api';
import { usePortfolioData } from '../../context/PortfolioContext';
import Modal from '../../components/Modal';
import FileUpload from '../../components/FileUpload';

export default function ProfileManager() {
  const { portfolioData, updateLocalPortfolio } = usePortfolioData();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('edit'); // 'edit', 'view'
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    heroDescription: '',
    cvUrl: '',
    profileImage: '',
    title: '',
    shortDescription: '',
    location: '',
    roleDetail: '',
    education: '',
    languages: '',
    email: '',
    socials: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    cv: null,
    profileImage: null
  });

  useEffect(() => {
    if (!portfolioData) return;

    setFormData({
      name: portfolioData.name || portfolioData.profile?.name || '',
      role: portfolioData.role || portfolioData.profile?.title || '',
      heroDescription: portfolioData.heroDescription || portfolioData.profile?.bio || '',
      cvUrl: portfolioData.cvUrl || portfolioData.profile?.resume || '',
      profileImage: portfolioData.profile?.profileImage || '',
      title: portfolioData.about?.introDescription || portfolioData.about?.description || '',
      shortDescription: portfolioData.about?.highlights?.[0] || '',
      email: portfolioData.contact?.email || portfolioData.profile?.email || '',
      location: portfolioData.about?.location || portfolioData.profile?.location || '',
      roleDetail: portfolioData.about?.role || portfolioData.profile?.title || '',
      education: portfolioData.education?.[0]?.degree || '',
      languages: portfolioData.about?.languages || portfolioData.profile?.languages || '',
      socials: portfolioData.socials || (portfolioData.contact?.social ? Object.entries(portfolioData.contact.social).map(([key, value]) => ({
        id: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        href: value,
        icon: `Fa${key.charAt(0).toUpperCase() + key.slice(1)}`
      })) : []),
    });
    setLoading(false);
  }, [portfolioData]);

  const openModal = (mode) => {
    setModalMode(mode);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUploadedFiles({ cv: null, profileImage: null });
  };

  const handleFileUpload = async (fileData, type) => {
    if (!fileData) {
      setUploadedFiles({ ...uploadedFiles, [type]: null });
      if (type === 'cv') {
        setFormData({ ...formData, cvUrl: '' });
      } else if (type === 'profileImage') {
        setFormData({ ...formData, profileImage: '' });
      }
      return;
    }

    try {
      const uploadType = type === 'cv' ? 'document' : 'profile';
      const response = await uploadAPI.uploadFile(fileData.file, uploadType);
      setUploadedFiles({ ...uploadedFiles, [type]: response.data });
      
      if (type === 'cv') {
        setFormData({ ...formData, cvUrl: response.data.url });
      } else if (type === 'profileImage') {
        setFormData({ ...formData, profileImage: response.data.url });
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      alert(`Failed to upload ${type}: ` + error.message);
    }
  };

  const handleSave = async () => {
    if (saving) return; // Prevent duplicate submissions
    
    try {
      setSaving(true);
      
      const updateData = {
        profile: {
          name: formData.name,
          title: formData.role,
          bio: formData.heroDescription,
          resume: formData.cvUrl,
          profileImage: formData.profileImage,
          location: formData.location,
          languages: formData.languages,
          email: formData.email || 'contact@example.com',
        },
        about: {
          description: formData.title,
          highlights: [formData.shortDescription],
        },
        contact: {
          email: formData.email || 'contact@example.com',
          social: formData.socials.reduce((acc, social) => {
            acc[social.id] = social.href;
            return acc;
          }, {}),
        },
      };

      await portfolioAPI.updatePortfolio(updateData);
      updateLocalPortfolio({
        name: formData.name,
        role: formData.role,
        heroDescription: formData.heroDescription,
        cvUrl: formData.cvUrl,
        profile: {
          ...updateData.profile,
        },
        about: {
          introDescription: formData.title,
          highlights: [formData.shortDescription],
        },
        contact: updateData.contact,
        socials: updateData.contact.social,
      });
      alert('Profile updated successfully!');
      closeModal();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const addSocial = () => {
    setFormData({
      ...formData,
      socials: [...formData.socials, { id: '', label: '', href: '', icon: '' }]
    });
  };

  const updateSocial = (index, field, value) => {
    const newSocials = [...formData.socials];
    newSocials[index][field] = value;
    setFormData({ ...formData, socials: newSocials });
  };

  const removeSocial = (index) => {
    setFormData({
      ...formData,
      socials: formData.socials.filter((_, i) => i !== index)
    });
  };

  const getFileUrl = (url) => {
    if (!url) return null;
    
    // If it's already a full URL (Cloudinary or external), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Legacy local uploads - convert to backend URL
    if (url.startsWith('/uploads')) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
    }
    
    return url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#185FA5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display text-gradient">Profile Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => openModal('view')} 
            className="btn-outline text-sm"
          >
            <HiEye className="w-4 h-4" />
            View Profile
          </button>
          <button 
            onClick={() => openModal('edit')} 
            className="btn-primary text-sm"
          >
            <HiPencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#185FA5]/20 to-[#0C447C]/20 flex items-center justify-center overflow-hidden">
            {formData.profileImage ? (
              <img 
                src={getFileUrl(formData.profileImage)} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-[#626058]">
                {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#1C1B19] mb-1">{formData.name || 'Your Name'}</h3>
            <p className="text-[#185FA5] mb-2">{formData.role || 'Your Role'}</p>
            <p className="text-sm text-[#626058] mb-3">{formData.heroDescription || 'Your bio description'}</p>
            <div className="flex flex-wrap gap-4 text-xs text-[#626058]">
              <span>📍 {formData.location || 'Location'}</span>
              <span>🎓 {formData.education || 'Education'}</span>
              <span>🌍 {formData.languages || 'Languages'}</span>
            </div>
          </div>
        </div>
        
        {/* Social Links */}
        {formData.socials.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[#C2C0B8]/30">
            <p className="text-sm text-[#626058] mb-3">Social Media</p>
            <div className="flex flex-wrap gap-2">
              {formData.socials.map((social, index) => (
                <span key={index} className="text-xs px-3 py-1 rounded-full bg-[#185FA5]/10 text-[#185FA5] border border-[#185FA5]/20">
                  {social.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={modalMode === 'edit' ? 'Edit Profile' : 'View Profile'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Profile Image & CV Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              label="Profile Image"
              accept="image/*"
              value={getFileUrl(formData.profileImage)}
              onChange={(fileData) => handleFileUpload(fileData, 'profileImage')}
              type="image"
              placeholder="Upload your profile photo"
            />
            
            <FileUpload
              label="CV/Resume"
              accept=".pdf,.doc,.docx,.odt,.rtf,.txt"
              value={getFileUrl(formData.cvUrl)}
              onChange={(fileData) => handleFileUpload(fileData, 'cv')}
              type="document"
              placeholder="Upload your CV or resume (PDF, Word, ODT, RTF, TXT)"
            />
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1C1B19]">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1B19] mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="form-input disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1B19] mb-2">Primary Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="form-input disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="e.g., Frontend Developer"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1B19] mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="form-input disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1B19] mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="form-input disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Malaysia (Available Remotely)"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1C1B19] mb-2">🌍 Languages</label>
              <input
                type="text"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                disabled={modalMode === 'view'}
                className="form-input disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="English, Arabic"
              />
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1C1B19]">About Section</h3>
            
            <div>
              <label className="block text-sm font-medium text-[#1C1B19] mb-2">Title (Who Am I)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={modalMode === 'view'}
                className="form-input disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="e.g., Full Stack Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C1B19] mb-2">Short Description</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                disabled={modalMode === 'view'}
                rows={4}
                className="form-input disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                placeholder="Brief description about yourself"
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1C1B19]">Social Media Handles</h3>
              {modalMode === 'edit' && (
                <button onClick={addSocial} className="btn-outline text-sm">
                  <HiPlus className="w-4 h-4" />
                  Add Social
                </button>
              )}
            </div>

            <div className="space-y-4">
              {formData.socials.map((social, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#C2C0B8]/10 rounded-xl">
                  <div>
                    <label className="block text-sm font-medium text-[#1C1B19] mb-2">Platform ID</label>
                    <input
                      type="text"
                      value={social.id}
                      onChange={(e) => updateSocial(index, 'id', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="form-input disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="github"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1B19] mb-2">Label</label>
                    <input
                      type="text"
                      value={social.label}
                      onChange={(e) => updateSocial(index, 'label', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="form-input disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="GitHub"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1B19] mb-2">URL</label>
                    <input
                      type="url"
                      value={social.href}
                      onChange={(e) => updateSocial(index, 'href', e.target.value)}
                      disabled={modalMode === 'view'}
                      className="form-input disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-[#1C1B19] mb-2">Icon</label>
                      <input
                        type="text"
                        value={social.icon}
                        onChange={(e) => updateSocial(index, 'icon', e.target.value)}
                        disabled={modalMode === 'view'}
                        className="form-input disabled:opacity-60 disabled:cursor-not-allowed"
                        placeholder="FaGithub"
                      />
                    </div>
                    {modalMode === 'edit' && (
                      <button
                        onClick={() => removeSocial(index)}
                        className="p-3 rounded-xl hover:bg-[#C2C0B8]/30 text-[#626058] hover:text-red-500 transition-colors"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {modalMode === 'edit' && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="btn-primary flex-1"
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
              <button
                onClick={closeModal}
                className="btn-outline flex-1"
                disabled={saving}
              >
                <HiXMark className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}