import { parse } from 'ahocon';
import path from 'path';

interface Config {
  flux: {
    api: {
      baseUrl: string;
      timeout: number;
    };
    app: {
      environment: string;
    };
  };
}

const CONFIG_PATH = path.resolve(process.cwd(), 'config', 'application.conf');

async function loadConfig(): Promise<Config> {
  const defaultConfig: Config = {
    flux: {
      api: {
        baseUrl: process.env.API_URL || 'http://localhost:8080',
        timeout: parseInt(process.env.API_TIMEOUT || '10000', 10)
      },
      app: {
        environment: process.env.NODE_ENV || 'development'
      }
    }
  };

  // Skip file loading on the client
  if (typeof window !== 'undefined') {
      return defaultConfig;
  }

  try {
      // Dynamic import to prevent bundling node:fs on the client
      const { readFile } = await import('node:fs/promises');
      const content = await readFile(CONFIG_PATH, 'utf-8');
      const parsed = parse(content) as Config;

      // Apply environment variable overrides manually since our HOCON parser is limited
      if (process.env.API_URL) parsed.flux.api.baseUrl = process.env.API_URL;
      if (process.env.API_TIMEOUT) parsed.flux.api.timeout = parseInt(process.env.API_TIMEOUT, 10);
      if (process.env.NODE_ENV) parsed.flux.app.environment = process.env.NODE_ENV;

      return parsed;
  } catch (error) {
      console.warn(`[Config] Failed to load ${CONFIG_PATH}, using defaults:`, error);
      return defaultConfig;
  }
}

// Singleton config instance
export const config = await loadConfig();

// Utility for client-side (safe fallback)
export const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        // In browser, we prefer the environment variable if set, otherwise relative /api
        return process.env.NEXT_PUBLIC_API_URL || '/api';
    }
    return config.flux.api.baseUrl;
};
