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




// Obtiene una lista paginada de ResourceSuppliers por recurso


/**
 * Obtiene todos los proveedores activos.
 * @returns {Promise<Object>} Lista de proveedores activos.
 */
getAllActiveSuppliers() {
  return apiClient.get('/api/suppliers/active')
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error obteniendo proveedores activos:", error);
      throw error;
    });
},

/**
 * Obtiene una lista paginada de SupplierResources por recurso.
 * @param {Object} paginationParams - Parámetros de paginación.
 * @param {number} page - Página actual.
 * @param {number} size - Tamaño de la página.
 * @param {string} sort - Campo de ordenación.
 * @param {string} direction - Dirección de la ordenación ('asc' o 'desc').
 */
getPagedResourceSuppliersByResource(paginationParams, page = 0, size = 10, sort = 'id', direction = 'desc') {
  return apiClient.post(`/api/resource-suppliers/paged-by-resource?page=${page}&size=${size}&sort=${sort}&direction=${direction}`, paginationParams)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error obteniendo ResourceSuppliers por recurso:", error);
      throw error;
    });
},

/**
 * Guarda un nuevo ResourceSupplier.
 * @param {Object} resourceSupplierData - Datos del nuevo ResourceSupplier.
 */
saveResourceSupplier(resourceSupplierData) {
  return apiClient.post('/api/resource-suppliers/', resourceSupplierData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error guardando ResourceSupplier:", error);
      throw error;
    });
},

/**
 * Actualiza un ResourceSupplier existente.
 * @param {Object} resourceSupplierData - Datos para actualizar el ResourceSupplier.
 */
updateResourceSupplier(resourceSupplierData) {
  return apiClient.put('/api/resource-suppliers/', resourceSupplierData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error actualizando ResourceSupplier:", error);
      throw error;
    });
  },

/**
 * Obtiene una lista paginada de SupplierResources.
 * @param {number} page - Página actual.
 * @param {number} size - Tamaño de la página.
 */
