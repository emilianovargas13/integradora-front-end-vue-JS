<template>
  <div class="layout">
    <!-- Navbar -->
    <div class="navbar">
      <div class="logo" @click="navigateToProfile">
        <img src="@/assets/logo.png" alt="Logo" />
      </div>
    </div>

    <!-- Sidebar -->
    <div :class="['sidebar', { 'sidebar-hidden': isSidebarHidden }]">
      <button class="toggle-button" @click="toggleSidebar">
        <font-awesome-icon :icon="isSidebarHidden ? 'chevron-left' : 'chevron-right'" />
      </button>
      <ul class="sidebar-list">
        <li @click="navigate('ProfileView')" :class="{ active: currentRoute === 'ProfileView' }" :title="isSidebarHidden ? 'Inicio' : ''">
          <font-awesome-icon icon="house-user" class="menu-icon" />
          <span v-if="!isSidebarHidden">Inicio</span>
        </li>
        <li @click="navigate('Stats')" :class="{ active: currentRoute === 'Stats' }" :title="isSidebarHidden ? 'Estadísticas' : ''">
          <font-awesome-icon icon="chart-line" class="menu-icon" />
          <span v-if="!isSidebarHidden">Estadísticas</span>
        </li>
        <li @click="navigate('ViewAdmins')" :class="{ active: currentRoute === 'ViewAdmins' }" :title="isSidebarHidden ? 'Administradores' : ''">
          <font-awesome-icon icon="user" class="menu-icon" />
          <span v-if="!isSidebarHidden">Administradores</span>
        </li>
        <li @click="navigate('ResourcesType')" :class="{ active: currentRoute === 'ResourcesType' }" :title="isSidebarHidden ? 'Recursos' : ''">
          <font-awesome-icon icon="folder-open" class="menu-icon" />
          <span v-if="!isSidebarHidden">Recursos</span>
        </li>
        <li @click="navigate('Events')" :class="{ active: currentRoute === 'Events' }" :title="isSidebarHidden ? 'Eventos' : ''">
          <font-awesome-icon icon="calendar" class="menu-icon" />
          <span v-if="!isSidebarHidden">Eventos</span>
        </li>
        <li @click="navigate('Suppliers')" :class="{ active: currentRoute === 'Suppliers' }" :title="isSidebarHidden ? 'Proveedores' : ''">
          <font-awesome-icon icon="truck" class="menu-icon" />
          <span v-if="!isSidebarHidden">Proveedores</span>
        </li>
        <li @click="navigate('Addresses')" :class="{ active: currentRoute === 'Addresses' }" :title="isSidebarHidden ? 'Direcciones' : ''">
          <font-awesome-icon icon="truck" class="menu-icon" />
          <span v-if="!isSidebarHidden">Direcciones</span>
        </li>
        
        <li @click="navigate('SupplierResources')" :class="{ active: currentRoute === 'SupplierResources' }" :title="isSidebarHidden ? 'SupplierResources' : ''">
          <font-awesome-icon icon="calendar" class="menu-icon" />
          <span v-if="!isSidebarHidden">SupplierResources</span>
        </li>

      </ul>
      <!-- Logout Button -->
      <div class="logout-button" @click="logout" :title="isSidebarHidden ? 'Cerrar Sesión' : ''">
        <font-awesome-icon icon="arrow-right-from-bracket" class="logout-icon" />
        <span v-if="!isSidebarHidden" class="logout-text">Cerrar Sesión</span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight, faHouseUser, faChartLine, faUser, faFolderOpen, faCalendar, faTruck, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

library.add(faChevronLeft, faChevronRight, faHouseUser, faChartLine, faUser, faFolderOpen, faCalendar, faTruck, faArrowRightFromBracket);

export default {
  name: "Layout-",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      currentRoute: this.$route.name,
      isSidebarHidden: localStorage.getItem('isSidebarHidden') === 'true',
    };
  },
  methods: {
    navigate(routeName) {
      if (this.$route.name !== routeName) {
        this.$router.push({ name: routeName }).catch((error) => {
          if (error.name !== 'NavigationDuplicated') {
            // Si ocurre otro error que no sea navegación duplicada, lo lanzamos
            console.error(error);
          }
        });
      }
    },
    toggleSidebar() {
      this.isSidebarHidden = !this.isSidebarHidden;
      localStorage.setItem('isSidebarHidden', this.isSidebarHidden);
    },
    navigateToProfile() {
      this.$router.push({ name: "ProfileView" }).catch((error) => {
        if (error.name !== 'NavigationDuplicated') {
          console.error(error);
        }
      });
    },
    logout() {
      localStorage.removeItem("authToken");
      this.$router.push({ name: "Login" }).catch((error) => {
        if (error.name !== 'NavigationDuplicated') {
          console.error(error);
        }
      });
    },
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Tooltip Customization */
.tooltip-custom {
  background-color: #00509e !important; /* Azul fuerte */
  color: #ffffff !important;
  padding: 8px 12px !important;
  border-radius: 5px !important;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3) !important;
  font-size: 14px !important;
}
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Navbar */
.navbar {
  width: 100%;
  height: 80px;
  background-color: #003366; /* Azul fuerte */
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.logo {
  cursor: pointer;
}

.logo img {
  height: 50px;
  width: auto;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #00509e; /* Azul fuerte */
  color: #ffffff;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 999;
}

.sidebar-hidden {
  width: 60px;
  transition: all 0.3s ease;
}

.toggle-button {
  position: absolute;
  top: 90px;
  left: -20px;
  background-color: #003366;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin-top: 100px;
  flex-grow: 1;
}

.sidebar-list li {
  padding: 12px 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
}

.sidebar-list li:hover {
  background-color: #007bff;
  color: #ffffff;
  transform: scale(1.05);
}

.sidebar-list li.active {
  background-color: #003366;
  color: #ffffff;
  font-weight: bold;
}

.menu-icon {
  margin-right: 15px; /* Aumentar el espacio entre el icono y el texto */
}

/* Logout Button */
.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: #d9534f; /* Color rojo para el botón de cierre de sesión */
  color: #ffffff;
  transition: background-color 0.3s, transform 0.2s;
  margin-bottom: 30px; /* Margen inferior ajustado */
}

.logout-icon {
  margin-right: 10px; /* Espaciado entre icono y texto */
}

.logout-button:hover {
  background-color: #c9302c;
  transform: scale(1.05);
}

/* Main Content */
.main-content {
  margin-top: 80px;
  margin-right: 250px;
  padding: 40px; /* Espaciado más grande para mejor diseño */
  width: calc(100% - 250px);
  transition: margin-right 0.3s ease, width 0.3s ease;
}

.sidebar-hidden + .main-content {
  margin-right: 60px;
  width: calc(100% - 60px);
}
</style>
