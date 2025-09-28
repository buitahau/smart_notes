import OpenRouterQueryAdapter from './impl/openRouterQueryAdapter.js';

/**
 * Configuration validation utilities
 */
class ConfigValidator {
  static validateApiKey(apiKey, provider) {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      throw new Error(`Invalid API key for provider: ${provider}`);
    }
    return apiKey.trim();
  }

  static validateUrl(url, provider) {
    if (!url || typeof url !== 'string') {
      throw new Error(`Invalid base URL for provider: ${provider}`);
    }
    try {
      new URL(url);
      return url.trim();
    } catch {
      throw new Error(`Invalid URL format for provider: ${provider}: ${url}`);
    }
  }

  static validateModel(model, provider) {
    if (!model || typeof model !== 'string' || model.trim().length === 0) {
      throw new Error(`Invalid model name for provider: ${provider}`);
    }
    return model.trim();
  }

  static validateProvider(provider) {
    if (!provider || typeof provider !== 'string') {
      throw new Error('Provider must be a non-empty string');
    }
    return provider.toLowerCase().trim();
  }
}

/**
 * Simple in-memory cache with TTL
 */
class ResponseCache {
  constructor(defaultTtl = 300000) { // 5 minutes default TTL
    this.cache = new Map();
    this.defaultTtl = defaultTtl;
  }

  set(key, value, ttl = this.defaultTtl) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Retry utility with exponential backoff
 */
class RetryHandler {
  static async withRetry(fn, maxRetries = 3, baseDelay = 1000, backoffFactor = 2) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          throw new Error(`Max retries (${maxRetries}) exceeded. Last error: ${error.message}`);
        }

        const delay = baseDelay * Math.pow(backoffFactor, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

/**
 * Structured logger for adapter operations
 */
class Logger {
  static log(level, message, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context
    };

    console.log(JSON.stringify(logEntry));
  }

  static info(message, context) {
    this.log('INFO', message, context);
  }

  static warn(message, context) {
    this.log('WARN', message, context);
  }

  static error(message, context) {
    this.log('ERROR', message, context);
  }
}

// Environment configuration with validation
const ENV = {
  QUERY_ADAPTER_PROVIDER: 'openrouter',
  OPENROUTER_API_KEY: '',
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  OPENROUTER_MODEL: 'deepseek/deepseek-chat-v3.1:free'
};

// Global cache instance
const responseCache = new ResponseCache();

/**
 * Enhanced AdapterFactory with validation, caching, and retry logic
 */
class AdapterFactory {
  static adapters = new Map();
  static cacheEnabled = true;
  static maxRetries = 3;
  static cacheTtl = 300000; // 5 minutes

  /**
   * Register a new adapter provider
   * @param {string} provider - Provider name
   * @param {Function} adapterClass - Adapter constructor
   */
  static registerAdapter(provider, adapterClass) {
    const validatedProvider = ConfigValidator.validateProvider(provider);
    if (typeof adapterClass !== 'function') {
      throw new Error('Adapter must be a constructor function');
    }
    this.adapters.set(validatedProvider, adapterClass);
    Logger.info(`Registered adapter: ${validatedProvider}`);
  }

  /**
   * Get available providers
   * @returns {string[]} - List of registered provider names
   */
  static getAvailableProviders() {
    return Array.from(this.adapters.keys()).concat(['openrouter']);
  }

  /**
   * Clear response cache
   */
  static clearCache() {
    responseCache.clear();
    Logger.info('Response cache cleared');
  }

  /**
   * Configure caching settings
   * @param {boolean} enabled - Whether caching is enabled
   * @param {number} ttl - Cache TTL in milliseconds
   */
  static configureCaching(enabled = true, ttl = 300000) {
    this.cacheEnabled = enabled;
    this.cacheTtl = ttl;
    Logger.info(`Caching configured: enabled=${enabled}, ttl=${ttl}ms`);
  }

  /**
   * Configure retry settings
   * @param {number} maxRetries - Maximum number of retries
   */
  static configureRetries(maxRetries = 3) {
    this.maxRetries = maxRetries;
    Logger.info(`Retry configuration updated: maxRetries=${maxRetries}`);
  }

