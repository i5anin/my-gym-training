import { handleApiError } from '@/api/errorHandler'
import axiosInstance from '@/api/axiosConfig'

function handleResponse(response) {
  return response.data
}

export const toolEditorApi = {
  // Добавить новый инструмент
  addTool: async (toolData) =>
    axiosInstance
      .post('/tool', toolData)
      .then(handleResponse)
      .catch(handleApiError),

  // Удалить инструмент по ID
  deleteTool: async (id) =>
    axiosInstance
      .delete(`/tool/${id}`)
      .then(handleResponse)
      .catch(handleApiError),

  // Обновить существующий инструмент
  updateTool: async (id, toolData) =>
    axiosInstance
      .put(`/tool/${id}`, toolData)
      .then(handleResponse)
      .catch(handleApiError),
}
