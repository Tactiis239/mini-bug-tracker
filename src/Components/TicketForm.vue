<script setup>
import { computed, reactive } from "vue";

const props = defineProps({
  isSubmitting: { type: Boolean, default: false },
  serverErrors: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["submit"]);

const ticket = reactive({
  title: "",
  description: "",
  priority: "",
});

const priorityOptions = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
];

const errors = computed(() => {
  const result = {};
  const title = ticket.title.trim();
  const description = ticket.description.trim();

  if (title.length < 3 || title.length > 255) {
    result.title = "Le titre doit contenir entre 3 et 255 caractères.";
  }
  if (description.length < 15) {
    result.description = `La description doit contenir au moins 15 caractères (${description.length}/15).`;
  }
  if (!ticket.priority) {
    result.priority = "Veuillez choisir une priorité.";
  }

  return result;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

const errorFor = (field) => props.serverErrors[field] ?? errors.value[field];

const touched = reactive({ title: false, description: false, priority: false });

const showError = (field) => touched[field] && errorFor(field);

const onSubmit = () => {
  Object.keys(touched).forEach((field) => (touched[field] = true));

  if (!isValid.value) {
    return;
  }

  emit("submit", {
    title: ticket.title.trim(),
    description: ticket.description.trim(),
    priority: ticket.priority,
  });
};
</script>

<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="mb-3">
      <label for="title" class="form-label">Titre</label>
      <input
          id="title"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': showError('title') }"
          v-model="ticket.title"
          maxlength="255"
          @blur="touched.title = true"
      >
      <div v-if="showError('title')" class="invalid-feedback">{{ errorFor("title") }}</div>
    </div>

    <div class="mb-3">
      <label for="description" class="form-label">Description</label>
      <textarea
          id="description"
          rows="5"
          class="form-control"
          :class="{ 'is-invalid': showError('description') }"
          v-model="ticket.description"
          @blur="touched.description = true"
      ></textarea>
      <div v-if="showError('description')" class="invalid-feedback">{{ errorFor("description") }}</div>
    </div>

    <div class="mb-4">
      <label for="priority" class="form-label">Priorité</label>
      <select
          id="priority"
          class="form-select"
          :class="{ 'is-invalid': showError('priority') }"
          v-model="ticket.priority"
          @blur="touched.priority = true"
      >
        <option value="" disabled>Sélectionner une priorité</option>
        <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div v-if="showError('priority')" class="invalid-feedback">{{ errorFor("priority") }}</div>
    </div>

    <div class="d-flex gap-2">
      <button type="submit" class="btn btn-dark" :disabled="isSubmitting">
        {{ isSubmitting ? "Création..." : "Créer le ticket" }}
      </button>
      <RouterLink :to="{ name: 'tickets' }" class="btn btn-outline-secondary">
        Annuler
      </RouterLink>
    </div>
  </form>
</template>