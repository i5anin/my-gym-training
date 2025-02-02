<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Вход в систему</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="login"
                label="Логин"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Пароль"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary" @click.prevent="submit"
                  >Войти</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    login: '',
    password: '',
  }),
  methods: {
    submit() {
      // Здесь должен быть ваш код для проверки данных формы и отправки их на сервер
      // Например, используя axios для отправки запроса на ваш API
      const formData = {
        login: this.login,
        password: this.password,
      }
      console.log(formData) // Замените эту часть на реальный запрос к серверу
      // Пример с axios (не забудьте установить axios через npm и импортировать его):
      // axios.post('/api/login', formData).then(response => {
      //   // Обработка успешного входа
      // }).catch(error => {
      //   // Обработка ошибок входа
      // });
    },
  },
}
</script>
