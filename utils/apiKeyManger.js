// API key manager using round-robin strategy
class ApiKeyManager {
  constructor(apiKeys) {
    if (!Array.isArray(apiKeys) || apiKeys.length === 0) {
      throw new Error("At least one API key is required.");
    }
    this.apiKeys = apiKeys;
    this.currentIndex = 0;
  }

  getNextKey() {
    const key = this.apiKeys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
    return key;
  }

  getCurrentKey() {
    return this.apiKeys[this.currentIndex];
  }
}

// Load keys from environment (React Native uses process.env with Babel plugin or dotenv fallback)
const apiKeys = [
  'CG-pe8kLucgejLMRXvp1fD4Xn7b',
  'CG-NqvCgHc3ku3gMNLAEJKA3oFJ',
  'CG-apTi335Xcqi5xPzrmHtLAPVN',
].filter(Boolean); // Remove falsy values

if (apiKeys.length === 0) {
  console.warn("No API keys provided. Please set environment variables.");
}

export const apiKeyManager = new ApiKeyManager(apiKeys);

// VITE_COINGECKO_API_KEY_1 = CG-pe8kLucgejLMRXvp1fD4Xn7b
// VITE_COINGECKO_API_KEY_2 = CG-NqvCgHc3ku3gMNLAEJKA3oFJ
// VITE_COINGECKO_API_KEY_3 = CG-apTi335Xcqi5xPzrmHtLAPVN