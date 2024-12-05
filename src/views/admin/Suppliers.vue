<template>
  <Layout>
    <div class="suppliers-container">
      <div class="header-container">
        <h1 class="text-center mb-4">Gestión de Proveedores</h1>
        <p class="text-center">Administra los proveedores que tienes disponibles en el sistema.</p>
      </div>

      <!-- Botón para crear un nuevo proveedor -->
      <div class="create-button-container">
        <b-button @click="showCreateSupplierDialog" variant="primary" size="lg" class="create-button">
          <font-awesome-icon icon="plus-circle" class="mr-2" />
          Crear Nuevo Proveedor
        </b-button>
      </div>

      <!-- Tabla de proveedores con paginación -->
      <div class="card-container expanded-table">
        <b-card class="shadow-sm">
          <b-table
            :items="suppliers"
            :fields="fields"
            responsive="sm"
            hover
            class="resource-table"
            :per-page="perPage"
            :current-page="currentPage"
          >
            <!-- Estado Activo/Inactivo -->
            <template #cell(active)="data">
              <b-badge :variant="data.item.active ? 'success' : 'danger'" class="text-dark">
                {{ data.item.active ? 'Activo' : 'Inactivo' }}
              </b-badge>
            </template>

            <!-- Acciones -->
            <template #cell(actions)="data">
              <b-button size="sm" @click="editSupplier(data.item)" variant="warning" class="mr-2 button-spacing">
                <font-awesome-icon :icon="['fas', 'edit']" /> Editar
              </b-button>
              <b-button size="sm" @click="toggleSupplierStatus(data.item.id)" :variant="data.item.active ? 'danger' : 'success'" class="button-spacing">
                <font-awesome-icon :icon="['fas', data.item.active ? 'times' : 'check']" />
                {{ data.item.active ? 'Desactivar' : 'Activar' }}
              </b-button>
            </template>
          </b-table>

          <!-- Paginación -->
          <b-pagination
            v-if="totalRows > 0"
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            @change="fetchSuppliers"
            align="center"
            class="mt-3"
          ></b-pagination>
        </b-card>
      </div>

      <!-- Modal para crear/editar proveedor -->
      <b-modal v-model="showModal" title="Registrar Proveedor">
        <b-form @submit.prevent="handleSubmit">
          <b-form-group label="Nombre" label-for="supplier-name">
            <b-form-input id="supplier-name" v-model="newSupplier.name" required></b-form-input>
          </b-form-group>
          <b-form-group label="Imagen" label-for="supplier-image">
            <b-form-file
              id="supplier-image"
              @change="handleImageChange"
              accept="image/*"
              required
            ></b-form-file>
            <small v-if="imageError" class="text-danger">{{ imageError }}</small>
          </b-form-group>
          <b-form-group label="Nombre de Contacto" label-for="supplier-contactName">
            <b-form-input id="supplier-contactName" v-model="newSupplier.contactName" required></b-form-input>
          </b-form-group>
          <b-form-group label="Descripción" label-for="supplier-description">
            <b-form-textarea id="supplier-description" v-model="newSupplier.description" required></b-form-textarea>
          </b-form-group>
          <b-form-group label="Lada" label-for="supplier-lada">
            <b-form-input id="supplier-lada" type="number" v-model="newSupplier.lada" required></b-form-input>
          </b-form-group>
          <b-form-group label="Teléfono" label-for="supplier-phone">
            <b-form-input id="supplier-phone" type="number" v-model="newSupplier.phone" required></b-form-input>
          </b-form-group>
          <b-form-group label="Correo Electrónico" label-for="supplier-email">
            <b-form-input id="supplier-email" type="email" v-model="newSupplier.email" required></b-form-input>
          </b-form-group>
          <!-- Información de dirección -->
          <b-form-group label="País" label-for="supplier-country">
            <b-form-input id="supplier-country" v-model="newSupplier.country" required></b-form-input>
          </b-form-group>
          <b-form-group label="Estado" label-for="supplier-state">
            <b-form-input id="supplier-state" v-model="newSupplier.state" required></b-form-input>
          </b-form-group>
          <b-form-group label="Ciudad" label-for="supplier-city">
            <b-form-input id="supplier-city" v-model="newSupplier.city" required></b-form-input>
          </b-form-group>
          <b-form-group label="Colonia" label-for="supplier-colony">
            <b-form-input id="supplier-colony" v-model="newSupplier.colony" required></b-form-input>
          </b-form-group>
          <b-form-group label="Calle" label-for="supplier-street">
            <b-form-input id="supplier-street" v-model="newSupplier.street" required></b-form-input>
          </b-form-group>
          <b-form-group label="Código Postal" label-for="supplier-postalCode">
            <b-form-input id="supplier-postalCode" v-model="newSupplier.postalCode" required></b-form-input>
          </b-form-group>
          <b-form-group label="Número Exterior" label-for="supplier-exteriorNumber">
            <b-form-input id="supplier-exteriorNumber" v-model="newSupplier.exteriorNumber" required></b-form-input>
          </b-form-group>
          <b-form-group label="Número Interior (Opcional)" label-for="supplier-interiorNumber">
            <b-form-input id="supplier-interiorNumber" v-model="newSupplier.interiorNumber"></b-form-input>
          </b-form-group>
          <b-form-group label="Detalles de Referencia" label-for="supplier-referenceDetails">
            <b-form-input id="supplier-referenceDetails" v-model="newSupplier.referenceDetails"></b-form-input>
          </b-form-group>
          <b-form-group label="Tipo de Edificio" label-for="supplier-buildingType">
            <b-form-input id="supplier-buildingType" v-model="newSupplier.buildingType" required></b-form-input>
          </b-form-group>

          <template #modal-footer>
            <b-button type="submit" variant="primary">{{ isEditing ? 'Guardar Cambios' : 'Registrar' }}</b-button>
            <b-button @click="closeModal" variant="secondary">Cancelar</b-button>
          </template>
        </b-form>
      </b-modal>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";
