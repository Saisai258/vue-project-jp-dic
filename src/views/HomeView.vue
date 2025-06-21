<template>
  <v-container class="glass-dashboard">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-center text-contrast">日本語学習ダッシュボード</h1>
        <p class="text-center text-contrast">Japanese Learning Progress</p>
      </v-col>
    </v-row>

    <!-- Progress Circular Cards -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-card class="glass-card pa-4">
          <v-card-title class="text-contrast text-center">学習進捗</v-card-title>
          <div class="d-flex justify-space-around flex-wrap">
            <div class="text-center ma-2" v-for="(progress, i) in studyProgress" :key="i">
              <v-progress-circular
                :rotate="-90"
                :size="120"
                :width="15"
                :model-value="progress.value"
                :color="progress.color"
              >
                <div class="text-contrast">
                  <div class="text-h6">{{ progress.value }}%</div>
                  <div class="text-caption">{{ progress.label }}</div>
                </div>
              </v-progress-circular>
              <div class="text-contrast mt-2">{{ progress.details }}</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="glass-card pa-4">
          <v-card-title class="text-contrast text-center">スキルマスター</v-card-title>
          <div class="d-flex justify-space-around flex-wrap">
            <div class="text-center ma-2" v-for="(skill, i) in skillMastery" :key="i">
              <v-progress-circular
                :rotate="-90"
                :size="120"
                :width="15"
                :model-value="skill.value"
                :color="skill.color"
              >
                <div class="text-contrast">
                  <div class="text-h6">{{ skill.value }}%</div>
                  <div class="text-caption">{{ skill.label }}</div>
                </div>
              </v-progress-circular>
              <div class="text-contrast mt-2">{{ skill.details }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

<!-- Weekly Activity Card -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="glass-card text-center" max-width="1200" dark>
          <v-card-text>
            <v-sheet color="rgba(255, 255, 255, .12)" class="glass-sheet">
              <v-sparkline
                :model-value="weeklyActivity"
                :labels="['月', '火', '水', '木', '金', '土', '日']"
                color="rgba(255, 255, 255, .7)"
                height="120"
                padding="24"
                stroke-linecap="round"
                smooth
                auto-draw
              >
                <template v-slot:label="item">
                  <text x="50%" y="100%" text-anchor="middle" style="fill: white; font-size: 12px">
                    {{ item.value }}分
                  </text>
                </template>
              </v-sparkline>
            </v-sheet>
          </v-card-text>

          <v-card-text>
            <div class="text-h4 font-weight-thin text-contrast">
              今週の学習時間
            </div>
            <div class="text-subtitle-1 text-contrast">
              合計: {{ totalWeeklyActivity }} 分 ({{ weeklyAverage }} 分/日)
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Stats -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="glass-card pa-4">
          <v-card-title class="text-contrast text-center">学習統計</v-card-title>
          <v-row>
            <v-col cols="6" md="3" v-for="(stat, i) in quickStats" :key="i">
              <div class="text-center">
                <v-progress-circular
                  :rotate="-90"
                  :size="80"
                  :width="10"
                  :model-value="stat.value"
                  :color="stat.color"
                >
                  <v-icon :color="stat.color">{{ stat.icon }}</v-icon>
                </v-progress-circular>
                <div class="text-contrast mt-2">
                  <div class="text-subtitle-1">{{ stat.label }}</div>
                  <div class="text-body-2">{{ stat.detail }}</div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Action Buttons -->
    <v-row>
      <v-col cols="12">
        <v-card class="glass-card pa-4">
          <div class="d-flex justify-space-around flex-wrap">
            <v-btn
              v-for="(action, i) in quickActions"
              :key="i"
              class="glass-button ma-2"
              :to="action.route"
              :prepend-icon="action.icon"
              size="large"
            >
              {{ action.label }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      weeklyActivity: [45, 80, 60, 110, 90, 50, 95],
      studyProgress: [
        { label: '文法', value: 65, color: '#4fc3f7', details: 'N3レベル完了' },
        { label: '読解', value: 45, color: '#81c784', details: '15/30 課' },
        { label: '聴解', value: 55, color: '#ffb74d', details: '72% 正解率' },
        { label: '作文', value: 35, color: '#ba68c8', details: '改善必要' }
      ],
      skillMastery: [
        { label: '漢字', value: 68, color: '#ff8a65', details: '650/950 字' },
        { label: '語彙', value: 72, color: '#aed581', details: '1200/1650 語' },
        { label: '会話', value: 58, color: '#64b5f6', details: '中級レベル' },
        { label: '試験', value: 62, color: '#ffd54f', details: 'N3 準備中' }
      ],
      quickStats: [
        { label: '連続日数', value: 100, color: 'red', icon: 'mdi-fire', detail: '14日' },
        { label: '目標達成', value: 75, color: 'green', icon: 'mdi-check-all', detail: '今週 3/4' },
        { label: '復習必要', value: 30, color: 'orange', icon: 'mdi-alert', detail: '15項目' },
        { label: '習得率', value: 68, color: 'blue', icon: 'mdi-star', detail: '全体 68%' }
      ],
      quickActions: [
        { label: '練習', icon: 'mdi-pencil', route: '/practice' },
        { label: '単語', icon: 'mdi-book', route: '/vocabulary' },
        { label: '漢字', icon: 'mdi-character', route: '/kanji' },
        { label: 'JLPTテスト', icon: 'mdi-clipboard-text', route: '/jlpt-tests' }
      ]
    }
  },
  computed: {
    totalWeeklyActivity() {
      return this.weeklyActivity.reduce((a, b) => a + b, 0)
    },
    weeklyAverage() {
      return Math.round(this.totalWeeklyActivity / this.weeklyActivity.length)
    }
  }
}
</script>

<style scoped>
.glass-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15) !important;
  border-radius: 12px !important;
}

.glass-sheet {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(5px);
  border-radius: 8px;
}

.glass-button {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: white !important;
  text-transform: none;
  font-weight: 500;
  min-width: 160px;
}

.text-contrast {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.v-progress-circular {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  padding: 8px;
}

@media (max-width: 960px) {
  .glass-dashboard {
    padding: 1rem;
  }
  
  .glass-button {
    min-width: 140px;
    margin: 4px !important;
  }
  
  .v-progress-circular {
    size: 100px;
  }
}
</style>