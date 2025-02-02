<template>
  <v-dialog
    persistent="true"
    :model-value="true"
    v-bind="modalProps"
    :width="widthDefault"
  >
    <template v-slot:activator="{ props }">
      <slot name="default" v-bind="props" />
    </template>

    <!-- Удалено '{ isActive }' из объявления слота -->
    <template v-slot:default>
      <v-card>
        <v-card-title> {{ title }}</v-card-title>
        <v-spacer />
        <slot name="content" />
        <v-spacer />
        <v-card-actions>
          <slot name="action" />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Заголовок попапа',
    },
    modalProps: {
      type: Object,
      default: () => ({}),
    },
    widthDefault: {
      type: String,
      default: '500',
    },
  },
}
</script>
