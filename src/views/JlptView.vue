<template>
  <v-container class="pa-4">
    <!-- Header Card -->
    <v-row>
      <v-col cols="12">
        <v-card class="glass-card pa-4" elevation="0">
          <v-card-title class="text-contrast text-center">
            <v-icon size="40" class="mr-2" color="white">mdi-alpha-j-box-outline</v-icon>
            JLPT STUDY RESOURCES
          </v-card-title>
          <v-card-subtitle class="text-center text-contrast">
            <h3 color="white">Kanji, Vocabulary and Grammar by JLPT Levels</h3>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- JLPT Levels -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="glass-card pa-4" elevation="0">
          <v-tabs v-model="tab" grow>
            <v-tab value="kanji">
              <v-icon left color="white">mdi-ideogram-cjk</v-icon>
              Kanji
            </v-tab>
            <v-tab value="vocabulary">
              <v-icon left color="white">mdi-book-alphabet</v-icon>
              Vocabulary
            </v-tab>
            <v-tab value="grammar">
              <v-icon left color="white">mdi-book-open-variant</v-icon>
              Grammar
            </v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <!-- Kanji Tab -->
            <v-window-item value="kanji">
              <v-card class="glass-card-inner mt-4" elevation="0">
                <v-card-text>
                  <v-toolbar density="compact" class="glass-toolbar mb-4">
                    <v-toolbar-title class="text-white">Select JLPT Level:</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn-toggle v-model="selectedLevel" mandatory divided variant="outlined" class="glass-toggle">
                      <v-btn v-for="level in jlptLevels" :key="`kanji-level-${level.id}`" :value="level.id" size="small"
                        class="text-white">
                        <v-icon left>{{ level.icon }}</v-icon>
                        {{ level.id.toUpperCase() }}
                      </v-btn>
                    </v-btn-toggle>
                  </v-toolbar>

                  <div v-if="kanjiData[selectedLevel]?.length">
                    <div class="d-flex flex-wrap">
                      <v-chip v-for="(k, i) in kanjiData[selectedLevel]" :key="i" class="ma-1" color="orange-lighten-4"
                        @click="showDetails('kanji', k)">
                        {{ k.character }} ({{ k.meanings.join(', ') }})
                      </v-chip>
                    </div>
                  </div>
                  <v-alert v-else type="info" class="mt-2">
                    No kanji found for this level.
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Vocabulary Tab -->
            <v-window-item value="vocabulary">
              <v-card class="glass-card-inner mt-4" elevation="0">
                <v-card-text>
                  <v-toolbar density="compact" class="glass-toolbar mb-4">
                    <v-toolbar-title class="text-white">Select JLPT Level:</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn-toggle v-model="selectedLevel" mandatory divided variant="outlined" class="glass-toggle">
                      <v-btn v-for="level in jlptLevels" :key="`vocab-level-${level.id}`" :value="level.id" size="small"
                        class="text-white">
                        <v-icon left>{{ level.icon }}</v-icon>
                        {{ level.id.toUpperCase() }}
                      </v-btn>
                    </v-btn-toggle>
                  </v-toolbar>

                  <div v-if="vocabData[selectedLevel]?.length">
                    <div class="d-flex flex-wrap">
                      <v-chip v-for="(word, i) in vocabData[selectedLevel]" :key="i" class="ma-1" color="blue-lighten-4"
                        @click="showDetails('vocabulary', word)">
                        {{ word.japanese }} ({{ word.meaning }})
                      </v-chip>
                    </div>
                  </div>
                  <v-alert v-else type="info" class="mt-2">
                    No vocabulary found for this level.
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Grammar Tab -->
            <v-window-item value="grammar">
              <v-card class="glass-card-inner mt-4" elevation="0">
                <v-card-text>
                  <v-toolbar density="compact" class="glass-toolbar mb-4">
                    <v-toolbar-title class="text-white">Select JLPT Level:</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn-toggle v-model="selectedLevel" mandatory divided variant="outlined" class="glass-toggle">
                      <v-btn v-for="level in jlptLevels" :key="`grammar-level-${level.id}`" :value="level.id"
                        size="small" class="text-white">
                        <v-icon left>{{ level.icon }}</v-icon>
                        {{ level.id.toUpperCase() }}
                      </v-btn>
                    </v-btn-toggle>
                  </v-toolbar>

                  <div v-if="grammarData[selectedLevel]?.length">
                    <v-list lines="two" class="glass-list">
                      <v-list-item v-for="(point, i) in grammarData[selectedLevel]" :key="i" class="glass-list-item"
                        @click="showDetails('grammar', point)">
                        <template v-slot:prepend>
                          <v-icon color="green-darken-2">mdi-bookmark</v-icon>
                        </template>
                        <v-list-item-title class="text-contrast">{{ point.structure }}</v-list-item-title>
                        <v-list-item-subtitle class="text-contrast">{{ point.meaning }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </div>
                  <v-alert v-else type="info" class="mt-2">
                    No grammar points found for this level.
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="600">
      <v-card class="glass-card">
        <v-card-title class="text-center text-bright pt-6">
          <span v-if="currentDetailType === 'kanji'" class="display-3 kanji-character">{{ selectedItem?.character
          }}</span>
          <span v-else class="text-h4">{{ selectedItem?.japanese || selectedItem?.structure }}</span>
        </v-card-title>

        <v-divider class="my-4 mx-4" color="rgba(255,255,255,0.2)"></v-divider>

        <v-card-text class="text-bright pb-6">
          <v-row>
            <template v-if="currentDetailType === 'kanji'">
              <v-col cols="12" sm="6">
                <div class="detail-section">
                  <h3 class="detail-title">Meanings</h3>
                  <p class="detail-content meanings-text">
                    {{ selectedItem?.meanings.join(', ') || 'No meanings available' }}
                  </p>
                </div>

                <div class="detail-section mt-4">
                  <h3 class="detail-title">Kunyomi</h3>
                  <div v-if="selectedItem?.kun_readings?.length" class="readings-container">
                    <v-chip v-for="(reading, index) in selectedItem.kun_readings" :key="`kun-${index}`"
                      class="reading-chip kun-reading">
                      {{ reading }}
                    </v-chip>
                  </div>
                  <p v-else class="detail-content">No Kunyomi readings available</p>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="detail-section">
                  <h3 class="detail-title">Onyomi</h3>
                  <div v-if="selectedItem?.on_readings?.length" class="readings-container">
                    <v-chip v-for="(reading, index) in selectedItem.on_readings" :key="`on-${index}`"
                      class="reading-chip on-reading">
                      {{ reading }}
                    </v-chip>
                  </div>
                  <p v-else class="detail-content">No Onyomi readings available</p>
                </div>

                <div class="detail-section mt-4">
                  <h3 class="detail-title">Stroke Count</h3>
                  <p class="detail-content stroke-count">
                    {{ selectedItem?.stroke_count || 'Unknown' }}
                    <span v-if="selectedItem?.stroke_count" class="strokes-label">strokes</span>
                  </p>
                </div>

                <!-- <div class="detail-section mt-4">
                  <h3 class="detail-title">JLPT Level</h3>
                  <v-chip color="primary" class="level-chip">
                    {{ selectedItem?.jlpt_level.toUpperCase() || 'Unknown' }}
                  </v-chip>
                </div> -->
              </v-col>
            </template>

            <template v-else-if="currentDetailType === 'vocabulary'">
              <v-col cols="12">
                <div class="detail-section">
                  <h3 class="detail-title">Japanese</h3>
                  <p class="detail-content japanese-text">{{ selectedItem?.japanese }}</p>
                </div>

                <div class="detail-section mt-4">
                  <h3 class="detail-title">Reading</h3>
                  <p class="detail-content">{{ selectedItem?.reading }}</p>
                </div>

                <div class="detail-section mt-4">
                  <h3 class="detail-title">Meaning</h3>
                  <p class="detail-content">{{ selectedItem?.meaning }}</p>
                </div>

                <!-- <div class="detail-section mt-4">
                  <h3 class="detail-title">JLPT Level</h3>
                  <v-chip color="primary" class="mt-1">
                    {{ selectedItem?.level.toUpperCase() || 'Unknown' }}
                  </v-chip>
                </div> -->
              </v-col>
            </template>

            <template v-else-if="currentDetailType === 'grammar'">
              <v-col cols="12">
                <div class="detail-section">
                  <h3 class="detail-title">Structure</h3>
                  <p class="detail-content structure-text">{{ selectedItem?.structure }}</p>
                </div>

                <div class="detail-section mt-4">
                  <h3 class="detail-title">Meaning</h3>
                  <p class="detail-content">{{ selectedItem?.meaning }}</p>
                </div>

                <div class="detail-section mt-4">
                  <h3 class="detail-title">Example</h3>
                  <p class="detail-content example-text">{{ selectedItem?.example }}</p>
                </div>

                <div class="detail-section mt-4">
                  <h3 class="detail-title">Translation</h3>
                  <p class="detail-content">{{ selectedItem?.example_translation }}</p>
                </div>

                <!-- <div class="detail-section mt-4">
                  <h3 class="detail-title">JLPT Level</h3>
                  <v-chip color="primary" class="mt-1">
                    {{ selectedItem?.level.toUpperCase() || 'Unknown' }}
                  </v-chip>
                </div> -->
              </v-col>
            </template>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-6 pb-4">
          <v-spacer />
          <v-btn color="primary" variant="outlined" @click="detailsDialog = false" class="close-btn">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const tab = ref('kanji');
const selectedLevel = ref('n5'); // Default to N5
const detailsDialog = ref(false);
const currentDetailType = ref('');
const selectedItem = ref(null);

const jlptLevels = ref([
  { id: 'n5', name: 'Beginner', icon: 'mdi-numeric-5-box' },
  { id: 'n4', name: 'Basic', icon: 'mdi-numeric-4-box' },
  { id: 'n3', name: 'Intermediate', icon: 'mdi-numeric-3-box' },
  { id: 'n2', name: 'Upper Intermediate', icon: 'mdi-numeric-2-box' },
  { id: 'n1', name: 'Advanced', icon: 'mdi-numeric-1-box' }
]);

// Kanji data for all JLPT levels
const kanjiData = ref({
  n5: [
    { character: '日', meanings: ['day', 'sun'], kun_readings: ['ひ', '-び', '-か'], on_readings: ['ニチ', 'ジツ'], stroke_count: 4, jlpt_level: 'n5' },
    { character: '月', meanings: ['month', 'moon'], kun_readings: ['つき'], on_readings: ['ゲツ', 'ガツ'], stroke_count: 4, jlpt_level: 'n5' },
    { character: '火', meanings: ['fire'], kun_readings: ['ひ', '-び', 'ほ-'], on_readings: ['カ'], stroke_count: 4, jlpt_level: 'n5' },
    { character: '水', meanings: ['water'], kun_readings: ['みず', 'みず-'], on_readings: ['スイ'], stroke_count: 4, jlpt_level: 'n5' },
    { character: '木', meanings: ['tree', 'wood'], kun_readings: ['き', 'こ-'], on_readings: ['モク', 'ボク'], stroke_count: 4, jlpt_level: 'n5' },
    { character: '金', meanings: ['gold', 'money'], kun_readings: ['かね', 'かな-', '-がね'], on_readings: ['キン', 'コン'], stroke_count: 8, jlpt_level: 'n5' },
    { character: '土', meanings: ['earth', 'soil'], kun_readings: ['つち'], on_readings: ['ド', 'ト'], stroke_count: 3, jlpt_level: 'n5' },
    { character: '人', meanings: ['person'], kun_readings: ['ひと', '-り', '-と'], on_readings: ['ジン', 'ニン'], stroke_count: 2, jlpt_level: 'n5' },
    { character: '山', meanings: ['mountain'], kun_readings: ['やま'], on_readings: ['サン'], stroke_count: 3, jlpt_level: 'n5' },
    { character: '川', meanings: ['river'], kun_readings: ['かわ'], on_readings: ['セン'], stroke_count: 3, jlpt_level: 'n5' }
  ],
  n4: [
    { character: '校', meanings: ['school', 'exam'], kun_readings: [], on_readings: ['コウ'], stroke_count: 10, jlpt_level: 'n4' },
    { character: '院', meanings: ['institution', 'temple'], kun_readings: [], on_readings: ['イン'], stroke_count: 10, jlpt_level: 'n4' },
    { character: '駅', meanings: ['station'], kun_readings: [], on_readings: ['エキ'], stroke_count: 14, jlpt_level: 'n4' },
    { character: '社', meanings: ['company', 'shrine'], kun_readings: ['やしろ'], on_readings: ['シャ'], stroke_count: 7, jlpt_level: 'n4' },
    { character: '店', meanings: ['shop', 'store'], kun_readings: ['みせ', 'たな'], on_readings: ['テン'], stroke_count: 8, jlpt_level: 'n4' }
  ],
  n3: [
    { character: '漢', meanings: ['China', 'kanji'], kun_readings: [], on_readings: ['カン'], stroke_count: 13, jlpt_level: 'n3' },
    { character: '字', meanings: ['character', 'letter'], kun_readings: ['あざ', 'あざな'], on_readings: ['ジ'], stroke_count: 6, jlpt_level: 'n3' },
    { character: '研', meanings: ['polish', 'study'], kun_readings: ['とぐ'], on_readings: ['ケン'], stroke_count: 9, jlpt_level: 'n3' }
  ],
  n2: [
    { character: '議', meanings: ['deliberation', 'consultation'], kun_readings: [], on_readings: ['ギ'], stroke_count: 20, jlpt_level: 'n2' },
    { character: '論', meanings: ['argument', 'discourse'], kun_readings: [], on_readings: ['ロン'], stroke_count: 15, jlpt_level: 'n2' }
  ],
  n1: [
    { character: '鬱', meanings: ['depression', 'gloom'], kun_readings: ['うっ'], on_readings: ['ウツ'], stroke_count: 29, jlpt_level: 'n1' },
    { character: '璽', meanings: ['emperor\'s seal'], kun_readings: [], on_readings: ['ジ'], stroke_count: 19, jlpt_level: 'n1' }
  ]
});

// Vocabulary data for all JLPT levels
const vocabData = ref({
  n5: [
    { japanese: '私', reading: 'わたし', meaning: 'I, me', level: 'n5' },
    { japanese: 'あなた', reading: 'あなた', meaning: 'you', level: 'n5' },
    { japanese: '学生', reading: 'がくせい', meaning: 'student', level: 'n5' },
    { japanese: '先生', reading: 'せんせい', meaning: 'teacher', level: 'n5' },
    { japanese: '食べる', reading: 'たべる', meaning: 'to eat', level: 'n5' }
  ],
  n4: [
    { japanese: '勉強', reading: 'べんきょう', meaning: 'study', level: 'n4' },
    { japanese: '旅行', reading: 'りょこう', meaning: 'travel', level: 'n4' },
    { japanese: '大切', reading: 'たいせつ', meaning: 'important', level: 'n4' }
  ],
  n3: [
    { japanese: '影響', reading: 'えいきょう', meaning: 'influence', level: 'n3' },
    { japanese: '確認', reading: 'かくにん', meaning: 'confirmation', level: 'n3' }
  ],
  n2: [
    { japanese: '議論', reading: 'ぎろん', meaning: 'discussion, argument', level: 'n2' },
    { japanese: '実施', reading: 'じっし', meaning: 'implementation', level: 'n2' }
  ],
  n1: [
    { japanese: '顕著', reading: 'けんちょ', meaning: 'remarkable, striking', level: 'n1' },
    { japanese: '緻密', reading: 'ちみつ', meaning: 'detailed, precise', level: 'n1' }
  ]
});

// Grammar data for all JLPT levels
const grammarData = ref({
  n5: [
    {
      structure: '～は～です',
      meaning: 'A is B',
      example: '私は学生です。',
      example_translation: 'I am a student.',
      level: 'n5'
    },
    {
      structure: '～を～ます',
      meaning: 'Do [verb] to [object]',
      example: '本を読みます。',
      example_translation: 'I read a book.',
      level: 'n5'
    },
    {
      structure: '～が～です',
      meaning: 'A has B',
      example: '猫がいます。',
      example_translation: 'There is a cat.',
      level: 'n5'
    },
    {
      structure: '～に～ます',
      meaning: 'Go to [place] to do [verb]',
      example: '学校に行きます。',
      example_translation: 'I go to school.',
      level: 'n5'
    }
  ],
  n4: [
    {
      structure: '～たり～たりする',
      meaning: 'Do things like A and B',
      example: '週末は映画を見たり、買い物をしたりします。',
      example_translation: 'On weekends I do things like watch movies and go shopping.',
      level: 'n4'
    },
    {
      structure: '～なければならない',
      meaning: 'Must do',
      example: '宿題をしなければなりません。',
      example_translation: 'I must do my homework.',
      level: 'n4'
    },
    {
      structure: '～ことがある',
      meaning: 'Sometimes do',
      example: '時々、友達と遊ぶことがあります。',
      example_translation: 'Sometimes I hang out with friends.',
      level: 'n4'
    },
    {
      structure: '～ようと思う',
      meaning: 'I think I will do',
      example: '来年、日本に行こうと思っています。',
      example_translation: 'I think I will go to Japan next year.',
      level: 'n4'
    }
  ],
  n3: [
    {
      structure: '～ように',
      meaning: 'In order to, so that',
      example: '忘れないようにメモをします。',
      example_translation: 'I take notes so I won\'t forget.',
      level: 'n3'
    },
    {
      structure: '～ば～ほど',
      meaning: 'The more... the more...',
      example: '練習すればするほど上手になります。',
      example_translation: 'The more you practice, the better you become.',
      level: 'n3'
    },
    {
      structure: '～に違いない',
      meaning: 'Must be, surely',
      example: '彼は忙しいに違いない。',
      example_translation: 'He must be busy.',
      level: 'n3'
    },
    {
      structure: '～ことにする',
      meaning: 'Decide to do',
      example: '毎日運動することにしました。',
      example_translation: 'I decided to exercise every day.',
      level: 'n3'
    }
  ],
  n2: [
    {
      structure: '～に限らず',
      meaning: 'Not limited to',
      example: 'この映画は子供に限らず、大人にも人気がある。',
      example_translation: 'This movie is popular not only with children but also with adults.',
      level: 'n2'
    },
    {
      structure: '～をきっかけに',
      meaning: 'Taking this as an opportunity',
      example: '日本旅行をきっかけに日本語を勉強し始めた。',
      example_translation: 'I started studying Japanese after taking a trip to Japan as an opportunity.',
      level: 'n2'
    },
    {
      structure: '～に対して',
      meaning: 'Towards, regarding',
      example: 'この問題に対して、意見を述べたい。',
      example_translation: 'I would like to express my opinion regarding this issue.',
      level: 'n2'
    },
    {
      structure: '～を問わず',
      meaning: 'Regardless of',
      example: '年齢を問わず、誰でも参加できます。',
      example_translation: 'Anyone can participate regardless of age.',
      level: 'n2'
    }
  ],
  n1: [
    {
      structure: '～を余儀なくされる',
      meaning: 'Be forced to',
      example: '台風のため、旅行の中止を余儀なくされた。',
      example_translation: 'Due to the typhoon, we were forced to cancel the trip.',
      level: 'n1'
    },
    {
      structure: '～とあって',
      meaning: 'Because it is the case that',
      example: '人気歌手のコンサートとあって、チケットはすぐに売り切れた。',
      example_translation: 'Because it was a concert of a popular singer, the tickets sold out immediately.',
      level: 'n1'
    },
    {
      structure: '～に即して',
      meaning: 'In accordance with',
      example: '法律に即して行動することが大切です。',
      example_translation: 'It is important to act in accordance with the law.',
      level: 'n1'
    },
    {
      structure: '～を踏まえて',
      meaning: 'Based on',
      example: '実績を踏まえて、次の計画を立てます。',
      example_translation: 'Based on the results, we will make the next plan.',
      level: 'n1'
    }
  ]
});

const showDetails = (type, item) => {
  currentDetailType.value = type;
  selectedItem.value = item;
  detailsDialog.value = true;
};
</script>

<style scoped>
/* Add these new styles */
.glass-toolbar {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-toggle {
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 8px;
}

.glass-toggle .v-btn {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.glass-toggle .v-btn--active {
  background: rgba(255, 255, 255, 0.15) !important;
}

/* Keep your existing styles */
.glass-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
}

.glass-card-inner {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(8px);
  border-radius: 12px;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px;
  margin-bottom: 8px;
}

.glass-list {
  background: transparent !important;
  border-radius: 12px;
}

.glass-list-item {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(8px);
  margin-bottom: 6px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.glass-list-item:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.text-contrast {
  color: rgba(255, 255, 255, 0.95) !important;
}

.text-bright {
  color: rgba(255, 255, 255, 0.95) !important;
}

.v-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.v-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-tab {
  color: white !important;
}

.v-tab .v-icon {
  color: white !important;
}

/* Dialog Styles */
.glass-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
}

.kanji-character {
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.detail-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid rgba(255, 255, 255, 0.2);
}

.detail-title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-content {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
}

.japanese-text {
  font-size: 1.4rem;
  font-weight: 500;
}

.structure-text {
  font-family: monospace;
  font-size: 1.2rem;
  color: #FFD54F;
}

.example-text {
  font-style: italic;
  background: rgba(255, 255, 255, 0.08);
  padding: 8px;
  border-radius: 4px;
}

.close-btn {
  border: 1px solid rgba(255, 255, 255, 0.3);
  letter-spacing: 0.5px;
  font-weight: 500;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Kanji Specific Styles */
.meanings-text {
  font-size: 1.2rem;
  line-height: 1.6;
}

.detail-title {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
}

.readings-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.reading-chip {
  font-size: 1.1rem;
  padding: 8px 12px;
  height: auto !important;
}

.kun-reading {
  background: rgba(75, 175, 80, 0.2) !important;
  color: #4CAF50 !important;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.on-reading {
  background: rgba(33, 150, 243, 0.2) !important;
  color: #2196F3 !important;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.stroke-count {
  font-size: 1.3rem;
  font-weight: 500;
}

.strokes-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-left: 4px;
}

.level-chip {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>