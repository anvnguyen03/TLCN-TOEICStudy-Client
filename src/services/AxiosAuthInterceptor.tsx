// Axios Interceptor to Add Token to Auth Header

import axios from "axios"

/**
 *  Create an initial 'axios' instance with custom settings
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// Request interceptor to add the Authorization token to each request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration or unauthorized access
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., token expired)
      // store.dispatch(logout())
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

export default apiClient
