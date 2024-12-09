<template>
  <Layout>
    <template v-slot:default>
      <div class="stats-dashboard">
        <header class="stats-header">
          <div class="container">
            <h1>Estadísticas de Eventos</h1>
            <p>Analiza el rendimiento y las métricas clave de tus eventos en tiempo real.</p>
          </div>
        </header>

        <section class="stats-overview">
          <div class="container">
            <h2>Resumen de Eventos</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <h3>Total de Eventos</h3>
                <p>45</p>
              </div>
              <div class="stat-card">
                <h3>Asistentes Confirmados</h3>
                <p>320</p>
              </div>
              <div class="stat-card">
                <h3>Ingresos Generados</h3>
                <p>$15,000</p>
              </div>
              <div class="stat-card">
                <h3>Eventos Cancelados</h3>
                <p>3</p>
              </div>
            </div>
          </div>
        </section>

        <section class="stats-details">
          <div class="container">
            <h2>Detalles Específicos</h2>
            <div class="details-grid">
              <div class="detail-card">
                <h3>Evento más Popular</h3>
                <p>Conferencia de Tecnología 2024</p>
              </div>
              <div class="detail-card">
                <h3>Mayor Ingreso por Evento</h3>
                <p>Workshop de Innovación: $5,000</p>
              </div>
              <div class="detail-card">
                <h3>Mayor Asistencia</h3>
                <p>200 Asistentes</p>
              </div>
            </div>
          </div>
        </section>

        <footer class="stats-footer">
          <div class="container">
            <p>&copy; 2024 VEvents. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";

export default {
  name: "StatisticsDashboard",
  components: {
    Layout,
  },
};
</script>

<style scoped>
.stats-dashboard {
  font-family: "Roboto", sans-serif;
  color: #333;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.stats-header {
  background-color: #003366;
  color: #fff;
  padding: 20px 0;
  text-align: center;
}

.stats-header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.stats-header p {
  margin-top: 10px;
  font-size: 1.2rem;
}

.stats-overview {
  padding: 40px 0;
  background-color: #fff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: #00509e;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0;
  font-size: 1.2rem;
}

.stat-card p {
  font-size: 2rem;
  margin: 10px 0 0;
}

.stats-details {
  padding: 40px 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.detail-card {
  background-color: #007bff;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.detail-card h3 {
  margin: 0;
  font-size: 1.2rem;
}

.detail-card p {
  font-size: 1.5rem;
  margin: 10px 0 0;
}

.stats-footer {
  text-align: center;
  padding: 20px;
  background-color: #003366;
  color: white;
}
</style>
