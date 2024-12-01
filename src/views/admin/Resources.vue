<template>
  <Layout>
    <div class="resources-container">
      <h1 class="text-center mb-4">Página de Recursos</h1>
      <p class="text-center">Bienvenido a la sección de Recursos. Aquí puedes gestionar los recursos disponibles.</p>

      <div class="d-flex justify-content-between mb-3">
        <h2>Tipos de Recursos</h2>
        <b-button @click="showCreateResourceDialog" variant="primary">Crear Nuevo Tipo de Recurso</b-button>
      </div>

      <b-table :items="resourceTypes" :fields="fields" responsive="sm" hover>
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

      <!-- Modal para crear/editar tipos de recursos -->
      <b-modal v-model="showModal" title="Registrar tipo de recurso">
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
import apiService from "@/service/api_service";
import { BTable, BModal, BButton, BForm, BFormGroup, BFormInput, BFormTextarea, BRow, BCol, BBadge } from "bootstrap-vue";

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
  },
  data() {
    return {
      resourceTypes: [],
      loading: false,
      showModal: false,
      isEditing: false,
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
    };
  },
  methods: {
    async fetchResourceTypes() {
      this.loading = true;
      try {
        const paginationParams = {
          value: "", // Sin filtro por defecto
        };
        const response = await apiService.getPagedResourceTypes(paginationParams);
        this.resourceTypes = response.data.content.map(resource => ({
          ...resource,
          active: resource.status, // Asegurarse de que la propiedad `active` se establezca según el estado en la respuesta
        }));
      } catch (error) {
        console.error("Error al obtener los tipos de recursos:", error);
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
        if (this.isEditing) {
          await apiService.updateResourceType(this.newResourceType);
        } else {
          await apiService.saveResourceType(this.newResourceType);
        }
        this.fetchResourceTypes();
        this.closeModal();
      } catch (error) {
        console.error("Error al guardar tipo de recurso:", error);
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
      this.newResourceType.iconName = icon[1]; // Guardar solo el nombre del ícono
    },
  },
  mounted() {
    this.fetchResourceTypes();
  },
};
</script>

<style scoped>
.resources-container {
  padding: 2rem;
  text-align: center;
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
  margin-right: 10px; /* Espacio entre los botones */
}

.text-dark {
  color: #343a40 !important; /* Asegúrate de que el color del texto sea visible */
}
</style>
