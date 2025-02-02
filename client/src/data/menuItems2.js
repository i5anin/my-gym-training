// menuItems.js
export const originalMenuItems = [
  {
    title: 'Главная',
    icon: 'mdi-home',
    path: '/',
    access: ['admin'],
  },
  {
    title: 'Станки',
    icon: 'mdi-expansion-card-variant',
    access: ['admin'],
    items: [
      {
        title: 'Мониторинг',
        icon: 'mdi-monitor-dashboard',
        path: '/cnc_stat',
      },
      {
        title: 'Загрузка станков',
        icon: 'mdi-clock-time-eight-outline',
        path: '/cnc_load',
      },
    ],
  },
  {
    title: 'План',
    icon: 'mdi-format-list-checks',
    path: '/plan',
    access: ['admin'],
  },
  {
    title: 'Статистика',
    icon: 'mdi-chart-bar',
    items: [
      { title: 'Статистика пр-ва', icon: 'mdi-chart-pie' },
      { title: 'Отклонение Т шт', icon: 'mdi-chart-timeline' },
    ],
  },
  {
    title: 'Отчёты',
    icon: 'mdi-file-document-outline',
    access: ['admin', 'hohlov'],
    items: [
      { title: 'Заготовка (за неделю)' },
      { title: 'Слесарка (за неделю)' },
      { title: 'Слесарка (план)' },
      { title: 'ОТК' },
      { title: 'ОТК Выработка' },
      { title: 'Упаковка' },
      { title: 'Приход на склад' },
      { title: 'Отгрузка за неделю' },
      { title: 'Склад готовой продукции' },
      { title: 'Склад остатков' },
      { title: 'Участки' },
    ],
  },
  // ==Участки== items: []
]

export const plotsMenuItems = [
  {
    title: 'Отдел ТО и ПП',
    icon: 'mdi-tools',
    access: ['admin', 'hohlov'],
    items: [
      // { title: 'Ремонт оборудования' },
      { title: 'Финансы по месяцам', path: '/FinanceSumMonth' },
      { title: 'Финансы', path: '/Finance' },
    ],
  },
  { title: 'Участок заготовки', icon: 'mdi-cog', path: '/machining_area' },
  { title: 'Отдел продаж', icon: 'mdi-chart-line' },
  {
    title: 'Слесарный участок',
    icon: 'mdi-hammer',
    items: [{ title: 'План участка' }, { title: 'Комментарии' }],
  },
  {
    title: 'Участок ОТК',
    icon: 'mdi-android-studio',
    access: ['admin', 'hohlov'],
    items: [
      { title: 'Выходной контроль' },
      { title: 'Операционный контроль' },
      { title: 'Принятие брака' },
      { title: 'Статистика брака' },
      { title: 'Отработка' },
      { title: 'Совет по качеству' },
    ],
  },
  { title: 'Участок упаковки', icon: 'mdi-package-variant' },
  {
    title: 'Склад',
    icon: 'mdi-garage',
    items: [
      { title: 'План' },
      { title: 'Приход с упаковки' },
      { title: 'Приход от аутсорса' },
      { title: 'Корректировка остатков' },
    ],
  },
  {
    title: 'Экраны',
    icon: 'mdi-monitor',
    access: ['admin', 'hohlov'],
    items: [
      { title: 'Слесарный участок' },
      { title: 'Участок ОТК' },
      { title: 'Участок упаковки' },
    ],
  },
  {
    title: 'Станки',
    icon: 'mdi-expansion-card-variant',
    access: ['admin', 'hohlov'],
    items: [
      {
        title: 'Токарный участок',
        path: '/*',
      },
      {
        title: 'Фрезерный участок',
        path: '/*',
      },
    ],
  },
]
