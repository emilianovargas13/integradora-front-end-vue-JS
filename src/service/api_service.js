import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Cambia esto si el backend está en otro lugar

// Crear una instancia de Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Agregar un interceptor para las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      // Si hay un token, agregarlo al header de autorización
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Retornar la configuración de la solicitud modificada
  },
  (error) => {
    // Manejo de error al configurar la solicitud
    return Promise.reject(error);
  }
);

// Ahora utilizamos apiClient en lugar de axios directamente
const apiService = {
  /**
   * Inicia sesión con las credenciales proporcionadas.
   * @param {Object} credentials - Credenciales de inicio de sesión (email y password).
   * @returns {Promise<Object>} - Respuesta de la API.
   */
  login(credentials) {
    return apiClient.post(`/api/auth/`, credentials)
      .then((response) => {
        // Devuelve el token y los datos del usuario si el inicio de sesión es exitoso
        return response.data.data;
      })
      .catch((error) => {
        // Manejo de errores
        if (error.response) {
          // Error enviado por el servidor
          throw new Error(error.response.data.message || "Error de autenticación");
        } else {
          // Error en la conexión
          throw new Error("Error de red. Verifica tu conexión.");
        }
      });
  },

  // Otras funciones de apiService que usan apiClient
  async generateResetToken(email) {
    try {
      const response = await apiClient.patch(`/api/users/generate-password-reset-token`, {
        email,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error desconocido" };
    }
  },

  async validateRecoveryCode(email, token) {
    try {
      const response = await apiClient.post(`/api/users/validate-token`, {
        email,
        token,
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error desconocido" };
    }
  },

  async recoverPassword(email, token, newPassword) {
    try {
      const response = await apiClient.patch(`/api/users/recover-password`, {
        email,
        token,
        newPassword,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error desconocido" };
    }
  },
};

export default apiService;
