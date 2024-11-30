<template>
  <Layout>
    <div class="resources-container">
      <h1>Página de Recursos</h1>
      <p>Bienvenido a la sección de Recursos. Aquí puedes gestionar los recursos disponibles.</p>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";

export default {
  name: "ResourceManagement",
  components: {
    Layout,
  },
};
</script>

<style scoped>
.resources-container {
  padding: 2rem;
  text-align: center;
}
</style>
