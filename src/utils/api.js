import axios from 'axios';

// Configure axios to always include credentials
axios.defaults.withCredentials = true;

// Add an interceptor to handle password change required responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && 
        error.response.status === 403 && 
        error.response.data.requirePasswordChange) {
      // Redirect to password change page
      window.location.href = '/change-password';
    }
    return Promise.reject(error);
  }
);
