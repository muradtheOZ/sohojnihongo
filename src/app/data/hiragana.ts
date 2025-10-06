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

// We define our character data here.
// NOTE: The SVG paths and checkpoint coordinates are based on a 400x400 canvas.
// You can get SVG paths from a vector editor like Inkscape or Figma.
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
        // Stroke 1: Top horizontal line
        path: 'M 95 135 C 160 115, 265 125, 320 150',
        checkpoints: [
          { x: 95, y: 135 },   // Start
          { x: 200, y: 125 },  // Middle
          { x: 320, y: 150 },  // End
        ],
      },
      {
        // Stroke 2: Vertical curved line
        path: 'M 210 130 C 200 230, 190 290, 195 330',
        checkpoints: [
          { x: 210, y: 130 },  // Start
          { x: 195, y: 230 },  // Middle
          { x: 195, y: 330 },  // End
        ],
      },
      {
        // Stroke 3: The characteristic loop
        path: 'M 130 240 Q 140 320, 215 330 C 290 340, 350 280, 250 240',
        checkpoints: [
          { x: 130, y: 240 },  // Start
          { x: 215, y: 330 },  // Bottom of loop
          { x: 310, y: 275 },  // Right side of loop
          { x: 250, y: 240 },  // End
        ],
      },
    ],
  },
  // We will add more characters like 'い', 'う', 'え', 'お' here later.
];

export default hiraganaData;
