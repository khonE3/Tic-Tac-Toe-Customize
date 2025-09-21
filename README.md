# Tic-Tac-Toe Customize

A modern, customizable Tic-Tac-Toe game built with Vue.js featuring a futuristic sci-fi theme, multiple players support, and responsive design.

## Features

### 🎮 Game Modes
- **2-4 Players**: Support for 2, 3, or 4 players
- **Customizable Board**: Board sizes from 3×3 up to 10×10
- **Flexible Win Conditions**: Choose between 3, 4, 5, or 6 in a row to win
- **Dynamic Gameplay**: Turn-based gameplay with visual indicators

### 🎨 Visual Design
- **Sci-Fi Theme**: Modern futuristic light theme with neon effects
- **Smooth Animations**: 
  - Cell click animations with scale and rotation effects
  - Floating particles background
  - Pulsing and glowing effects for active elements
  - Winning cell highlighting with pulse animation
  - Symbol appearance animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Touch-Friendly**: Mobile-optimized controls and sizing

### ⚙️ Customization
- **Game Settings**: 
  - Adjustable board size (3×3 to 10×10)
  - Win condition slider (3-6 in a row)
  - Player count selection (2-4 players)
- **In-Game Options**:
  - Sound effects toggle
  - Animation speed control
  - Quick restart functionality

### 🎯 Technical Features
- **Vue 3 Composition API**: Modern reactive framework
- **Pinia State Management**: Centralized game state
- **Vue Router**: Navigation between menu and game
- **CSS Animations**: Hardware-accelerated animations
- **Responsive Grid**: CSS Grid with dynamic sizing

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/khonE3/Tic-Tac-Toe-Customize.git
   cd Tic-Tac-Toe-Customize
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

## How to Play

### Setup
1. **Select Players**: Choose 2, 3, or 4 players
2. **Choose Board Size**: Pick from preset sizes (3×3 to 10×10) or use custom size
3. **Set Win Condition**: Decide how many symbols in a row are needed to win (3-6)
4. **Start Game**: Click "Start Game" to begin

### Gameplay
1. Players take turns clicking empty cells
2. The current player is highlighted with a pulsing symbol
3. First player to get the required number of symbols in a row (horizontal, vertical, or diagonal) wins
4. Winning cells will be highlighted with a special animation
5. Use "New Game" to restart with same settings or "Main Menu" to change settings

### Controls
- **Click/Tap**: Place your symbol in an empty cell
- **Settings Button**: Access in-game settings
- **New Game**: Restart the current game
- **Main Menu**: Return to setup screen

## Project Structure

```
src/
├── components/
│   ├── MainMenu.vue          # Main menu with game settings
│   ├── GameBoard.vue         # Game board and gameplay
│   └── BackgroundParticles.vue # Animated background particles
├── stores/
│   └── gameStore.js          # Pinia store for game state
├── App.vue                   # Root component
├── main.js                   # Application entry point
└── style.css                 # Global styles and theme
```

## Technologies Used

- **Vue 3**: Progressive JavaScript framework
- **Pinia**: State management library
- **Vue Router**: Client-side routing
- **Vite**: Build tool and development server
- **CSS Grid & Flexbox**: Layout and responsive design
- **CSS Animations**: Smooth visual effects
- **Google Fonts (Orbitron)**: Sci-fi typography

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Customization

The game theme can be customized by modifying CSS variables in `src/style.css`:

```css
:root {
  --primary-color: #00f5ff;      /* Main accent color */
  --secondary-color: #0080ff;    /* Secondary accent */
  --accent-color: #ff0080;       /* Tertiary accent */
  --success-color: #00ff80;      /* Win/success color */
  --warning-color: #ffff00;      /* Draw/warning color */
}
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Vue.js team for the excellent framework
- Google Fonts for the Orbitron typeface
- CSS animation inspiration from modern UI designs
Game Tic Tac Toe 
