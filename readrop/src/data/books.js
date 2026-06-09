export const BOOKS = [
  // Sci-Fi
  { emoji: "🚀", title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", genre: "Sci-Fi", condition: "GOOD", city: "Berlin" },
  { emoji: "🏜️", title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", condition: "GREAT", city: "Munich", exchange: true },
  { emoji: "🤖", title: "I, Robot", author: "Isaac Asimov", genre: "Sci-Fi", condition: "GOOD", city: "Vienna" },
  { emoji: "🌌", title: "Foundation", author: "Isaac Asimov", genre: "Sci-Fi", condition: "WORN", city: "Berlin", exchange: true },
  { emoji: "⭐", title: "Ender's Game", author: "Orson Scott Card", genre: "Sci-Fi", condition: "GREAT", city: "Hamburg" },
  // Classics
  { emoji: "🎩", title: "Pride and Prejudice", author: "Jane Austen", genre: "Classics", condition: "WORN", city: "Vienna" },
  { emoji: "🐋", title: "Moby-Dick", author: "Herman Melville", genre: "Classics", condition: "WORN", city: "Hamburg", exchange: true },
  { emoji: "🌹", title: "Anna Karenina", author: "Leo Tolstoy", genre: "Classics", condition: "GOOD", city: "Berlin" },
  { emoji: "⚖️", title: "Crime and Punishment", author: "Fyodor Dostoyevsky", genre: "Classics", condition: "GOOD", city: "Munich" },
  { emoji: "🕯️", title: "Great Expectations", author: "Charles Dickens", genre: "Classics", condition: "WORN", city: "Vienna" },
  // Fiction / Modern
  { emoji: "🌊", title: "The Old Man and the Sea", author: "Ernest Hemingway", genre: "Fiction", condition: "GREAT", city: "Vienna" },
  { emoji: "🌍", title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", condition: "WORN", city: "Hamburg" },
  { emoji: "🦋", title: "Normal People", author: "Sally Rooney", genre: "Fiction", condition: "GREAT", city: "Berlin", exchange: true },
  { emoji: "🏔️", title: "Shuggie Bain", author: "Douglas Stuart", genre: "Fiction", condition: "GREAT", city: "Hamburg" },
  { emoji: "🎭", title: "Conversations with Friends", author: "Sally Rooney", genre: "Fiction", condition: "GOOD", city: "Munich" },
  // Non-Fiction
  { emoji: "📖", title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-Fiction", condition: "GREAT", city: "Berlin" },
  { emoji: "🧠", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genre: "Non-Fiction", condition: "GOOD", city: "Berlin" },
  { emoji: "💡", title: "Atomic Habits", author: "James Clear", genre: "Non-Fiction", condition: "GREAT", city: "Munich", exchange: true },
  { emoji: "🗺️", title: "Guns, Germs, and Steel", author: "Jared Diamond", genre: "Non-Fiction", condition: "GOOD", city: "Vienna" },
  { emoji: "🎯", title: "Deep Work", author: "Cal Newport", genre: "Non-Fiction", condition: "GREAT", city: "Berlin" },
  // Science
  { emoji: "🔬", title: "A Brief History of Time", author: "Stephen Hawking", genre: "Science", condition: "GOOD", city: "Munich" },
  { emoji: "🧬", title: "The Selfish Gene", author: "Richard Dawkins", genre: "Science", condition: "GOOD", city: "Berlin" },
  { emoji: "🪐", title: "Cosmos", author: "Carl Sagan", genre: "Science", condition: "WORN", city: "Vienna" },
  { emoji: "🧪", title: "The Body", author: "Bill Bryson", genre: "Science", condition: "GREAT", city: "Hamburg", exchange: true },
  // Dystopia
  { emoji: "🌑", title: "1984", author: "George Orwell", genre: "Dystopia", condition: "WORN", city: "Hamburg" },
  { emoji: "🔥", title: "Fahrenheit 451", author: "Ray Bradbury", genre: "Dystopia", condition: "GOOD", city: "Berlin", exchange: true },
  { emoji: "🌿", title: "Brave New World", author: "Aldous Huxley", genre: "Dystopia", condition: "GOOD", city: "Munich" },
  { emoji: "🙋", title: "The Handmaid's Tale", author: "Margaret Atwood", genre: "Dystopia", condition: "GREAT", city: "Vienna" },
  // Philosophy
  { emoji: "🤔", title: "Meditations", author: "Marcus Aurelius", genre: "Philosophy", condition: "GREAT", city: "Vienna" },
  { emoji: "⚡", title: "Thus Spoke Zarathustra", author: "Friedrich Nietzsche", genre: "Philosophy", condition: "GOOD", city: "Berlin" },
  { emoji: "🦉", title: "Sophie's World", author: "Jostein Gaarder", genre: "Philosophy", condition: "WORN", city: "Hamburg" },
  { emoji: "🌅", title: "The Republic", author: "Plato", genre: "Philosophy", condition: "GOOD", city: "Munich" },
];

export const GENRES = [
  { key: "all", label: "All", emoji: "📚" },
  { key: "Sci-Fi", label: "Sci-Fi", emoji: "🚀" },
  { key: "Fiction", label: "Fiction", emoji: "🌊" },
  { key: "Classics", label: "Classics", emoji: "🎩" },
  { key: "Non-Fiction", label: "Non-Fiction", emoji: "📖" },
  { key: "Dystopia", label: "Dystopia", emoji: "🌑" },
  { key: "Science", label: "Science", emoji: "🔬" },
  { key: "Philosophy", label: "Philosophy", emoji: "🤔" },
];

export const GENRE_COLORS = {
  "Sci-Fi":      { bg: "var(--indigo-light)", color: "var(--indigo)" },
  "Fiction":     { bg: "var(--teal-light)",   color: "var(--teal)" },
  "Classics":    { bg: "#fdf4e0",             color: "var(--gold)" },
  "Non-Fiction": { bg: "var(--forest-light)", color: "var(--forest)" },
  "Dystopia":    { bg: "var(--terra-light)",  color: "var(--terra)" },
  "Science":     { bg: "var(--teal-light)",   color: "var(--teal-dark)" },
  "Philosophy":  { bg: "var(--indigo-light)", color: "var(--indigo-dark)" },
};

export const CONDITION_LABELS = {
  GREAT: "Great",
  GOOD: "Good",
  WORN: "Well-loved",
};

export const CONDITION_COLORS = {
  GREAT: "var(--forest)",
  GOOD:  "var(--terra)",
  WORN:  "var(--gold)",
};
