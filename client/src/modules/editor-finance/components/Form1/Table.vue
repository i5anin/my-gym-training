<template>
  <EditToolModal
    v-if="openDialog"
    :is-active="openDialog"
    :transaction="selectedTransaction"
    @close-modal="closeModal"
    :persistent="true"
    :tool-id="selectedTransaction ? selectedTransaction.transaction_id : null"
    @canceled="onClosePopup"
    @changes-saved="onSaveChanges"
  />
  <v-container>
    <v-col cols="12" class="text-right">
      <v-btn @click="updateDatabase" color="primary" :disabled="loading"
        >Обновить данные</v-btn
      >
    </v-col>
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
              <th
                class="text-left"
                v-for="column in columns"
                :key="column.header"
              >
                {{ column.header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(transaction, index) in transactions"
              :key="transaction.transaction_id"
              :class="{ 'alternate-background': alternatedBackgrounds[index] }"
              @click="onEditRow(transaction)"
            >
              <td
                v-for="column in columns"
                :key="column.header"
                :style="column.style ? column.style(transaction) : {}"
              >
                {{ column.value(transaction) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { transactionsApi } from '../../api/transactions'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import EditToolModal from './Modal.vue'

export default {
  components: { EditToolModal },
  data() {
    return {
      columns: [
        {
          header: 'Дата',
          value: (transaction) =>
            this.formatDate(transaction.date_of_operation),
          style: () => ({ color: 'grey' }),
        },
        {
          header: 'Сумма',
          value: (transaction) =>
            this.formatNumber(transaction.operation_amount) +
            ` ${transaction.operation_currency}`,
          style: (transaction) => ({
            color:
              transaction.operation_amount > 0
                ? this.colorGreen
                : this.colorRed,
            textAlign: 'right', // Добавляем выравнивание по правому краю
          }),
        },
        {
          header: 'Мой комментарий',
          value: (transaction) => transaction.my_comment,
        },
        {
          header: 'Моя категория',
          value: (transaction) => transaction.my_category,
        },
        {
          header: 'Комментарий банка',
          value: (transaction) => transaction.description,
        },
        {
          header: 'Категория банка',
          value: (transaction) => transaction.category,
        },
        {
          header: 'Время',
          value: (transaction) =>
            this.formatTime(transaction.date_of_operation),
          style: () => ({ color: 'grey' }),
        },
        {
          header: 'Неделя',
          value: (transaction) =>
            this.formatDayWeek(transaction.date_of_operation),
          style: (transaction) =>
            this.dayOfWeekStyle(transaction.date_of_operation),
        },
      ],
      colorGreen: '#74e274', // более тусклый зеленый
      colorRed: '#d96c6c', // более тусклый красный
      transactions: [],
      selectedTransaction: null,
      openDialog: false,
      isModalActive: false,
      loading: false, // Добавляем состояние загрузки
    }
  },
  props: {
    selectedYear: Number,
    selectedMonth: Number,
  },
  computed: {
    alternatedBackgrounds() {
      return this.transactions.map((transaction, index, array) => {
        if (index === 0) return false
        const prevDate = format(
          parseISO(array[index - 1].date_of_operation),
          'yyyy-MM-dd'
        )
        const currentDate = format(
          parseISO(transaction.date_of_operation),
          'yyyy-MM-dd'
        )
        return prevDate !== currentDate
      })
    },
  },
  methods: {
    async updateDatabase() {
      this.loading = true // Устанавливаем состояние загрузки
      try {
        // Предполагается, что у вас есть endpoint /update-database для обновления данных
        await transactionsApi.updateDatabase()
        // После обновления базы данных, обновите данные в таблице
        await this.fetchTransactions()
      } catch (error) {
        console.error('Ошибка при обновлении базы данных:', error)
      } finally {
        this.loading = false // Сбрасываем состояние загрузки
      }
    },
    formatNumber(number) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(number)
    },
    formatDate(timestamp) {
      return timestamp
        ? format(parseISO(timestamp), 'd MMM', { locale: ru })
        : 'Неверная дата'
    },
    onSaveChanges() {
      this.openDialog = false
      this.$emit('changes-saved')
    },
    onClosePopup() {
      this.openDialog = false
    },
    onCancel() {
      this.$emit('canceled')
    },
    closeModal() {
      this.isModalActive = false
    },
    onEditRow(transaction) {
      this.selectedTransaction = transaction
      this.openDialog = true
    },
    dayOfWeekStyle(timestamp) {
      const dayOfWeek = this.formatDayWeek(timestamp)
      if (dayOfWeek === 'СБ' || dayOfWeek === 'ВС') {
        return { color: this.colorRed }
      }
      return { color: 'white' }
    },
    shouldAlternateBackground(index) {
      return this.alternatedBackgrounds[index]
    },
    formatDayWeek(timestamp) {
      return timestamp
        ? format(parseISO(timestamp), 'EEEEEE', { locale: ru }).toUpperCase()
        : 'Неверная дата'
    },
    formatTime(timestamp) {
      return timestamp ? format(parseISO(timestamp), 'HH:mm') : 'Неверная дата'
    },

    async fetchTransactions() {
      this.loading = true // Устанавливаем состояние загрузки
      try {
        this.transactions =
          await transactionsApi.getTransactionsForMonthAndYear(
            this.selectedYear,
            this.selectedMonth
          )
      } catch (error) {
        console.error('Ошибка при загрузке транзакций:', error)
      } finally {
        this.loading = false // Сбрасываем состояние загрузки
      }
    },
  },
  mounted() {
    if (this.selectedYear && this.selectedMonth) {
      this.fetchTransactions(this.selectedYear, this.selectedMonth)
    }
  },
}
</script>

<style>
.alternateBackground {
  background-color: rgba(255, 255, 255, 0.03);
}
td {
  white-space: nowrap;
}
</style>
