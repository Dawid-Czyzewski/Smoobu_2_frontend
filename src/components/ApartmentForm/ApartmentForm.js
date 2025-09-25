import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

export default function ApartmentForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  loading = false,
  isEditing = false 
}) {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    priceForClean: initialData.priceForClean || "",
    picture: initialData.picture || "",
    vat: initialData.vat || "",
    canFaktura: initialData.canFaktura || false
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (initialData.name) {
      setFormData({
        name: initialData.name || "",
        priceForClean: initialData.priceForClean || "",
        picture: initialData.picture || "",
        vat: initialData.vat || "",
        canFaktura: initialData.canFaktura || false
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error(t('apartments.form.nameRequired'));
      return false;
    }
    if (!formData.priceForClean || formData.priceForClean <= 0) {
      toast.error(t('apartments.form.priceRequired'));
      return false;
    }
    if (!formData.vat || formData.vat < 0 || formData.vat > 100) {
      toast.error(t('apartments.form.vatRequired'));
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('apartments.name')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder={t('apartments.form.namePlaceholder')}
            required
          />
        </div>

        <div>
          <label htmlFor="priceForClean" className="block text-sm font-medium text-gray-700 mb-2">
            {t('apartments.priceForClean')} *
          </label>
          <input
            type="number"
            id="priceForClean"
            name="priceForClean"
            value={formData.priceForClean}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder={t('apartments.form.pricePlaceholder')}
            required
          />
        </div>
      </div>

      <ImageUpload
        value={formData.picture}
        onChange={(value) => setFormData(prev => ({ ...prev, picture: value }))}
        onFileSelect={setSelectedFile}
        disabled={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="vat" className="block text-sm font-medium text-gray-700 mb-2">
            {t('apartments.vat')} *
          </label>
          <input
            type="number"
            id="vat"
            name="vat"
            value={formData.vat}
            onChange={handleInputChange}
            min="0"
            max="100"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder={t('apartments.form.vatPlaceholder')}
            required
          />
        </div>

        <div className="flex items-center">
          <div className="flex items-center h-5">
            <input
              id="canFaktura"
              name="canFaktura"
              type="checkbox"
              checked={formData.canFaktura}
              onChange={handleInputChange}
              className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="canFaktura" className="font-medium text-gray-700">
              {t('apartments.canFaktura')}
            </label>
            <p className="text-gray-500">
              {t('apartments.form.canFakturaHelp')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEditing ? t('apartments.form.updating') : t('apartments.form.creating')}
            </span>
          ) : (
            isEditing ? t('apartments.form.updateApartment') : t('apartments.form.createApartment')
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('apartments.form.cancel')}
          </button>
        )}
      </div>
    </form>
  );
}
