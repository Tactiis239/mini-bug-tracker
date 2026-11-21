<script setup>
import {TicketCollectionDTO} from "@/DTO/TicketCollectionDTO.js";

defineProps({
  collection: TicketCollectionDTO,
})
</script>

<template>
  <div v-if="collection && collection.tickets.length > 0" class="table-responsive">
    <table class="table table-striped table-hover align-middle">
      <thead class="table-dark">
      <tr>
        <slot name="table-header"></slot>
      </tr>
      </thead>

      <tbody>
      <tr v-for="item in collection.tickets" :key="item.id">
        <slot name="table-body" :item="item"></slot>
      </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="alert alert-info text-center">
    Pas de données
  </div>
</template>