<template>
  <Layout>
    <div class="resources-container">
      <div class="header-container">
        <div class="header-left">
          <h1 class="text-center mb-4">Gestión de Tipos de Recursos</h1>
          <p class="text-center">Administra los diferentes tipos de recursos que tienes disponibles en el sistema.</p>
        </div>
      </div>

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
          <b-table
            :items="resourceTypes"
            :fields="fields"
            responsive="sm"
            hover
            class="resource-table"
            :per-page="perPage"
            :current-page="currentPage"
          >
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
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="center"
            class="mt-3"
          ></b-pagination>
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
import PouchDB from "pouchdb";
import apiService from "@/service/api_service";
import {
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
} from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

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
      db: null,
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
        ["fas", "user"],
        ["fas", "archive"],
        ["fas", "calendar-alt"],
        ["fas", "chart-bar"],
        ["fas", "home"],
        ["fas", "truck"],
        ["fas", "bell"],
      ],
    };
  },
  methods: {
    async initPouchDB() {
      this.db = new PouchDB("resourceTypes");

      // Cargar datos existentes desde el backend al inicializar
      try {
        const response = await apiService.get("/api/resourceTypes/list");
        const existingResources = response.data;

        for (const resource of existingResources) {
          const resourceInDB = await this.db.get(resource.id).catch(() => null);
          if (!resourceInDB) {
            await this.db.put({ _id: resource.id, ...resource, synced: true });
          }
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales del backend:", error);
      }

      // Iniciar sincronización de datos locales y remotos
      this.syncWithBackend();
    },
    async fetchResourceTypes() {
      try {
        const result = await this.db.allDocs({ include_docs: true });
        this.resourceTypes = result.rows.map((row) => row.doc);
        this.totalRows = this.resourceTypes.length;
      } catch (error) {
        console.error("Error al obtener los tipos de recursos:", error);
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
    async saveResourceType() {
      const resourceType = {
        _id: this.isEditing ? this.newResourceType.id : new Date().toISOString(),
        ...this.newResourceType,
        synced: false, // Marcar como no sincronizado
      };
      try {
        await this.db.put(resourceType);
        this.fetchResourceTypes();
        this.closeModal();
        this.syncWithBackend();
      } catch (error) {
        console.error("Error al guardar tipo de recurso:", error);
      }
    },
    async toggleResourceTypeStatus(resourceType) {
      try {
        resourceType.active = !resourceType.active;
        await this.db.put(resourceType);
        this.fetchResourceTypes();
        this.syncWithBackend(); // Intentar sincronizar
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
    async syncWithBackend() {
      try {
        const unsyncedDocs = await this.db.allDocs({ include_docs: true });
        for (const row of unsyncedDocs.rows) {
          const resourceType = row.doc;
          if (!resourceType.synced) {
            // Enviar al backend
            await apiService.saveResourceType(resourceType);
            // Marcar como sincronizado
            resourceType.synced = true;
            await this.db.put(resourceType);
          }
        }
        console.log("Sincronización completada");
      } catch (error) {
        console.error("Error al sincronizar con el backend:", error);
      }
    },
  },
  mounted() {
    this.initPouchDB();
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
