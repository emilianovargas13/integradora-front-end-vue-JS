<template>
    <div class="recover-container">
      <div class="card">
        <h2 class="recover-title">Restablecer Contraseña</h2>
        <input
          type="password"
          v-model="newPassword"
          placeholder="Nueva contraseña"
          required
          class="input"
        />
        <input
          type="password"
          v-model="confirmPassword"
          placeholder="Confirmar contraseña"
          required
          class="input"
        />
        <button :disabled="isLoading" @click="onRecoverPassword" class="button">
          {{ isLoading ? "Restableciendo..." : "Restablecer Contraseña" }}
        </button>
        <router-link to="/login" class="link">Iniciar sesión</router-link>
        <p v-if="message" :class="{'success': message.success, 'error': !message.success}">
          {{ message.text }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import apiService from "@/service/api_service";
  
  export default {
    data() {
      return {
        email: this.$route.query.email || "",
        token: this.$route.query.token || "",
        newPassword: "",
        confirmPassword: "",
        isLoading: false,
        message: null,
      };
    },
    methods: {
      async onRecoverPassword() {
        if (!this.newPassword || !this.confirmPassword) {
          this.message = { success: false, text: "Todos los campos son obligatorios." };
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          this.message = { success: false, text: "Las contraseñas no coinciden." };
          return;
        }
        this.isLoading = true;
        const response = await apiService.recoverPassword(this.email, this.token, this.newPassword);
        this.isLoading = false;
        this.message = { success: response.success, text: response.message };
        if (response.success) {
          this.$router.push("/login");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .recover-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #003366, #00509e);
  }
  
  .card {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    width: 400px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    text-align: center;
    animation: fadeIn 1s ease-in-out;
  }
  
  .logo {
    width: 300px;
    height: auto;
    margin: 0 auto 20px;
    display: block;
  }
  
  .recover-title {
    margin-bottom: 10px;
    font-size: 1.8rem;
    font-weight: bold;
    color: #003366;
  }
  
  .recover-description {
    font-size: 1rem;
    color: #003366;
    margin-bottom: 20px;
  }
  
  .input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .button {
    width: 100%;
    padding: 10px;
    background-color: #00509e;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }
  
  .button:hover {
    background-color: #007bff;
  }
  
  .link {
    margin-top: 10px;
    display: block;
    text-decoration: underline;
    color: #00509e;
  }
  
  .success {
    color: green;
  }
  
  .error {
    color: red;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  