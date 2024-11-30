<template>
  <layout>
    <div class="profile-container">
      <h1>Bienvenido al Panel de Control</h1>
      <p>Esta es la pantalla de inicio después de iniciar sesión.</p>
    </div>
  </layout>
</template>

<script>
import Layout from "@/components/Layout.vue";

export default {
  name: "ProfileView",
  components: {
    Layout,
  },
};
</script>

<style scoped>
.profile-container {
  padding: 2rem;
}
</style>
