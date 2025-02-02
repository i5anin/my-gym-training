<template>
  <v-card>
    <v-select
      v-model="yearTab"
      :items="tabsYears"
      item-text="name"
      item-value="name"
      label="Выберите год"
      :key="tabsYears.length"
    />

    <v-card-text>
      <v-tabs v-model="monthTab">
        <v-tab
          v-for="month in monthsYears"
          :key="month.name"
          :value="month.name"
        >
          {{ month.name }}
        </v-tab>
      </v-tabs>
      <MonthlySummary
        :year="parseInt(yearTab, 10)"
        :month="getSelectedMonthIndex(monthTab)"
      />

      <!--      <Chart-->
      <!--        :selectedYear="parseInt(yearTab, 10)"-->
      <!--        :selectedMonth="getSelectedMonthIndex(monthTab)"-->
      <!--      />-->

      <v-window v-model="monthTab">
        <v-window-item
          v-for="month in monthsYears"
          :key="month.name"
          :value="month.name"
        >
          <component
            :is="month.component"
            :type="month.type"
            :selectedYear="parseInt(yearTab, 10)"
            :selectedMonth="getSelectedMonthIndex(monthTab)"
          />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import FinanceTable from '@/modules/editor-finance/components/Form1/Table.vue'
import Chart from '@/modules/editor-finance/components/Form1/Chart.vue'
import MonthlySummary from '@/modules/editor-finance/components/Form1/MonthlySummary.vue'

export default {
  components: { MonthlySummary, Chart },
  data() {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const tabsYears = ['2025', '2024', '2023', '2022', '2021', '2020']
    const months = [
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

    return {
      yearTab: currentYear.toString(),
      monthTab: months[currentMonth - 1],
      tabsYears,
      monthsYears: months.map((month) => ({
        name: month,
        component: FinanceTable,
      })),
    }
  },
  methods: {
    updateHash() {
      const monthIndex = this.getSelectedMonthIndex(this.monthTab)
      window.location.hash = `#${this.yearTab}.${monthIndex}`
    },
    emitUpdateTransactions() {
      const year = parseInt(this.yearTab, 10)
      const monthIndex = this.getSelectedMonthIndex(this.monthTab)
      this.$emit('updateTransactions', year, monthIndex)
    },
    fetchTransactions() {
      this.emitUpdateTransactions()
    },
    handleHashChangeOnLoad() {
      const hash = window.location.hash.slice(1)
      const [year, month] = hash.split('.')
      if (year && month) {
        this.yearTab = year
        this.monthTab = this.monthsYears[parseInt(month, 10) - 1].name
      }
      this.updateHash()
    },
    getSelectedMonthIndex(monthName) {
      return this.monthsYears.findIndex((month) => month.name === monthName) + 1
    },
  },
  watch: {
    yearTab() {
      this.monthTab = this.monthsYears[0].name
      this.updateHash()
    },
    monthTab() {
      this.updateHash()
    },
  },
  mounted() {
    this.handleHashChangeOnLoad()
    // Дополнительно, убедитесь, что yearTab и monthTab являются строками
    this.yearTab = this.yearTab.toString()
    this.monthTab = this.monthTab.toString()
  },
}
</script>
