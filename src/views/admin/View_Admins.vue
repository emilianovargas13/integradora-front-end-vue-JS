<template>
  <Layout>
    <div class="admins-container">
      <h1 class="text-center mb-4">Administradores</h1>
      <p class="text-center">Aquí puedes ver, crear, cambiar el estado y restablecer la contraseña de los administradores.</p>

      <div class="d-flex justify-content-between mb-3">
        <h2>Lista de Administradores</h2>
        <b-button @click="showCreateAdminDialog" variant="primary">Crear Nuevo Administrador</b-button>
      </div>

      <b-table :items="admins" :fields="fields" responsive="sm" hover>
        <!-- Estado Activo/Inactivo -->
        <template #cell(active)="data">
          <b-badge :variant="data.item.status ? 'success' : 'danger'" class="text-dark">
            {{ data.item.status ? 'Activo' : 'Inactivo' }}
          </b-badge>
        </template>

        <!-- Acciones -->
        <template #cell(actions)="data">
          <b-button size="sm" @click="changeStatus(data.item.id)" :variant="data.item.status ? 'danger' : 'success'" class="button-spacing">
            <font-awesome-icon :icon="['fas', data.item.status ? 'times' : 'check']" />
            {{ data.item.status ? 'Desactivar' : 'Activar' }}
          </b-button>
          <b-button size="sm" @click="resetPassword(data.item.id)" variant="warning" class="button-spacing">
            <font-awesome-icon :icon="['fas', 'redo']" /> Resetear Contraseña
          </b-button>
        </template>
      </b-table>

      <!-- Paginación -->
      <b-pagination
        v-if="totalPages > 1"
        v-model="currentPage"
        :total-rows="totalItems"
        :per-page="pageSize"
        @change="fetchAdmins"
        align="center"
      ></b-pagination>

      <!-- Modal para crear administrador -->
      <b-modal v-model="showModal" title="Crear Administrador">
        <b-form>
          <b-form-group label="Nombre" label-for="admin-name">
            <b-form-input id="admin-name" v-model="newAdmin.name" required></b-form-input>
          </b-form-group>
          <b-form-group label="Apellido" label-for="admin-lastname">
            <b-form-input id="admin-lastname" v-model="newAdmin.lastname" required></b-form-input>
          </b-form-group>
          <b-form-group label="Correo" label-for="admin-email">
            <b-form-input type="email" id="admin-email" v-model="newAdmin.email" required></b-form-input>
          </b-form-group>
          <b-form-group label="Lada" label-for="admin-lada">
            <b-form-input type="number" id="admin-lada" v-model="newAdmin.lada" required></b-form-input>
          </b-form-group>
          <b-form-group label="Teléfono" label-for="admin-phone">
            <b-form-input type="number" id="admin-phone" v-model="newAdmin.phone" required></b-form-input>
          </b-form-group>
          <b-form-group label="Contraseña" label-for="admin-password">
            <b-form-input type="password" id="admin-password" v-model="newAdmin.password" required></b-form-input>
          </b-form-group>
        </b-form>
        <template #modal-footer>
          <b-button @click="saveAdmin" variant="primary">Crear Administrador</b-button>
          <b-button @click="closeModal" variant="secondary">Cancelar</b-button>
        </template>
      </b-modal>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";
import apiService from "@/service/api_service";
import { BTable, BButton, BBadge, BPagination, BModal, BForm, BFormGroup, BFormInput } from "bootstrap-vue";

export default {
  name: "AdminManagement",
  components: {
    Layout,
    BTable,
    BButton,
    BBadge,
    BPagination,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
  },
  data() {
    return {
      admins: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      showModal: false,
      newAdmin: {
        name: "",
        lastname: "",
        email: "",
        lada: "",
        phone: "",
        password: "",
      },
      fields: [
        { key: "name", label: "Nombre" },
        { key: "email", label: "Correo" },
        { key: "lada", label: "Lada" },
        { key: "phone", label: "Teléfono" },
        { key: "active", label: "Estado" },
        { key: "actions", label: "Acciones", sortable: false },
      ],
    };
  },
  methods: {
    async fetchAdmins() {
      this.loading = true;
      try {
        const paginationParams = {
          searchValue: "", // Aquí puedes agregar algún filtro de búsqueda
          page: this.currentPage - 1,
          size: this.pageSize,
        };
        const response = await apiService.getPagedUsers(paginationParams);
        const data = response.data;
        this.admins = data.content.map(admin => ({
          ...admin,
          status: admin.status,
        }));
        this.totalItems = data.totalElements;
        this.totalPages = data.totalPages;
      } catch (error) {
        console.error("Error al obtener los administradores:", error);
      } finally {
        this.loading = false;
      }
    },
    async changeStatus(userId) {
      try {
        await apiService.changeUserStatus(userId);
        this.fetchAdmins(); // Refrescar la lista de administradores
      } catch (error) {
        console.error("Error cambiando el estado del usuario:", error);
      }
    },
    async resetPassword(userId) {
      try {
        await apiService.resetUserPassword(userId);
        alert("Contraseña reseteada correctamente y enviada al correo del administrador.");
      } catch (error) {
        console.error("Error al resetear la contraseña del usuario:", error);
      }
    },
    async saveAdmin() {
      try {
        await apiService.createAdmin(this.newAdmin);
        alert("Administrador creado correctamente.");
        this.fetchAdmins(); // Refrescar la lista de administradores
        this.closeModal();
      } catch (error) {
        console.error("Error al crear el administrador:", error);
      }
    },
    showCreateAdminDialog() {
      this.showModal = true;
      this.newAdmin = {
        name: "",
        lastname: "",
        email: "",
        lada: "",
        phone: "",
        password: "",
      };
    },
    closeModal() {
      this.showModal = false;
    },
  },
  mounted() {
    this.fetchAdmins();
  },
};
</script>

<style scoped>
.admins-container {
  padding: 2rem;
  text-align: center;
}

.button-spacing {
  margin-right: 10px;
}

.text-dark {
  color: #343a40 !important;
}
</style>
