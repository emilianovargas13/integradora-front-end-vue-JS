<template>
  <Layout>
    <div class="landing-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Bienvenido a NeuroRehab Solutions</h1>
          <p>Innovación y tecnología al servicio de tu neurorehabilitación.</p>
          <b-button variant="primary" size="lg" class="cta-button">Explorar Servicios</b-button>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <h2 class="section-title">¿Por qué elegirnos?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <font-awesome-icon icon="brain" class="feature-icon" />
            <h3>Neurorehabilitación Avanzada</h3>
            <p>Contamos con tecnología de punta para mejorar tu calidad de vida.</p>
          </div>
          <div class="feature-card">
            <font-awesome-icon icon="user-md" class="feature-icon" />
            <h3>Especialistas Certificados</h3>
            <p>Un equipo altamente capacitado y dedicado a tu recuperación.</p>
          </div>
          <div class="feature-card">
            <font-awesome-icon icon="calendar-check" class="feature-icon" />
            <h3>Gestión de Citas Fácil</h3>
            <p>Programa y gestiona tus citas desde cualquier dispositivo.</p>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials">
        <h2 class="section-title">Testimonios</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <p>"Gracias a NeuroRehab Solutions, mi recuperación fue más rápida de lo que esperaba."</p>
            <h4>- Juan Pérez</h4>
          </div>
          <div class="testimonial-card">
            <p>"El equipo es increíble, realmente se preocupan por tu bienestar."</p>
            <h4>- Ana López</h4>
          </div>
          <div class="testimonial-card">
            <p>"La tecnología y la atención personalizada marcaron la diferencia en mi vida."</p>
            <h4>- Carlos Martínez</h4>
          </div>
        </div>
      </section>

      <!-- Call-to-Action Section -->
      <section class="cta">
        <h2>¿Listo para transformar tu vida?</h2>
        <p>Regístrate hoy mismo y empieza tu camino hacia una mejor salud.</p>
        <b-button variant="success" size="lg" class="cta-button">Regístrate Ahora</b-button>
      </section>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";
import { BButton } from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "LandingPage",
  components: {
    Layout,
    BButton,
    FontAwesomeIcon,
  },
};
</script>

<style scoped>
.landing-container {
  font-family: 'Arial', sans-serif;
  text-align: center;
  line-height: 1.6;
}

.hero {
  background-image: url("https://via.placeholder.com/1920x600");
  background-size: cover;
  background-position: center;
  color: white;
  padding: 3rem 2rem;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.features {
  padding: 3rem 2rem;
  background-color: #f9f9f9;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.feature-icon {
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 1rem;
}

.testimonials {
  padding: 3rem 2rem;
  background-color: #003366;
  color: white;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.testimonial-card {
  background: white;
  color: #003366;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-style: italic;
}

.cta {
  padding: 3rem 2rem;
  background-color: #28a745;
  color: white;
}

.cta h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-button {
  margin-top: 1rem;
}
</style>
