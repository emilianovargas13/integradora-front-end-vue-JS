<template>
  <Layout>
    <div class="addresses-container">
      <!-- Encabezado -->
      <div class="header-container">
        <h1 class="text-center mb-4">Direcciones</h1>
        <p class="text-center">Administra las direcciones registradas en el sistema.</p>
      </div>

      <!-- Botón para crear una nueva dirección -->
      <div class="create-button-container">
        <b-button @click="showCreateAddressDialog" variant="primary" size="lg" class="create-button">
          <font-awesome-icon icon="plus-circle" class="mr-2" />
          Crear Nueva Dirección
        </b-button>
      </div>

      <!-- Tabla de direcciones -->
      <div class="card-container expanded-table">
        <b-card class="shadow-sm">
          <b-table
            :items="addresses"
            :fields="fields"
            responsive="sm"
            hover
            class="address-table"
            :per-page="perPage"
            :current-page="currentPage"
          >
            <!-- Acciones -->
            <template #cell(actions)="data">
              <b-button size="sm" variant="warning" @click="editAddress(data.item)" class="mr-2">
                <font-awesome-icon :icon="['fas', 'edit']" /> Editar
              </b-button>
              <b-button size="sm" variant="danger" @click="deleteAddress(data.item.id)">
                <font-awesome-icon :icon="['fas', 'trash']" /> Eliminar
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
            @change="fetchAddresses"
          ></b-pagination>
        </b-card>
      </div>

      <!-- Modal para crear/editar direcciones -->
      <b-modal v-model="showModal" :title="isEditing ? 'Editar Dirección' : 'Crear Dirección'">
        <b-form>
          <b-form-group label="País">
            <b-form-input v-model="currentAddress.country" required></b-form-input>
          </b-form-group>
          <b-form-group label="Estado">
            <b-form-input v-model="currentAddress.state" required></b-form-input>
          </b-form-group>
          <b-form-group label="Ciudad">
            <b-form-input v-model="currentAddress.city" required></b-form-input>
          </b-form-group>
          <b-form-group label="Colonia">
            <b-form-input v-model="currentAddress.colony" required></b-form-input>
          </b-form-group>
          <b-form-group label="Calle">
            <b-form-input v-model="currentAddress.street" required></b-form-input>
          </b-form-group>
          <b-form-group label="Código Postal">
            <b-form-input v-model="currentAddress.postalCode" required></b-form-input>
          </b-form-group>
          <b-form-group label="Número Exterior">
            <b-form-input v-model="currentAddress.exteriorNumber"></b-form-input>
          </b-form-group>
          <b-form-group label="Número Interior">
            <b-form-input v-model="currentAddress.interiorNumber"></b-form-input>
          </b-form-group>
          <b-form-group label="Tipo de Edificio">
            <b-form-input v-model="currentAddress.buildingType"></b-form-input>
          </b-form-group>
          <b-form-group label="Detalles de Referencia">
            <b-form-textarea v-model="currentAddress.referenceDetails"></b-form-textarea>
          </b-form-group>
        </b-form>
        <template #modal-footer>
          <b-button @click="saveAddress" variant="primary">
            {{ isEditing ? "Guardar Cambios" : "Crear Dirección" }}
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
  BPagination,
  BCard,
} from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "Addresses-",
  components: {
    Layout,
    BTable,
    BModal,
    BButton,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BPagination,
    BCard,
    FontAwesomeIcon,
  },
  data() {
    return {
      addresses: [],
      showModal: false,
      isEditing: false,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      currentAddress: {
        id: null,
        country: "",
        state: "",
        city: "",
        colony: "",
        street: "",
        postalCode: "",
        exteriorNumber: "",
        interiorNumber: "",
        buildingType: "",
        referenceDetails: "",
      },
      fields: [
        { key: "country", label: "País" },
        { key: "state", label: "Estado" },
        { key: "city", label: "Ciudad" },
        { key: "colony", label: "Colonia" },
        { key: "street", label: "Calle" },
        { key: "postalCode", label: "Código Postal" },
        { key: "actions", label: "Acciones", sortable: false },
      ],
    };
  },
  methods: {
    async fetchAddresses() {
      try {
        const response = await apiService.getPagedAddresses("", this.currentPage - 1, this.perPage);
        if (response.data) {
          this.addresses = response.data.content;
          this.totalRows = response.data.totalElements;
        } else {
          console.error("Error en la respuesta del backend:", response);
        }
      } catch (error) {
        console.error("Error al obtener direcciones paginadas:", error);
      }
    },
    showCreateAddressDialog() {
      this.resetCurrentAddress();
      this.isEditing = false;
      this.showModal = true;
    },
    editAddress(address) {
      this.currentAddress = { ...address };
      this.isEditing = true;
      this.showModal = true;
    },
    async saveAddress() {
      try {
        if (this.isEditing) {
          await apiService.updateAddress(this.currentAddress.id, this.currentAddress);
        } else {
          await apiService.createAddress(this.currentAddress);
        }
        this.fetchAddresses();
        this.closeModal();
      } catch (error) {
        console.error("Error al guardar dirección:", error);
      }
    },
    async deleteAddress(id) {
      try {
        await apiService.deleteAddress(id);
        this.fetchAddresses();
      } catch (error) {
        console.error("Error al eliminar dirección:", error);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    resetCurrentAddress() {
      this.currentAddress = {
        id: null,
        country: "",
        state: "",
        city: "",
        colony: "",
        street: "",
        postalCode: "",
        exteriorNumber: "",
        interiorNumber: "",
        buildingType: "",
        referenceDetails: "",
      };
    },
  },
  mounted() {
    this.fetchAddresses();
  },
};
</script>

<style scoped>
.addresses-container {
  padding: 2rem;
  text-align: center;
}

.header-container {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #003366;
  color: #ffffff;
  border-radius: 8px;
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

.address-table {
  border-radius: 8px;
}
</style>
