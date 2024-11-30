<template>
    <Layout>
      <div class="stats-container">
        <h1>Página de Estadísticas</h1>
        <p>Bienvenido a la sección de Estadísticas. Aquí puedes ver las métricas y reportes del sistema.</p>
      </div>
    </Layout>
  </template>
  
  <script>
  import Layout from "@/components/Layout.vue"; // Ruta hacia el archivo Layout.vue
  
  export default {
    name: "StatisticsDashboard",
    components: {
      Layout,
    },
  };
  </script>
  
  <style scoped>
  .stats-container {
    padding: 2rem;
    text-align: center;
  }
  </style>
  