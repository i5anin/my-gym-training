module.exports = {
  apps: [
    {
      name: 'backend.soft.vue.pf-forum',
      script: 'backend/server.js',  // Указывает на ваш файл сервера
      instances: 1,  // Запускает один экземпляр вашего приложения
      autorestart: true,  // Автоматически перезапускает приложение при сбоях
      watch: false,  // Отключает автоматический перезапуск при изменении файлов
      max_memory_restart: '1G',  // Ограничивает использование памяти для перезапуска
      env: {
        NODE_ENV: 'development'  // Устанавливает переменные среды для разработки
      },
      env_production: {
        NODE_ENV: 'production'  // Устанавливает переменные среды для продакшена
      }
    }
  ]
};
