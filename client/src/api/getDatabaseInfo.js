import axiosInstance from '@/api/axiosConfig'
import { handleApiError, handleResponse } from '@/api/errorHandler'

export async function getDatabaseInfo() {
  return axiosInstance
    .get('/database-info')
    .then(handleResponse)
    .catch(handleApiError)
}
