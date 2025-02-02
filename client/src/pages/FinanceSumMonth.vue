<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-table hover="true">
          <thead>
            <tr>
              <th class="text-left">Год</th>
              <th class="text-left">Месяц</th>
              <th class="text-right">Доходы</th>
              <th class="text-right">Расходы</th>
              <th class="text-right">Чистая прибыль</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions" :key="transaction.id">
              <td>{{ transaction.year }}</td>
              <td>
                {{ getMonthName(transaction.month) }} ({{ transaction.month }})
              </td>
              <td
                :style="incomeStyle(transaction.totalIncome)"
                class="text-right"
              >
                {{ formatNumber(transaction.totalIncome) }}
              </td>
              <td
                :style="expenseStyle(transaction.totalExpense)"
                class="text-right"
              >
                {{ formatNumber(transaction.totalExpense) }}
              </td>
              <td
                :style="profitStyle(transaction.netProfit)"
                class="text-right"
              >
                {{ formatNumber(transaction.netProfit) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { transactionsApi } from '@/modules/editor-finance/api/transactions'

export default {
  data() {
    return {
      transactions: [],
    }
  },
  async mounted() {
    await this.fetchTransactions()
  },
  methods: {
    async fetchTransactions() {
      try {
        const response = await transactionsApi.getMonthlyIncomeExpenseProfit()
        this.transactions = response.map((item) => ({
          year: item.year,
          month: item.month,
          totalIncome: item.total_income,
          totalExpense: item.total_expense,
          netProfit: item.net_profit,
        }))
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      }
    },
    getMonthName(month) {
      const monthNames = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ]
      return monthNames[month - 1] // Месяцы начинаются с 0 в JavaScript
    },
    formatNumber(value) {
      return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    },
    incomeStyle() {
      return { color: 'green' }
    },
    expenseStyle() {
      return { color: 'red' }
    },
    profitStyle(value) {
      return { color: value >= 0 ? 'white' : 'red' }
    },
  },
}
</script>
