<template>
  <v-navigation-drawer :value="value" @input="$emit('input', $event)" app width="256" class="glass-nav-drawer">
    <v-list-item class="glass-header">
      <v-list-item-content>
        <v-list-item-title class="text-h6 font-weight-bold text-contrast">
          Japanese Dictionary
        </v-list-item-title>
        <v-list-item-subtitle class="text-contrast">MBTC</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider class="mb-2 glass-divider"></v-divider>

    <v-list dense nav class="glass-list">
      <v-list-item link to="/jp" active-class="active-nav-item" class="glass-list-item">
        <v-list-item-icon>
          <v-icon class="text-contrast">mdi-translate</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="text-contrast">English to Kanji</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="/jpDic" class="glass-list-item" active-class="active-nav-item">
        <v-list-item-icon>
          <v-icon class="text-contrast">mdi-book</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="text-contrast">Kanji Dictionary</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Only show User List to authenticated users -->
      <v-list-item v-if="$store.state.login" link to="/allUser" class="glass-list-item" active-class="active-nav-item">
        <v-list-item-icon>
          <v-icon icon="mdi-account-group" start class="text-contrast"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="text-contrast">User List</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Only show JLPT to authenticated users -->
      <v-list-item v-if="$store.state.login" link to="/jlpt" class="glass-list-item" active-class="active-nav-item">
        <v-list-item-icon>
          <v-icon icon="mdi-account-group" start class="text-contrast"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="text-contrast">JLPT Dictionary</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  emits: ['input']
}
</script>

<style scoped>
/* Glass navigation drawer */
.glass-nav-drawer {
  background: rgba(33, 33, 33, 0.8) !important;
  /* Dark semi-transparent background */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Glass header */
.glass-header {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

/* Glass list */
.glass-list {
  background: transparent !important;
}

/* Glass list items */
.glass-list-item {
  background: rgba(148, 144, 144, 0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.glass-list-item:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateX(4px);
}

/* Active nav item */
.active-nav-item {
  background: rgba(31, 2, 160, 0.3) !important;
  border-left: 4px solid #0080ff;
}

.active-nav-item .v-list-item__title {
  font-weight: 600;
}

/* Glass divider */
.glass-divider {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Text contrast */
.text-contrast {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Icon styling */
.v-icon {
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
}
</style>