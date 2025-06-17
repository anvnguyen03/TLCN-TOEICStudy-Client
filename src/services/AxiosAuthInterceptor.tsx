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

    // For FormData requests, let the browser set the Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration or unauthorized access
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error)
      return Promise.reject(new Error('Request timeout. Please try again.'))
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data)
      
      if (error.response.status === 401) {
        // Handle unauthorized errors (e.g., token expired)
        localStorage.removeItem('token')
        window.location.href = '/login' // Redirect to login page
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request)
      return Promise.reject(new Error('No response from server. Please check your connection.'))
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
