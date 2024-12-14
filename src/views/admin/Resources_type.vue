<template>
  <Layout>
    <div class="resources-container">
      <div class="header-container">
        <div class="header-left">
          <h1 class="text-center mb-4">Gestión de Tipos de Recursos</h1>
          <p class="text-center">Administra los diferentes tipos de recursos que tienes disponibles en el sistema.</p>
        </div>
      </div>

      <b-button 
        @click="syncWithBackend" 
        variant="info" 
        size="sm" 
        class="mt-3"
        :disabled="!isOnline"
      >
        Sincronizar Pendientes
      </b-button>

      <!-- Barra de navegación para cambiar a Recursos -->
      <div class="nav-tabs-container">
        <b-nav pills>
          <b-nav-item @click="navigateToResources" active class="nav-item-button">
            <font-awesome-icon icon="folder-open" class="mr-2" />
            Navegar a Recursos
          </b-nav-item>
        </b-nav>
      </div>

      <!-- Sección para crear nuevo tipo de recurso -->
      <div class="create-button-container">
        <b-button @click="showCreateResourceDialog" variant="primary" size="lg" class="create-button">
          <font-awesome-icon icon="plus-circle" class="mr-2" />
          Crear Nuevo Tipo de Recurso
        </b-button>
      </div>

      <!-- Tabla de tipos de recursos con paginación -->
      <div class="card-container expanded-table">
        <b-card class="shadow-sm">
          <b-table :items="resourceTypes" :fields="fields" responsive="sm" hover class="resource-table"
            :per-page="perPage" :current-page="currentPage">
            <!-- Ícono -->
            <template #cell(iconName)="data">
              <font-awesome-icon :icon="['fas', data.item.iconName]" />
            </template>

            <!-- Estado Activo/Inactivo -->
            <template #cell(active)="data">
              <b-badge :variant="data.item.active ? 'success' : 'danger'" class="text-dark">
                {{ data.item.active ? 'Activo' : 'Inactivo' }}
              </b-badge>
            </template>

            <!-- Acciones -->
            <template #cell(actions)="data">
              <b-button size="sm" @click="editResourceType(data.item)" variant="warning" class="mr-2 button-spacing">
                <font-awesome-icon :icon="['fas', 'edit']" /> Editar
              </b-button>
              <b-button size="sm" @click="toggleResourceTypeStatus(data.item)"
                :variant="data.item.active ? 'danger' : 'success'" class="button-spacing">
                <font-awesome-icon :icon="['fas', data.item.active ? 'times' : 'check']" />
                {{ data.item.active ? 'Desactivar' : 'Activar' }}
              </b-button>
            </template>
          </b-table>
          <!-- Paginación -->
          <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="center"
            class="mt-3"></b-pagination>
        </b-card>
      </div>

      <!-- Modal para crear/editar tipos de recursos -->
      <b-modal v-model="showModal" title="Registrar Tipo de Recurso">
        <b-form>
          <b-form-group label="Nombre" label-for="resource-name">
            <b-form-input id="resource-name" v-model="newResourceType.name" required></b-form-input>
          </b-form-group>
          <b-form-group label="Descripción" label-for="resource-description">
            <b-form-textarea id="resource-description" v-model="newResourceType.description" required></b-form-textarea>
          </b-form-group>
          <b-form-group label="Ícono" label-for="resource-icon">
            <b-row>
              <b-col v-for="(icon, index) in availableIcons" :key="index" class="icon-selection">
                <b-button size="sm" variant="outline-secondary" @click="selectIcon(icon)">
                  <font-awesome-icon :icon="icon" />
                </b-button>
              </b-col>
            </b-row>
          </b-form-group>
        </b-form>
        <template #modal-footer>
          <b-button @click="saveResourceType" variant="primary">{{ isEditing ? 'Guardar Cambios' : 'Registrar' }}</b-button>
          <b-button @click="closeModal" variant="secondary">Cancelar</b-button>
        </template>
      </b-modal>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";
import PouchDB from "pouchdb-browser";

import apiService from "@/service/api_service";
import { BTable, BModal, BButton, BForm, BFormGroup, BFormInput, BFormTextarea, BRow, BCol, BBadge, BCard, BNav, BNavItem, BPagination } from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const resourceTypeDB = new PouchDB("resource_types");

