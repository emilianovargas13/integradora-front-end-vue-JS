<template>
    <Layout>
        <div class="supplier-resources-container">
            <div class="header-container">
                <h1 class="text-center mb-4">Gestión de Supplier Resources</h1>
                <p class="text-center">Administra los recursos de los proveedores registrados en el sistema.</p>
            </div>

            <!-- Botón para crear un nuevo Supplier Resource -->
            <div class="create-button-container">
                <b-button @click="showCreateDialog" variant="primary" size="lg" class="create-button">
                    <font-awesome-icon icon="plus-circle" class="mr-2" />
                    Crear Nuevo Supplier Resource
                </b-button>
            </div>

            <!-- Tabla con paginación -->
            <div class="card-container expanded-table">
                <b-card class="shadow-sm">
                    <b-table :items="supplierResources" :fields="fields" responsive="sm" hover
                        class="supplier-resource-table" :per-page="perPage" :current-page="currentPage">
                        <!-- Estado Activo/Inactivo -->
                        <template #cell(status)="data">
                            <b-badge :variant="data.item.status ? 'success' : 'danger'" class="text-dark">
                                {{ data.item.status ? 'Activo' : 'Inactivo' }}
                            </b-badge>
                        </template>

                        <!-- Acciones -->
                        <template #cell(actions)="data">
                            <b-button size="sm" @click="editSupplierResource(data.item)" variant="warning"
                                class="mr-2 button-spacing">
                                <font-awesome-icon :icon="['fas', 'edit']" /> Editar
                            </b-button>
                            <b-button size="sm" @click="toggleStatus(data.item.id)"
                                :variant="data.item.status ? 'danger' : 'success'" class="button-spacing">
                                <font-awesome-icon :icon="['fas', data.item.status ? 'times' : 'check']" />
                                {{ data.item.status ? 'Desactivar' : 'Activar' }}
                            </b-button>
                        </template>
                    </b-table>

                    <!-- Paginación -->
                    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="center"
                        class="mt-3"></b-pagination>
                </b-card>
            </div>

            <!-- Modal para crear/editar -->
            <b-modal v-model="showModal" title="Registrar Supplier Resource">
                <b-form>
                    <b-form-group label="Nombre" label-for="supplier-resource-name">
                        <b-form-input id="supplier-resource-name" v-model="form.name" required></b-form-input>
                    </b-form-group>
                    <b-form-group label="Descripción" label-for="supplier-resource-description">
                        <b-form-textarea id="supplier-resource-description"
                            v-model="form.description"></b-form-textarea>
                    </b-form-group>
                    <b-form-group label="Precio" label-for="supplier-resource-price">
                        <b-form-input id="supplier-resource-price" type="number" v-model="form.price"
                            required></b-form-input>
                    </b-form-group>
                    <b-form-group label="Proveedor" label-for="supplier-select">
                        <b-form-select id="supplier-select" v-model="form.supplierId" :options="supplierOptions"
                            required>
                            <option :value="null" disabled>Selecciona un proveedor</option>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group label="Recurso" label-for="resource-select">
                        <b-form-select id="resource-select" v-model="form.resourceId" :options="resourceOptions"
                            required>
                            <option :value="null" disabled>Selecciona un recurso</option>
                        </b-form-select>
                    </b-form-group>
                </b-form>
                <template #modal-footer>
                    <b-button @click="saveSupplierResource" variant="primary">{{ isEditing ? 'Guardar Cambios' :
                        'Registrar' }}</b-button>
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
    name: "SupplierResources",
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
            supplierResources: [],
            suppliers: [],
            resources: [],
            supplierOptions: [],
            resourceOptions: [],
            loading: false,
            showModal: false,
            isEditing: false,
            currentPage: 1,
            perPage: 5,
            totalRows: 0,
            form: {
                id: null,
                name: "",
                description: "",
                price: 0,
                supplierId: null,
                resourceId: null,
                active: true,
            },
            fields: [
                { key: "name", label: "Nombre" },
                { key: "price", label: "Precio" },
                { key: "supplierName", label: "Proveedor" },
                { key: "resourceName", label: "Recurso" },
                { key: "status", label: "Estado" },
                { key: "actions", label: "Acciones", sortable: false },
            ],
        };
    },
    methods: {
        async fetchSupplierResources() {
            this.loading = true;
            try {
                const response = await apiService.getPagedSupplierResources(this.currentPage - 1, this.perPage);
                this.supplierResources = response.content;
                this.totalRows = response.totalElements;
            } catch (error) {
                console.error("Error al obtener supplier resources:", error.message, error.response?.data || error);
            } finally {
                this.loading = false;
            }
        }
        ,
        async fetchSuppliersAndResources() {
            try {
                const suppliers = await apiService.getAllSuppliers();
                const resources = await apiService.getAllResources();

                this.supplierOptions = suppliers.map(s => ({
                    value: s.id,
                    text: s.name,
                }));
                this.resourceOptions = resources.map(r => ({
                    value: r.id,
                    text: r.name,
                }));

                console.log("Suppliers:", this.supplierOptions);
                console.log("Resources:", this.resourceOptions);
            } catch (error) {
                console.error("Error obteniendo datos:", error);
            }
        },
        showCreateDialog() {
            this.isEditing = false;
            this.resetForm();
            this.showModal = true;
        },
        editSupplierResource(item) {
            this.isEditing = true;
            this.form = { ...item };
            this.showModal = true;
        },
        async saveSupplierResource() {
            try {
                if (this.isEditing) {
                    await apiService.updateSupplierResource(this.form);
                } else {
                    await apiService.createSupplierResource(this.form);
                }
                this.fetchSupplierResources();
                this.closeModal();
            } catch (error) {
                console.error("Error al guardar supplier resource:", error);
            }
        },
        async toggleStatus(id) {
            try {
                await apiService.toggleSupplierResourceStatus(id);
                this.fetchSupplierResources();
            } catch (error) {
                console.error("Error al cambiar el estado:", error);
            }
        },
        resetForm() {
            this.form = {
                id: null,
                name: "",
                description: "",
                price: 0,
                supplierId: null,
                resourceId: null,
                active: true,
            };
        },
        closeModal() {
            this.showModal = false;
        },
    },
    mounted() {
        this.fetchSupplierResources();
        this.fetchSuppliersAndResources();
    },
};
</script>


<style scoped>
.supplier-resources-container {
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
}

.create-button-container {
    margin-bottom: 20px;
}

.card-container {
    margin: 0 auto;
    max-width: 1200px;
}

.text-dark {
    color: #343a40 !important;
}
</style>