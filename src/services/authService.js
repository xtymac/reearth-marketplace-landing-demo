const AUTH_KEY = 'reearth_auth';
const AUTH_EXPIRY_KEY = 'reearth_auth_expiry';

export const authService = {
  login: () => {
    const expiryTime = Date.now() + (2 * 60 * 60 * 1000); // 2 hours
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
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