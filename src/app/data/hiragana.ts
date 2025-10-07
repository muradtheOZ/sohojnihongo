// src/data/hiragana.ts

export interface Checkpoint {
  x: number;
  y: number;
}

export interface Stroke {
  path: string; // SVG path for the visual guide
  checkpoints: Checkpoint[];
}

export interface HiraganaCharacter {
  kana: string;
  romaji: string;
  strokes: Stroke[];
}

const hiraganaData: HiraganaCharacter[] = [
  {
    kana: 'あ',
    romaji: 'a',
    strokes: [
      {
        // Stroke 1: Shifted up by 50px
        path: 'M 95 86 L 190 75 L 298 51',
        checkpoints: [
          { x: 95, y: 86 },
          { x: 190, y: 75 },
          { x: 298, y: 51 },
        ],
      },
      {
        // Stroke 2: Shifted up by 50px
        path: 'M 215 60 L 205 195 L 225 315',
        checkpoints: [
          { x: 215, y: 60 },
          { x: 205, y: 195 },
          { x: 225, y: 315 },
        ],
      },
      {
        // Stroke 3: Shifted up by 50px
        path: 'M 235 101 C 244 107, 257 128, 235 162 C 212 196, 171 240, 151 258 C 137 270, 107 293, 89 296 C 68 299, 40 280, 45 260 C 50 240, 57 207, 78 194 C 99 181, 142 152, 189 137 C 228 125, 269 126, 285 128 C 309 135, 362 159, 361 193 C 359 234, 338 280, 315 296 C 297 308, 256 327, 235 335',
        checkpoints: [
          { x: 235, y: 101 }, // Start
          { x: 151, y: 258 }, // Left-most point
          { x: 45, y: 260 },  // Bottom-left curve
          { x: 189, y: 137 }, // Top of the loop
          { x: 361, y: 193 }, // Right-most point
          { x: 235, y: 335 }, // End
        ],
      },
    ],
  },
  // We will add more characters here later.
];

export default hiraganaData;