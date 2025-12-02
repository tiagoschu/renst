// Game Configuration
const CONFIG = {
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 500,
    INITIAL_BLOCK_WIDTH: 100,
    BLOCK_HEIGHT: 30,
    BASE_SPEED: 2,
    BLOCKS_PER_LEVEL: 10,
    MAX_LIVES: 3,
    COLORS: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B739', '#52B788', '#E63946', '#457B9D'
    ],
    LEVEL_THEMES: [
        { bg: '#f5f5f5', name: 'Beginner' },
        { bg: '#e3f2fd', name: 'Novice' },
        { bg: '#f3e5f5', name: 'Intermediate' },
        { bg: '#fff3e0', name: 'Advanced' },
        { bg: '#fce4ec', name: 'Expert' },
        { bg: '#e0f2f1', name: 'Master' },
        { bg: '#fff9c4', name: 'Legend' },
        { bg: '#ffe0b2', name: 'Champion' },
        { bg: '#f1f8e9', name: 'Ultimate' },
        { bg: '#ffebee', name: 'Godlike' }
    ]
};

// Leaderboard Manager
class LeaderboardManager {
    constructor() {
        this.leaderboard = this.loadLeaderboard();
    }

    loadLeaderboard() {
        const data = localStorage.getItem('towerLeaderboard');
        return data ? JSON.parse(data) : [];
    }

    saveLeaderboard() {
        localStorage.setItem('towerLeaderboard', JSON.stringify(this.leaderboard));
    }

    addScore(name, score, level) {
        this.leaderboard.push({
            name: name.trim() || 'Anonymous',
            score: score,
            level: level,
            date: new Date().toLocaleDateString()
        });

        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 10);
        this.saveLeaderboard();
    }

    isHighScore(score) {
        return this.leaderboard.length < 10 || score > this.leaderboard[this.leaderboard.length - 1].score;
    }

    clearLeaderboard() {
        this.leaderboard = [];
        this.saveLeaderboard();
    }

    getLeaderboard() {
        return this.leaderboard;
    }
}

