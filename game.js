// Game Configuration
const CONFIG = {
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 500,
    INITIAL_BLOCK_WIDTH: 100,
    BLOCK_HEIGHT: 30,
    BASE_SPEED: 2,
    BLOCKS_PER_LEVEL: 10,
    MAX_LIVES: 3,
    LEVEL_THEMES: [
        {
            name: 'Beginner',
            bgGradient: ['#FFF5E1', '#FFE4B5'],
            pattern: 'dots',
            colors: ['#FF6B6B', '#FF8787', '#FFA5A5', '#FFC0CB']
        },
        {
            name: 'Novice',
            bgGradient: ['#E3F2FD', '#BBDEFB'],
            pattern: 'waves',
            colors: ['#4ECDC4', '#45B7D1', '#5DADE2', '#85C1E2']
        },
        {
            name: 'Intermediate',
            bgGradient: ['#F3E5F5', '#E1BEE7'],
            pattern: 'grid',
            colors: ['#BB8FCE', '#9B59B6', '#8E44AD', '#A569BD']
        },
        {
            name: 'Advanced',
            bgGradient: ['#FFF3E0', '#FFE0B2'],
            pattern: 'diagonal',
            colors: ['#FFA07A', '#FF8C69', '#F8B739', '#FFB347']
        },
        {
            name: 'Expert',
            bgGradient: ['#FCE4EC', '#F8BBD0'],
            pattern: 'circles',
            colors: ['#E91E63', '#F06292', '#EC407A', '#FF4081']
        },
        {
            name: 'Master',
            bgGradient: ['#E0F2F1', '#B2DFDB'],
            pattern: 'hexagon',
            colors: ['#26A69A', '#4DB6AC', '#52B788', '#66BB6A']
        },
        {
            name: 'Legend',
            bgGradient: ['#FFF9C4', '#FFF59D'],
            pattern: 'stars',
            colors: ['#F7DC6F', '#F4D03F', '#F9E79F', '#FFD700']
        },
        {
            name: 'Champion',
            bgGradient: ['#FFE0B2', '#FFCC80'],
            pattern: 'zigzag',
            colors: ['#FF9800', '#FFB74D', '#FFA726', '#FB8C00']
        },
        {
            name: 'Ultimate',
            bgGradient: ['#C5E1A5', '#AED581'],
            pattern: 'triangles',
            colors: ['#8BC34A', '#9CCC65', '#7CB342', '#689F38']
        },
        {
            name: 'Godlike',
            bgGradient: ['#FFCDD2', '#EF9A9A'],
            pattern: 'diamonds',
            colors: ['#E63946', '#FF6B6B', '#D32F2F', '#C62828']
        }
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
        this.retries = 1;
        this.direction = 1;
        this.blocksInLevel = 0;

        this.setupEventListeners();
        this.updateLivesDisplay();
        this.updateRetriesDisplay();
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
        this.retries = 1;
        this.blocks = [];
        this.direction = 1;
        this.blocksInLevel = 0;

        this.updateScore();
        this.updateLevel();
        this.updateLivesDisplay();
        this.updateRetriesDisplay();
        this.updateMessage('Click or press SPACE to drop!');

        // Add base block with level-specific color
        const theme = this.getCurrentTheme();
        this.blocks.push({
            x: CONFIG.CANVAS_WIDTH / 2 - CONFIG.INITIAL_BLOCK_WIDTH / 2,
            y: CONFIG.CANVAS_HEIGHT - CONFIG.BLOCK_HEIGHT,
            width: CONFIG.INITIAL_BLOCK_WIDTH,
            height: CONFIG.BLOCK_HEIGHT,
            color: theme.colors[0]
        });

        this.spawnNewBlock();
        this.gameLoop();
    }

    getCurrentTheme() {
        const themeIndex = Math.min(this.level - 1, CONFIG.LEVEL_THEMES.length - 1);
        return CONFIG.LEVEL_THEMES[themeIndex];
    }

    spawnNewBlock() {
        const lastBlock = this.blocks[this.blocks.length - 1];
        const theme = this.getCurrentTheme();
        const colorIndex = this.blocks.length % theme.colors.length;

        // Calculate speed based on level
        const speed = CONFIG.BASE_SPEED + (this.level - 1) * 0.5;

        this.currentBlock = {
            x: 0,
            y: lastBlock.y - CONFIG.BLOCK_HEIGHT,
            width: lastBlock.width,
            height: CONFIG.BLOCK_HEIGHT,
            color: theme.colors[colorIndex],
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
        this.lives = CONFIG.MAX_LIVES; // Reset lives to 3
        this.retries = 1; // Reset retry to 1

        this.updateLevel();
        this.updateLivesDisplay();
        this.updateRetriesDisplay();
        this.updateMessage(`Level ${this.level}! Lives & Retry restored! 🎊`);

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

        // Check if player has a retry available
        if (this.retries > 0) {
            this.offerRetry();
        } else {
            this.endGame();
        }
    }

    offerRetry() {
        this.updateMessage(`Out of lives! Use retry? (Y/N)`);

        const retryHandler = (e) => {
            if (e.key === 'y' || e.key === 'Y') {
                document.removeEventListener('keydown', retryHandler);
                this.useRetry();
            } else if (e.key === 'n' || e.key === 'N') {
                document.removeEventListener('keydown', retryHandler);
                this.endGame();
            }
        };

        document.addEventListener('keydown', retryHandler);

        // Also add click handler for mobile
        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Use Retry (1 Life)';
        retryBtn.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 100; padding: 15px 30px; font-size: 1.2em;';
        retryBtn.onclick = () => {
            document.removeEventListener('keydown', retryHandler);
            retryBtn.remove();
            this.useRetry();
        };

        const skipBtn = document.createElement('button');
        skipBtn.textContent = 'End Game';
        skipBtn.style.cssText = 'position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); z-index: 100; padding: 15px 30px; font-size: 1.2em;';
        skipBtn.onclick = () => {
            document.removeEventListener('keydown', retryHandler);
            retryBtn.remove();
            skipBtn.remove();
            this.endGame();
        };

        this.canvas.parentElement.appendChild(retryBtn);
        this.canvas.parentElement.appendChild(skipBtn);
    }

    useRetry() {
        this.retries--;
        this.lives = 1; // Give 1 life on retry
        this.updateLivesDisplay();
        this.updateRetriesDisplay();
        this.updateMessage('Retry used! 1 life granted!');

        setTimeout(() => {
            this.gameRunning = true;
            this.spawnNewBlock();
            this.gameLoop();
        }, 1000);
    }

    endGame() {
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
        const theme = this.getCurrentTheme();

        // Draw background with gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_HEIGHT);
        gradient.addColorStop(0, theme.bgGradient[0]);
        gradient.addColorStop(1, theme.bgGradient[1]);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        // Draw background pattern
        this.drawBackgroundPattern(theme.pattern);

        // Draw all placed blocks
        this.blocks.forEach(block => {
            this.drawBlock(block);
        });

        // Draw current moving block
        if (this.currentBlock) {
            this.drawBlock(this.currentBlock);
        }
    }

    drawBackgroundPattern(pattern) {
        this.ctx.globalAlpha = 0.1;
        this.ctx.fillStyle = '#000';
        const spacing = 30;

        switch (pattern) {
            case 'dots':
                for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += spacing) {
                    for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += spacing) {
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, 3, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
                break;
            case 'waves':
                for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += spacing) {
                    this.ctx.beginPath();
                    for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += 5) {
                        const waveY = y + Math.sin(x / 20) * 5;
                        if (x === 0) this.ctx.moveTo(x, waveY);
                        else this.ctx.lineTo(x, waveY);
                    }
                    this.ctx.stroke();
                }
                break;
            case 'grid':
                for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += spacing) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, 0);
                    this.ctx.lineTo(x, CONFIG.CANVAS_HEIGHT);
                    this.ctx.stroke();
                }
                for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += spacing) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, y);
                    this.ctx.lineTo(CONFIG.CANVAS_WIDTH, y);
                    this.ctx.stroke();
                }
                break;
            case 'diagonal':
                for (let i = -CONFIG.CANVAS_HEIGHT; i < CONFIG.CANVAS_WIDTH + CONFIG.CANVAS_HEIGHT; i += spacing) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(i, 0);
                    this.ctx.lineTo(i - CONFIG.CANVAS_HEIGHT, CONFIG.CANVAS_HEIGHT);
                    this.ctx.stroke();
                }
                break;
            case 'circles':
                for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += spacing) {
                    for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += spacing) {
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, 10, 0, Math.PI * 2);
                        this.ctx.stroke();
                    }
                }
                break;
            case 'hexagon':
            case 'stars':
                for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += spacing) {
                    for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += spacing) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, y - 5);
                        this.ctx.lineTo(x + 3, y + 2);
                        this.ctx.lineTo(x - 3, y + 2);
                        this.ctx.closePath();
                        this.ctx.fill();
                    }
                }
                break;
            case 'zigzag':
                for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += spacing) {
                    this.ctx.beginPath();
                    for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += spacing / 2) {
                        const zigY = y + ((x / (spacing / 2)) % 2 === 0 ? -5 : 5);
                        if (x === 0) this.ctx.moveTo(x, zigY);
                        else this.ctx.lineTo(x, zigY);
                    }
                    this.ctx.stroke();
                }
                break;
            case 'triangles':
                for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += spacing) {
                    for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += spacing) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, y);
                        this.ctx.lineTo(x + 10, y + 10);
                        this.ctx.lineTo(x - 10, y + 10);
                        this.ctx.closePath();
                        this.ctx.fill();
                    }
                }
                break;
            case 'diamonds':
                for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += spacing) {
                    for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += spacing) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, y - 8);
                        this.ctx.lineTo(x + 8, y);
                        this.ctx.lineTo(x, y + 8);
                        this.ctx.lineTo(x - 8, y);
                        this.ctx.closePath();
                        this.ctx.stroke();
                    }
                }
                break;
        }

        this.ctx.globalAlpha = 1.0;
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

    updateRetriesDisplay() {
        const retriesDisplay = document.getElementById('retriesDisplay');
        retriesDisplay.textContent = this.retries > 0 ? '✨' : '❌';
        retriesDisplay.style.opacity = this.retries > 0 ? '1' : '0.3';
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
