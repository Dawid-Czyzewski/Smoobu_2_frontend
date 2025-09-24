/**
 * Determines the highest role for a user
 * Admin has priority over User
 * @param {Array} roles - Array of user roles
 * @returns {string} - The highest role ('Admin' or 'User')
 */
export function getHighestRole(roles) {
  if (!roles || !Array.isArray(roles)) {
    return 'User';
  }

  // Check if user has ROLE_ADMIN
  if (roles.includes('ROLE_ADMIN')) {
    return 'Admin';
  }

  // Check if user has ROLE_USER (default)
  if (roles.includes('ROLE_USER')) {
    return 'User';
  }

  // Default fallback
  return 'User';
}

/**
 * Checks if user has admin role
 * @param {Array} roles - Array of user roles
 * @returns {boolean} - True if user is admin
 */
export function isAdmin(roles) {
  return getHighestRole(roles) === 'Admin';
}

/**
 * Checks if user has specific role
 * @param {Array} roles - Array of user roles
 * @param {string} role - Role to check for
 * @returns {boolean} - True if user has the role
 */
export function hasRole(roles, role) {
  if (!roles || !Array.isArray(roles)) {
    return false;
  }
  return roles.includes(role);
}
