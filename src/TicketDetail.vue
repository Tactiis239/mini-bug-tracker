<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { TicketDTO } from "@/DTO/TicketDTO.js";

const props = defineProps({
  id: { type: String, required: true },
});

const router = useRouter();

const ticket = ref(null);
const status = ref("");
const priority = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const isSaving = ref(false);

const statusOptions = [
  { value: "open", label: "Ouvert" },
  { value: "in_progress", label: "En cours" },
  { value: "resolved", label: "Résolu" },
];

const priorityOptions = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
];

const loadTicket = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/${props.id}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/ld+json",
    },
  });

  if (response.status === 404) {
    throw new Error("Ce ticket n'existe pas.");
  }

  if (!response.ok) {
    throw new Error("Impossible de charger le ticket.");
  }

  ticket.value = TicketDTO.fromApi(await response.json());
  status.value = ticket.value.status;
  priority.value = ticket.value.priority;
};

onMounted(async () => {
  try {
    await loadTicket();
  } catch (error) {
    errorMessage.value = error.message;
  }
});

const updateTicket = async () => {
  isSaving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/${props.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
        Accept: "application/ld+json",
      },
      body: JSON.stringify({
        status: status.value,
        priority: priority.value,
      }),
    });

    if (response.status === 422) {
      const data = await response.json();
      throw new Error(data.violations.map((v) => v.message).join(" "));
    }

    if (!response.ok) {
      throw new Error("Impossible de modifier le ticket.");
    }

    ticket.value = TicketDTO.fromApi(await response.json());
    successMessage.value = "Ticket modifié avec succès.";
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSaving.value = false;
  }
};

const deleteTicket = async () => {
  if (!confirm("Supprimer ce ticket ?")) {
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/${props.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/ld+json",
      },
    });

    if (response.status !== 204) {
      throw new Error("Impossible de supprimer le ticket.");
    }

    await router.push({ name: "tickets" });
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <RouterLink :to="{ name: 'tickets' }" class="btn btn-link px-0 mb-3">
    ← Retour à la liste
  </RouterLink>

  <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

  <div v-if="ticket" class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h1 class="h4 mb-0">#{{ ticket.id }} — {{ ticket.title }}</h1>
      <small class="text-muted">
        Créé le {{ new Date(ticket.createdAt).toLocaleString("fr-FR") }}
      </small>
    </div>

    <div class="card-body">
      <p class="mb-4">{{ ticket.description }}</p>

      <form @submit.prevent="updateTicket" class="row g-3 align-items-end">
        <div class="col-md-4">
          <label for="status" class="form-label">Statut</label>
          <select id="status" class="form-select" v-model="status">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="col-md-4">
          <label for="priority" class="form-label">Priorité</label>
          <select id="priority" class="form-select" v-model="priority">
            <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="col-md-4 d-flex gap-2">
          <button type="submit" class="btn btn-dark" :disabled="isSaving">
            {{ isSaving ? "Enregistrement..." : "Enregistrer" }}
          </button>
          <button type="button" class="btn btn-outline-danger" @click="deleteTicket">
            Supprimer
          </button>
        </div>
      </form>
    </div>
  </div>

  <div v-else-if="!errorMessage" class="text-center py-5">
    <div class="spinner-border" role="status"></div>
  </div>
</template>