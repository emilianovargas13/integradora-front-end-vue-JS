const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  // Configuración para PWA
  pwa: {
    name: 'Mi Aplicación', // Nombre de tu aplicación
    themeColor: '#4DBA87', // Color del tema
    msTileColor: '#000000', // Color de la tile para Windows
    manifestOptions: {
      short_name: 'MiApp', // Nombre corto
      start_url: '/', // URL de inicio al abrir la PWA
      display: 'standalone', // Modo de visualización
      background_color: '#ffffff', // Color de fondo
      icons: [
        {
          src: 'img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workboxOptions: {
      // Configuración de Workbox para gestionar la caché
      runtimeCaching: [
        {
          urlPattern: new RegExp('http://174.129.194.175:8082/'), // Cambia esta URL a tu API si quieres cachearla
          handler: 'NetworkFirst', // Intenta la red primero, luego cache
          options: {
            cacheName: 'api-cache',
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/, // Cache de imágenes
          handler: 'CacheFirst', // Primero sirve desde la cache
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
            },
          },
        },
        {
          urlPattern: /.*/,
          handler: 'NetworkFirst', // Para otros archivos, intenta la red primero
          options: {
            cacheName: 'general-cache',
          },
        },
      ],
    },
  },
});
