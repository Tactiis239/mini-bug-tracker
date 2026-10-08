<script setup>
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <div class="d-flex gap-2">
        <RouterLink
            class="btn btn-outline-light"
            active-class="active"
            to="/tickets"
        >
          Tickets
        </RouterLink>

        <RouterLink
            class="btn btn-outline-light"
            active-class="active"
            to="/gestion-tickets"
        >
          Gestion des tickets
        </RouterLink>
      </div>
    </div>
  </nav>

  <main class="container py-4">
    <RouterView />
  </main>
</template>