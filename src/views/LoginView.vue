<template>
  <v-container class="d-flex justify-center align-center app-background" style="height: 100vh;">
    <v-card class="login-card glass-card" elevation="8" width="450">
      <v-card-title class="text-center text-h4 font-weight-bold text-contrast py-6">
        <v-icon large class="mr-2">mdi-account-circle</v-icon>
        User Login
      </v-card-title>
      
      <v-alert v-if="error" type="error" dense class="mx-4">
        {{ errorMessage }}
      </v-alert>

      <v-form ref="form" @submit.prevent="login" class="px-4">
        <v-text-field
          v-model="credentials.name"
          label="Username"
          prepend-inner-icon="mdi-account"
          outlined
          dense
          color="white"
          class="text-contrast"
          :rules="[v => !!v || 'Username is required']"
          required
        ></v-text-field>

        <v-text-field
          v-model="credentials.pwd"
          label="Password"
          prepend-inner-icon="mdi-lock"
          outlined
          dense
          color="white"
          class="text-contrast"
          :rules="[v => !!v || 'Password is required']"
          type="password"
          required
        ></v-text-field>

        <v-btn 
          type="submit" 
          color="primary" 
          block 
          class="mt-2 mb-4 glass-button"
          :loading="loading"
          :disabled="loading"
        >
          <v-icon left>mdi-login</v-icon>
          Login
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'; // Add this import
import api from '@/utils/api';

const router = useRouter();
const store = useStore(); // Initialize the store

const credentials = ref({
  name: '',
  pwd: ''
});
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');

async function login() {
  try {
    loading.value = true;
    error.value = false;
    
    const user = await api.loginCheck(credentials.value);
    
    if (user) {
      // Store user data in localStorage
      localStorage.setItem('authUser', JSON.stringify(user));
      
      // Commit to Vuex store
      store.commit('SET_USER', user); // Make sure this mutation exists in your store
      store.commit('Login_State_Change');
      
      router.push('/'); // Redirect to home after login
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = 'Invalid username or password';
    console.error("Login error:", err);
  } finally {
    loading.value = false;
  }
}
</script>