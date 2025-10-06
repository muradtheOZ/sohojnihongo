// src/app/api/hiragana/[char]/route.ts

import { NextResponse } from 'next/server';
import hiraganaData from '@/app/data/hiragana';

export async function GET(
  request: Request,
  { params }: { params: { char: string } }
) {
  const character = params.char;

  const characterData = hiraganaData.find(
    (h) => h.kana === decodeURIComponent(character)
  );

  if (!characterData) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  return NextResponse.json(characterData);
}