import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiXMark, HiEye } from 'react-icons/hi2';
import { portfolioAPI, uploadAPI, resolveBackendUrl } from '../../services/api';
import { usePortfolioData } from '../../context/usePortfolioData';
import Modal from '../../components/Modal';
import FileUpload from '../../components/FileUpload';

// Helper function to get image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const url = typeof imagePath === 'object' ? (imagePath.secure_url || imagePath.url || imagePath.secureUrl) : imagePath;
  if (!url) return null;

  // If it starts with /uploads, it's an uploaded file
  if (url.startsWith('/uploads')) {
    return resolveBackendUrl(url);
  }

  return url;
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    tags: [''],
    liveUrl: '',
    githubUrl: '',
  });

  const [_uploadedImage, setUploadedImage] = useState(null);
  const { portfolioData, refreshPortfolio } = usePortfolioData();

  useEffect(() => {
    // keep in sync if portfolioData changes
    if (portfolioData?.projects) setProjects(portfolioData.projects);
    setLoading(false);
  }, [portfolioData]);

  const openModal = (mode, project = null) => {
    setModalMode(mode);
    setEditingProject(project);

    if (mode === 'add') {
      setFormData({ title: '', description: '', image: null, tags: [''], liveUrl: '', githubUrl: '' });
      setUploadedImage(null);
    } else if (mode === 'edit' && project) {
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        tags: Array.isArray(project.technologies)
          ? project.technologies
          : (project.tags ? project.tags.split(',').map((tag) => tag.trim()) : ['']),
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
      });
      setUploadedImage(null);
    } else if (mode === 'view' && project) {
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        tags: Array.isArray(project.technologies)
          ? project.technologies
          : (project.tags ? project.tags.split(',').map((tag) => tag.trim()) : ['']),
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMode('add');
    setEditingProject(null);
    setFormData({ title: '', description: '', image: null, tags: [''], liveUrl: '', githubUrl: '' });
    setUploadedImage(null);
  };

  const handleImageUpload = async (fileData) => {
    if (!fileData) {
      setUploadedImage(null);
      setFormData({ ...formData, image: null });
      return;
    }

    try {
      const response = await uploadAPI.uploadFile(fileData.file, 'project');
      const imgData = {
        secure_url: response.data.url || response.data.secure_url,
        public_id: response.data.publicId || response.data.public_id,
        width: response.data.width || null,
        height: response.data.height || null,
        format: response.data.format || null
      };
      setUploadedImage(imgData);
      setFormData({ ...formData, image: imgData });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error.message);
    }
  };

  const handleAdd = async () => {
    if (saving) return; // Prevent duplicate submissions

    try {
      setSaving(true);
      const newProject = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        technologies: formData.tags.filter(t => t.trim() !== ''),
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        featured: false,
      };
      
      await portfolioAPI.createProject(newProject);
      await refreshPortfolio();
      alert('Project added successfully!');
      closeModal();
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (saving) return; // Prevent duplicate submissions

    try {
      setSaving(true);
      const projectData = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        technologies: formData.tags.filter(t => t.trim() !== ''),
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        featured: editingProject.isFeatured ?? editingProject.featured ?? false,
      };

      await portfolioAPI.updateProject(editingProject._id, projectData);
      await refreshPortfolio();
      alert('Project updated successfully!');
      closeModal();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (saving) return; // Prevent duplicate operations
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        setSaving(true);
        await portfolioAPI.deleteProject(id);
        await refreshPortfolio();
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project: ' + error.message);
      } finally {
        setSaving(false);
      }
    }
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const updateTag = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const removeTag = (index) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
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
        <h2 className="text-2xl font-bold font-display text-gradient">Projects</h2>
        <button
          onClick={() => openModal('add')}
          className="btn-primary text-sm"
          disabled={saving}
        >
          <HiPlus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="glass-card rounded-2xl overflow-hidden">
            {getImageUrl(project.image) ? (
              <div className="h-48 bg-gradient-to-br from-accent/10 to-accent-dark/10 flex items-center justify-center overflow-hidden">
                <img
                  src={getImageUrl(project.image)}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-accent/10 to-accent-dark/10" aria-hidden="true" />
            )}
            <div className="p-4 sm:p-5">
              <div className="mb-3 flex flex-col gap-2 min-[430px]:flex-row min-[430px]:items-start min-[430px]:justify-between">
                <h3 className="min-w-0 break-words text-lg font-semibold text-text-primary">{project.title}</h3>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openModal('view', project)}
                    className="p-1.5 rounded-lg hover:bg-border-base/30 text-text-muted hover:text-accent transition-colors"
                    title="View"
                  >
                    <HiEye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openModal('edit', project)}
                    className="p-1.5 rounded-lg hover:bg-border-base/30 text-text-muted hover:text-accent transition-colors"
                    disabled={saving}
                    title="Edit"
                  >
                    <HiPencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-1.5 rounded-lg hover:bg-border-base/30 text-text-muted hover:text-red-500 transition-colors"
                    disabled={saving}
                    title="Delete"
                  >
                    <HiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-muted mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {(project.technologies || []).map((tag, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          modalMode === 'add' ? 'Add New Project' :
            modalMode === 'edit' ? 'Edit Project' :
              'View Project'
        }
        size="lg"
      >
        <div className="space-y-6">
          {/* Project Image */}
          <div>
            <FileUpload
              label="Project Image"
              accept="image/*"
              value={getImageUrl(formData.image)}
              onChange={handleImageUpload}
              type="image"
              placeholder="Upload project screenshot or image"
            />
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Project Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              placeholder="e.g., E-commerce Platform"
              disabled={modalMode === 'view'}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="form-input resize-none"
              placeholder="Brief description of the project..."
              disabled={modalMode === 'view'}
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Technologies</label>
            <div className="space-y-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    className="form-input flex-1"
                    placeholder="e.g., React"
                    disabled={modalMode === 'view'}
                  />
                  {modalMode !== 'view' && formData.tags.length > 1 && (
                    <button
                      onClick={() => removeTag(index)}
                      className="p-3 rounded-xl hover:bg-border-base/30 text-text-muted hover:text-red-500 transition-colors"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {modalMode !== 'view' && (
                <button
                  onClick={addTag}
                  className="text-sm text-accent hover:text-[#1D4ED8] transition-colors"
                >
                  + Add Technology
                </button>
              )}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Live/Demo URL</label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="form-input"
                placeholder="https://example.com"
                disabled={modalMode === 'view'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="form-input"
                placeholder="https://github.com/username/repo"
                disabled={modalMode === 'view'}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {modalMode !== 'view' && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={modalMode === 'add' ? handleAdd : handleUpdate}
                className="btn-primary flex-1"
                disabled={saving || !formData.title || !formData.description}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <HiCheck className="w-4 h-4" />
                    {modalMode === 'add' ? 'Add Project' : 'Update Project'}
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
