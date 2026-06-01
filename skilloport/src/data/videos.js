// The full SkillOport archive. `cat` values double as gallery filter keys.
export const VIDEOS = [
  { emoji: "🦢", title: "Paper Crane Origami", cat: "Craft", dur: "6 min", free: true, color: "#c8432b,#d4900c" },
  { emoji: "👾", title: "Pixel Art: Space Invader", cat: "Digital", dur: "8 min", free: false, color: "#3d6b3a,#2c8a86" },
  { emoji: "🇯🇵", title: "5 Japanese Phrases", cat: "Language", dur: "5 min", free: false, color: "#c8432b,#b13a76" },
  { emoji: "🏔", title: "ASCII Art Mountains", cat: "Digital", dur: "4 min", free: false, color: "#3d6b3a,#5a8fb0" },
  { emoji: "✍️", title: "Calligraphy: Your Name", cat: "Art", dur: "10 min", free: false, color: "#1a1208,#7a6852" },
  { emoji: "📡", title: "Morse Code Basics", cat: "Secret", dur: "7 min", free: false, color: "#2f4858,#3d6b3a" },
  { emoji: "🔮", title: "Paper Fortune Teller", cat: "Craft", dur: "5 min", free: true, color: "#b13a76,#d4900c" },
  { emoji: "🅰️", title: "Pixel Font Design", cat: "Digital", dur: "12 min", free: false, color: "#3d6b3a,#c8432b" },
  { emoji: "🌮", title: "Spanish Food Vocab", cat: "Language", dur: "6 min", free: false, color: "#d4900c,#c8432b" },
  { emoji: "🧶", title: "Cat's Cradle", cat: "Craft", dur: "8 min", free: false, color: "#c8432b,#b13a76" },
  { emoji: "💻", title: "Binary Counting", cat: "Secret", dur: "9 min", free: false, color: "#2f4858,#5a8fb0" },
  { emoji: "🌀", title: "Zentangle Pattern", cat: "Art", dur: "7 min", free: false, color: "#7a6852,#3d6b3a" },
];

// Filter buttons: { key matches video.cat, label shown in the UI }
export const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "Craft", label: "Craft" },
  { key: "Digital", label: "Digital" },
  { key: "Language", label: "Language" },
  { key: "Art", label: "Art" },
  { key: "Secret", label: "Secret Skills" },
];

export const catLabel = (cat) => (cat === "Secret" ? "Secret Skills" : cat);
