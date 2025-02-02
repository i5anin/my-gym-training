<template>
  <Modal :title="popupTitle">
    <template #content>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="ID Транзакции"
              :value="transactionData.transaction_id"
              readonly
            />
            <v-text-field
              label="Дата операции"
              :value="formatDate(transactionData.date_of_operation)"
              readonly
            />
            <v-text-field
              label="Дата платежа"
              :value="formatDate(transactionData.date_of_payment)"
              readonly
            />
            <v-text-field
              label="Статус"
              :value="transactionData.status"
              readonly
            />
            <v-text-field
              label="Сумма операции"
              :value="
                transactionData.operation_amount +
                ' ' +
                transactionData.operation_currency
              "
              readonly
            />
            <v-text-field
              label="Сумма платежа"
              :value="
                transactionData.payment_amount +
                ' ' +
                transactionData.payment_currency
              "
              readonly
            />
            <v-text-field
              label="Категория"
              :value="transactionData.category"
              readonly
            />
            <v-text-field
              label="Описание"
              :value="transactionData.description"
              readonly
            />
            <v-text-field
              label="Комментарий"
              :value="transactionData.my_comment"
              readonly
            />
            <v-text-field
              label="Моя категория"
              :value="transactionData.my_category"
              readonly
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template #action>
      <v-btn color="red darken-1" text @click="onCancel">Закрыть</v-btn>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/shared/Modal.vue'
import { transactionsApi } from '../../api/transactions' // Убедитесь, что путь к API корректен

export default {
  name: 'TransactionDetailsModal',
  components: { Modal },
  props: {
    transactionId: Number,
  },
  data() {
    return {
      transactionData: {},
      popupTitle: 'Детали транзакции',
    }
  },
  created() {
    this.fetchTransactionData()
  },
  methods: {
    async fetchTransactionData() {
      console.log(this.transactionId)

      try {
        this.transactionData = await transactionsApi.getTransactionById(
          this.transactionId
        )
        console.log(this.transactionData)
      } catch (error) {
        console.error('Ошибка при получении данных транзакции:', error)
        // Обработка ошибок
      }
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }
      return new Date(dateString).toLocaleDateString('ru-RU', options)
    },
    onCancel() {
      this.$emit('close')
    },
  },
}
</script>
