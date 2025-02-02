<template>
  <div>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Общий доход:</th>
          <th class="text-left">Общий расход:</th>
          <th class="text-left">Чистая прибыль:</th>
        </tr>
      </thead>
      <tbody>
        <!-- Итерируем по элементам в массиве desserts и отображаем каждый элемент в строке таблицы -->
        <tr>
          <td :style="{ color: colorGreen }">{{ formattedIncome }}</td>
          <td :style="{ color: colorRed }">{{ formattedExpense }}</td>
          <td
            :style="{ color: parseFloat(formattedProfit) < 0 ? colorRed : '' }"
          >
            {{ formattedProfit }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import { transactionsApi } from '@/modules/editor-finance/api/transactions'

export default {
  name: 'MonthlySummary',
  data() {
    return {
      colorGreen: '#74e274', // более тусклый зеленый
      colorRed: '#d96c6c', // более тусклый красный
      summary: null,
    }
  },
  props: {
    year: Number,
    month: Number,
  },
  computed: {
    formattedIncome() {
      return this.summary ? this.formatNumber(this.summary.total_income) : ''
    },
    formattedExpense() {
      return this.summary ? this.formatNumber(this.summary.total_expense) : ''
    },
    formattedProfit() {
      return this.summary ? this.formatNumber(this.summary.net_profit) : ''
    },
    incomeStyle() {
      return this.getStyle('#74e274') // Используем функцию для стилей
    },
    expenseStyle() {
      return this.getStyle('#d96c6c') // Используем функцию для стилей
    },
    profitStyle() {
      return this.getStyle(
        this.summary && this.summary.net_profit < 0 ? '#d96c6c' : '#74e274',
        true
      )
    },
  },
  methods: {
    async fetchSummary() {
      try {
        const summary =
          await transactionsApi.getIncomeExpenseProfitForMonthAndYear(
            this.year,
            this.month
          )
        this.summary = summary
      } catch (error) {
        console.error('Ошибка при получении сводки за месяц:', error)
      }
    },
    formatNumber(value) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    },
    getStyle(color, isRightAligned = false) {
      return {
        color: color,
        textAlign: isRightAligned ? 'right' : 'left',
      }
    },
  },
  watch: {
    year() {
      this.fetchSummary()
    },
    month() {
      this.fetchSummary()
    },
  },
  mounted() {
    this.fetchSummary()
  },
}
</script>
