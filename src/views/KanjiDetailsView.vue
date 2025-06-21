<template>
    <v-container class="app-background" style="min-height: 100vh; padding: 24px;">
        <v-card class="glass-card pa-6 text-center" elevation="0">
            <!-- Loading View -->
            <div v-if="loading">
                <v-skeleton-loader type="card" class="mb-4 glass-card" elevation="0" max-width="1200" />
                <v-skeleton-loader type="card" class="mb-4 glass-card" elevation="0" />
                <v-skeleton-loader type="list-item-two-line" class="mb-4 glass-card" v-for="n in 3" :key="n" />
            </div>

            <!-- Error View -->
            <div v-else-if="error" class="text-center py-10">
                <v-icon color="error" size="64">mdi-alert-circle-outline</v-icon>
                <div class="text-h5 mt-4 text-contrast">Failed to load Kanji data</div>
                <div class="text-body-1 mb-4 text-contrast">Please try again or check the character</div>
                <v-btn color="primary" class="glass-button" @click="$router.go(-1)">
                    Back to Search
                </v-btn>
            </div>

            <!-- Kanji Details View -->
            <div v-else>
                <v-row class="mb-6 justify-center align-center">
                    <!-- Kanji Character -->
                    <v-col cols="12" md="4" class="text-center">
                        <div class="text-h1 text-contrast kanji-character">
                            {{ kanji.character || 'NULL' }}
                        </div>
                        <!-- Pronunciation Audio -->
                        <div class="mt-4">
                            <v-btn v-if="kanji.kunyomi?.audio" icon class="glass-icon"
                                @click="playAudio(kanji.kunyomi.audio, 'kunyomi')" :loading="audioLoading === 'kunyomi'"
                                :disabled="audioLoading">
                                <v-icon class="text-contrast">mdi-volume-high</v-icon>
                            </v-btn>
                            <v-btn v-if="kanji.onyomi?.audio" icon class="glass-icon"
                                @click="playAudio(kanji.onyomi.audio, 'onyomi')" :loading="audioLoading === 'onyomi'"
                                :disabled="audioLoading">
                                <v-icon class="text-contrast">mdi-volume-high</v-icon>
                            </v-btn>
                        </div>
                    </v-col>

                    <!-- Stroke Order Video -->
                    <v-col cols="12" md="4" class="text-center">
                        <video v-if="kanji.video?.mp4" controls autoplay muted loop width="128" height="128"
                            class="glass-video">
                            <source :src="kanji.video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div class="text-caption mt-1 text-contrast">Stroke order animation</div>
                    </v-col>
                </v-row>

                <v-divider class="my-4 glass-divider"></v-divider>

                <v-row class="mt-6">
                    <!-- Kanji Info Column -->
                    <v-col cols="12" md="5">
                        <v-card class="pa-4 glass-card" elevation="0">
                            <div class="text-h6 mb-4 text-contrast">Kanji Information</div>
                            <v-divider class="mb-4 glass-divider"></v-divider>
                            <v-simple-table class="glass-table">
                                <tbody>
                                    <tr>
                                        <td class="text-contrast"><strong>Stroke Count</strong></td>
                                        <td class="text-contrast">{{ kanji.strokes?.count || 'NULL' }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-contrast"><strong>Meaning</strong></td>
                                        <td class="text-contrast">{{ kanji.meaning?.english || 'NULL' }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-contrast"><strong>Kunyomi</strong></td>
                                        <td class="text-contrast">
                                            {{ kanji.kunyomi?.hiragana || 'NULL' }}
                                            <span v-if="kanji.kunyomi?.romaji">({{ kanji.kunyomi.romaji }})</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-contrast"><strong>Onyomi</strong></td>
                                        <td class="text-contrast">
                                            {{ kanji.onyomi?.romaji || 'NULL' }}
                                            <span v-if="kanji.onyomi?.katakana">({{ kanji.onyomi.katakana }})</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-card>
                    </v-col>

                    <!-- Examples Column -->
                    <v-col cols="12" md="7">
                        <v-card class="pa-4 glass-card" elevation="0">
                            <div class="text-h6 mb-4 text-contrast">Examples</div>
                            <v-divider class="mb-4 glass-divider"></v-divider>
                            <v-list v-if="examples.length > 0" class="glass-list">
                                <v-list-item v-for="(example, i) in examples" :key="i" class="glass-list-item">
                                    <v-list-item-content>
                                        <v-list-item-title class="text-h5 text-contrast">
                                            {{ example.japanese || 'NULL' }}
                                            <v-btn v-if="example.audio?.mp3" icon small class="glass-icon"
                                                @click="playAudio(example.audio.mp3, `example-${i}`)"
                                                :loading="audioLoading === `example-${i}`" :disabled="audioLoading">
                                                <v-icon class="text-contrast">mdi-volume-high</v-icon>
                                            </v-btn>
                                        </v-list-item-title>
                                        <v-list-item-subtitle class="text-contrast">
                                            {{ example.meaning?.english || 'NULL' }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <div v-else class="text-center py-4 text-contrast">
                                No examples available
                            </div>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Back Button -->
                <v-btn color="primary" class="mt-6 glass-button" @click="$router.go(-1)">
                    Back to Search
                </v-btn>

                <!-- Hidden Audio Element -->
                <audio ref="audioPlayer" style="display: none;"></audio>
            </div>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            kanji: {
                character: '',
                strokes: { count: 0 },
                meaning: { english: '' },
                kunyomi: { hiragana: '', romaji: '', audio: '' },
                onyomi: { romaji: '', katakana: '', audio: '' }
            },
            examples: [],
            loading: true,
            error: false,
            audioLoading: null,
            audioError: null
        };
    },
    async created() {
        try {
            const kanjiCharacter = JSON.parse(this.$route.params.word);
            await this.fetchKanjiDetails(kanjiCharacter);
        } catch (e) {
            console.error("Error loading kanji route param:", e);
            this.error = true;
            this.loading = false;
        }
    },
    methods: {
        async fetchKanjiDetails(kanjiCharacter) {
            try {
                const response = await fetch(
                    `https://kanjialive-api.p.rapidapi.com/api/public/kanji/${kanjiCharacter}`,
                    {
                        method: 'GET',
                        headers: {
                            "x-rapidapi-host": "kanjialive-api.p.rapidapi.com",
                            "x-rapidapi-key": "2cf276514cmshc0e530d0c7954e5p153142jsne2ea7993d315"
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (!data.kanji || !data.kanji.character) {
                        throw new Error("Invalid Kanji data");
                    }
                    this.kanji = data.kanji;
                    console.log("Kanji character:", this.kanji);
                    console.log("Kanji details fetched successfully:", this.kanji);
                    this.examples = data.examples || [];
                } else {
                    throw new Error(`HTTP error: ${response.status}`);
                }
            } catch (error) {
                console.error("API Error:", error);
                this.error = true;
            } finally {
                this.loading = false;
            }
        },
        playAudio(audioUrl, type) {
            if (!audioUrl) return;

            this.audioLoading = type;
            this.audioError = null;

            const audioPlayer = this.$refs.audioPlayer;
            audioPlayer.src = audioUrl;

            audioPlayer.play()
                .then(() => {
                    console.log("Audio playing successfully");
                })
                .catch(error => {
                    console.error("Audio playback failed:", error);
                    this.audioError = type;
                })
                .finally(() => {
                    this.audioLoading = null;
                });
        }
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
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
    border-radius: 16px !important;
}

/* Glass button styling */
.glass-button {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: white !important;
    text-transform: none;
    font-weight: 500;
    letter-spacing: normal;
}

.glass-button:hover {
    background: rgba(255, 255, 255, 0.3) !important;
}

/* Glass icon buttons */
.glass-icon {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 50%;
    padding: 8px;
    border: 1px solid rgba(255, 255, 255, 0.18);
}

.glass-icon:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Glass video styling */
.glass-video {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Glass divider styling */
.glass-divider {
    border-color: rgba(255, 255, 255, 0.2) !important;
}

/* Glass table styling */
.glass-table {
    background: transparent !important;
}

.glass-table td {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Glass list styling */
.glass-list {
    background: transparent !important;
}

.glass-list-item {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 8px;
    margin-bottom: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Text contrast for better readability */
.text-contrast {
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Kanji character styling */
.kanji-character {
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    color: #ffffff;
}

/* Caption text styling */
.text-caption {
    font-style: italic;
    opacity: 0.8;
}

/* Skeleton loader styling */
:deep(.v-skeleton-loader__bone) {
    background: rgba(255, 255, 255, 0.1) !important;
}

/* Error icon styling */
.v-icon[color="error"] {
    color: #ff5252 !important;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Responsive adjustments */
@media (max-width: 960px) {
    .kanji-character {
        font-size: 48px !important;
    }

    .glass-card {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }
}

@media (max-width: 600px) {
    .kanji-character {
        font-size: 36px !important;
    }

    .glass-card {
        padding: 16px !important;
    }
}
</style>