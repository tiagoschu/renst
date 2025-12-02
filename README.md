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
- Start with **3 lives per level** (❤️ ❤️ ❤️)
- Lose a life when you miss a block or it becomes too small
- **Lives reset to 3** when you advance to the next level
- Lives are displayed with animated heartbeat effects

### Retry System
- **1 retry per level** (✨)
- When you run out of lives, you can use your retry
- Using a retry gives you **1 life** to continue
- **Retry resets to 1** when you advance to the next level
- Choose to use retry or end game when prompted

### Level System
- **10 blocks per level** - Stack 10 blocks to advance to the next level
- **Progressive Difficulty** - Block speed increases by 0.5 each level
- **Unique Visual Themes** - Each level has distinct background gradients and patterns
- **Level-Specific Block Colors** - Blocks change color palette every level
- **Level Names & Patterns**:
  - Level 1: Beginner (Peach gradient with dots pattern)
  - Level 2: Novice (Blue gradient with waves pattern)
  - Level 3: Intermediate (Purple gradient with grid pattern)
  - Level 4: Advanced (Orange gradient with diagonal lines)
  - Level 5: Expert (Pink gradient with circles pattern)
  - Level 6: Master (Teal gradient with hexagon pattern)
  - Level 7: Legend (Yellow gradient with stars pattern)
  - Level 8: Champion (Orange gradient with zigzag pattern)
  - Level 9: Ultimate (Green gradient with triangles pattern)
  - Level 10+: Godlike (Red gradient with diamonds pattern)

### Scoring
- **Perfect Drop**: Perfectly aligned blocks (within 5 pixels) = **2 points**
- **Normal Drop**: Regular successful drops = **1 point**
- **Overhang**: Parts that don't overlap get cut off
- **Leaderboard Entry**: Top 10 scores are saved with player names

## Features

### Core Gameplay
- Smooth animations and controls
- **Level-specific block colors** - 4 unique colors per level (40 total color variations)
- Responsive canvas rendering
- Click or keyboard (SPACE) controls
- Retry system for second chances

### Progressive Challenge
- **10 unique level themes** with distinct visual identities
- **Dynamic backgrounds** - Gradient colors with animated patterns (dots, waves, grids, etc.)
- Speed increases by 0.5 per level
- Blocks maintain momentum and bounce off walls
- Lives and retries reset each level

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
- **Animated heartbeats** for lives display
- **Background patterns** - 10 unique patterns (dots, waves, grid, diagonal, circles, hexagon, stars, zigzag, triangles, diamonds)
- **Gradient backgrounds** that smoothly transition each level
- **Level-specific color palettes** for blocks
- **Retry indicator** with sparkle emoji (✨)
- Level celebration messages with pause
- Modal dialogs for leaderboard and name entry
- Hover effects on leaderboard entries
- Smooth retry prompt with button overlays

## Technologies Used

- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript (ES6+)** - Game logic with classes
- **CSS3** - Gradients, animations, and responsive design
- **LocalStorage** - Leaderboard persistence

## Game Over Conditions

You lose a life when:
- A block completely misses the tower
- The overlapping area becomes too small (< 10 pixels)

When you run out of lives:
- If you have a retry available, you can choose to continue with 1 life
- If you decline retry or have no retries left, the game ends

## Controls

- **Mouse Click** - Drop the current block
- **Spacebar** - Drop the current block (keyboard alternative)
- **Y/N Keys** - Accept or decline retry when prompted
- **Retry Button** - Use your retry (appears on game over)
- **End Game Button** - Decline retry and end game
- **Leaderboard Button** - View top 10 scores
- **Restart Button** - Start a new game after game over

## Tips for High Scores

- **Timing is everything** - Wait for perfect alignment
- **Perfect drops earn double points** - Aim for precision
- **Manage your lives wisely** - You get 3 lives per level, but they reset each level
- **Save your retry** - Use it strategically when you're close to completing a level
- **Speed increases each level** - Stay focused as difficulty ramps up
- **Reach higher levels** - More levels = more points = leaderboard glory
- **Visual cues** - Watch the background patterns change - each level has a unique look

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
