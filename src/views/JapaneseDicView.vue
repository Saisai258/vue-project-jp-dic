<template>
  <v-container class="app-background" fluid>
    <!-- Loading Skeleton -->
    <v-row v-if="loading">
      <v-col
        v-for="n in 12"
        :key="n"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-skeleton-loader
          type="card"
          class="glass-card"
          height="150"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Kanji Grid -->
    <v-row v-else>
      <v-col
        v-for="(kanji, index) in allKanji"
        :key="index"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-card 
          class="glass-card kanji-card"
          @click="showKanjiDetails(kanji)"
        >
          <v-card-text class="text-center">
            <div class="text-h2 kanji-character">{{ kanji.kanji.character }}</div>
            <div class="text-subtitle-1 text-contrast mt-2">
              {{ kanji.kanji.meaning.english }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <div v-if="!loading && allKanji.length === 0" class="text-center py-12">
      <v-icon size="64" color="white">mdi-alert-circle-outline</v-icon>
      <div class="text-h4 text-contrast mt-4">No kanji found</div>
    </div>

    <!-- Kanji Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800" persistent>
      <v-card class="glass-card">
        <v-card-title class="text-h4 font-weight-bold text-contrast">
          {{ selectedKanji.kanji?.character }} Details
        </v-card-title>
        
        <v-card-text>
          <v-row>
            <!-- Left Column -->
            <v-col cols="12" md="6">
              <div class="text-center">
                <div class="text-h1 kanji-character mb-4">
                  {{ selectedKanji.kanji?.character }}
                </div>
                
                <!-- Stroke Order Video -->
                <video
                  v-if="selectedKanji.kanji?.video?.mp4"
                  controls
                  autoplay
                  muted
                  loop
                  class="glass-video mb-4"
                >
                  <source :src="selectedKanji.kanji.video.mp4" type="video/mp4">
                </video>
                
                <!-- Pronunciation -->
                <div class="d-flex justify-center">
                  <v-btn
                    v-if="selectedKanji.kanji?.onyomi?.audio"
                    icon
                    large
                    class="glass-icon mx-2"
                    @click="playAudio(selectedKanji.kanji.onyomi.audio, 'onyomi')"
                  >
                    <v-icon large>mdi-volume-high</v-icon>
                    <span class="ml-2">Onyomi</span>
                  </v-btn>
                  
                  <v-btn
                    v-if="selectedKanji.kanji?.kunyomi?.audio"
                    icon
                    large
                    class="glass-icon mx-2"
                    @click="playAudio(selectedKanji.kanji.kunyomi.audio, 'kunyomi')"
                  >
                    <v-icon large>mdi-volume-high</v-icon>
                    <span class="ml-2">Kunyomi</span>
                  </v-btn>
                </div>
              </div>
            </v-col>
            
            <!-- Right Column -->
            <v-col cols="12" md="6">
              <v-simple-table class="glass-table mb-6">
                <tbody>
                  <tr>
                    <td><strong class="text-contrast">Meaning</strong></td>
                    <td class="text-contrast">{{ selectedKanji.kanji?.meaning?.english }}</td>
                  </tr>
                  <tr>
                    <td><strong class="text-contrast">Stroke Count</strong></td>
                    <td class="text-contrast">{{ selectedKanji.kanji?.strokes?.count }}</td>
                  </tr>
                  <tr>
                    <td><strong class="text-contrast">Onyomi</strong></td>
                    <td class="text-contrast">
                      {{ selectedKanji.kanji?.onyomi?.romaji }}
                      <span v-if="selectedKanji.kanji?.onyomi?.katakana">
                        ({{ selectedKanji.kanji.onyomi.katakana }})
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong class="text-contrast">Kunyomi</strong></td>
                    <td class="text-contrast">
                      {{ selectedKanji.kanji?.kunyomi?.hiragana }}
                      <span v-if="selectedKanji.kanji?.kunyomi?.romaji">
                        ({{ selectedKanji.kanji.kunyomi.romaji }})
                      </span>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
              
              <!-- Examples -->
              <div v-if="selectedKanji.examples?.length > 0">
                <div class="text-h6 text-contrast mb-2">Examples</div>
                <v-divider class="glass-divider mb-4"></v-divider>
                <v-list class="glass-list">
                  <v-list-item
                    v-for="(example, index) in selectedKanji.examples"
                    :key="index"
                    class="glass-list-item"
                  >
                    <v-list-item-content>
                      <v-list-item-title class="text-contrast">
                        {{ example.japanese }}
                        <v-btn
                          v-if="example.audio?.mp3"
                          icon
                          small
                          class="glass-icon ml-2"
                          @click="playAudio(example.audio.mp3, `example-${index}`)"
                        >
                          <v-icon small>mdi-volume-high</v-icon>
                        </v-btn>
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-contrast">
                        {{ example.meaning?.english }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions class="glass-actions">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="glass-button"
            @click="detailsDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Audio Player (hidden) -->
    <audio ref="audioPlayer" style="display: none;"></audio>
  </v-container>
</template>

<script>
import api from '@/utils/api';

export default {
  data() {
    return {
      allKanji: [],
      selectedKanji: {},
      detailsDialog: false,
      loading: false,
      audioLoading: null
    };
  },
  async created() {
    await this.fetchAllKanji();
  },
  methods: {
    async fetchAllKanji() {
      this.loading = true;
      try {
        const response = await api.get_allKanjiWord();
        if (response && response.ok) {
          this.allKanji = await response.json();
        } else {
          throw new Error('Failed to fetch kanji');
        }
      } catch (error) {
        console.error('Error fetching kanji:', error);
        this.allKanji = [];
      } finally {
        this.loading = false;
      }
    },
    
    showKanjiDetails(kanji) {
      this.selectedKanji = kanji;
      this.detailsDialog = true;
    },
    
    playAudio(audioUrl, type) {
      if (!audioUrl) return;
      
      this.audioLoading = type;
      const audioPlayer = this.$refs.audioPlayer;
      audioPlayer.src = audioUrl;
      
      audioPlayer.play()
        .catch(error => {
          console.error('Audio playback failed:', error);
        })
        .finally(() => {
          this.audioLoading = null;
        });
    }
  }
};
</script>

<style scoped>
/* Add this new style for skeleton loader */
.v-skeleton-loader.glass-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
}

/* Rest of your existing styles... */
.app-background {
  background-image: url('https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 24px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(31, 38, 135, 0.5) !important;
}

/* Kanji card specific */
.kanji-card {
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kanji-character {
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Glass button */
.glass-button {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: white !important;
  text-transform: none;
  letter-spacing: normal;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}

/* Glass list */
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
  transition: all 0.3s ease;
}

.glass-list-item:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Glass table */
.glass-table {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 8px;
}

.glass-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Glass icon */
.glass-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 50%;
}

.glass-icon:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Glass video */
.glass-video {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-width: 100%;
}

/* Glass divider */
.glass-divider {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

/* Glass actions */
.glass-actions {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 0 0 16px 16px;
}

/* Text contrast */
.text-contrast {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .kanji-character {
    font-size: 48px !important;
  }
}

@media (max-width: 600px) {
  .glass-card {
    padding: 16px !important;
  }
  
  .kanji-character {
    font-size: 36px !important;
  }
}
</style>