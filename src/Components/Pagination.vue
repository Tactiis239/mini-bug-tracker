<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(["change"]);
</script>

<template>
  <nav v-if="totalPages > 1" class="d-flex align-items-center gap-2">
    <button
        type="button"
        class="btn btn-outline-dark"
        :disabled="currentPage <= 1"
        @click="emit('change', currentPage - 1)"
    >
      Précédent
    </button>

    <span>Page {{ currentPage }} / {{ totalPages }}</span>

    <button
        type="button"
        class="btn btn-outline-dark"
        :disabled="currentPage >= totalPages"
        @click="emit('change', currentPage + 1)"
    >
      Suivant
    </button>
  </nav>
</template>