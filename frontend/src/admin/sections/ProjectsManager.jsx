import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiXMark, HiEye } from 'react-icons/hi2';
import { portfolioAPI, uploadAPI } from '../../services/api';
import Modal from '../../components/Modal';
import FileUpload from '../../components/FileUpload';

// Helper function to get image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it starts with /uploads, it's an uploaded file
  if (imagePath.startsWith('/uploads')) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
  }
  
  // If it's just a filename, use our imported images
  const filename = imagePath.split('/').pop();
  if (projectImages[filename]) {
    return projectImages[filename];
  }
  
  // Otherwise, use the path as-is
  return imagePath;
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
    image: '',
    tags: [''],
    liveUrl: '',
    githubUrl: '',
  });

  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await portfolioAPI.getPortfolio();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const saveProjects = async (updatedProjects) => {
    try {
      setSaving(true);
      await portfolioAPI.updateSection('projects', updatedProjects);
      setProjects(updatedProjects);
      alert('Projects updated successfully!');
    } catch (error) {
      console.error('Error saving projects:', error);
      alert('Failed to save projects: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const openModal = (mode, project = null) => {
    setModalMode(mode);
    setEditingProject(project);
    
    if (mode === 'add') {
      setFormData({ title: '', description: '', image: '', tags: [''], liveUrl: '', githubUrl: '' });
      setUploadedImage(null);
    } else if (mode === 'edit' && project) {
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        tags: project.technologies || [''],
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
      });
      setUploadedImage(null);
    } else if (mode === 'view' && project) {
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        tags: project.technologies || [''],
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
    setFormData({ title: '', description: '', image: '', tags: [''], liveUrl: '', githubUrl: '' });
    setUploadedImage(null);
  };

  const handleImageUpload = async (fileData) => {
    if (!fileData) {
      setUploadedImage(null);
      setFormData({ ...formData, image: '' });
      return;
    }

    try {
      const response = await uploadAPI.uploadFile(fileData.file, 'project');
      setUploadedImage(response.data);
      setFormData({ ...formData, image: response.data.url });
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
      const updatedProjects = [...projects, newProject];
      await saveProjects(updatedProjects);
      closeModal();
    } catch (error) {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (saving) return; // Prevent duplicate submissions
    
    try {
      setSaving(true);
      const updatedProjects = projects.map(project => 
        project._id === editingProject._id ? { 
          ...project, 
          title: formData.title,
          description: formData.description,
          image: formData.image,
          technologies: formData.tags.filter(t => t.trim() !== ''),
          liveUrl: formData.liveUrl,
          githubUrl: formData.githubUrl,
        } : project
      );
      await saveProjects(updatedProjects);
      closeModal();
    } catch (error) {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (saving) return; // Prevent duplicate operations
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(project => project._id !== id);
      await saveProjects(updatedProjects);
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
        <div className="w-8 h-8 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
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
            {project.image ? (
              <div className="h-48 bg-gradient-to-br from-[#00d4ff]/10 to-[#7c3aed]/10 flex items-center justify-center overflow-hidden">
                <img 
                  src={getImageUrl(project.image)} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-[#00d4ff]/10 to-[#7c3aed]/10 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-sm">No image</div>
                </div>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-200">{project.title}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal('view', project)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-[#00d4ff] transition-colors"
                    title="View"
                  >
                    <HiEye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openModal('edit', project)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-[#00d4ff] transition-colors"
                    disabled={saving}
                    title="Edit"
                  >
                    <HiPencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-red-400 transition-colors"
                    disabled={saving}
                    title="Delete"
                  >
                    <HiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {(project.technologies || []).map((tag, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff]">
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Project Title</label>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Technologies</label>
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
                      className="p-3 rounded-xl hover:bg-white/[0.04] text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {modalMode !== 'view' && (
                <button
                  onClick={addTag}
                  className="text-sm text-[#00d4ff] hover:text-[#00aad4] transition-colors"
                >
                  + Add Technology
                </button>
              )}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Live/Demo URL</label>
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
              <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
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