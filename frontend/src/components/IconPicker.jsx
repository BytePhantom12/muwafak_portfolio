import { useMemo, useState } from 'react';
import { HiMagnifyingGlass, HiPhoto, HiCodeBracket } from 'react-icons/hi2';
import { iconEntries } from '../utils/iconMap';
import { isImageUrl } from '../utils/skillUtils';
import { uploadAPI } from '../services/api';
import FileUpload from './FileUpload';
import SkillIcon from './SkillIcon';

const ICON_SEARCH_LIMIT = 120;

const getImageValue = (value) => {
  if (!value) return null;
  if (typeof value === 'string' && isImageUrl(value)) return value;
  if (typeof value === 'object') return value.url || null;
  return null;
};

export default function IconPicker({
  label = 'Icon',
  iconType = 'react',
  value,
  onChange,
  placeholder = 'Search an icon name',
}) {
  const [query, setQuery] = useState('');
  const [uploading, setUploading] = useState(false);

  const selectedType = iconType === 'image' ? 'image' : 'react';
  const selectedImageUrl = getImageValue(value);
  const selectedIconName = typeof value === 'string' ? value : value?.name || value?.icon || '';

  const filteredIcons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const source = iconEntries;

    if (!normalizedQuery) {
      return source.slice(0, ICON_SEARCH_LIMIT);
    }

    return source.filter(([iconName]) => iconName.toLowerCase().includes(normalizedQuery)).slice(0, ICON_SEARCH_LIMIT);
  }, [query]);

  const handleReactIconSelect = (iconName) => {
    onChange({
      iconType: 'react',
      icon: iconName,
    });
  };

  const handleCustomImageUpload = async (fileData) => {
    if (!fileData) {
      onChange({
        iconType: 'image',
        icon: null,
      });
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAPI.uploadFile(fileData.file, 'skill');

      onChange({
        iconType: 'image',
        icon: {
          url: response.data.url,
          publicId: response.data.publicId || response.data.public_id || response.data.filename || null,
          filename: response.data.filename || null,
          cloudinary: true,
        },
      });
    } catch (error) {
      console.error('Error uploading skill image:', error);
      alert(`Failed to upload skill image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-text-primary">{label}</label>}

      <div className="flex items-center gap-2 rounded-xl border border-border-base/20 bg-background/50 p-1">
        <button
          type="button"
          onClick={() => onChange({ iconType: 'react', icon: selectedIconName || 'FaCode' })}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${selectedType === 'react' ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'}`}
        >
          <HiCodeBracket className="h-4 w-4" />
          React Icon
        </button>
        <button
          type="button"
          onClick={() => onChange({ iconType: 'image', icon: selectedImageUrl ? { url: selectedImageUrl, publicId: value?.publicId || value?.public_id || null, filename: value?.filename || null, cloudinary: value?.cloudinary ?? false } : null })}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${selectedType === 'image' ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'}`}
        >
          <HiPhoto className="h-4 w-4" />
          Custom Image
        </button>
      </div>

      {selectedType === 'react' ? (
        <div className="space-y-3 rounded-xl border border-border-base/20 bg-background/40 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-border-base/20 bg-background/60 px-3 py-2">
            <HiMagnifyingGlass className="h-4 w-4 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
            />
          </div>

          <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
            {filteredIcons.map(([iconName, IconComponent]) => {
              const isSelected = selectedIconName === iconName;

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleReactIconSelect(iconName)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${isSelected ? 'border-accent bg-accent/10 text-accent' : 'border-border-base/20 bg-background/50 text-text-muted hover:border-border-base/40 hover:text-text-primary'}`}
                >
                  <IconComponent className="h-4 w-4 shrink-0" />
                  <span className="truncate">{iconName}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-border-base/20 bg-background/40 p-4">
          <FileUpload
            label="Custom Icon Image"
            accept="image/*"
            value={selectedImageUrl}
            onChange={handleCustomImageUpload}
            type="image"
            placeholder={uploading ? 'Uploading image...' : 'Upload a custom skill image'}
          />

          {selectedImageUrl ? (
            <div className="flex items-center gap-3 rounded-xl border border-border-base/20 bg-background/60 p-3">
              <SkillIcon
                skill={{ iconType: 'image', icon: { url: selectedImageUrl }, name: 'Preview' }}
                className="h-10 w-10"
                imageClassName="h-10 w-10"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">{selectedImageUrl}</p>
                <p className="text-xs text-text-muted">Stored in Cloudinary</p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}