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

  // Generar un token para restablecer la contraseña
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

  // Validar el token
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

  // Recuperar la contraseña
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

  // Métodos para los Tipos de Recursos
  /**
   * Obtiene todos los tipos de recursos activos.
   */
  getAllResourceTypes() {
    return apiClient.get(`/api/resourceTypes/list`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error obteniendo los tipos de recursos:", error);
        throw error;
      });
  },

  /**
   * Crea un nuevo tipo de recurso.
   * @param {Object} resourceType - Datos del nuevo tipo de recurso.
   */
  saveResourceType(resourceType) {
    return apiClient.post(`/api/resourceTypes/`, resourceType)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error creando tipo de recurso:", error);
        throw error;
      });
  },

  /**
   * Actualiza un tipo de recurso existente.
   * @param {Object} resourceType - Datos para actualizar el tipo de recurso.
   */
  updateResourceType(resourceType) {
    return apiClient.put(`/api/resourceTypes/`, resourceType)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error actualizando tipo de recurso:", error);
        throw error;
      });
  },

  /**
   * Cambia el estado de un tipo de recurso.
   * @param {Object} resourceTypeStatusDto - DTO con el ID para cambiar el estado.
   */
  changeStatusResourceType(resourceTypeStatusDto) {
    return apiClient.patch(`/api/resourceTypes/change/status`, resourceTypeStatusDto)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error cambiando estado del tipo de recurso:", error);
        throw error;
      });
  },

  /**
   * Obtiene una lista paginada de tipos de recursos.
   * @param {Object} paginationParams - Parámetros de paginación y filtro.
   */
  getPagedResourceTypes(paginationParams) {
    return apiClient.post(`/api/resourceTypes/paged`, paginationParams)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error obteniendo tipos de recursos paginados:", error);
        throw error;
      });
  },


  // Método para obtener usuarios con paginación
  getPagedUsers(paginationParams) {
    return apiClient.post(`/api/users/paged`, paginationParams)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error obteniendo usuarios paginados:", error);
        throw error;
      });
  },

  // Cambiar el estado del usuario
  changeUserStatus(userId) {
    return apiClient.patch(`/api/users/change/status`, { id: userId })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error cambiando estado del usuario:", error);
        throw error;
      });
  },

  // Solicitar un restablecimiento de contraseña para el usuario
  resetUserPassword(userId) {
    return apiClient.post(`/api/users/reset-password`, { id: userId })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error reseteando contraseña del usuario:", error);
        throw error;
      });
  },


    /**
   * Método para crear un nuevo administrador.
   * @param {Object} adminData - Datos del nuevo administrador.
   */
    createAdmin(adminData) {
      return apiClient.post(`/api/users/create-admin`, adminData)
        .then((response) => response.data)
        .catch((error) => {
          console.error("Error creando administrador:", error);
          throw error;
        });
    },




};

export default apiService;
