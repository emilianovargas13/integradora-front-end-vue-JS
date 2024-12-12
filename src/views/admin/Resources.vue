<template>
  <Layout>
    <div class="resources-container">
      <div class="header-container">
        <div class="header-left">
          <h1 class="text-center mb-4">Gestión de Recursos PruebaJenkins</h1>
          <p class="text-center">Administra los recursos individuales que tienes disponibles en el sistema.</p>
        </div>
      </div>

      <!-- Barra de navegación para cambiar a Tipos de Recursos -->
      <div class="nav-tabs-container">
        <b-nav pills>
          <b-nav-item @click="navigateToResourcesType" active class="nav-item-button">
            <font-awesome-icon icon="folder-open" class="mr-2" />
            Navegar a Tipos de Recursos
          </b-nav-item>
        </b-nav>
      </div>

      <!-- Sección para crear nuevo recurso -->
      <div class="create-button-container">
        <b-button @click="showCreateResourceDialog" variant="primary" size="lg" class="create-button">
          <font-awesome-icon icon="plus-circle" class="mr-2" />
          Crear Nuevo Recurso
        </b-button>
      </div>

      <!-- Tabla de recursos con paginación -->
      <div class="card-container expanded-table">
        <b-card class="shadow-sm">
          <b-table
            :items="resources"
            :fields="fields"
            responsive="sm"
            hover
            class="resource-table"
            :per-page="perPage"
            :current-page="currentPage"
          >
            <!-- Estado Activo/Inactivo -->
            <template #cell(active)="data">
              <b-badge :variant="data.item.status ? 'success' : 'danger'" class="text-dark">
                {{ data.item.status ? 'Activo' : 'Inactivo' }}
              </b-badge>
            </template>

            <!-- Acciones -->
            <template #cell(actions)="data">
              <b-button size="sm" @click="editResource(data.item)" variant="warning" class="mr-2 button-spacing">
                <font-awesome-icon :icon="['fas', 'edit']" /> Editar
              </b-button>
              <b-button size="sm" @click="toggleResourceStatus(data.item.id)"
                :variant="data.item.status ? 'danger' : 'success'" class="button-spacing">
                <font-awesome-icon :icon="['fas', data.item.status ? 'times' : 'check']" />
                {{ data.item.status ? 'Desactivar' : 'Activar' }}
              </b-button>
            </template>
          </b-table>

          <!-- Paginación -->
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="center"
            class="mt-3"
          ></b-pagination>
        </b-card>
      </div>

      <!-- Modal para crear/editar recursos -->
      <b-modal v-model="showModal" title="Registrar Recurso">
        <b-form>
          <b-form-group label="Nombre" label-for="resource-name">
            <b-form-input id="resource-name" v-model="newResource.name" required></b-form-input>
          </b-form-group>
          <b-form-group label="Descripción" label-for="resource-description">
            <b-form-textarea id="resource-description" v-model="newResource.description" required></b-form-textarea>
          </b-form-group>
          <b-form-group label="Tipo de Recurso" label-for="resource-type">
            <b-form-select
              id="resource-type"
              v-model="newResource.resourceTypeId"
              :options="resourceTypeOptions"
              required
            >
              <template v-slot:first>
                <option :value="null" disabled>Selecciona un Tipo de Recurso</option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-form>
        <template #modal-footer>
          <b-button @click="saveResource" variant="primary">{{ isEditing ? 'Guardar Cambios' : 'Registrar' }}</b-button>
          <b-button @click="closeModal" variant="secondary">Cancelar</b-button>
        </template>
      </b-modal>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";
import apiService from "@/service/api_service";
import {
  BTable,
  BModal,
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BFormSelect,
  BNav,
  BNavItem,
  BPagination,
  BCard,
  BBadge,
} from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "Resources-",
  components: {
    Layout,
    BTable,
    BModal,
    BButton,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BFormSelect,
    BNav,
    BNavItem,
    BPagination,
    BCard,
    BBadge,
    FontAwesomeIcon,
  },
  data() {
    return {
      resources: [],
      loading: false,
      showModal: false,
      isEditing: false,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      newResource: {
        id: null,
        name: "",
        description: "",
        resourceTypeId: null,
        status: true,
      },
      fields: [
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "active", label: "Estado" },
        { key: "actions", label: "Acciones", sortable: false },
      ],
      resourceTypeOptions: [], // Opciones para el select de tipos de recursos
    };
  },
  methods: {
    async fetchResources() {
      this.loading = true;
      try {
        const paginationParams = {
          value: "", // Sin filtro por defecto
        };
        const response = await apiService.getPagedResources(
          paginationParams,
          this.currentPage - 1, // Restar 1 porque las páginas son base 0 en el backend
          this.perPage
        );
        if (response.data && response.data.content) {
          this.resources = response.data.content;
          this.totalRows = response.data.totalElements;
        } else {
          console.error("La respuesta del backend no tiene el formato esperado:", response);
        }
      } catch (error) {
        console.error("Error al obtener los recursos:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchResourceTypes() {
      try {
        const response = await apiService.getAllResourceTypes();
        if (Array.isArray(response.data)) {
          this.resourceTypeOptions = response.data.map((type) => ({
            value: type.id,
            text: type.name,
          }));
        } else {
          console.error("La respuesta de los tipos de recursos no tiene el formato esperado:", response);
        }
      } catch (error) {
        console.error("Error al obtener los tipos de recursos:", error);
      }
    },
    showCreateResourceDialog() {
      this.isEditing = false;
      this.newResource = {
        id: null,
        name: "",
        description: "",
        resourceTypeId: null,
        status: true,
      };
      this.showModal = true;
    },
    editResource(resource) {
      this.isEditing = true;
      this.newResource = { ...resource };
      this.showModal = true;
    },
    async saveResource() {
      try {
        if (this.isEditing) {
          await apiService.updateResource(this.newResource);
        } else {
          await apiService.saveResource(this.newResource);
        }
        this.fetchResources();
        this.closeModal();
      } catch (error) {
        console.error("Error al guardar el recurso:", error);
      }
    },
    async toggleResourceStatus(resourceId) {
      try {
        await apiService.changeResourceStatus(resourceId);
        this.fetchResources();
      } catch (error) {
        console.error("Error al cambiar el estado del recurso:", error);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    navigateToResourcesType() {
      this.$router.push({ name: "ResourcesType" });
    },
  },
  watch: {
    currentPage() {
      this.fetchResources();
    },
  },
  mounted() {
    this.fetchResources();
    this.fetchResourceTypes();
  },
};
</script>

<style scoped>
.resources-container {
  padding: 2rem;
  text-align: center;
  background-color: #f5f5f5; /* Fondo claro para una mejor presentación */
}

.header-container {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #003366;
  color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-tabs-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.create-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.card-container {
  margin: 0 auto;
  max-width: 1200px; /* Expandir para más espacio */
}

.resource-table {
  border-radius: 8px;
}

.modal-footer .b-button {
  margin-right: 10px;
}

.button-spacing {
  margin-right: 10px;
}

.text-dark {
  color: #343a40 !important;
}
</style>
