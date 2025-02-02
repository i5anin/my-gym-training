<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="50"
        ></v-progress-circular>
        <v-table v-else hover="true">
          <thead>
            <tr>
              <th class="text-left">Комментарий</th>
              <th class="text-right">Деньги</th>
              <th class="text-left">Процент</th>
              <th class="text-left">Конечная дата</th>
              <th class="text-right">Прибыль</th>
              <th class="text-left">Дней осталось</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deposit in deposits" :key="deposit.id">
              <td>{{ deposit.comment }}</td>
              <td v-if="deposit.money !== 0" class="text-right">
                {{ formatMoney(deposit.money) }} ₽
              </td>
              <td v-else></td>
              <td>
                <v-chip v-if="deposit.bet"> {{ deposit.bet }} % </v-chip>
              </td>
              <td>{{ formatDate(deposit.end_date) }}</td>
              <td class="text-right">
                <v-chip color="green" v-if="deposit.profit"
                  >+ {{ formatMoney(deposit.profit) }} ₽
                </v-chip>
              </td>
              <td>{{ deposit.days_left }}</td>
            </tr>
          </tbody>
        </v-table>
        <v-card class="mt-4" dark>
          <v-card-title class="text-h5">
            Общая сумма: {{ formatMoney(totalMoney) }} ₽
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { transactionsApi } from '../modules/editor-finance/api/transactions'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

export default {
  data() {
    return {
      deposits: [],
      totalMoney: 0,
      loading: false,
    }
  },
  methods: {
    async fetchDeposits() {
      this.loading = true
      try {
        const response = await transactionsApi.getDeposits()
        this.deposits = response.map((row) => ({
          ...row,
          days_left: row.days_left || 0, // Убедитесь, что days_left всегда число
        }))
        this.totalMoney = response[0].total_money // Предполагаем, что total_money одинаков для всех строк
      } catch (error) {
        console.error('Ошибка при загрузке депозитов:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(timestamp) {
      return timestamp
        ? format(parseISO(timestamp), 'd MMM yyyy', { locale: ru })
        : ''
    },
    formatMoney(number) {
      if (number === 0) return ''
      return new Intl.NumberFormat('ru-RU', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(number)
    },
  },
  mounted() {
    this.fetchDeposits()
  },
}
</script>