// Game State
class TowerGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;

        this.leaderboardManager = new LeaderboardManager();

        this.blocks = [];
        this.currentBlock = null;
        this.gameRunning = false;
        this.score = 0;
        this.level = 1;
        this.lives = CONFIG.MAX_LIVES;
        this.direction = 1;
        this.blocksInLevel = 0;

        this.setupEventListeners();
        this.updateLivesDisplay();
    }

    setupEventListeners() {
        const startBtn = document.getElementById('startBtn');
        const restartBtn = document.getElementById('restartBtn');
        const leaderboardBtn = document.getElementById('leaderboardBtn');
        const leaderboardModal = document.getElementById('leaderboardModal');
        const nameModal = document.getElementById('nameModal');
        const closeButtons = document.querySelectorAll('.close');
        const submitScore = document.getElementById('submitScore');
        const clearLeaderboard = document.getElementById('clearLeaderboardBtn');
        const playerNameInput = document.getElementById('playerName');

        startBtn.addEventListener('click', () => this.startGame());
        restartBtn.addEventListener('click', () => this.restartGame());
        leaderboardBtn.addEventListener('click', () => this.showLeaderboard());

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                leaderboardModal.style.display = 'none';
                nameModal.style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target === leaderboardModal) leaderboardModal.style.display = 'none';
            if (e.target === nameModal) nameModal.style.display = 'none';
        });

        submitScore.addEventListener('click', () => this.submitPlayerScore());

        playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitPlayerScore();
        });

        clearLeaderboard.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the leaderboard?')) {
                this.leaderboardManager.clearLeaderboard();
                this.showLeaderboard();
            }
        });

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
        this.level = 1;
        this.lives = CONFIG.MAX_LIVES;
        this.blocks = [];
        this.direction = 1;
        this.blocksInLevel = 0;

        this.updateScore();
        this.updateLevel();
        this.updateLivesDisplay();
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

        // Calculate speed based on level
        const speed = CONFIG.BASE_SPEED + (this.level - 1) * 0.5;

        this.currentBlock = {
            x: 0,
            y: lastBlock.y - CONFIG.BLOCK_HEIGHT,
            width: lastBlock.width,
            height: CONFIG.BLOCK_HEIGHT,
            color: CONFIG.COLORS[colorIndex],
            speed: speed
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
            // Missed completely - lose a life
            this.loseLife();
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
        this.blocksInLevel++;
        this.updateScore();

        // Check for level up
        if (this.blocksInLevel >= CONFIG.BLOCKS_PER_LEVEL) {
            this.levelUp();
        }

        // Adjust camera if tower gets too high
        if (this.blocks.length > 8) {
            this.adjustCamera();
        }

        // Spawn next block
        if (overlap >= 10) {
            this.spawnNewBlock();
        } else {
            this.loseLife();
        }
    }

    loseLife() {
        this.lives--;
        this.updateLivesDisplay();

        if (this.lives > 0) {
            this.updateMessage(`Missed! ${this.lives} ${this.lives === 1 ? 'life' : 'lives'} remaining`);

            // Reset to last successful block
            this.currentBlock = null;

            // Small delay before spawning next block
            setTimeout(() => {
                if (this.gameRunning) {
                    this.spawnNewBlock();
                }
            }, 1000);
        } else {
            this.gameOver();
        }
    }

    levelUp() {
        this.level++;
        this.blocksInLevel = 0;
        this.updateLevel();
        this.updateMessage(`Level ${this.level}! 🎊`);

        // Brief celebration pause
        const wasRunning = this.gameRunning;
        this.gameRunning = false;
        setTimeout(() => {
            if (wasRunning) {
                this.gameRunning = true;
                this.updateMessage('Keep going!');
                // Restart the game loop
                this.gameLoop();
            }
        }, 1000);
    }

    adjustCamera() {
        const shiftAmount = CONFIG.BLOCK_HEIGHT;
        this.blocks.forEach(block => {
            block.y += shiftAmount;
        });
        if (this.currentBlock) {
            this.currentBlock.y += shiftAmount;
        }

        this.blocks = this.blocks.filter(
            block => block.y < CONFIG.CANVAS_HEIGHT
        );
    }

    gameOver() {
        this.gameRunning = false;
        this.currentBlock = null;

        // Check if it's a leaderboard score
        if (this.leaderboardManager.isHighScore(this.score)) {
            this.showNameEntry();
        } else {
            this.updateMessage(`Game Over! Score: ${this.score}`);
            document.getElementById('restartBtn').style.display = 'inline-block';
        }
    }

    showNameEntry() {
        const nameModal = document.getElementById('nameModal');
        const playerNameInput = document.getElementById('playerName');
        document.getElementById('finalScore').textContent = this.score;

        playerNameInput.value = '';
        nameModal.style.display = 'block';
        playerNameInput.focus();
    }

    submitPlayerScore() {
        const playerName = document.getElementById('playerName').value;
        this.leaderboardManager.addScore(playerName, this.score, this.level);

        document.getElementById('nameModal').style.display = 'none';
        this.updateMessage(`New High Score: ${this.score}! 🎉`);
        document.getElementById('restartBtn').style.display = 'inline-block';

        this.showLeaderboard();
    }

    showLeaderboard() {
        const modal = document.getElementById('leaderboardModal');
        const listContainer = document.getElementById('leaderboardList');
        const leaderboard = this.leaderboardManager.getLeaderboard();

        if (leaderboard.length === 0) {
            listContainer.innerHTML = '<p class="no-scores">No scores yet! Be the first to play!</p>';
        } else {
            listContainer.innerHTML = leaderboard.map((entry, index) => {
                const rank = index + 1;
                let rankClass = '';
                let medal = '';

                if (rank === 1) {
                    rankClass = 'top-1';
                    medal = '🥇';
                } else if (rank === 2) {
                    rankClass = 'top-2';
                    medal = '🥈';
                } else if (rank === 3) {
                    rankClass = 'top-3';
                    medal = '🥉';
                } else {
                    medal = `#${rank}`;
                }

                return `
                    <div class="leaderboard-entry ${rankClass}">
                        <span class="entry-rank">${medal}</span>
                        <span class="entry-name">${entry.name}</span>
                        <span class="entry-score">${entry.score}
                            <span class="entry-level">Lv.${entry.level}</span>
                        </span>
                    </div>
                `;
            }).join('');
        }

        modal.style.display = 'block';
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
        // Get level theme
        const themeIndex = Math.min(this.level - 1, CONFIG.LEVEL_THEMES.length - 1);
        const theme = CONFIG.LEVEL_THEMES[themeIndex];

        // Clear canvas with level-specific background
        this.ctx.fillStyle = theme.bg;
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
        const gradient = this.ctx.createLinearGradient(
            block.x, block.y,
            block.x + block.width, block.y + block.height
        );
        gradient.addColorStop(0, block.color);
        gradient.addColorStop(1, this.adjustBrightness(block.color, -20));

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(block.x, block.y, block.width, block.height);

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

    updateLevel() {
        const themeIndex = Math.min(this.level - 1, CONFIG.LEVEL_THEMES.length - 1);
        const theme = CONFIG.LEVEL_THEMES[themeIndex];
        document.getElementById('level').textContent = `${this.level} (${theme.name})`;
    }

    updateLivesDisplay() {
        const livesDisplay = document.getElementById('livesDisplay');
        const hearts = [];

        for (let i = 0; i < CONFIG.MAX_LIVES; i++) {
            if (i < this.lives) {
                hearts.push('<span class="heart">❤️</span>');
            } else {
                hearts.push('<span class="heart" style="opacity: 0.3;">🖤</span>');
            }
        }

        livesDisplay.innerHTML = hearts.join('');
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