  /**
   * Create a query adapter with enhanced configuration
   * @param {string} provider - Provider name
   * @param {Object} config - Configuration object
   * @returns {QueryAdapter} - Configured adapter instance
   */
  static createQueryAdapter(provider = 'openrouter', config = {}) {
    const validatedProvider = ConfigValidator.validateProvider(provider);

    Logger.info(`Creating adapter for provider: ${validatedProvider}`, { config: { ...config, apiKey: config.apiKey ? '[REDACTED]' : undefined } });

    switch (validatedProvider) {
      case 'openrouter':
        return this.createOpenRouterAdapter(config);
      default:
        // Check if it's a registered custom adapter
        if (this.adapters.has(validatedProvider)) {
          const AdapterClass = this.adapters.get(validatedProvider);
          return new AdapterClass(config);
        }
        throw new Error(`Unsupported query adapter provider: ${validatedProvider}. Available: ${this.getAvailableProviders().join(', ')}`);
    }
  }

  /**
   * Create OpenRouter adapter with validation
   * @param {Object} config - Configuration
   * @returns {OpenRouterQueryAdapter} - Validated adapter
   */
  static createOpenRouterAdapter(config) {
    const apiKey = ConfigValidator.validateApiKey(config.apiKey || ENV.OPENROUTER_API_KEY, 'openrouter');
    const baseUrl = ConfigValidator.validateUrl(config.baseUrl || ENV.OPENROUTER_BASE_URL, 'openrouter');
    const model = ConfigValidator.validateModel(config.model || ENV.OPENROUTER_MODEL, 'openrouter');

    return new OpenRouterQueryAdapter(apiKey, baseUrl, model);
  }

  /**
   * Get default query adapter with environment fallback
   * @returns {QueryAdapter} - Default adapter instance
   */
  static getQueryAdapter() {
    const defaultProvider = ENV.QUERY_ADAPTER_PROVIDER || 'openrouter';
    Logger.info(`Getting default adapter: ${defaultProvider}`);

    switch (defaultProvider.toLowerCase()) {
      case 'openrouter':
        return this.createOpenRouterAdapter({
          apiKey: ENV.OPENROUTER_API_KEY,
          baseUrl: ENV.OPENROUTER_BASE_URL,
          model: ENV.OPENROUTER_MODEL
        });
      default:
        throw new Error(`Unsupported query adapter provider: ${defaultProvider}. Available: ${this.getAvailableProviders().join(', ')}`);
    }
  }

  /**
   * Get query adapter from Cloudflare Workers context
   * @param {Object} env - Environment object
   * @returns {QueryAdapter} - Context-aware adapter
   */
  static getQueryAdapterFromContext(env) {
    const defaultProvider = env?.QUERY_ADAPTER_PROVIDER || ENV.QUERY_ADAPTER_PROVIDER || 'openrouter';
    Logger.info(`Getting adapter from context: ${defaultProvider}`);

    switch (defaultProvider.toLowerCase()) {
      case 'openrouter':
        return this.createOpenRouterAdapter({
          apiKey: env?.OPENROUTER_API_KEY || ENV.OPENROUTER_API_KEY,
          baseUrl: env?.OPENROUTER_BASE_URL || ENV.OPENROUTER_BASE_URL,
          model: env?.OPENROUTER_MODEL || ENV.OPENROUTER_MODEL
        });
      default:
        throw new Error(`Unsupported query adapter provider: ${defaultProvider}. Available: ${this.getAvailableProviders().join(', ')}`);
    }
  }

  /**
   * Execute adapter method with caching and retry logic
   * @param {string} method - Method name
   * @param {Array} args - Method arguments
   * @param {QueryAdapter} adapter - Adapter instance
   * @returns {Promise<any>} - Method result
   */
  static async executeWithCachingAndRetry(method, args, adapter) {
    const cacheKey = this.cacheEnabled ? `${method}:${JSON.stringify(args)}` : null;

    if (cacheKey) {
      const cached = responseCache.get(cacheKey);
      if (cached) {
        Logger.info(`Cache hit for method: ${method}`);
        return cached;
      }
    }

    const result = await RetryHandler.withRetry(async () => {
      if (!adapter[method] || typeof adapter[method] !== 'function') {
        throw new Error(`Method '${method}' not found on adapter`);
      }
      return await adapter[method](...args);
    }, this.maxRetries);

    if (cacheKey) {
      responseCache.set(cacheKey, result, this.cacheTtl);
      Logger.info(`Cached result for method: ${method}`);
    }

    return result;
  }

  /**
   * Initialize factory with default configuration
   */
  static initialize() {
    // Set up periodic cache cleanup
    setInterval(() => responseCache.cleanup(), 60000); // Cleanup every minute

    Logger.info('AdapterFactory initialized', {
      availableProviders: this.getAvailableProviders(),
      cacheEnabled: this.cacheEnabled,
      maxRetries: this.maxRetries
    });
  }
}

export default AdapterFactory;