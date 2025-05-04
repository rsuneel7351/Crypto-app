// Simple rate limiter to control API request frequency
class RateLimiter {
  constructor() {
    this.lastRequestTime = 0;
    this.requestQueue = [];
    this.isProcessing = false;
    this.MIN_INTERVAL = 2000; // 2 seconds
  }

  async waitForNextRequest() {
    return new Promise((resolve) => {
      this.requestQueue.push(resolve);
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;

    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const waitTime = Math.max(0, this.MIN_INTERVAL - timeSinceLastRequest);

    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    const nextRequest = this.requestQueue.shift();
    if (nextRequest) {
      this.lastRequestTime = Date.now();
      nextRequest();
    }

    this.isProcessing = false;
    this.processQueue();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

