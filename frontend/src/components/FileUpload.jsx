import { useState, useRef } from 'react';
import { HiCloudArrowUp, HiPhoto, HiDocument, HiTrash } from 'react-icons/hi2';

export default function FileUpload({ 
  label, 
  accept = "image/*", 
  value, 
  onChange, 
  type = "image",
  placeholder = "Click to upload or drag and drop"
}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    if (type === "image" && !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    if (type === "document") {
      const validDocTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text',
        'application/rtf',
        'text/plain',
        'text/rtf'
      ];
      
      if (!validDocTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|odt|rtf|txt)$/i)) {
        alert('Please select a valid document file (PDF, Word, ODT, RTF, or TXT)');
        return;
      }
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      onChange({
        file,
        url,
        base64,
        name: file.name,
        size: file.size,
        type: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'image': return HiPhoto;
      case 'document': return HiDocument;
      default: return HiCloudArrowUp;
    }
  };

  const Icon = getIcon();

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-slate-300">{label}</label>
      )}
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
          dragActive 
            ? 'border-[#00d4ff] bg-[#00d4ff]/5' 
            : 'border-white/20 hover:border-white/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {preview ? (
          <div className="space-y-3">
            {type === 'image' ? (
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <HiTrash className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <Icon className="w-8 h-8 text-[#00d4ff]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    {onChange.name || 'File selected'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {onChange.size ? `${(onChange.size / 1024).toFixed(1)} KB` : ''}
                  </p>
                </div>
                <button
                  onClick={handleRemove}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Icon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-1">{placeholder}</p>
            <p className="text-xs text-slate-500">
              {type === 'image' ? 'PNG, JPG, GIF, SVG up to 10MB' : 'PDF, Word, ODT, RTF, TXT up to 10MB'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}