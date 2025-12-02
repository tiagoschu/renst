# Tower Stack Game

A simple and addictive tower stacking game built with HTML5 Canvas and JavaScript.

## How to Play

1. Open `index.html` in your web browser
2. Click "Start Game" to begin
3. A block will move horizontally across the screen
4. Click anywhere on the canvas or press **SPACE** to drop the block
5. Try to stack blocks on top of each other as accurately as possible
6. The game ends when a block misses the tower completely

## Game Rules

- **Perfect Drop**: If you drop a block perfectly aligned (within 5 pixels), you get 2 points
- **Normal Drop**: Regular successful drops give you 1 point
- **Overhang**: Any part of the block that doesn't overlap with the previous block gets cut off
- **Game Over**: The game ends if a block completely misses the tower or becomes too small (< 10 pixels)
- **Speed**: The blocks move faster as your score increases
- **High Score**: Your best score is saved in your browser's local storage

## Features

- Responsive design
- Colorful gradient blocks
- High score tracking
- Perfect drop detection
- Progressive difficulty (blocks speed up as you progress)
- Smooth animations

## Technologies Used

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- CSS3 with gradients and animations
- LocalStorage for high score persistence

## Play Online

Simply open the `index.html` file in any modern web browser. No installation or build process required!

## Tips

- Timing is everything - wait for the block to be perfectly aligned
- As the game progresses, blocks move faster, so stay focused
- Try to get as many perfect drops as possible for a higher score

Enjoy stacking! 🏗️
