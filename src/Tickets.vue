<script setup>
import {onMounted, ref} from "vue";
import {TicketCollectionDTO} from "@/DTO/TicketCollectionDTO.js";
import {TicketDTO} from "@/DTO/TicketDTO.js";
import TicketTable from "@/Components/TicketTable.vue";

  const tickets = ref(null);

  onMounted(() => {
    tickets.value = null;
    fetch(import.meta.env.VITE_API_URL + "/tickets", {
      method: "GET",
      headers: {
        Accept: "application/ld+json",
      }
    })
        .then(res => res.json())
        .then(data => {
          tickets.value = new TicketCollectionDTO(data, (rawItem) => new TicketDTO(rawItem));
        })
  })
</script>

<template>
  <h1 class="mb-4">Liste des tickets</h1>

  <TicketTable :collection="tickets">
    <template #table-header>
      <th>ID</th>
      <th>Titre</th>
      <th>Description</th>
      <th>Statut</th>
      <th>Priorité</th>
      <th>Date de création</th>
    </template>

    <template #table-body="{ item }">
      <td>{{ item.id }}</td>
      <td>{{ item.title }}</td>
      <td>{{ item.description }}</td>
      <td>{{ item.status }}</td>
      <td>{{ item.priority }}</td>
      <td>{{ item.createdAt }}</td>
    </template>
  </TicketTable>
</template>

<style scoped>

</style>