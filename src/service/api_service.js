import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Cambia esto si el backend está en otro lugar

const apiService = {
  /**
   * Inicia sesión con las credenciales proporcionadas.
   * @param {Object} credentials - Credenciales de inicio de sesión (email y password).
   * @returns {Promise<Object>} - Respuesta de la API.
   */
  login(credentials) {
    return axios.post(`${API_BASE_URL}/api/auth/`, credentials)
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


  async generateResetToken(email) {
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/users/generate-password-reset-token`, {
        email,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error desconocido" };
    }
  },

  async validateRecoveryCode(email, token) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/validate-token`, {
        email,
        token,
      });
      // Devuelve solo el campo `data` que contiene el valor `true` o `false`
      return { success: true, data: response.data.data };
    } catch (error) {
      // Manejo de errores
      return { success: false, message: error.response?.data?.message || "Error desconocido" };
    }
  },

  async recoverPassword(email, token, newPassword) {
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/users/recover-password`, {
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
