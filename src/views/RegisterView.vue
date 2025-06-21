<template>
  <v-container class="d-flex justify-center align-center app-background" style="height: 100vh;">
    <v-card class="register-card glass-card" elevation="8" width="500">
      <v-card-title class="text-center text-h4 font-weight-bold text-contrast py-6">
        <v-icon large class="mr-2">mdi-account-plus</v-icon>
        Register
      </v-card-title>
      
      <v-alert v-if="error" type="error" dense class="mx-4">
        {{ errorMessage }}
      </v-alert>

      <v-form ref="form" @submit.prevent="register" class="px-4">
        <v-text-field
          v-model="user.name"
          label="Username"
          prepend-inner-icon="mdi-account"
          outlined
          dense
          color="white"
          class="text-contrast"
          :rules="[v => !!v || 'Username is required']"
          required
          @input="$refs.form.validate()"
        ></v-text-field>

        <v-text-field
          v-model="user.pwd"
          label="Password"
          prepend-inner-icon="mdi-lock"
          outlined
          dense
          color="white"
          class="text-contrast"
          :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Password must be at least 6 characters']"
          type="password"
          required
          @input="$refs.form.validate()"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          prepend-inner-icon="mdi-lock-check"
          outlined
          dense
          color="white"
          class="text-contrast"
          :rules="[
            v => !!v || 'Please confirm password', 
            () => confirmPassword === user.pwd || 'Passwords do not match'
          ]"
          type="password"
          required
          @input="$refs.form.validate()"
        ></v-text-field>

        <v-select
          v-model="user.role"
          :items="['User', 'Admin']"
          label="Role"
          prepend-inner-icon="mdi-account-key"
          outlined
          dense
          color="white"
          class="text-contrast"
          :rules="[v => !!v || 'Role is required']"
          required
        ></v-select>

        <v-text-field
          v-model="user.description"
          label="Description"
          prepend-inner-icon="mdi-text"
          outlined
          dense
          color="white"
          class="text-contrast"
        ></v-text-field>

        <v-btn 
          type="submit" 
          color="primary" 
          block 
          class="mt-2 mb-4 glass-button"
          :loading="loading"
          :disabled="loading"
        >
          <v-icon left>mdi-account-plus</v-icon>
          Register
        </v-btn>

        <div class="text-center text-contrast mt-4">
          Already have an account? 
          <v-btn text color="primary" @click="$router.push('/login')" class="glass-button">Login</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/api';

const router = useRouter();
const form = ref(null);
const user = ref({
  name: '',
  pwd: '',
  role: 'User',
  description: ''
});
const confirmPassword = ref('');
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');

async function register() {
  const { valid } = await form.value.validate();
  
  if (!valid) {
    error.value = true;
    errorMessage.value = 'Please fix all validation errors';
    return;
  }

  try {
    loading.value = true;
    error.value = false;
    
    const response = await api.saveUser(user.value);
    
    if (response) {
      router.push('/login');
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = err.response?.data?.message || 'Registration failed. Please try again.';
    console.error("Registration error:", err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-card {
  border-radius: 16px;
}
</style>