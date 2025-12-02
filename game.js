// Game Configuration
const CONFIG = {
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 500,
    INITIAL_BLOCK_WIDTH: 100,
    BLOCK_HEIGHT: 30,
    BLOCK_SPEED: 2,
    COLORS: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B739', '#52B788', '#E63946', '#457B9D'
    ]
};

// Game State
class TowerGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;

        this.blocks = [];
        this.currentBlock = null;
        this.gameRunning = false;
        this.score = 0;
        this.highScore = localStorage.getItem('towerHighScore') || 0;
        this.direction = 1;

        this.setupEventListeners();
        this.updateHighScoreDisplay();
    }

    setupEventListeners() {
        const startBtn = document.getElementById('startBtn');
        const restartBtn = document.getElementById('restartBtn');

        startBtn.addEventListener('click', () => this.startGame());
        restartBtn.addEventListener('click', () => this.restartGame());

        this.canvas.addEventListener('click', () => this.dropBlock());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameRunning) {
                e.preventDefault();
                this.dropBlock();
            }
        });
    }

    startGame() {
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('restartBtn').style.display = 'none';
        this.gameRunning = true;
        this.score = 0;
        this.blocks = [];
        this.direction = 1;

        this.updateScore();
        this.updateMessage('Click or press SPACE to drop!');

        // Add base block
        this.blocks.push({
            x: CONFIG.CANVAS_WIDTH / 2 - CONFIG.INITIAL_BLOCK_WIDTH / 2,
            y: CONFIG.CANVAS_HEIGHT - CONFIG.BLOCK_HEIGHT,
            width: CONFIG.INITIAL_BLOCK_WIDTH,
            height: CONFIG.BLOCK_HEIGHT,
            color: CONFIG.COLORS[0]
        });

        this.spawnNewBlock();
        this.gameLoop();
    }

    spawnNewBlock() {
        const lastBlock = this.blocks[this.blocks.length - 1];
        const colorIndex = this.blocks.length % CONFIG.COLORS.length;

        this.currentBlock = {
            x: 0,
            y: lastBlock.y - CONFIG.BLOCK_HEIGHT,
            width: lastBlock.width,
            height: CONFIG.BLOCK_HEIGHT,
            color: CONFIG.COLORS[colorIndex],
            speed: CONFIG.BLOCK_SPEED + this.score * 0.1
        };

        this.direction = Math.random() > 0.5 ? 1 : -1;
    }

    dropBlock() {
        if (!this.gameRunning || !this.currentBlock) return;

        const lastBlock = this.blocks[this.blocks.length - 1];
        const currentBlock = this.currentBlock;

        // Calculate overlap
        const leftEdge = Math.max(currentBlock.x, lastBlock.x);
        const rightEdge = Math.min(
            currentBlock.x + currentBlock.width,
            lastBlock.x + lastBlock.width
        );

        const overlap = rightEdge - leftEdge;

        if (overlap <= 0) {
            // Missed completely - game over
            this.gameOver();
            return;
        }

        // Perfect drop bonus
        const tolerance = 5;
        if (Math.abs(currentBlock.x - lastBlock.x) < tolerance) {
            this.updateMessage('Perfect! 🎯');
            this.score += 2;
        } else {
            this.score += 1;
        }

        // Create the new block with adjusted size
        const newBlock = {
            x: leftEdge,
            y: currentBlock.y,
            width: overlap,
            height: CONFIG.BLOCK_HEIGHT,
            color: currentBlock.color
        };

        this.blocks.push(newBlock);
        this.updateScore();

        // Adjust camera if tower gets too high
        if (this.blocks.length > 8) {
            this.adjustCamera();
        }

        // Spawn next block
        if (overlap >= 10) {
            this.spawnNewBlock();
        } else {
            this.gameOver();
        }
    }

    adjustCamera() {
        // Move all blocks down to keep the tower in view
        const shiftAmount = CONFIG.BLOCK_HEIGHT;
        this.blocks.forEach(block => {
            block.y += shiftAmount;
        });
        if (this.currentBlock) {
            this.currentBlock.y += shiftAmount;
        }

        // Remove blocks that are below the canvas
        this.blocks = this.blocks.filter(
            block => block.y < CONFIG.CANVAS_HEIGHT
        );
    }

    gameOver() {
        this.gameRunning = false;
        this.currentBlock = null;

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('towerHighScore', this.highScore);
            this.updateHighScoreDisplay();
            this.updateMessage(`New High Score: ${this.score}! 🎉`);
        } else {
            this.updateMessage(`Game Over! Score: ${this.score}`);
        }

        document.getElementById('restartBtn').style.display = 'inline-block';
    }

    restartGame() {
        this.startGame();
    }

    gameLoop() {
        if (!this.gameRunning) return;

        this.update();
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (this.currentBlock) {
            this.currentBlock.x += this.currentBlock.speed * this.direction;

            // Bounce off walls
            if (this.currentBlock.x <= 0) {
                this.currentBlock.x = 0;
                this.direction = 1;
            } else if (this.currentBlock.x + this.currentBlock.width >= CONFIG.CANVAS_WIDTH) {
                this.currentBlock.x = CONFIG.CANVAS_WIDTH - this.currentBlock.width;
                this.direction = -1;
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        // Draw all placed blocks
        this.blocks.forEach(block => {
            this.drawBlock(block);
        });

        // Draw current moving block
        if (this.currentBlock) {
            this.drawBlock(this.currentBlock);
        }
    }

    drawBlock(block) {
        // Draw block with gradient
        const gradient = this.ctx.createLinearGradient(
            block.x, block.y,
            block.x + block.width, block.y + block.height
        );
        gradient.addColorStop(0, block.color);
        gradient.addColorStop(1, this.adjustBrightness(block.color, -20));

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(block.x, block.y, block.width, block.height);

        // Draw border
        this.ctx.strokeStyle = this.adjustBrightness(block.color, -40);
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(block.x, block.y, block.width, block.height);
    }

    adjustBrightness(color, amount) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    updateHighScoreDisplay() {
        document.getElementById('highScore').textContent = this.highScore;
    }

    updateMessage(message) {
        document.getElementById('gameMessage').textContent = message;
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new TowerGame();
});