getPagedSupplierResources(page = 0, size = 10) {
  return apiClient.get(`/api/supplier-resources?page=${page}&size=${size}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error obteniendo SupplierResources:", error);
      throw error;
    });
},

/**
 * Obtiene todos los proveedores.
 */
getAllSuppliers() {
  return apiClient.get('/api/suppliers')
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error obteniendo proveedores:", error);
      throw error;
    });
},

/**
 * Obtiene todos los recursos.
 */
getAllResources() {
  return apiClient.get('/api/resources')
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error obteniendo recursos:", error);
      throw error;
    });
},




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



  // Métodos para la gestión de Recursos

  /**
   * Obtiene una lista paginada de recursos.
   * @param {Object} paginationParams - Parámetros de paginación y filtro.
   * @param {number} page - Número de página.
   * @param {number} size - Tamaño de la página.
   * @param {string} sort - Campo de ordenación.
   * @param {string} direction - Dirección de la ordenación ('asc' o 'desc').
   */
  getPagedResources(paginationParams, page = 0, size = 10, sort = 'id', direction = 'desc') {
    return apiClient.post(`/api/resources/paged?page=${page}&size=${size}&sort=${sort}&direction=${direction}`, paginationParams)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error obteniendo recursos paginados:", error);
        throw error;
      });
  },

  /**
   * Obtiene todos los recursos activos.
   */
  getAllActiveResources() {
    return apiClient.get('/api/resources/list')
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error obteniendo la lista de recursos activos:", error);
        throw error;
      });
  },

  /**
   * Guarda un nuevo recurso.
   * @param {Object} resourceData - Datos del nuevo recurso.
   */
  saveResource(resourceData) {
    return apiClient.post('/api/resources/', resourceData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error guardando recurso:", error);
        throw error;
      });
  },

  /**
   * Actualiza un recurso existente.
   * @param {Object} resourceData - Datos para actualizar el recurso.
   */
  updateResource(resourceData) {
    return apiClient.put('/api/resources/', resourceData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error actualizando recurso:", error);
        throw error;
      });
  },

  /**
   * Cambia el estado de un recurso (activo/inactivo).
   * @param {number} resourceId - ID del recurso para cambiar el estado.
   */
  changeResourceStatus(resourceId) {
    return apiClient.patch('/api/resources/change/status', { id: resourceId })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error cambiando estado del recurso:", error);
        throw error;
      });
  },



  /**
 * Guarda un nuevo proveedor.
 * @param {Object} supplierData - Datos del nuevo proveedor.
 */
  saveSupplier(supplierData) {
    return apiClient
      .post('/api/suppliers/', supplierData)
      .then((response) => {
        console.log("Proveedor registrado exitosamente:", response.data);
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error del servidor al guardar proveedor:", error.response.data);
        } else if (error.request) {
          console.error("No se recibió respuesta del servidor:", error.request);
        } else {
          console.error("Error al configurar la solicitud:", error.message);
        }
        throw error;
      });
  },

  /**
   * Obtiene todos los proveedores activos.
   */
  /**
* Obtiene todas las direcciones.
*/
  getAllAddresses() {
    return apiClient
      .get("/api/suppliers/addresses")
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error obteniendo todas las direcciones:", error);
        throw error;
      });
  },




  /**
   * Obtiene una lista paginada de proveedores.
   * @param {Object} paginationParams - Parámetros de paginación y filtro.
   * @param {number} page - Número de página.
   * @param {number} size - Tamaño de la página.
   * @param {string} sort - Campo de ordenación.
   * @param {string} direction - Dirección de la ordenación ('asc' o 'desc').
   */
  getPagedSuppliers(paginationParams = {}, page = 0, size = 10, sort = "id", direction = "desc") {
    return apiClient
      .post(
        `/api/suppliers/paged?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
        paginationParams // Aquí siempre se envía un objeto válido
      )
      .then((response) => {
        console.log("Respuesta del backend (paginated):", response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error obteniendo proveedores paginados:", error.response?.data || error.message);
        throw error;
      });
  }

  ,

  /**
   * Cambia el estado de un proveedor (activo/inactivo).
   * @param {number} supplierId - ID del proveedor para cambiar el estado.
   */
  changeSupplierStatus(supplierId) {
    return apiClient.patch('/api/suppliers/change/status', { id: supplierId })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error cambiando estado del proveedor:", error);
        throw error;
      });
  },

  /**
 * Actualiza un proveedor existente.
 * @param {Object} supplierData - Datos para actualizar el proveedor.
 */
  updateSupplier(supplierData) {
    return apiClient.put('/api/suppliers/', supplierData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error actualizando proveedor:", error.response?.data || error.message);
        throw error;
      });
  }
  ,

  /**
   * Obtiene los detalles de un proveedor.
   * @param {number} supplierId - ID del proveedor para obtener los detalles.
   */
  getSupplierDetails(supplierId) {
    return apiClient.post('/api/suppliers/details', { id: supplierId })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error obteniendo detalles del proveedor:", error);
        throw error;
      });
  },

  getAddressById(id) {
    return apiClient.get(`/api/addresses/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error al obtener dirección con id ${id}:`, error);
        throw error;
      });
  },

  createAddress(addressData) {
    return apiClient.post(`/api/addresses/`, addressData)
      .then(response => response.data)
      .catch(error => {
        console.error("Error al crear dirección:", error);
        throw error;
      });
  },

  updateAddress(id, addressData) {
    return apiClient.put(`/api/addresses/${id}`, addressData)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error al actualizar dirección con id ${id}:`, error);
        throw error;
      });
  },

  deleteAddress(id) {
    return apiClient.delete(`/api/addresses/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error al eliminar dirección con id ${id}:`, error);
        throw error;
      });
  },

  async getPagedAddresses(searchValue, page = 0, size = 10, sort = "id", direction = "asc") {
    try {
      const response = await apiClient.post(
        `/api/addresses/paged`, // Asegúrate de que este sea el endpoint correcto
        { value: searchValue || "" }, // Cuerpo de la solicitud (DTO)
        {
          params: {
            page, // Página actual
            size, // Tamaño de la página
            sort, // Campo para ordenar
            direction, // Dirección del orden
          },
        }
      );
      return response.data; // Retorna los datos de la respuesta
    } catch (error) {
      console.error("Error al obtener direcciones paginadas:", error);
      throw error;
    }
  },







};




export default apiService;
