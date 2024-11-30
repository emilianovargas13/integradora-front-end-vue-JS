<template>
  <Layout>
    <div class="view-admins-container">
      <h1>Página de Administradores</h1>
      <p>Bienvenido a la sección de Administradores. Aquí puedes gestionar las cuentas de los administradores del sistema.</p>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";

export default {
  name: "ViewAdmins",
  components: {
    Layout,
  },
};
</script>

<style scoped>
.view-admins-container {
  padding: 2rem;
  text-align: center;
}
</style>
