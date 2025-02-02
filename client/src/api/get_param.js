import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000/api'

export async function getToolParams() {
  try {
    const response = await axios.get(`${BASE_URL}/tools-params`)
    return response.data
  } catch (error) {
    console.error(
      'There has been a problem with fetching tool parameters:',
      error
    )
    return null
  }
}
