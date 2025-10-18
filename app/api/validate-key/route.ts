import { NextResponse } from 'next/server';

// Shared storage with generate-key
const generatedKeys = new Map<string, { timestamp: number, used: boolean }>();
const usedKeys = new Set<string>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, message: 'No key provided' },
        { status: 400 }
      );
    }

    // Check if key exists
    const keyData = generatedKeys.get(key);
    
    if (!keyData) {
      return NextResponse.json(
        { success: false, message: 'Invalid key' },
        { status: 400 }
      );
    }

    if (keyData.used || usedKeys.has(key)) {
      return NextResponse.json(
        { success: false, message: 'Key already used' },
        { status: 400 }
      );
    }

    // Mark key as used
    keyData.used = true;
    usedKeys.add(key);
    generatedKeys.set(key, keyData);

    return NextResponse.json({
      success: true,
      message: 'Key validated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}