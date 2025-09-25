import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../config';

export default function ImageUpload({ value, onChange, onFileSelect, disabled = false }) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (value) {
      setPreview(`${BASE_URL}${value}`);
    } else {
      setPreview('');
    }
  }, [value]);


  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t('apartments.form.invalidFileType'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('apartments.form.fileTooLarge'));
      return;
    }

    setSelectedFile(file);
    
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    if (onFileSelect) {
      onFileSelect(file);
    }
    
    toast.success(t('apartments.form.imageSelected'));
  };

  const handleRemoveImage = () => {
    setPreview('');
    setSelectedFile(null);
    onChange('');
    if (onFileSelect) {
      onFileSelect(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('apartments.picture')}
        </label>
        
        <div className="flex items-center space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
            id="apartment-image-upload"
          />
          <label
            htmlFor="apartment-image-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('apartments.form.selectImage')}
          </label>
          
          {preview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={disabled}
              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
            >
              {t('apartments.form.removeImage')}
            </button>
          )}
        </div>
        
        <p className="mt-1 text-sm text-gray-500">
          {t('apartments.form.imageHelp')}
        </p>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {t('apartments.form.preview')}:
          </p>
          <div className="relative inline-block">
            <img
              src={preview}
              alt={t('apartments.form.imagePreview')}
              className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none';
                toast.error(t('apartments.form.imageLoadError'));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
