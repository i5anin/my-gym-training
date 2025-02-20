<template>
  <td>
    <template v-if="set">
      {{ set.weight }}×{{ set.repetitions }}

      <!-- Вывод добивок -->
      <span v-if="hasExtras" class="extra-sets">
        <br />
        <span v-for="(extra, i) in set.extra" :key="i">
          +{{ extra.weight }}×{{ extra.repetitions }}
          <span v-if="i !== set.extra.length - 1">,</span>
        </span>
      </span>
    </template>
  </td>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  set: {
    type: Object,
    required: true,
  },
})

const hasExtras = computed(() => {
  return Array.isArray(props.set.extra) && props.set.extra.length > 0
})
</script>

<style scoped>
.extra-sets {
  color: grey;
  font-size: 0.8rem;
}
</style>
