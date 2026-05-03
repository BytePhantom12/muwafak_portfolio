import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiXMark } from 'react-icons/hi2';
import { portfolioAPI, uploadAPI } from '../../services/api';
import Modal from '../../components/Modal';
import FileUpload from '../../components/FileUpload';

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    level: 90,
    category: 'Frontend',
    color: '#00d4ff',
  });

  const [uploadedIcon, setUploadedIcon] = useState(null);

  const categories = [
    { name: 'Frontend', color: '#00d4ff' },
    { name: 'Backend', color: '#7c3aed' },
    { name: 'Tools & Cloud', color: '#10b981' },
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await portfolioAPI.getPortfolio();
      const flatSkills = (data.skills || []).flatMap((skillCategory, catIndex) => 
        (skillCategory.items || []).map((item, itemIndex) => ({
          _id: `${catIndex}-${itemIndex}`,
          name: item,
          icon: '',
          level: 90,
          category: skillCategory.category,
          categoryColor: categories.find(c => c.name === skillCategory.category)?.color || '#00d4ff',
          color: categories.find(c => c.name === skillCategory.category)?.color || '#00d4ff',
        }))
      );
      setSkills(flatSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      alert('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const saveSkills = async (updatedSkills) => {
    try {
      setSaving(true);
      const skillsByCategory = {};
      updatedSkills.forEach(skill => {
        if (!skillsByCategory[skill.category]) {
          skillsByCategory[skill.category] = [];
        }
        skillsByCategory[skill.category].push(skill.name);
      });

      const backendFormat = Object.entries(skillsByCategory).map(([category, items]) => ({
        category,
        items,
      }));

      await portfolioAPI.updateSection('skills', backendFormat);
      setSkills(updatedSkills);
      alert('Skills updated successfully!');
    } catch (error) {
      console.error('Error saving skills:', error);
      alert('Failed to save skills: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleIconUpload = async (fileData) => {
    if (!fileData) {
      setUploadedIcon(null);
      setFormData({ ...formData, icon: '' });
      return;
    }

    try {
      const response = await uploadAPI.uploadFile(fileData.file, 'icon');
      setUploadedIcon(response.data);
      setFormData({ ...formData, icon: response.data.url });
    } catch (error) {
      console.error('Error uploading icon:', error);
      alert('Failed to upload icon: ' + error.message);
    }
  };

  const getImageUrl = (iconPath) => {
    if (!iconPath) return null;
    if (iconPath.startsWith('/uploads')) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${iconPath}`;
    }
    return iconPath;
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', icon: '', level: 90, category: 'Frontend', color: '#00d4ff' });
    setUploadedIcon(null);
    setShowModal(true);
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      icon: skill.icon,
      level: skill.level,
      category: skill.category,
      color: skill.color,
    });
    setUploadedIcon(null);
    setShowModal(true);
  };

  const handleAdd = async () => {
    if (saving) return; // Prevent duplicate submissions
    
    try {
      setSaving(true);
      const newSkill = {
        ...formData,
        categoryColor: categories.find(cat => cat.name === formData.category)?.color || '#00d4ff',
      };
      const updatedSkills = [...skills, newSkill];
      await saveSkills(updatedSkills);
      closeModal();
    } catch (error) {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (saving) return; // Prevent duplicate submissions
    
    try {
      setSaving(true);
      const updatedSkills = skills.map(skill => 
        skill._id === editingId ? { 
          ...skill, 
          ...formData,
          categoryColor: categories.find(cat => cat.name === formData.category)?.color || '#00d4ff',
        } : skill
      );
      await saveSkills(updatedSkills);
      closeModal();
    } catch (error) {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (saving) return; // Prevent duplicate operations
    if (confirm('Are you sure you want to delete this skill?')) {
      const updatedSkills = skills.filter(skill => skill._id !== id);
      await saveSkills(updatedSkills);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', icon: '', level: 90, category: 'Frontend', color: '#00d4ff' });
    setUploadedIcon(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-gradient">Skills & Tech Stack</h2>
          <p className="text-sm text-slate-400 mt-1">Manage all your technical skills and technologies in one place</p>
        </div>
        <button onClick={openAddModal} className="btn-primary text-sm" disabled={saving}>
          <HiPlus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingId ? 'Edit Skill' : 'Add New Skill'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Skill Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g., React.js"
            />
          </div>

          <div>
            <FileUpload
              label="Skill Icon"
              accept="image/*"
              value={getImageUrl(formData.icon)}
              onChange={handleIconUpload}
              type="image"
              placeholder="Upload skill icon (PNG, SVG, JPG)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="form-input"
            >
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Proficiency Level: {formData.level}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00d4ff ${formData.level}%, rgba(255,255,255,0.08) ${formData.level}%)`
              }}
            />
          </div>

          {/* Preview */}
          {formData.name && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Preview</label>
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: categories.find(c => c.name === formData.category)?.color || '#00d4ff' }}
                  >
                    {formData.icon ? (
                      <img src={getImageUrl(formData.icon)} alt={formData.name} className="w-6 h-6 object-contain" />
                    ) : (
                      formData.name.slice(0, 2)
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">{formData.name}</h4>
                    <p className="text-xs text-slate-500">{formData.level}% proficiency</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${formData.level}%`,
                      backgroundColor: categories.find(c => c.name === formData.category)?.color || '#00d4ff'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={closeModal} className="btn-outline text-sm" disabled={saving}>
            <HiXMark className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={editingId ? handleUpdate : handleAdd}
            className="btn-primary text-sm"
            disabled={saving || !formData.name.trim()}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <HiCheck className="w-4 h-4" />
                {editingId ? 'Update Skill' : 'Add Skill'}
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* Skills by Category */}
      {categories.map(category => {
        const categorySkills = skills.filter(skill => skill.category === category.name);
        
        if (categorySkills.length === 0) return null;

        return (
          <div key={category.name} className="mb-8">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills.map((skill) => (
                <div key={skill._id} className="glass-card p-4 lg:p-5 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: skill.color || category.color }}
                      >
                        {skill.icon ? (
                          <img src={getImageUrl(skill.icon)} alt={skill.name} className="w-6 h-6 object-contain" />
                        ) : (
                          skill.name.slice(0, 2)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-slate-200 truncate">{skill.name}</h4>
                        <p className="text-xs text-slate-500">{skill.level}% proficiency</p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-[#00d4ff] transition-colors"
                        disabled={saving}
                      >
                        <HiPencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-red-400 transition-colors"
                        disabled={saving}
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${skill.level}%`,
                        backgroundColor: skill.color || category.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
