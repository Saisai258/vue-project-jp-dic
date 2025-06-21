<template>
    <v-container class="app-background" style="min-height: 100vh; padding: 24px;">
        <!-- Search Card with Glass Effect -->
        <v-card class="search-card glass-card pa-4 mb-6" elevation="0">
            <v-row align="center">
                <v-col cols="12" md="8">
                    <v-text-field 
                        v-model="word" 
                        label="Enter English Word" 
                        outlined
                        clearable
                        hide-details
                        @keyup.enter="searchKanji"
                        class="glass-input"
                        color="white"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                    <v-btn 
                        color="primary" 
                        large 
                        block 
                        @click="searchKanji" 
                        :loading="circle"
                        class="glass-button"
                    >
                        Search Kanji
                        <template v-slot:loader>
                            <span class="text-contrast">Searching...</span>
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>

        <!-- Skeleton Loaders with Glass Effect -->
        <div v-if="loading">
            <v-card class="pa-4 content-card glass-card" elevation="0">
                <v-row>
                    <v-col cols="12" sm="6" md="4" lg="3" v-for="n in 8" :key="n">
                        <v-skeleton-loader 
                            type="card" 
                            class="mb-4 glass-card" 
                            elevation="0"
                        />
                    </v-col>
                </v-row>
            </v-card>
        </div>

        <!-- Search Results with Glass Effect -->
        <v-card 
            v-else-if="searched && kanji.length > 0" 
            class="pa-4 content-card glass-card" 
            elevation="0"
        >
            <v-subheader class="text-contrast section-header">Search Results</v-subheader>
            <v-divider class="mb-4 glass-divider"></v-divider>

            <v-row dense>
                <v-col 
                    v-for="(item, index) in kanji" 
                    :key="index" 
                    cols="12" 
                    sm="6" 
                    md="4" 
                    lg="3"
                >
                    <v-card class="kanji-card pa-4 text-center glass-card" elevation="0">
                        <div class="text-h4 mb-2 kanji-character text-contrast">
                            {{ item.kanji?.character || 'NULL' }}
                        </div>

                        <v-chip class="ma-1 glass-chip" small>
                            Strokes: {{ item.kanji?.stroke || item.kanji?.stroke_count || item.kanji?.strokes || 'NULL' }}
                        </v-chip>

                        <v-divider class="my-3 glass-divider"></v-divider>

                        <v-btn 
                            color="primary" 
                            class="glass-button" 
                            block 
                            @click="searchkanjiDetails(item.kanji?.character || '')"
                        >
                            Details
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>

        <!-- No Results Card with Glass Effect -->
        <v-card 
            v-else-if="searched && kanji.length === 0" 
            class="pa-4 text-center content-card glass-card" 
            elevation="0"
        >
            <v-icon large class="mb-2 text-contrast">mdi-magnify</v-icon>
            <div class="text-h6 text-contrast">No results found</div>
            <div class="text-body-1 text-contrast">Try a different search term</div>
        </v-card>
    </v-container>
</template>

<script>
import api from '../utils/api.js';

export default {
    data() {
        return {
            word: '',
            kanji: [],
            circle: false,
            searched: false,
            loading: false
        };
    },
    methods: {
        async searchKanji() {
            if (!this.word) return;

            this.circle = true;
            this.loading = true;
            this.searched = false;
            this.kanji = [];
            try {
                const resp = await api.get_searchKanjiWord(this.word);
                if (resp && resp.status === 200) {
                    const data = await resp.json();
                    this.kanji = Array.isArray(data) ? data : [data];
                    console.log("Kanji fetched successfully:", data);
                } else {
                    this.kanji = [];    
                }
            } catch (error) {
                console.error("Error fetching Kanji:", error);
                this.kanji = [];
            } finally {
                this.circle = false;
                this.loading = false;
                this.searched = true;
            }
        },
        searchkanjiDetails(word) {
            if (!word) return;
            this.$router.push({
                name: "details",
                params: { word: JSON.stringify(word) }
            });
        },
    }
}
</script>

<style scoped>
/* Base container styling */
.app-background {
    background-image: url('https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
}

/* Glass card styling */
.glass-card {
    background: rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
    border-radius: 12px !important;
}

/* Glass button styling */
.glass-button {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: white !important;
    text-transform: none;
    letter-spacing: normal;
    font-weight: 500;
}

.glass-button:hover {
    background: rgba(255, 255, 255, 0.3) !important;
}

/* Glass input field styling */
.glass-input :deep(.v-field) {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    color: white !important;
}

.glass-input :deep(.v-field__outline) {
    color: rgba(255, 255, 255, 0.5) !important;
}

.glass-input :deep(.v-label) {
    color: rgba(255, 255, 255, 0.8) !important;
}

/* Glass chip styling */
.glass-chip {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    color: white !important;
}

/* Glass divider styling */
.glass-divider {
    border-color: rgba(255, 255, 255, 0.2) !important;
}

/* Text contrast for better readability */
.text-contrast {
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Section header styling */
.section-header {
    font-size: 1.1rem;
    font-weight: 500;
    padding-left: 0;
}

/* Kanji card hover effect */
.kanji-card {
    transition: all 0.3s ease;
}

.kanji-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
    cursor: pointer;
}

.kanji-character {
    font-weight: 500;
    transition: all 0.3s ease;
}

/* Skeleton loader styling */
:deep(.v-skeleton-loader__bone) {
    background: rgba(255, 255, 255, 0.1) !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .glass-card {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }
    
    .kanji-card {
        padding: 16px !important;
    }
}
</style>