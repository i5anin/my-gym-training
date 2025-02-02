// axiosConfig.js
import axios from 'axios'

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000/api'
const axiosInstance = axios.create({ baseURL })

export default axiosInstance
