<template>
  <v-container>
    <!-- График Рублей: Исторические данные и Цель -->
    <v-row>
      <v-col cols="12">
        <div class="chart-container">
          <LineChart
            v-if="rublesChartData"
            :data="rublesChartData"
            :options="rublesChartOptions"
          />
        </div>
      </v-col>
    </v-row>

    <!-- График USD: Исторические данные и Цель -->
    <v-row>
      <v-col cols="12">
        <div class="chart-container">
          <LineChart
            v-if="usdChartData"
            :data="usdChartData"
            :options="usdChartOptions"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import axios from 'axios'

// Регистрация необходимых компонентов Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  TimeScale
)

export default defineComponent({
  components: { LineChart },
  setup() {
    // Состояния для исторических данных (/api/chart-data)
    const chartData = ref([])

    // Состояния для целевых данных (/api/calculate-time)
    const calculateTimeData = ref(null)

    // Состояния для графиков
    const rublesChartData = ref(null)
    const usdChartData = ref(null)

    // Опции для графика Рублей
    const rublesChartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: { unit: 'month' }, // Можно изменить на 'day' или другой интервал
          title: { display: true, text: 'Дата' },
        },
        y: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Рубли' },
        },
      },
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Рубли - Исторические Данные и Цель',
        },
      },
    }))

    // Опции для графика USD
    const usdChartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: { unit: 'month' }, // Можно изменить на 'day' или другой интервал
          title: { display: true, text: 'Дата' },
        },
        y: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'USD' },
        },
      },
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'USD - Исторические Данные и Цель',
        },
      },
    }))

    // Функция для загрузки данных из /api/chart-data
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          'http://192.168.3.161:4001/api/chart-data'
        )
        chartData.value = response.data.map((item) => ({
          date: new Date(item.date),
          money: parseFloat(item.money),
          usd: parseFloat(item.usd),
          usd_exchange_rate: parseFloat(item.usd_exchange_rate),
        }))
        // После загрузки данных обновляем графики
        updateChartData()
      } catch (error) {
        console.error(
          'Ошибка при загрузке данных для исторических графиков:',
          error
        )
      }
    }

    // Функция для загрузки данных из /api/calculate-time
    const fetchCalculateTimeData = async () => {
      try {
        const response = await axios.get(
          'http://192.168.3.161:4001/api/calculate-time'
        )
        calculateTimeData.value = {
          startDate: new Date(response.data.startDate),
          endDate: new Date(response.data.endDate),
          daysToReachTarget: response.data.daysToReachTarget,
          target: response.data.data[1], // Предполагается, что второй элемент - цель
        }
        // После загрузки целевых данных обновляем графики
        updateChartData()
      } catch (error) {
        console.error('Ошибка при загрузке целевых данных:', error)
      }
    }

    // Обновление данных графиков
    const updateChartData = () => {
      if (chartData.value.length === 0 || !calculateTimeData.value) return

      const sortedHistorical = chartData.value.sort((a, b) => a.date - b.date)
      const target = calculateTimeData.value.target

      // Обновление графика Рублей
      rublesChartData.value = {
        labels: sortedHistorical.map((item) => item.date).concat(target.date),
        datasets: [
          {
            label: 'Рубли - Исторические Данные',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            data: sortedHistorical.map((item) => item.money), // Только исторические данные
            fill: false,
            tension: 0.1,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: 'Цель Рубли',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            data: sortedHistorical.map(() => null).concat(target.money), // Пустые значения + цель
            fill: false,
            tension: 0.1,
            pointRadius: 7,
            pointHoverRadius: 9,
            borderDash: [5, 5], // Пунктирная линия для цели
          },
        ],
      }

      // Обновление графика USD
      usdChartData.value = {
        labels: sortedHistorical.map((item) => item.date).concat(target.date),
        datasets: [
          {
            label: 'USD - Исторические Данные',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            data: sortedHistorical.map((item) => item.usd), // Только исторические данные
            fill: false,
            tension: 0.1,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: 'Цель USD',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            data: sortedHistorical.map(() => null).concat(target.usd), // Пустые значения + цель
            fill: false,
            tension: 0.1,
            pointRadius: 7,
            pointHoverRadius: 9,
            borderDash: [5, 5], // Пунктирная линия для цели
          },
        ],
      }
    }

    // Загрузка данных при монтировании компонента
    onMounted(() => {
      fetchChartData()
      fetchCalculateTimeData()
    })

    return {
      rublesChartData,
      usdChartData,
      rublesChartOptions,
      usdChartOptions,
    }
  },
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 40px; /* Увеличен отступ для лучшего разделения */
}
</style>
