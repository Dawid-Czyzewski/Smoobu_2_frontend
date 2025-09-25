import React from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/dateUtils";
import { formatPrice, formatVat } from "../../utils/priceUtils";
import { BASE_URL } from "../../config";
import ActionButton from "../common/ActionButton";

export default function ApartmentCard({ apartment, onEdit, onView, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden">
            {apartment.picture ? (
              <img 
                src={`${BASE_URL}${apartment.picture}`}
                alt={apartment.name}
                className="h-10 w-10 sm:h-12 sm:w-12 object-cover"
              />
            ) : (
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                {apartment.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {apartment.name || t('apartments.notProvided')}
            </div>
            <div className="text-xs text-gray-500">ID: {apartment.id}</div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1 flex-shrink-0 ml-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            apartment.canFaktura 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {apartment.canFaktura ? t('apartments.canInvoice') : t('apartments.cannotInvoice')}
          </span>
          <div className="flex gap-1">
            <ActionButton 
              type="view" 
              size="sm" 
              onClick={() => onView(apartment.id)}
            />
            <ActionButton 
              type="edit" 
              size="sm" 
              onClick={() => onEdit(apartment.id)}
            />
            <ActionButton 
              type="delete" 
              size="sm" 
              onClick={() => onDelete(apartment)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs text-gray-600">
          <span>
            {t('apartments.priceForClean')}: {formatPrice(apartment.priceForClean) || t('apartments.notProvided')}
          </span>
          <span>
            {t('apartments.vat')}: {formatVat(apartment.vat) || t('apartments.notProvided')}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {t('apartments.createdAt')}: {formatDate(apartment.createdAt)}
        </div>
      </div>
    </div>
  );
}