export default {
  name: "ResourceManagement",
  components: {
    Layout,
    BTable,
    BModal,
    BButton,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BRow,
    BCol,
    BBadge,
    BCard,
    BNav,
    BNavItem,
    BPagination,
    FontAwesomeIcon,
  },
  data() {
    return {
      resourceTypes: [],
      loading: false,
      showModal: false,
      isEditing: false,
      currentPage: 1, // Página actual para la paginación
      perPage: 5, // Registros por página
      totalRows: 0, // Total de registros
      newResourceType: {
        id: null,
        name: "",
        iconName: "",
        description: "",
        active: true,
      },
      fields: [
        { key: "iconName", label: "Ícono" },
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "active", label: "Estado" },
        { key: "actions", label: "Acciones", sortable: false },
      ],
      availableIcons: [
        ['fas', 'user'],
        ['fas', 'archive'],
        ['fas', 'calendar-alt'],
        ['fas', 'chart-bar'],
        ['fas', 'home'],
        ['fas', 'truck'],
        ['fas', 'bell'],
      ],
      isOnline: navigator.onLine, // Agregado: Estado de conexión
    };
  },
  methods: {
    handleOnlineEvent() {
      console.log("Conexión restaurada. Intentando sincronizar...");
      this.isOnline = true; // Actualiza el estado a online
      this.syncWithBackend();
    },
    handleOfflineEvent() {
      console.log("Sin conexión. Trabajando en modo offline.");
      this.isOnline = false; // Actualiza el estado a offline
    },

    async fetchResourceTypes() {
      this.loading = true;
      try {
        const response = await apiService.getPagedResourceTypes();
        this.resourceTypes = response.data.content.map((resource) => ({
          ...resource,
          active: resource.status,
        }));
        this.totalRows = response.data.totalElements;
      } catch (error) {
        console.warn("Error al conectar con el servidor. Cargando datos desde caché local.");
        const allDocs = await resourceTypeDB.allDocs({ include_docs: true });
        this.resourceTypes = allDocs.rows.map((row) => row.doc);
      } finally {
        this.loading = false;
      }
    },
    showCreateResourceDialog() {
      this.isEditing = false;
      this.newResourceType = {
        id: null,
        name: "",
        iconName: "",
        description: "",
        active: true,
      };
      this.showModal = true;
    },
    editResourceType(resourceType) {
      this.isEditing = true;
      this.newResourceType = { ...resourceType };
      this.showModal = true;
    },
    async saveResourceType() {
      try {
        const doc = {
          ...this.newResourceType,
          _id: new Date().toISOString(),
          status: "pending",
        };
        await resourceTypeDB.put(doc);

        // Intentar sincronización inmediata
        await this.syncWithBackend();

        this.fetchResourceTypes();
        this.closeModal();
      } catch (error) {
        console.error("Error al guardar tipo de recurso:", error);
      }
    },

    async syncWithBackend() {
  this.loading = true;
  const errors = [];
  try {
    const allDocs = await resourceTypeDB.allDocs({ include_docs: true });
    const pendingDocs = allDocs.rows.map((row) => row.doc).filter((doc) => doc.status === "pending");

    for (const doc of pendingDocs) {
      try {
        await apiService.saveResourceType({
          name: doc.name,
          iconName: doc.iconName,
          description: doc.description,
          active: doc.active,
        });

        // Una vez guardado en el servidor, eliminar el documento del caché
        await resourceTypeDB.remove(doc._id, doc._rev);

      } catch (error) {
        console.error("Error al sincronizar tipo de recurso:", error);
        errors.push(doc);
      }
    }
    
    if (errors.length > 0) {
      console.warn("Documentos pendientes de sincronización:", errors);
    } else {
      console.log("Sincronización completada. Documentos removidos del caché.");
    }
  } catch (error) {
    console.error("Error durante la sincronización:", error);
  } finally {
    this.loading = false;
  }
},

    async toggleResourceTypeStatus(resourceType) {
      try {
        await apiService.changeStatusResourceType({ id: resourceType.id });
        resourceType.active = !resourceType.active;
      } catch (error) {
        console.error("Error al cambiar el estado del tipo de recurso:", error);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    selectIcon(icon) {
      this.newResourceType.iconName = icon[1];
    },
    navigateToResources() {
      this.$router.push({ name: "Resources" });
    },
  },
  mounted() {
    this.isOnline = navigator.onLine;
    window.addEventListener("online", this.handleOnlineEvent);
    window.addEventListener("offline", this.handleOfflineEvent);
    this.fetchResourceTypes();
  },
  beforeDestroy() {
    window.removeEventListener("online", this.handleOnlineEvent);
    window.removeEventListener("offline", this.handleOfflineEvent);
  },
};
</script>

<style scoped>
.resources-container {
  padding: 2rem;
  text-align: center;
  background-color: #f5f5f5;
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
  max-width: 1200px;
}

.resource-table {
  border-radius: 8px;
}

.icon-selection {
  margin-bottom: 10px;
}

.icon-selection .b-button {
  margin: 5px;
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