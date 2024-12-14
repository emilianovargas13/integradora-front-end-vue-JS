<template>
    <div class="landing-page">
      <!-- Encabezado -->
      <header class="header-section">
        <div class="container">
          <div class="logo">
            <h1>VEvents</h1>
          </div>
          <nav class="nav-menu">
            <a href="#">Inicio</a>
            <a href="#features">Características</a>
            <a href="#testimonials">Testimonios</a>
            <a href="#contact">Contacto</a>
            <a @click.prevent="$router.push('/login')" class="btn btn-primary">Iniciar Sesión</a>
          </nav>
        </div>
      </header>
  
      <!-- Sección Hero -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-text">
            <h1>Bienvenido a <span>VEvents</span></h1>
            <p>La plataforma más innovadora para la gestión de eventos y recursos.</p>
            <a href="/register" class="btn btn-hero">¡Comienza Ahora!</a>
          </div>
        </div>
      </section>
  
      <!-- Características -->
      <section id="features" class="features-section">
        <div class="container">
          <h2 class="section-title">Características Innovadoras</h2>
          <div class="features-grid">
            <div class="feature-card">
              <h3>Gestión de Eventos</h3>
              <p>Organiza, administra y personaliza todos tus eventos en un solo lugar.</p>
            </div>
            <div class="feature-card">
              <h3>Control de Recursos</h3>
              <p>Optimiza la asignación y uso de recursos para garantizar el éxito.</p>
            </div>
            <div class="feature-card">
              <h3>Notificaciones Inteligentes</h3>
              <p>Recibe recordatorios y actualizaciones en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Testimonios -->
      <section id="testimonials" class="testimonials-section">
        <div class="container">
          <h2 class="section-title">Lo Que Dicen Nuestros Usuarios</h2>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <p>"VEvents revolucionó la forma en que organizamos nuestros eventos. ¡Altamente recomendado!"</p>
              <h4>Juan Pérez</h4>
            </div>
            <div class="testimonial-card">
              <p>"Gracias a VEvents, optimizamos el uso de recursos y mejoramos la experiencia de nuestros clientes."</p>
              <h4>Ana López</h4>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Contacto -->
      <section id="contact" class="contact-section">
        <div class="container">
          <h2 class="section-title">Contáctanos</h2>
          <form class="contact-form">
            <input type="text" placeholder="Nombre Completo" required />
            <input type="email" placeholder="Correo Electrónico" required />
            <textarea placeholder="Tu Mensaje" rows="5" required></textarea>
            <button type="submit" class="btn btn-primary">Enviar</button>
          </form>
        </div>
      </section>
  
      <!-- Pie de Página -->
      <footer class="footer-section">
        <div class="container">
          <p>&copy; 2024 VEvents. Todos los derechos reservados.</p>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: "LandingPage",
  };
  </script>
  
  <style scoped>
  /* Estilos generales */
  body {
    margin: 0;
    font-family: "Roboto", sans-serif;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  /* Encabezado */
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    background-color: #003366;
    color: #fff;
  }
  
  .nav-menu a {
    color: #fff;
    margin: 0 10px;
    text-decoration: none;
  }
  
  .nav-menu a.btn {
    background-color: #ff6600;
    padding: 10px 20px;
    border-radius: 5px;
  }
  
  /* Hero */
  .hero-section {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 0;
    background-color: #003366;
    color: #fff;
    text-align: center;
  }
  
  .hero-text h1 {
    font-size: 48px;
    margin-bottom: 20px;
  }
  
  .hero-text .btn-hero {
    background-color: #ff6600;
    padding: 15px 30px;
    border-radius: 5px;
    text-decoration: none;
    color: #fff;
  }
  
  /* Características */
  .features-section {
    padding: 60px 0;
    background-color: #f5f5f5;
  }
  
  .features-grid {
    display: flex;
    gap: 20px;
  }
  
  .feature-card {
    flex: 1;
    text-align: center;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* Testimonios */
  .testimonials-section {
    padding: 60px 0;
    background-color: #003366;
    color: #fff;
  }
  
  .testimonials-grid {
    display: flex;
    gap: 20px;
  }
  
  .testimonial-card {
    flex: 1;
    padding: 20px;
    background: #fff;
    color: #000;
    border-radius: 10px;
    text-align: center;
  }
  
  /* Contacto */
  .contact-section {
    padding: 60px 0;
  }
  
  .contact-form input,
  .contact-form textarea {
    width: 100%;
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .contact-form button {
    background-color: #003366;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
  }
  
  /* Pie de Página */
  .footer-section {
    text-align: center;
    padding: 20px;
    background-color: #003366;
    color: #fff;
  }
  
  .footer-section .social-links a {
    margin: 0 5px;
    color: #fff;
    font-size: 18px;
  }
  </style>
  