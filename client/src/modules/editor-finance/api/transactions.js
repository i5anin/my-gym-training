import { handleApiError } from '@/api/errorHandler'
import axiosInstance from '@/api/axiosConfig'

function handleResponse(response) {
  return response.data
}

export const transactionsApi = {
  updateDatabase: async () =>
    axiosInstance
      .get(`/update-database`)
      .then(handleResponse)
      .catch(handleApiError),

  getTransactionsForMonthAndYear: async (year, month) =>
    axiosInstance
      .get(`/transactions/${year}-${month}/list`)
      .then(handleResponse)
      .catch(handleApiError),

  getDeposits: async () =>
    axiosInstance.get(`/deposits`).then(handleResponse).catch(handleApiError),

  getAvailableYearsAndMonths: async () =>
    axiosInstance
      .get('/years-months')
      .then(handleResponse)
      .catch(handleApiError),

  getIncomeExpenseProfitForMonthAndYear: async (year, month) =>
    axiosInstance
      .get(`/transactions/${year}-${month}/sum`)
      .then(handleResponse)
      .catch(handleApiError),

  getMonthlyIncomeExpenseProfit: async () =>
    axiosInstance
      .get('/transactions/sum')
      .then(handleResponse)
      .catch(handleApiError),

  getTransactionById: async (id) =>
    axiosInstance
      .get(`/transactions/id/${id}`)
      .then(handleResponse)
      .catch(handleApiError),
}
