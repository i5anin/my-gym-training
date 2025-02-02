<template>
  <v-list-item
    v-if="!item.items"
    :prepend-icon="item.icon"
    :title="item.title"
    @click="navigate"
  />
  <v-list-group v-else :value="item.title">
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        :prepend-icon="item.icon"
        :title="item.title"
        @click="navigate"
      />
    </template>
    <sidebar-menu-item
      v-for="(subItem, subIndex) in item.items"
      :key="subIndex"
      :item="subItem"
    />
  </v-list-group>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  methods: {
    navigate() {
      const { path } = this.item
      if (path == null) return
      this.$router.push({ path })
    },
  },
}
</script>
