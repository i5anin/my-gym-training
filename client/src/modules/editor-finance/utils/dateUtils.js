import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

// Функция форматирования даты
export const formatDate = (dateString) => {
  if (!dateString) return '—'
  return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru })
}

// Функция определяет "зебру" по дате
export const getRowClass = (dateString, uniqueDates = []) => {
  const dateIndex = uniqueDates.indexOf(formatDate(dateString))
  return dateIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// Проверяем, есть ли в одной дате разные номера тренировок
export const isIncorrectWorkoutNumber = (dateString, workouts = []) => {
  if (!Array.isArray(workouts)) return false // Если workouts не является массивом, возвращаем false

  const formattedDate = formatDate(dateString)
  const workoutsOnDate = workouts.filter(
    (w) => formatDate(w.training_date) === formattedDate
  )
  const uniqueNumbers = new Set(workoutsOnDate.map((w) => w.workout_number))
  return uniqueNumbers.size > 1
}

// Проверка наличия добивок в сете
export const hasExtras = (set) => {
  return Array.isArray(set.extra) && set.extra.length > 0
}
