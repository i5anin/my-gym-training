// Импорт общего экземпляра Axios и обработчиков ошибок
import axiosInstance from '@/api/axiosConfig'
import { handleApiError, handleResponse } from '@/api/errorHandler'

export const toolApi = {
  // Получить инструменты с фильтрацией и пагинацией
  getTools: async (
    search = '',
    page = 1,
    limit = 10,
    includeNull = false,
    parentId = null,
    onlyInStock = true
  ) => {
    const params = { search, page, limit, includeNull, onlyInStock }
    if (parentId !== null) {
      params.parent_id = parentId
    }

    return axiosInstance
      .get('/tools', { params })
      .then(handleResponse)
      .catch(handleApiError)
  },

  // Получить инструмент по ID
  getToolById: async (id) => {
    return axiosInstance
      .get(`/tool/${id}`)
      .then(handleResponse)
      .catch(handleApiError)
  },
}
