const localhost = "http://localhost:8082/api_user"
// utils/api.js
const japan_api = "https://kanjialive-api.p.rapidapi.com/api/public/";
const japan_all = "https://kanjialive-api.p.rapidapi.com/api/public/kanji/all";
const japanAllApi = 'https://kanjialive-api.p.rapidapi.com/api/public/kanji/all';

// Updated getJlptKanji function with better error handling
async function getJlptKanji(level) {
  if (!['n5', 'n4', 'n3', 'n2', 'n1'].includes(level.toLowerCase())) {
    throw new Error('Invalid JLPT level');
  }

  const url = `https://muzukanjiapi.p.rapidapi.com/kanji?minJlptLevel=${level.toUpperCase()}&maxJlptLevel=${level.toUpperCase()}`;
  const headers = {
    'x-rapidapi-host': 'muzukanjiapi.p.rapidapi.com',
    'x-rapidapi-key': '2cf276514cmshc0e530d0c7954e5p153142jsne2ea7993d315'
  };

  try {
    const resp = await fetch(url, { method: 'GET', headers });
    if (resp.ok) {
      const json = await resp.json();
      return json.data || [];
    }
    console.warn('Main API returned non-OK, using fallback');
    return await getFallbackKanji(level, headers);
  } catch (e) {
    console.error('Main API request failed, falling back:', e);
    return await getFallbackKanji(level, headers);
  }
}

async function getFallbackKanji(level, headers) {
  console.log('🔁 Fetching fallback Kanji Alive data…');
  try {
    const resp = await fetch(japanAllApi, { method: 'GET', headers });
    if (!resp.ok) throw new Error('Fallback API non-OK');
    const data = await resp.json();

    return data.filter(k => {
      const jl = k.jlpt?.toLowerCase();
      return jl === level.toLowerCase();
    });
  } catch (e) {
    console.error('Fallback API failed:', e);
    return [];
  }
}

async function get_allKanjiWord() {
    try {
        const resp = await fetch(japan_all, {
            method: 'GET',
            headers: {
                "x-rapidapi-host": "kanjialive-api.p.rapidapi.com",
                "x-rapidapi-key": "2cf276514cmshc0e530d0c7954e5p153142jsne2ea7993d315"
            }
        });
        return resp;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//   // Mock grammar data
//   async function getJlptGrammar(level) {
//     try {
//         // Simulate API delay
//         await new Promise(resolve => setTimeout(resolve, 500));

//         const mockData = {
//             n5: [
//                 { pattern: "〜です", explanation: "Polite form of 'to be'", example: "私は学生です (I am a student)" },
//                 { pattern: "〜ます", explanation: "Polite verb ending", example: "食べます (I eat)" }
//             ],
//             n4: [
//                 { pattern: "〜たい", explanation: "Want to do something", example: "食べたい (I want to eat)" },
//                 { pattern: "〜ながら", explanation: "While doing", example: "歩きながら話す (Talk while walking)" }
//             ],
//             n3: [
//                 { pattern: "〜ばかり", explanation: "Nothing but", example: "遊んでばかりいる (Do nothing but play)" },
//                 { pattern: "〜ほど", explanation: "To the extent that", example: "泣きたいほど嬉しい (So happy I could cry)" }
//             ],
//             n2: [
//                 { pattern: "〜ものだ", explanation: "Used to", example: "子供の時、よくここで遊んだものだ (I used to play here as a child)" },
//                 { pattern: "〜ことだ", explanation: "Should", example: "もっと勉強することだ (You should study more)" }
//             ],
//             n1: [
//                 { pattern: "〜まい", explanation: "Probably won't", example: "二度と行くまい (I probably won't go again)" },
//                 { pattern: "〜ずにはいられない", explanation: "Can't help but", example: "笑わずにはいられない (I can't help but laugh)" }
//             ]
//         };

//         return mockData[level] || [];
//     } catch (error) {
//         console.error('Error fetching grammar:', error);
//         throw error;
//     }
// }

async function get_searchKanjiWord(engWord) {
    try {
        const resp = await fetch(japan_api + "search/" + engWord, {
            method: 'GET',
            headers: {
                "x-rapidapi-host": "kanjialive-api.p.rapidapi.com",
                "x-rapidapi-key": "2cf276514cmshc0e530d0c7954e5p153142jsne2ea7993d315"
            }
        });
        return resp;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// async function get_allKanjiWord() {
//     try {
//         const resp = await fetch(japan_all, {
//             method: 'GET',
//             headers: {
//                 "x-rapidapi-host": "kanjialive-api.p.rapidapi.com",
//                 "x-rapidapi-key": "2cf276514cmshc0e530d0c7954e5p153142jsne2ea7993d315"
//             }
//         });
//         return resp;
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// }

// api.js // Adjust to your backend URL

async function loginCheck(credentials) {
    try {
        const response = await fetch(`http://localhost:8082/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// ... keep your existing API functions
async function getAllUser(path) {
    try {
        const resp = await fetch(localhost + path, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await resp.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function saveUser(user) {
    try {
        const resp = await fetch(localhost + "/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        return await resp.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function updateUser(user) {
    try {
        const resp = await fetch(localhost + "/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        return await resp.text();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deleteUser(id) {
    try {
        const resp = await fetch(localhost + `/delete/${id}`, {
            method: "DELETE"
        });
        return await resp.text();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default {
    get_searchKanjiWord,
    getAllUser,
    saveUser,
    updateUser,
    deleteUser,
    loginCheck,
    get_allKanjiWord,
    // getJlptWords,
    getJlptKanji,
    // getJlptGrammar
};