<template>
  <Layout>
    <template v-slot:default>
      <div class="admin-dashboard">
        <header class="dashboard-header">
          <div class="container">
            <h1>Panel de Administrador</h1>
            <nav class="admin-nav">
              <a href="#overview">Resumen</a>
              <a href="#manage-users">Gestión de Usuarios</a>
              <a href="#reports">Reportes</a>
              <a href="#settings">Configuración</a>
            </nav>
          </div>
        </header>

        <section id="overview" class="dashboard-overview">
          <div class="container">
            <h2>Resumen General</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <h3>Usuarios Activos</h3>
                <p>125</p>
              </div>
              <div class="stat-card">
                <h3>Eventos Actuales</h3>
                <p>12</p>
              </div>
              <div class="stat-card">
                <h3>Recursos Disponibles</h3>
                <p>34</p>
              </div>
              <div class="stat-card">
                <h3>Notificaciones Enviadas</h3>
                <p>240</p>
              </div>
            </div>
          </div>
        </section>

        <section id="manage-users" class="dashboard-section">
          <div class="container">
            <h2>Gestión de Usuarios</h2>
            <p>Aquí puedes administrar los usuarios registrados en el sistema.</p>
            <button class="primary-btn">Ver Todos los Usuarios</button>
          </div>
        </section>

        <section id="reports" class="dashboard-section">
          <div class="container">
            <h2>Reportes</h2>
            <p>Accede a reportes detallados sobre la actividad del sistema.</p>
            <button class="primary-btn">Ver Reportes</button>
          </div>
        </section>

        <section id="settings" class="dashboard-section">
          <div class="container">
            <h2>Configuración</h2>
            <p>Configura las opciones del sistema y tus preferencias personales.</p>
            <button class="primary-btn">Ir a Configuración</button>
          </div>
        </section>

        <footer class="dashboard-footer">
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
  name: "ProfileView",
  components: {
    Layout,
  },
};
</script>

<style scoped>
.admin-dashboard {
  font-family: "Roboto", sans-serif;
  color: #333;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  background-color: #003366;
  color: #fff;
  padding: 20px 0;
}

.dashboard-header h1 {
  text-align: center;
  margin: 0;
}

.admin-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.admin-nav a {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
}

.dashboard-overview {
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

.dashboard-section {
  padding: 40px 0;
}

.dashboard-section .container {
  text-align: center;
}

.primary-btn {
  background-color: #003366;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.primary-btn:hover {
  background-color: #00509e;
}

.dashboard-footer {
  text-align: center;
  padding: 20px;
  background-color: #003366;
  color: white;
  margin-top: 40px;
}
</style>
