<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
      </div>
      <h2 class="login-title">Bienvenido</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Ingresa tu correo"
            required
            class="input"
          />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-container">
            <input
              :type="isObscure ? 'password' : 'text'"
              id="password"
              v-model="password"
              placeholder="Ingresa tu contraseña"
              required
              class="input"
            />
            <button type="button" class="toggle-password" @click="togglePasswordVisibility">
              <i :class="isObscure ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </button>
          </div>
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? "Iniciando..." : "Iniciar Sesión" }}
        </button>
      </form>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      <button class="forgot-password-button" @click="goToRecoverPassword">
        ¿Ha olvidado la contraseña?
      </button>
    </div>
  </div>
</template>

<script>
import apiService from "@/service/api_service";

export default {
  data() {
    return {
      email: "",
      password: "",
      isObscure: true,
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: { 
    async handleLogin() {
  this.errorMessage = "";
  this.isLoading = true;
  try {
    const credentials = {
      email: this.email,
      password: this.password,
    };
    const data = await apiService.login(credentials);

    // Guardar el token y los datos del usuario
    localStorage.setItem("authToken", data.token);

    // Redirigir a la pantalla de perfil solo si no estás ya en ella
    if (this.$route.path !== "/ProfileView") {
      this.$router.push("/profile-view");
    }
  } catch (error) {
    this.errorMessage = error.message || "Error inesperado al iniciar sesión.";
  } finally {
    this.isLoading = false;
  }
},
    goToRecoverPassword() {
      if (this.$route.path !== "/recover-password-step1") {
        this.$router.push("/recover-password-step1");
      }
    },
    togglePasswordVisibility() {
      this.isObscure = !this.isObscure;
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #003366, #00509e);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 300px;
  height: auto;
  margin: 0 auto;
  display: block;
}

.login-title {
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: bold;
  color: #003366;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #003366;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.password-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.toggle-password i {
  font-size: 1rem;
  color: #00509e;
}

.login-button {
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

.login-button:disabled {
  background-color: #003366;
  cursor: not-allowed;
}

.login-button:hover {
  background-color: #007bff;
}

.forgot-password-button {
  margin-top: 10px;
  background: none;
  border: none;
  color: #00509e;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
}

.forgot-password-button:hover {
  color: #007bff;
}

.error-message {
  color: red;
  margin-top: 10px;
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
