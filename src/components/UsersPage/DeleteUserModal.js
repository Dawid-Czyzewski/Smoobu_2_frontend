import { useTranslation } from "react-i18next";
import { getHighestRole } from "../../utils/roleUtils";

export default function DeleteUserModal({ isOpen, onClose, onConfirm, user, loading }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

      return (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-red-50">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('users.deleteConfirm.title') || 'Delete User'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {t('users.deleteConfirm.message') || 'Are you sure you want to delete this user? This action cannot be undone.'}
          </p>
          
          {user && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold">
                  {`${user.name?.[0] || ''}${user.surname?.[0] || ''}`.toUpperCase()}
                </div>
                <div className="ml-3 text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {`${user.name || ''} ${user.surname || ''}`.trim()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            {t('users.deleteConfirm.cancel') || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('users.deleteConfirm.deleting') || 'Deleting...'}
              </span>
            ) : (
              t('users.deleteConfirm.delete') || 'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
