# Tower Stack Game

A fun and addictive tower stacking game built with HTML5 Canvas and JavaScript, featuring progressive levels, lives system, and competitive leaderboard.

## How to Play

1. Open `index.html` in your web browser
2. Click "Start Game" to begin
3. A block will move horizontally across the screen
4. Click anywhere on the canvas or press **SPACE** to drop the block
5. Try to stack blocks on top of each other as accurately as possible
6. Complete levels by stacking blocks successfully
7. Keep your lives to reach higher levels!

## Game Mechanics

### Lives System
- Start with **3 lives** (❤️ ❤️ ❤️)
- Lose a life when you miss a block or it becomes too small
- Game ends when all lives are lost
- Lives are displayed with animated hearts at the top

### Level System
- **10 blocks per level** - Stack 10 blocks to advance to the next level
- **Progressive Difficulty** - Block speed increases with each level
- **Visual Themes** - Background color changes for each level
- **Level Names**:
  - Level 1: Beginner
  - Level 2: Novice
  - Level 3: Intermediate
  - Level 4: Advanced
  - Level 5: Expert
  - Level 6: Master
  - Level 7: Legend
  - Level 8: Champion
  - Level 9: Ultimate
  - Level 10+: Godlike

### Scoring
- **Perfect Drop**: Perfectly aligned blocks (within 5 pixels) = **2 points**
- **Normal Drop**: Regular successful drops = **1 point**
- **Overhang**: Parts that don't overlap get cut off
- **Leaderboard Entry**: Top 10 scores are saved with player names

## Features

### Core Gameplay
- Smooth animations and controls
- Colorful gradient blocks (12 unique colors)
- Responsive canvas rendering
- Click or keyboard (SPACE) controls

### Progressive Challenge
- 10 unique level themes with visual changes
- Speed increases by 0.5 per level
- Blocks maintain momentum and bounce off walls

### Leaderboard System
- **Top 10 Scores** saved locally
- **Player Names** - Enter your name for high scores
- **Level Reached** - Shows what level you achieved
- **Medal System**:
  - 🥇 1st Place (Gold)
  - 🥈 2nd Place (Silver)
  - 🥉 3rd Place (Bronze)
- **Clear Leaderboard** - Reset all scores if needed

### Visual Polish
- Animated heartbeats for lives
- Level celebration messages
- Modal dialogs for leaderboard and name entry
- Gradient backgrounds that change per level
- Hover effects on leaderboard entries

## Technologies Used

- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript (ES6+)** - Game logic with classes
- **CSS3** - Gradients, animations, and responsive design
- **LocalStorage** - Leaderboard persistence

## Game Over Conditions

The game ends when you run out of lives. You lose a life when:
- A block completely misses the tower
- The overlapping area becomes too small (< 10 pixels)

## Controls

- **Mouse Click** - Drop the current block
- **Spacebar** - Drop the current block (keyboard alternative)
- **Leaderboard Button** - View top 10 scores
- **Restart Button** - Start a new game after game over

## Tips for High Scores

- **Timing is everything** - Wait for perfect alignment
- **Perfect drops earn double points** - Aim for precision
- **Manage your lives** - You only get 3 chances
- **Speed increases each level** - Stay focused as difficulty ramps up
- **Reach higher levels** - More levels = more points = leaderboard glory

## Installation

No installation required! Simply:
1. Download or clone the repository
2. Open `index.html` in any modern web browser
3. Start playing immediately

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- LocalStorage
- CSS3 Animations

## Credits

Built with vanilla JavaScript - no frameworks or libraries required!

Enjoy stacking and compete for the top spot on the leaderboard! 🏗️🏆
