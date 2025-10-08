// src/app/api/hiragana/[char]/route.ts

import { NextResponse } from 'next/server';
import hiraganaData from '@/app/data/hiragana';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ char: string }> }
) {
  // Next.js generated types expect RouteContext.params to be a Promise — await it
  const paramsObj = await params;
  const character = paramsObj?.char;

  const characterData = hiraganaData.find(
    (h) => h.kana === decodeURIComponent(character)
  );

  if (!characterData) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  return NextResponse.json(characterData);
}