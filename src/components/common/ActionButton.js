import { useTranslation } from "react-i18next";

export default function ActionButton({ 
  type, 
  onClick, 
  disabled = false, 
  size = "md",
  children 
}) {
  const { t } = useTranslation();

  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    
    const sizeStyles = {
      sm: "px-2 py-1 text-xs rounded-md",
      md: "px-3 py-1.5 text-xs rounded-lg"
    };

    const typeStyles = {
      view: "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300",
      edit: "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300",
      delete: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300"
    };

    return `${baseStyles} ${sizeStyles[size]} ${typeStyles[type]}`;
  };

  const getIcon = () => {
    const iconClass = size === "sm" ? "w-3 h-3 mr-1" : "w-3 h-3 mr-1";
    
    const icons = {
      view: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      edit: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      delete: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    };

    return icons[type];
  };

  const getText = () => {
    if (children) return children;
    
    const texts = {
      view: t('users.view'),
      edit: t('users.edit'),
      delete: t('users.delete')
    };

    return texts[type];
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonStyles()}
    >
      {getIcon()}
      {getText()}
    </button>
  );
}
