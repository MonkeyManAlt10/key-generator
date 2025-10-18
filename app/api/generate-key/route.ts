import { NextResponse } from 'next/server';

// In-memory storage for keys
const generatedKeys = new Map<string, { timestamp: number, used: boolean }>();

// Clean up keys older than 24 hours
function cleanupOldKeys() {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  for (const [key, data] of generatedKeys.entries()) {
    if (data.timestamp < oneDayAgo) {
      generatedKeys.delete(key);
    }
  }
}

function generateRandomKey(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export async function GET() {
  cleanupOldKeys();
  
  let key = generateRandomKey();
  
  // Ensure key is unique
  while (generatedKeys.has(key)) {
    key = generateRandomKey();
  }
  
  generatedKeys.set(key, {
    timestamp: Date.now(),
    used: false
  });
  
  return NextResponse.json({ 
    success: true, 
    key: key 
  });
}