import axios from 'axios'

const API_URL = 'http://localhost:3000/finance'

export async function getFinanceEntries() {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error(
      'Ошибка при получении данных:',
      error.response ? error.response.status : error
    )
    throw error
  }
}

export async function addFinanceEntry(entry) {
  try {
    const response = await axios.post(API_URL, entry)
    return response.data
  } catch (error) {
    console.error(
      'Ошибка при добавлении записи:',
      error.response ? error.response.status : error
    )
    throw error
  }
}

export async function updateFinanceEntry(id, entry) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, entry)
    return response.data
  } catch (error) {
    console.error(
      'Ошибка при обновлении записи:',
      error.response ? error.response.status : error
    )
    throw error
  }
}

export async function deleteFinanceEntry(id) {
  try {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(
      'Ошибка при удалении записи:',
      error.response ? error.response.status : error
    )
    throw error
  }
}
