<template>
  <div class="chart-container">
    <Pie v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js'
import { transactionsApi } from '../../api/transactions'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default defineComponent({
  name: 'CircularChart',
  components: { Pie },
  props: {
    selectedYear: Number,
    selectedMonth: Number,
  },
  setup(props) {
    const data = ref([])

    const loadData = async () => {
      try {
        data.value = await transactionsApi.getChartForMonthAndYear(
          props.selectedYear,
          props.selectedMonth
        )
        console.log(data.value) // Вывод данных для отладки
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      }
    }

    watch(() => [props.selectedYear, props.selectedMonth], loadData, {
      immediate: true,
    })

    const chartData = computed(() => {
      if (!data.value.length) return null

      return {
        labels: data.value.map((item: any) => item.name),
        datasets: [
          {
            label: 'Value',
            backgroundColor: [
              '#f87979',
              '#41B883',
              '#E46651',
              '#00D8FF',
              '#DD1B16',
              '#FFCE56',
            ],
            data: data.value.map((item: any) => item.pl),
          },
        ],
      }
    })

    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'left', // Изменение позиции легенды на левую сторону
        },
        title: {
          display: true,
          text: 'Monthly Data',
        },
      },
    }))

    return { chartData, chartOptions }
  },
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
