import React from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/dateUtils";
import { formatPrice, formatVat } from "../../utils/priceUtils";
import { BASE_URL } from "../../config";
import ActionButton from "../common/ActionButton";

export default function ApartmentTable({ apartments, onEdit, onView, onDelete, onSort, sortField, sortDirection }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center gap-1">
                  {t('apartments.name')}
                  {sortField === "name" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("priceForClean")}
              >
                <div className="flex items-center gap-1">
                  {t('apartments.priceForClean')}
                  {sortField === "priceForClean" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("vat")}
              >
                <div className="flex items-center gap-1">
                  {t('apartments.vat')}
                  {sortField === "vat" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("canFaktura")}
              >
                <div className="flex items-center gap-1">
                  {t('apartments.canFaktura')}
                  {sortField === "canFaktura" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  {t('apartments.createdAt')}
                  {sortField === "createdAt" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('apartments.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apartments.map((apartment) => (
              <tr key={apartment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {apartment.picture ? (
                        <img 
                          src={`${BASE_URL}${apartment.picture}`}
                          alt={apartment.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
                          {apartment.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {apartment.name || t('apartments.notProvided')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(apartment.priceForClean) || t('apartments.notProvided')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatVat(apartment.vat) || t('apartments.notProvided')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    apartment.canFaktura 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {apartment.canFaktura ? t('apartments.yes') : t('apartments.no')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(apartment.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <ActionButton 
                      type="view" 
                      size="md" 
                      onClick={() => onView(apartment.id)}
                    />
                    <ActionButton 
                      type="edit" 
                      size="md" 
                      onClick={() => onEdit(apartment.id)}
                    />
                    <ActionButton 
                      type="delete" 
                      size="md" 
                      onClick={() => onDelete(apartment)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
