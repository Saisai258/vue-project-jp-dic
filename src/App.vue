<template>
  <v-app>
    <v-app-bar color="black"
      style=" background-image: url('https://imgix.cosmicjs.com/c8a28e00-2a63-11ef-adb1-8b946b3a80e4-hero.svg?auto=format%2Ccompress&q=10&fit=crop&w=4096&h=256');"
      height="64" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-btn to="/" text>Japanese Dictionary</v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Show login/register when not authenticated -->
      <template v-if="!isAuthenticated">
        <v-btn text to="/login" class="mr-2">
          <v-icon left>mdi-login</v-icon>
          Login
        </v-btn>
        <v-btn text to="/register">
          <v-icon left>mdi-account-plus</v-icon>
          Register
        </v-btn>
      </template>

      <!-- Show user menu when authenticated -->
      <template v-else>
        <v-btn text @click="logout" class="mr-2">
          <v-icon left>mdi-logout</v-icon>
          Logout
        </v-btn>
      </template>
    </v-app-bar>

    <nav-drawer v-model="drawer"></nav-drawer>

    <v-main class="app-background">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <!-- Glassmorphism Footer -->
    <!-- Enhanced Glassmorphism Footer -->
    <v-footer class="glass-footer" app>
      <v-container>
        <v-row align="center" justify="space-between">
          <!-- Social Icons -->
          <v-col cols="12" sm="4" class="text-center text-sm-left mb-2 mb-sm-0">
            <v-btn v-for="icon in icons" :key="icon" icon class="mx-2 glass-icon">
              <v-icon size="28px" color="white">{{ icon }}</v-icon>
            </v-btn>
          </v-col>

          <!-- Centered Text -->
          <v-col cols="12" sm="4" class="text-center mb-2 mb-sm-0">
            <div class="footer-text">© {{ new Date().getFullYear() }} Japanese Dictionary</div>
          </v-col>

          <!-- Footer Links -->
          <v-col cols="12" sm="4" class="text-center text-sm-right">
            <div class="glass-link-box">
              <v-btn text to="/about" class="footer-link">About</v-btn>
              <v-btn text to="/contact" class="footer-link">Contact</v-btn>
            </div>
          </v-col>

        </v-row>
      </v-container>
    </v-footer>

  </v-app>
</template>

<script>
import NavDrawer from './components/NavDrawer.vue';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';

export default {
  name: 'App',
  components: {
    NavDrawer
  },
  setup() {
    const store = useStore();
    const drawer = ref(false);
    const icons = ['mdi-facebook', 'mdi-twitter', 'mdi-instagram', 'mdi-youtube'];

    const isAuthenticated = computed(() => store.state.login);
    const user = computed(() => JSON.parse(localStorage.getItem('authUser')) || {});

    const logout = () => {
      if (confirm('Are you sure you want to logout?')) {
        store.dispatch('LogoutStateChange');
        localStorage.removeItem('authUser');
        window.location.href = '/login';
      }
    };

    return {
      drawer,
      isAuthenticated,
      user,
      logout,
      icons
    };
  }
}
</script>

<style>
.app-background {
  background-image: url('https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
}

/* Glassmorphism effects */
.glass-card {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
}

.glass-table {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.glass-button {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Ensure footer sticks to bottom */
.v-application--wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Push footer down */
.v-main {
  flex: 1 0 auto;
}

/* Glass footer stays at bottom */
.glass-footer {
  background: linear-gradient(
    to right,
    rgba(30, 30, 30, 0.7),
    rgba(10, 10, 10, 0.7)
  ) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0; /* Prevents footer from shrinking */
}

/* Rounded glass card effect */
.glass-card {
  border-radius: 20px;
  padding: 20px;
}

/* Social media icon hover effect */
.glass-icon:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

/* Footer text styling */
.footer-text {
  color: white;
  font-weight: 500;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.footer-link {
  color: #ffffff;
  font-weight: 500;
  text-transform: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin-left: 8px;
  margin-right: 8px;
  
  /* Glassmorphism effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 4px 12px;
  transition: all 0.3s ease-in-out;
}

/* Hover effect for interaction */
.footer-link:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

/* Mobile responsiveness */
@media (max-width: 960px) {
  .footer-text {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}

.glass-icon {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.glass-icon:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}

.glass-icon v-icon {
  color: white;
}

.glass-icon v-icon:hover {
  color: #ff4081;
  /* Change color on hover */
}
.glass-link-box {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease-in-out;
}

/* Optional hover effect */
.glass-link-box:hover {
  background: rgba(255, 255, 255, 0.15);
}

</style>