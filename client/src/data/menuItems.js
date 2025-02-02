// menuItems.js
export const originalMenuItems = [
  {
    title: 'Финансы',
    icon: 'mdi-tools',
    access: ['admin', 'hohlov'],
    items: [
      // { title: 'Ремонт оборудования' },
      { title: 'по месяцам', path: '/FinanceSumMonth' },
      { title: 'группировка', path: '/Finance' },
      { title: 'график', path: '/chart' },
      { title: 'deposit', path: '/deposit' },
    ],
  },
]

export const plotsMenuItems = []
