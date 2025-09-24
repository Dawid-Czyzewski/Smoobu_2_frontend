export default function UserAvatar({ 
  user, 
  size = "md",
  showName = false,
  showRole = false,
  className = ""
}) {
  const getSizeClasses = () => {
    const sizes = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-lg"
    };
    return sizes[size];
  };

  const getInitials = () => {
    const name = user?.name || '';
    const surname = user?.surname || '';
    return `${name[0] || ''}${surname[0] || ''}`.toUpperCase();
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${getSizeClasses()} flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-lg flex-shrink-0`}>
        {getInitials()}
      </div>
      {(showName || showRole) && (
        <div className="flex flex-col min-w-0">
          {showName && (
            <span className="text-sm font-semibold text-white truncate">
              {`${user?.name || ''} ${user?.surname || ''}`.trim()}
            </span>
          )}
          {showRole && (
            <span className="text-xs text-blue-300 font-medium">
              {user?.role || 'User'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
