// apiUtils.js
export function handleApiError(error) {
  if (error.response) {
    console.error('Ошибка от сервера:', error.response.data)
    console.error('Статус:', error.response.status)
    console.error('Заголовки:', error.response.headers)
  } else if (error.request) {
    console.error('Запрос был сделан, но ответ не получен:', error.request)
  } else {
    console.error('Ошибка при настройке запроса:', error.message)
  }
  console.error('Конфигурация запроса:', error.config)
  throw error
}

export async function handleResponse(response) {
  return response.data
}
