// Configuración para reintentos
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

// Clase para manejar el rate limiting
export class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerMinute: number;
  private requestTimes: number[] = [];

  constructor(requestsPerMinute = 60) {
    this.requestsPerMinute = requestsPerMinute;
  }

  async add<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process(): Promise<void> {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    if (this.canMakeRequest()) {
      const operation = this.queue.shift();
      if (operation) {
        this.requestTimes.push(Date.now());
        try {
          await operation();
        } catch (error) {
          console.error('Error in rate limited operation:', error);
        }
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, this.getWaitTime()));
    }

    // Procesar siguiente en la cola
    this.process();
  }

  private canMakeRequest(): boolean {
    const now = Date.now();
    this.requestTimes = this.requestTimes.filter(
      time => now - time < 60000
    );
    return this.requestTimes.length < this.requestsPerMinute;
  }

  private getWaitTime(): number {
    if (this.requestTimes.length === 0) return 0;
    const oldestRequest = this.requestTimes[0];
    const now = Date.now();
    const timeToWait = Math.max(0, 60000 - (now - oldestRequest));
    return timeToWait;
  }
}

// Utilidad para reintentos
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) break;

      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

// Cache simple para respuestas
export class ResponseCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }
}