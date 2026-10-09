<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { TicketDTO } from "@/DTO/TicketDTO.js";
import TicketForm from "@/Components/TicketForm.vue";

const router = useRouter();

const isSubmitting = ref(false);
const errorMessage = ref("");
const serverErrors = ref({});

const createTicket = async (ticketData) => {
  isSubmitting.value = true;
  errorMessage.value = "";
  serverErrors.value = {};

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
        Accept: "application/ld+json",
      },
      body: JSON.stringify(ticketData),
    });

    // Erreurs de validation renvoyées par l'API : on les affiche sous chaque champ
    if (response.status === 422) {
      const data = await response.json();
      serverErrors.value = Object.fromEntries(
          data.violations.map((v) => [v.propertyPath, v.message])
      );
      return;
    }

    if (!response.ok) {
      throw new Error("Impossible de créer le ticket.");
    }

    const ticket = TicketDTO.fromApi(await response.json());
    await router.push({ name: "ticket-detail", params: { id: ticket.id } });
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <RouterLink :to="{ name: 'tickets' }" class="btn btn-link px-0 mb-3">
    ← Retour à la liste
  </RouterLink>

  <div class="card">
    <div class="card-header">
      <h1 class="h4 mb-0">Nouveau ticket</h1>
    </div>
    <div class="card-body">
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <TicketForm
          :is-submitting="isSubmitting"
          :server-errors="serverErrors"
          @submit="createTicket"
      />
    </div>
  </div>
</template>