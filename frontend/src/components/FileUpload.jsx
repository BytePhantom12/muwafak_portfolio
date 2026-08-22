import { useState, useRef, useEffect } from 'react';
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
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  useEffect(() => () => {
    if (preview?.startsWith?.('blob:')) URL.revokeObjectURL(preview);
  }, [preview]);

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
    setSelectedFile(file);
    
    onChange({
      file,
      url,
      name: file.name,
      size: file.size,
      type: file.type
    });
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
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
        <label className="block text-sm font-medium text-[#0F172A]">{label}</label>
      )}
      
      {/* Upload Area */}
      <div
        className={`relative min-h-36 border-2 border-dashed rounded-xl p-4 sm:p-6 transition-all duration-200 ${
          dragActive 
            ? 'border-[#2563EB] bg-[#2563EB]/5'
            : 'border-[#E2E8F0] bg-[#FFFFFF]/40 hover:border-[#2563EB]/50'
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
          aria-label={label || placeholder}
        />
        
        {preview ? (
          <div className="space-y-3">
            {type === 'image' ? (
              <div className="relative z-20 pointer-events-none">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemove}
                  type="button"
                  className="touch-target pointer-events-auto absolute top-2 right-2 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                  aria-label="Remove selected image"
                >
                  <HiTrash className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="relative z-20 flex items-center gap-3 rounded-lg bg-[#FFFFFF] p-3 pointer-events-none">
                <Icon className="w-8 h-8 text-[#2563EB]" />
                <div className="flex-1">
                  <p className="break-all text-sm font-medium text-[#0F172A]">
                    {selectedFile?.name || 'File selected'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedFile?.size ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}
                  </p>
                </div>
                <button
                  onClick={handleRemove}
                  type="button"
                  className="touch-target pointer-events-auto flex items-center justify-center rounded-full text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label="Remove selected document"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-[#64748B] mx-auto mb-3" />
            <p className="text-sm text-[#0F172A] mb-1">{placeholder}</p>
            <p className="text-xs text-[#64748B]">
              {type === 'image' ? 'PNG, JPG, GIF, WebP up to 10MB' : 'PDF, Word, ODT, RTF, TXT up to 10MB'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
