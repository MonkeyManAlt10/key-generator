import { NextResponse } from 'next/server';
import { generatedKeys, usedKeys } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key } = body;

    console.log('Validating key:', key);
    console.log('Keys in storage:', Array.from(generatedKeys.keys()));

    if (!key) {
      return NextResponse.json(
        { success: false, message: 'No key provided' },
        { status: 400 }
      );
    }

    const keyData = generatedKeys.get(key);
    
    if (!keyData) {
      console.log('Key not found in storage');
      return NextResponse.json(
        { success: false, message: 'Invalid key' },
        { status: 400 }
      );
    }

    if (keyData.used || usedKeys.has(key)) {
      console.log('Key already used');
      return NextResponse.json(
        { success: false, message: 'Key already used' },
        { status: 400 }
      );
    }

    // Mark key as used
    keyData.used = true;
    usedKeys.add(key);
    generatedKeys.set(key, keyData);

    console.log('Key validated successfully');

    return NextResponse.json({
      success: true,
      message: 'Key validated successfully'
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}