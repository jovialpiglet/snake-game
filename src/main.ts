import './style.css';

// Game constants
const CELL_SIZE = 20;
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

// Game state
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

class SnakeGame {
    private snake: Position[] = [];
    private food: Position = { x: 0, y: 0 };
    private direction: Direction = 'RIGHT';
    private nextDirection: Direction = 'RIGHT';
    private gameInterval: number | null = null;
    private score: number = 0;
    private isGameRunning: boolean = false;

    constructor(
        private canvas: HTMLCanvasElement,
        private ctx: CanvasRenderingContext2D,
        private scoreElement: HTMLElement,
        private startButton: HTMLButtonElement
    ) {
        this.init();
    }

    private init(): void {
        this.setupEventListeners();
        this.resetGame();
        this.draw();
    }

    private resetGame(): void {
        this.snake = [
            { x: 5, y: 10 },
            { x: 4, y: 10 },
            { x: 3, y: 10 }
        ];
        this.generateFood();
        this.score = 0;
        this.scoreElement.textContent = this.score.toString();
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
    }

    private generateFood(): void {
        this.food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

        // Make sure food doesn't appear on snake
        for (const segment of this.snake) {
            if (segment.x === this.food.x && segment.y === this.food.y) {
                this.generateFood();
                return;
            }
        }
    }

    private draw(): void {
        // Clear canvas
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#4CAF50';
        for (const segment of this.snake) {
            this.ctx.fillRect(
                segment.x * CELL_SIZE,
                segment.y * CELL_SIZE,
                CELL_SIZE - 1,
                CELL_SIZE - 1
            );
        }

        // Draw head differently
        if (this.snake.length > 0) {
            this.ctx.fillStyle = '#388E3C';
            this.ctx.fillRect(
                this.snake[0].x * CELL_SIZE,
                this.snake[0].y * CELL_SIZE,
                CELL_SIZE - 1,
                CELL_SIZE - 1
            );
        }

        // Draw food
        this.ctx.fillStyle = '#F44336';
        this.ctx.fillRect(
            this.food.x * CELL_SIZE,
            this.food.y * CELL_SIZE,
            CELL_SIZE - 1,
            CELL_SIZE - 1
        );
    }

    private update(): void {
        // Update direction
        this.direction = this.nextDirection;

        // Move snake
        const head = { ...this.snake[0] };

        switch (this.direction) {
            case 'UP':
                head.y -= 1;
                break;
            case 'DOWN':
                head.y += 1;
                break;
            case 'LEFT':
                head.x -= 1;
                break;
            case 'RIGHT':
                head.x += 1;
                break;
        }

        // Check for collisions
        if (
            head.x < 0 || head.x >= GRID_SIZE ||
            head.y < 0 || head.y >= GRID_SIZE ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            this.gameOver();
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check if snake ate food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score.toString();
            this.generateFood();
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
    }

    private gameLoop = (): void => {
        this.update();
        this.draw();
    }

    private gameOver(): void {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        this.isGameRunning = false;
        this.startButton.textContent = 'Start Game';
        alert(`Game Over! Your score: ${this.score}`);
    }

    private setupEventListeners(): void {
        this.startButton.addEventListener('click', () => this.toggleGame());

        document.addEventListener('keydown', (e) => {
            if (!this.isGameRunning) return;

            switch (e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'DOWN') this.nextDirection = 'UP';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'UP') this.nextDirection = 'DOWN';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'RIGHT') this.nextDirection = 'LEFT';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'LEFT') this.nextDirection = 'RIGHT';
                    break;
            }
        });
    }

    private toggleGame(): void {
        if (this.isGameRunning) {
            if (this.gameInterval) {
                clearInterval(this.gameInterval);
                this.gameInterval = null;
            }
            this.isGameRunning = false;
            this.startButton.textContent = 'Start Game';
        } else {
            this.resetGame();
            this.isGameRunning = true;
            this.startButton.textContent = 'Stop Game';
            this.gameInterval = setInterval(this.gameLoop, INITIAL_SPEED) as unknown as number;
        }
    }
}

// Initialize Snake Game
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const scoreElement = document.getElementById('score') as HTMLSpanElement;
const startButton = document.getElementById('startBtn') as HTMLButtonElement;

new SnakeGame(canvas, ctx, scoreElement, startButton);