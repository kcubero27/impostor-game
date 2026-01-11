# 🎭 Impostor Game

A fun multiplayer social deduction game built with React, TypeScript, and Vite. Players try to identify the impostor among them based on word associations!

## 🎮 Game Overview

One player is secretly assigned as the **Impostor**. All other players see the same word, but the impostor only sees a hint. Players must discuss and figure out who doesn't know the actual word!

## ✨ Features

- 🌍 **Multilingual Support**: Full English and Spanish translations
- 📚 **300 Words**: Comprehensive word database across 12 categories
- 🎯 **Difficulty Levels**: Words categorized by difficulty (1-3)
- 👥 **Flexible Player Count**: Play with 3+ players
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- 🔒 **Private Role Reveal**: Each player sees their role individually
- 🔄 **Replayable**: Quick restart with "Play Again" feature

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### How to Play

1. **Setup**: Add 3 or more players with names
2. **Start Game**: Click "Start Game" to begin
3. **Role Reveal**: Each player privately views their role:
   - **Normal Players**: See the word (e.g., "Elephant")
   - **Impostor**: Only sees a hint (e.g., "Large animal with a trunk")
4. **Discussion**: Players discuss and try to identify the impostor
5. **Vote**: Decide who the impostor is!
6. **Play Again**: Start a new round with the same or different players

## 📂 Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Main game screens
├── services/       # Game logic and business rules
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── data/           # Word and category databases
├── i18n/           # Internationalization
└── constants/      # App constants
```

## 🌐 Languages

- 🇬🇧 English (EN)
- 🇪🇸 Spanish (ES)

Switch languages anytime using the language toggle in the top-right corner!

## 📋 Categories

Words are organized across 12 categories (300 total):

- 🐾 Animals (40 words)
- 🍕 Food (40 words)
- ⚽ Sports (30 words)
- 💼 Professions (30 words)
- 🎯 Objects (30 words)
- 🏛️ Places (30 words)
- 💻 Technology (25 words)
- 🚗 Transportation (20 words)
- 🎬 Entertainment (20 words)
- 🌲 Nature (5 words)
- 👕 Clothing (15 words)
- 🏠 Household (15 words)

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **react-i18next** - Internationalization (i18n)
- **Lucide React** - Icons
- **Radix UI** - Accessible components

## 📖 Documentation

- **Features**: See [FEATURES.md](./FEATURES.md)
- **i18next Migration**: See [I18NEXT_MIGRATION.md](./I18NEXT_MIGRATION.md)

## 🎯 Game Strategy Tips

**For Normal Players:**

- Subtly reference the word without saying it directly
- Ask questions that only someone who knows the word would understand
- Watch for players who seem confused or vague

**For the Impostor:**

- Listen carefully to others before speaking
- Make generic statements that could apply to many things
- Blend in without being too specific or too vague

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

---

Built with ❤️ using React + TypeScript + Vite
