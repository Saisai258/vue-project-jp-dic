<template>
  <div class="about">
    <h1>This is an about page</h1>
    <v-btn @click="logout()" color="primary">
      logout
    </v-btn>
  </div>
</template>

<script>
export default {


  methods: {
    logout() {
      this.$store.dispatch("LogoutStateChange");
      this.$router.push("/");
    }
  }
}
</script>
