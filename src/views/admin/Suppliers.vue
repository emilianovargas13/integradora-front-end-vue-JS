<template>
  <Layout>
    <div class="suppliers-container">
      <div class="header-container">
        <h1 class="text-center mb-4">Gestión de Proveedores</h1>
        <p class="text-center">Administra los proveedores disponibles en el sistema.</p>
      </div>

      <!-- Botón para crear nuevo proveedor -->
      <div class="create-button-container">
        <b-button @click="showCreateSupplierDialog" variant="primary" size="lg" class="create-button">
          <font-awesome-icon icon="plus-circle" class="mr-2" />
          Crear Nuevo Proveedor
        </b-button>
      </div>

      <!-- Tabla de proveedores con paginación -->
      <div class="card-container expanded-table">
        <b-card class="shadow-sm">
          <b-table :items="suppliers" :fields="fields" responsive="sm" hover class="supplier-table" :per-page="perPage"
            :current-page="currentPage">
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
              <b-button size="sm" @click="toggleSupplierStatus(data.item.id)"
                :variant="data.item.active ? 'danger' : 'success'" class="button-spacing">
                <font-awesome-icon :icon="['fas', data.item.active ? 'times' : 'check']" />
                {{ data.item.active ? 'Desactivar' : 'Activar' }}
              </b-button>
            </template>
          </b-table>

          <!-- Paginación -->
          <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="center" class="mt-3"
            @change="fetchSuppliers"></b-pagination>
        </b-card>
      </div>

      <!-- Modal para crear/editar proveedor -->
      <b-modal v-model="showModal" title="Registrar Proveedor">
        <b-form @submit.prevent="saveSupplier">
          <b-form-group label="Nombre" label-for="supplier-name">
            <b-form-input id="supplier-name" v-model="newSupplier.name" required></b-form-input>
          </b-form-group>
          <b-form-group label="Correo Electrónico" label-for="supplier-email">
            <b-form-input id="supplier-email" type="email" v-model="newSupplier.email" required></b-form-input>
          </b-form-group>
          <b-form-group label="Lada" label-for="supplier-lada">
            <b-form-input id="supplier-lada" type="number" v-model="newSupplier.lada" required></b-form-input>
          </b-form-group>
          <b-form-group label="Teléfono" label-for="supplier-phone">
            <b-form-input id="supplier-phone" type="number" v-model="newSupplier.phone" required></b-form-input>
          </b-form-group>
          <b-form-group label="Nombre de Contacto" label-for="supplier-contactName">
            <b-form-input id="supplier-contactName" v-model="newSupplier.contactName" required></b-form-input>
          </b-form-group>
          <b-form-group label="Descripción" label-for="supplier-description">
            <b-form-textarea id="supplier-description" v-model="newSupplier.description" required></b-form-textarea>
          </b-form-group>
          <b-form-group label="Dirección" label-for="supplier-address">
            <b-form-select id="supplier-address" v-model="newSupplier.addressId" :options="addressOptions" required>
              <template #first>
                <option :value="null" disabled>Selecciona una dirección</option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-form>
        <template #modal-footer>
          <b-button type="button" @click="saveSupplier" variant="primary">
            {{ isEditing ? 'Guardar Cambios' : 'Registrar' }}
          </b-button>
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
  BPagination,
  BCard,
  BBadge,
} from "bootstrap-vue";
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
    BFormSelect,
    BPagination,
    BCard,
    BBadge,
    FontAwesomeIcon,
  },
  data() {
    return {
      suppliers: [],
      addressOptions: [],
      loading: false,
      showModal: false,
      isEditing: false,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      newSupplier: {
        id: null,
        name: "",
        email: "",
        lada: "",
        phone: "",
        contactName: "",
        description: "",
        addressId: null,
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
        const paginationParams = { supplierName: "" }; // Filtro vacío para obtener todos
        const response = await apiService.getPagedSuppliers(
          paginationParams,
          this.currentPage - 1,
          this.perPage
        );

        console.log("Datos recibidos del backend:", response.data);

        // Verifica si la respuesta contiene los datos esperados
        if (response.data && response.data.content) {
          // Mapea correctamente los campos desde la respuesta
          this.suppliers = response.data.content.map(supplier => ({
            ...supplier,
            active: supplier.active !== undefined ? supplier.active : supplier.status, // Mapea correctamente el estado
          }));
          this.totalRows = response.data.totalElements; // Total de registros
        } else {
          console.warn("No se encontraron proveedores");
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error.response?.data || error.message);
      } finally {
        this.loading = false;
      }
    }

    ,
    async fetchAddresses() {
      try {
        const response = await apiService.getAllAddresses();
        if (response && response.data) {
          this.addressOptions = response.data.map((address) => ({
            value: address.id,
            text: `${address.street}, ${address.city}, ${address.state}`,
          }));
        } else {
          console.error("La respuesta no contiene datos de direcciones");
        }
      } catch (error) {
        console.error("Error al obtener direcciones:", error);
      }
    },
    showCreateSupplierDialog() {
      this.isEditing = false;
      this.resetSupplierData();
      this.showModal = true;
    },



    editSupplier(supplier) {
  this.isEditing = true;

  // Mapear los datos del proveedor al modelo del formulario
  this.newSupplier = {
    id: supplier.id,
    name: supplier.name,
    contactName: supplier.contactName,
    description: supplier.description,
    lada: supplier.lada,
    phone: supplier.phone,
    email: supplier.email,
    addressId: supplier.address?.id || null, // Manejar direcciones
    country: supplier.address?.country || "", // Asegúrate de enviar todos los campos requeridos
    state: supplier.address?.state || "",
    city: supplier.address?.city || "",
    colony: supplier.address?.colony || "",
    street: supplier.address?.street || "",
    postalCode: supplier.address?.postalCode || "",
    exteriorNumber: supplier.address?.exteriorNumber || "",
    interiorNumber: supplier.address?.interiorNumber || "",
    buildingType: supplier.address?.buildingType || "",
    referenceDetails: supplier.address?.referenceDetails || "",
  };

  this.showModal = true; // Mostrar el modal de edición
},


async saveSupplier() {
  try {
    if (this.isEditing) {
      // Actualizar proveedor existente
      await apiService.updateSupplier(this.newSupplier);
    } else {
      // Crear nuevo proveedor
      await apiService.saveSupplier(this.newSupplier);
    }

    await this.fetchSuppliers(); // Recargar la lista de proveedores
    this.closeModal(); // Cerrar el modal
  } catch (error) {
    console.error("Error al guardar el proveedor:", error.response?.data || error.message);
  }
},





    async toggleSupplierStatus(supplierId) {
      try {
        const response = await apiService.changeSupplierStatus(supplierId);

        this.suppliers = this.suppliers.map((supplier) => {
          if (supplier.id === supplierId) {
            return { ...supplier, active: !supplier.active }; // Cambia el estado
          }
          return supplier;
        });

        console.log("Estado cambiado exitosamente:", response);
      } catch (error) {
        console.error("Error al cambiar el estado del proveedor:", error);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    resetSupplierData() {
      this.newSupplier = {
        id: null,
        name: "",
        email: "",
        lada: "",
        phone: "",
        contactName: "",
        description: "",
        addressId: null,
        active: true,
      };
    },
  },
  mounted() {
    this.fetchSuppliers();
    this.fetchAddresses();
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
