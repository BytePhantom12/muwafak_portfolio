import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiXMark } from 'react-icons/hi2';
import { portfolioAPI } from '../../services/api';
import Modal from '../../components/Modal';
import IconPicker from '../../components/IconPicker';
import SkillIcon from '../../components/SkillIcon';
import { usePortfolioData } from '../../context/usePortfolioData';
import {
  SKILL_CATEGORY_OPTIONS,
  getSkillCategoryConfig,
  groupSkillsByCategory,
  normalizeCategoryName,
  normalizeSkillItem,
  toBackendSkillSections,
} from '../../utils/skillUtils';

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    iconType: 'react',
    icon: 'FaCode',
    level: 90,
    category: 'Frontend',
    color: '#00d4ff',
  });

  const { portfolioData, updateLocalPortfolio } = usePortfolioData();

  const categories = SKILL_CATEGORY_OPTIONS.map((name) => ({
    name,
    ...getSkillCategoryConfig(name),
  }));

  useEffect(() => {
    if (portfolioData?.skillCategories) {
      setLoading(false);
      const flatSkills = (portfolioData.skillCategories || []).flatMap((skillCategory, catIndex) =>
        (skillCategory.skills || skillCategory.items || []).map((item, itemIndex) => ({
          _id: `${catIndex}-${itemIndex}`,
          ...normalizeSkillItem(item, normalizeCategoryName(skillCategory.name || skillCategory.category), skillCategory.color),
          category: normalizeCategoryName(skillCategory.name || skillCategory.category),
        }))
      );
      setSkills(flatSkills);
    }
  }, [portfolioData]);

  const saveSkills = async (updatedSkills) => {
    try {
      setSaving(true);
      const frontendFormat = groupSkillsByCategory(updatedSkills);
      const backendFormat = toBackendSkillSections(updatedSkills);

      await portfolioAPI.updateSection('skills', backendFormat);
      setSkills(updatedSkills);
      try { updateLocalPortfolio({ skillCategories: frontendFormat }); } catch { }
      alert('Skills updated successfully!');
    } catch (error) {
      console.error('Error saving skills:', error);
      alert('Failed to save skills: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', iconType: 'react', icon: 'FaCode', level: 90, category: 'Frontend', color: '#00d4ff' });
    setShowModal(true);
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      iconType: skill.iconType || (skill.icon?.url || typeof skill.icon === 'string' && skill.icon.startsWith('http') ? 'image' : 'react'),
      icon: skill.icon,
      level: skill.level,
      category: skill.category,
      color: skill.color,
    });
    setShowModal(true);
  };

  const handleAdd = async () => {
    if (saving) return; // Prevent duplicate submissions

    try {
      setSaving(true);
      const newSkill = {
        ...formData,
        color: formData.color || categories.find((cat) => cat.name === formData.category)?.color || '#00d4ff',
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
          color: formData.color || categories.find((cat) => cat.name === formData.category)?.color || '#00d4ff',
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
    setFormData({ name: '', iconType: 'react', icon: 'FaCode', level: 90, category: 'Frontend', color: '#00d4ff' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-gradient">Skills & Tech Stack</h2>
          <p className="text-sm text-text-muted mt-1">Manage all your technical skills and technologies in one place</p>
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
            <label className="block text-sm font-medium text-text-primary mb-2">Skill Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g., React.js"
            />
          </div>

          <div>
            <IconPicker
              label="Skill Icon"
              iconType={formData.iconType}
              value={formData.icon}
              onChange={(nextIcon) => setFormData((previous) => ({ ...previous, ...nextIcon }))}
              placeholder="Search icon names like FaReact or SiFastapi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
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
            <label className="block text-sm font-medium text-text-primary mb-2">
              Proficiency Level: {formData.level}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
              className="w-full h-2 bg-border-base/20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #185FA5 ${formData.level}%, rgba(194, 192, 184, 0.2) ${formData.level}%)`
              }}
            />
          </div>

          {/* Preview */}
          {formData.name && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Preview</label>
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: categories.find(c => c.name === formData.category)?.color || '#185FA5' }}
                  >
                    <SkillIcon
                      skill={{
                        name: formData.name,
                        iconType: formData.iconType,
                        icon: formData.icon,
                        color: categories.find((c) => c.name === formData.category)?.color || '#185FA5',
                      }}
                      className="w-6 h-6"
                      imageClassName="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">{formData.name}</h4>
                    <p className="text-xs text-text-muted">{formData.level}% proficiency</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-border-base/25 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${formData.level}%`,
                      backgroundColor: categories.find(c => c.name === formData.category)?.color || '#185FA5'
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
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
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
                        <SkillIcon
                          skill={skill}
                          className="w-6 h-6"
                          imageClassName="w-6 h-6"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-text-primary truncate">{skill.name}</h4>
                        <p className="text-xs text-text-muted">{skill.level}% proficiency</p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-1.5 rounded-lg hover:bg-border-base/30 text-text-muted hover:text-accent transition-colors"
                        disabled={saving}
                      >
                        <HiPencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-1.5 rounded-lg hover:bg-border-base/30 text-text-muted hover:text-red-500 transition-colors"
                        disabled={saving}
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-border-base/25 rounded-full overflow-hidden">
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
