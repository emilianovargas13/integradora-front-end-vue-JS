<template>
    <div class="profile-container">
      <h1>Perfil de Usuario</h1>
      <div class="token-display">
        <h3>Token de Autenticación:</h3>
        <p>{{ authToken }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        authToken: "",
      };
    },
    mounted() {
      // Obtener el token del localStorage cuando se monta la vista
      this.authToken = localStorage.getItem("authToken");
    },
  };
  </script>
  
  <style scoped>
  .profile-container {
    padding: 2rem;
    max-width: 600px;
    margin: 2rem auto;
    background: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .token-display {
    margin-top: 20px;
    background: #ffffff;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    word-wrap: break-word;
  }
  
  .token-display h3 {
    color: #00509e;
    margin-bottom: 10px;
  }
  </style>
  