import apiService from "@/service/api_service";
import { BTable, BModal, BButton, BForm, BFormGroup, BFormInput, BFormTextarea, BFormFile, BBadge, BPagination, BCard } from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "Suppliers-",
  components: {
    Layout,
    BTable,
    BModal,
    BButton,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BFormFile,
    BBadge,
    BPagination,
    BCard,
    FontAwesomeIcon,
  },
  data() {
    return {
      suppliers: [],
      loading: false,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      showModal: false,
      isEditing: false,
      imageError: "",
      newSupplier: {
        id: null,
        name: "",
        contactName: "",
        description: "",
        image: "",
        lada: "",
        phone: "",
        email: "",
        country: "",
        state: "",
        city: "",
        colony: "",
        street: "",
        postalCode: "",
        exteriorNumber: "",
        interiorNumber: "",
        referenceDetails: "",
        buildingType: "",
        active: true,
      },
      fields: [
        { key: "name", label: "Nombre" },
        { key: "contactName", label: "Contacto" },
        { key: "description", label: "Descripción" },
        { key: "active", label: "Estado" },
        { key: "actions", label: "Acciones", sortable: false },
      ],
    };
  },
  methods: {
    async fetchSuppliers() {
      this.loading = true;
      try {
        const paginationParams = { supplierName: "" };
        const response = await apiService.getPagedSuppliers(paginationParams, this.currentPage - 1, this.perPage);
        this.suppliers = response.content;
        this.totalRows = response.totalElements;
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        alert("Error al obtener proveedores: " + error.message);
      } finally {
        this.loading = false;
      }
    },
    async toggleSupplierStatus(supplierId) {
      try {
        await apiService.changeSupplierStatus(supplierId);
        this.fetchSuppliers();
      } catch (error) {
        console.error("Error al cambiar el estado del proveedor:", error);
        alert("Error al cambiar el estado del proveedor: " + error.message);
      }
    },
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          this.imageError = "El tamaño de la imagen no debe exceder los 5 MB.";
          this.newSupplier.image = "";
        } else {
          this.imageError = "";
          const reader = new FileReader();
          reader.onloadend = () => {
            this.newSupplier.image = reader.result;
          };
          reader.readAsDataURL(file);
        }
      }
    },
    showCreateSupplierDialog() {
      this.isEditing = false;
      this.resetSupplierData();
      this.showModal = true;
    },
    editSupplier(supplier) {
      this.isEditing = true;
      this.newSupplier = { ...supplier };
      this.showModal = true;
    },
    async handleSubmit() {
      try {
        console.log("Datos que se van a enviar:", this.newSupplier);
        if (this.isEditing) {
          await apiService.updateSupplier(this.newSupplier);
        } else {
          await apiService.saveSupplier(this.newSupplier);
        }
        this.fetchSuppliers();
        this.closeModal();
      } catch (error) {
        console.error("Error al guardar el proveedor:", error);
        alert("Error al guardar el proveedor: " + error.message);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    resetSupplierData() {
      this.newSupplier = {
        id: null,
        name: "",
        contactName: "",
        description: "",
        image: "",
        lada: "",
        phone: "",
        email: "",
        country: "",
        state: "",
        city: "",
        colony: "",
        street: "",
        postalCode: "",
        exteriorNumber: "",
        interiorNumber: "",
        referenceDetails: "",
        buildingType: "",
        active: true,
      };
    },
  },
  mounted() {
    this.fetchSuppliers();
  },
};
</script>

<style scoped>
.suppliers-container {
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

.create-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.card-container {
  margin: 0 auto;
  max-width: 1200px;
}

.button-spacing {
  margin-right: 10px;
}

.text-dark {
  color: #343a40 !important;
}
</style>
