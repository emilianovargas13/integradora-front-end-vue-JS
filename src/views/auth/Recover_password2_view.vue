<template>
  <div class="recover-container">
    <div class="card">
      <h2 class="recover-title">Validar Token</h2>
      <p class="recover-description">Ingresa tu correo y el token para continuar.</p>
      <input
        type="email"
        v-model="email"
        placeholder="Correo electrónico"
        required
        class="input"
      />
      <input
        type="text"
        v-model="token"
        placeholder="Token de verificación"
        required
        class="input"
      />
      <button :disabled="isLoading" @click="onValidateToken" class="button">
        {{ isLoading ? "Validando..." : "Validar Token" }}
      </button>
      <router-link to="/login" class="link">Iniciar sesión</router-link>
      <p v-if="message" :class="{ success: message.success, error: !message.success }">
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
      email: "",
      token: "",
      isLoading: false,
      message: null,
    };
  },
  methods: {
    async onValidateToken() {
      // Validación básica
      if (!this.email || !this.token) {
        this.message = { success: false, text: "Por favor, completa todos los campos." };
        return;
      }

      this.isLoading = true;

      try {
        const response = await apiService.validateRecoveryCode(this.email, this.token);

        // Manejo de la respuesta de la API
        if (response.success && response.data === true) {
          this.message = { success: true, text: "Token validado correctamente." };
          this.$router.push({
            name: "RecoverPasswordP3",
            query: { email: this.email, token: this.token },
          });
        } else if (response.success && response.data === false) {
          this.message = { success: false, text: "Token inválido o expirado." };
        } else {
          this.message = { success: false, text: response.message || "Error desconocido." };
        }
      } catch (error) {
        // Manejo de errores en el proceso
        this.message = { success: false, text: error.message || "Error al validar el token." };
      } finally {
        this.isLoading = false;
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
