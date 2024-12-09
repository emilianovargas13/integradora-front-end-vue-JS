<template>
  <Layout>
    <template v-slot:default>
      <div class="events-management">
        <header class="events-header">
          <div class="container">
            <h1>Gestión de Eventos</h1>
            <p>Añade, edita o elimina eventos de tu sistema fácilmente.</p>
            <button class="primary-btn" @click="openCreateEventModal">Crear Nuevo Evento</button>
          </div>
        </header>

        <section class="events-list">
          <div class="container">
            <h2>Listado de Eventos</h2>
            <table class="events-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha de Inicio</th>
                  <th>Fecha de Fin</th>
                  <th>Lugar</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in events" :key="event.id">
                  <td>{{ event.name }}</td>
                  <td>{{ event.startDate }}</td>
                  <td>{{ event.endDate }}</td>
                  <td>{{ event.place }}</td>
                  <td>
                    <button class="action-btn edit-btn" @click="openEditEventModal(event)">Editar</button>
                    <button class="action-btn delete-btn" @click="deleteEvent(event.id)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Modal for Create/Edit Event -->
        <div v-if="showEventModal" class="modal-overlay">
          <div class="modal-content enhanced-modal">
            <h3>{{ isEditing ? 'Editar Evento' : 'Crear Nuevo Evento' }}</h3>
            <form @submit.prevent="saveEvent" class="modal-form">
              <div class="form-group">
                <label for="name">Nombre del Evento</label>
                <input id="name" v-model="currentEvent.name" type="text" required />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="startDate">Fecha de Inicio</label>
                  <input
                    id="startDate"
                    v-model="currentEvent.startDate"
                    type="date"
                    required
                    @change="validateDates"
                  />
                </div>
                <div class="form-group">
                  <label for="endDate">Fecha de Fin</label>
                  <input
                    id="endDate"
                    v-model="currentEvent.endDate"
                    type="date"
                    required
                    @change="validateDates"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="place">Lugar</label>
                <input id="place" v-model="currentEvent.place" type="text" required />
              </div>

              <div class="form-group">
                <label for="description">Descripción</label>
                <textarea id="description" v-model="currentEvent.description"></textarea>
              </div>

              <div class="form-group">
                <label for="resources">Recursos de Proveedores</label>
                <select id="resources" v-model="selectedResourceId" @change="addResource">
                  <option value="" disabled selected>Selecciona un recurso</option>
                  <option v-for="resource in availableResources" :key="resource.id" :value="resource.id">
                    {{ resource.name }} - ${{ resource.cost }}
                  </option>
                </select>
              </div>

              <div class="selected-resources">
                <h4>Recursos Seleccionados:</h4>
                <ul>
                  <li v-for="(resource, index) in selectedResources" :key="resource.id">
                    {{ resource.name }} - ${{ resource.cost }}
                    <button class="remove-btn" @click="removeResource(index)">Quitar</button>
                  </li>
                </ul>
              </div>

              <div class="budget-info">
                <p><strong>Presupuesto Disponible:</strong> ${{ availableBudget }}</p>
                <p><strong>Total Seleccionado:</strong> ${{ totalCost }}</p>
              </div>

              <div class="modal-actions">
                <button type="submit" class="primary-btn" :disabled="!isBudgetValid">Guardar</button>
                <button type="button" class="secondary-btn" @click="closeEventModal">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";

export default {
  name: "EventManagement",
  components: {
    Layout,
  },
  data() {
    return {
      events: [
        {
          id: 1,
          name: "Conferencia Anual",
          startDate: "2024-01-15",
          endDate: "2024-01-17",
          place: "Auditorio Central",
          description: "Evento principal del año para discutir estrategias."
        },
        {
          id: 2,
          name: "Workshop de Innovación",
          startDate: "2024-02-10",
          endDate: "2024-02-12",
          place: "Sala de Reuniones 3",
          description: "Explorando nuevas ideas y soluciones."
        }
      ],
      showEventModal: false,
      isEditing: false,
      currentEvent: {
        id: null,
        name: "",
        startDate: "",
        endDate: "",
        place: "",
        description: "",
      },
      availableResources: [
        { id: 1, name: "Proyector", cost: 200 },
        { id: 2, name: "Sillas", cost: 50 },
        { id: 3, name: "Mesas", cost: 100 }
      ],
      selectedResources: [],
      selectedResourceId: null,
      availableBudget: 1000,
      totalCost: 0
    };
  },
  computed: {
    isBudgetValid() {
      return this.availableBudget - this.totalCost >= 0;
    }
  },
  methods: {
    openCreateEventModal() {
      this.isEditing = false;
      this.currentEvent = {
        id: null,
        name: "",
        startDate: "",
        endDate: "",
        place: "",
        description: "",
      };
      this.selectedResources = [];
      this.totalCost = 0;
      this.showEventModal = true;
    },
    openEditEventModal(event) {
      this.isEditing = true;
      this.currentEvent = { ...event };
      this.showEventModal = true;
    },
    saveEvent() {
      if (this.isEditing) {
        const index = this.events.findIndex(e => e.id === this.currentEvent.id);
        if (index !== -1) {
          this.events.splice(index, 1, this.currentEvent);
        }
      } else {
        this.currentEvent.id = Date.now();
        this.events.push(this.currentEvent);
      }
      this.closeEventModal();
    },
    deleteEvent(id) {
      this.events = this.events.filter(event => event.id !== id);
    },
    closeEventModal() {
      this.showEventModal = false;
    },
    validateDates() {
      if (this.currentEvent.startDate && this.currentEvent.endDate) {
        if (this.currentEvent.startDate > this.currentEvent.endDate) {
          alert("La fecha de inicio no puede ser mayor a la fecha de finalización.");
        }
      }
    },
    addResource() {
      const resource = this.availableResources.find(res => res.id === this.selectedResourceId);
      if (resource && !this.selectedResources.includes(resource)) {
        this.selectedResources.push(resource);
        this.updateBudget();
      }
    },
    removeResource(index) {
      this.selectedResources.splice(index, 1);
      this.updateBudget();
    },
    updateBudget() {
      this.totalCost = this.selectedResources.reduce((sum, resource) => sum + resource.cost, 0);
    }
  }
};
</script>

<style scoped>
.events-management {
  font-family: "Roboto", sans-serif;
  color: #333;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.events-header {
  background-color: #003366;
  color: #fff;
  padding: 20px 0;
  text-align: center;
}

.primary-btn {
  background-color: #00509e;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.primary-btn:hover {
  background-color: #007bff;
}

.events-list {
  padding: 40px 0;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.events-table th, .events-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.events-table th {
  background-color: #003366;
  color: #fff;
}

.action-btn {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.edit-btn {
  background-color: #ffcc00;
  color: #333;
}

.delete-btn {
  background-color: #d9534f;
  color: #fff;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 600px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 15px;
}

form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

form-group input, form-group select, form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.enhanced-modal h3 {
  text-align: center;
  color: #003366;
  margin-bottom: 20px;
}

.selected-resources {
  margin-top: 20px;
}

.selected-resources ul {
  list-style-type: none;
  padding: 0;
}

.selected-resources li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.remove-btn {
  background-color: #d9534f;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #c9302c;
}

.budget-info {
  margin-top: 20px;
  background-color: #f0f8ff;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.secondary-btn {
  background-color: #ccc;
  color: #333;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
