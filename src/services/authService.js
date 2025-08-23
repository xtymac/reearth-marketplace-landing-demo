const AUTH_KEY = 'reearth_auth';
const AUTH_EXPIRY_KEY = 'reearth_auth_expiry';
const USER_DATA_KEY = 'reearth_user_data';

export const authService = {
  login: (userData = null) => {
    const expiryTime = Date.now() + (2 * 60 * 60 * 1000); // 2 hours
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
    
    // Store user data or use default
    const defaultUser = {
      name: 'Mac Xiang',
      email: 'tianying.x@eukarya.io'
    };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData || defaultUser));
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },

  getUserData: () => {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  getDisplayName: (user) => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  },

  isAuthenticated: () => {
    const auth = localStorage.getItem(AUTH_KEY);
    const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
    
    if (!auth || !expiry) {
      return false;
    }

    const now = Date.now();
    const expiryTime = parseInt(expiry, 10);

    if (now > expiryTime) {
      authService.logout();
      return false;
    }

    return auth === 'true';
  }
};