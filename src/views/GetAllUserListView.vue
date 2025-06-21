<template>
  <v-container class="app-background" style="min-height: 100vh; padding-top: 20px;">
    <v-sheet border rounded class="glass-card">
      <v-data-table 
        :headers="headers" 
        :hide-default-footer="users.length < 11" 
        :items="users"
        class="glass-table"
      >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <v-icon color="medium-emphasis" icon="mdi-account-group" size="x-small" start></v-icon>
                        User List
                    </v-toolbar-title>

                    <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Add a User" border
                        @click="add"></v-btn>
                </v-toolbar>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
                <div class="d-flex ga-2 justify-end">
                    <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>
                    <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
                </div>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:no-data>
                <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border
                    @click="reset"></v-btn>
            </template>
        </v-data-table>
    </v-sheet>

    <v-dialog v-model="dialog" max-width="500">
      <v-card class="glass-card" :subtitle="`${isEditing ? 'Update' : 'Create'} a user`" :title="`${isEditing ? 'Edit' : 'Add'} User`">
            <template v-slot:text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="record.name" label="Name" />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-select v-model="record.role" :items="['Admin', 'User']" label="Role" clearable />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="record.pwd" label="Password" type="password"
                            autocomplete="new-password" />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="record.description" label="Description" />
                    </v-col>
                </v-row>
            </template>

            <v-divider></v-divider>

            <v-card-actions class="bg-surface-light">
                <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>
                <v-spacer></v-spacer>
                <v-btn text="Save" @click="save"></v-btn>
            </v-card-actions>
       </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import api from '@/utils/api'
import { onMounted, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

const DEFAULT_RECORD = { name: '',pwd:'', role: '', description: '' }

const router = useRouter();

// Check authentication before loading
const authUser = JSON.parse(localStorage.getItem('authUser'));
if (!authUser) {
  router.push('/login');
}

const users = ref([])
const record = ref({ ...DEFAULT_RECORD })
const dialog = shallowRef(false)
const isEditing = shallowRef(false)

const headers = [
    { title: 'Id', key: 'id', align: 'start', sortable: true },
    { title: 'Name', key: 'name' },
    { title: 'Role', key: 'role' },
    { title: 'Password', key: 'pwd' },
    { title: 'Description', key: 'description' },
    { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

onMounted(async () => {
    await loadUsers()
})

async function loadUsers() {
    try {
        const result = await api.getAllUser("/getAll")
        if (result) {
            users.value = result
        }
    } catch (error) {
        console.error("Failed to fetch users:", error)
    }
}

function add() {
    isEditing.value = false
    record.value = { ...DEFAULT_RECORD }
    dialog.value = true
}

function edit(id) {
    const found = users.value.find(user => user.id === id)
    if (!found) return

    isEditing.value = true
    record.value = { ...found }
    dialog.value = true
}

async function remove(id) {
    if (!confirm("Are you sure to delete this user?")) return

    try {
        const result = await api.deleteUser(id)
        if (result?.includes("success")) {
            await loadUsers() // Refresh the list after deletion
        }
    } catch (error) {
        console.error("Failed to delete user:", error)
    }
}

async function save() {
    try {
        if (isEditing.value) {
            const result = await api.updateUser(record.value)
            if (result?.includes("success")) {
                await loadUsers() // Refresh the list after update
            }
        } else {
            const result = await api.saveUser(record.value)
            if (result) {
                await loadUsers() // Refresh the list after creation
            }
        }
        dialog.value = false
    } catch (error) {
        console.error("Failed to save user:", error)
    }
}

function reset() {
    dialog.value = false
    record.value = { ...DEFAULT_RECORD }
    loadUsers()
}

</script>