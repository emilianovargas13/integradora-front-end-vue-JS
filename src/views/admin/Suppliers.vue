<template>
  <Layout>
    <div class="suppliers-container">
      <h1>Página de Proveedores</h1>
      <p>Bienvenido a la sección de Proveedores. Aquí puedes gestionar los proveedores con los que trabajas.</p>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";

export default {
  name: "SupplierManagement",
  components: {
    Layout,
  },
};
</script>

<style scoped>
.suppliers-container {
  padding: 2rem;
  text-align: center;
}
</style>
