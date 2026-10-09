<script setup>
import { onMounted, ref } from "vue";
import { TicketCollectionDTO } from "@/DTO/TicketCollectionDTO.js";
import TicketTable from "@/Components/TicketTable.vue";
import Pagination from "@/Components/Pagination.vue";

const tickets = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const errorMessage = ref("");

const loadTickets = async () => {
  tickets.value = null;

  const params = new URLSearchParams({ page: currentPage.value });

  const response = await fetch(
      `${import.meta.env.VITE_API_URL}/tickets?${params}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/ld+json",
        },
      }
  );

  if (!response.ok) {
    throw new Error("Impossible de charger les tickets.");
  }

  const data = await response.json();
  tickets.value = TicketCollectionDTO.fromApi(data);
  totalPages.value = tickets.value.lastPage;
};

const goToPage = async (page) => {
  currentPage.value = page;
  errorMessage.value = "";

  try {
    await loadTickets();
  } catch (error) {
    errorMessage.value = error.message;
  }
};

onMounted(async () => {
  try {
    await loadTickets();
  } catch (error) {
    errorMessage.value = error.message;
  }
});

const deleteTicket = async (ticketId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/${ticketId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/ld+json",
      },
    });

    if (!response.ok) {
      throw new Error("Impossible de supprimer le ticket.");
    }

    await loadTickets();

    // Si on vient de supprimer le dernier ticket de la dernière page
    if (tickets.value.tickets.length === 0 && currentPage.value > 1) {
      await goToPage(currentPage.value - 1);
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="mb-0">Liste des tickets</h1>
  </div>

  <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

  <div class="d-flex justify-content-between align-items-center mb-3">
    <span class="text-muted">
      {{ tickets?.totalItems ?? 0 }} ticket(s)
    </span>
    <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change="goToPage"
    />
  </div>

  <TicketTable :collection="tickets">
    <template #table-header>
      <th>ID</th>
      <th>Titre</th>
      <th>Description</th>
      <th>Statut</th>
      <th>Priorité</th>
      <th>Date de création</th>
      <th class="text-end">Actions</th>
    </template>

    <template #table-body="{ item }">
      <td>{{ item.id }}</td>
      <td>{{ item.title }}</td>
      <td>{{ item.description }}</td>
      <td>{{ item.status }}</td>
      <td>{{ item.priority }}</td>
      <td>{{ item.createdAt }}</td>
      <td class="text-end">
        <div class="d-inline-flex gap-2">
          <RouterLink
              :to="{ name: 'ticket-detail', params: { id: item.id } }"
              class="btn btn-outline-dark btn-sm"
              title="Modifier le ticket"
          >
            Modifier
          </RouterLink>
          <button
              type="button"
              class="btn btn-outline-danger btn-sm"
              title="Supprimer le ticket"
              aria-label="Supprimer le ticket"
              @click="deleteTicket(item.id)"
          >
            <span>Supprimer</span>
          </button>
        </div>
      </td>
    </template>
  </TicketTable>

</template>

<style scoped>

</style>