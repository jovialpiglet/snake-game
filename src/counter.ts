export class Counter {
  private score: number;

  constructor() {
    this.score = 0;
  }

  increment(): void {
    this.score++;
  }

  reset(): void {
    this.score = 0;
  }

  getScore(): number {
    return this.score;
  }
}