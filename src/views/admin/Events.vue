<template>
  <Layout>
    <div class="events-container">
      <h1>Página de Eventos</h1>
      <p>Bienvenido a la sección de Eventos. Aquí puedes gestionar todos los eventos relacionados con tu organización.</p>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";

export default {
  name: "EventManagement",
  components: {
    Layout,
  },
};
</script>

<style scoped>
.events-container {
  padding: 2rem;
  text-align: center;
}
</style>
