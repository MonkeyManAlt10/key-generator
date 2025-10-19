// Shared storage for keys
export const generatedKeys = new Map<string, { timestamp: number, used: boolean }>();
export const usedKeys = new Set<string>();

// Clean up keys older than 24 hours
export function cleanupOldKeys() {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  for (const [key, data] of generatedKeys.entries()) {
    if (data.timestamp < oneDayAgo) {
      generatedKeys.delete(key);
      usedKeys.delete(key);
    }
  }
}