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
  {
    kana: 'い',
    romaji: 'i',
    strokes: [
      {
        // Stroke 1: The left, hooked stroke
        path: 'M 131 91 C 132 114, 137 172, 148 212 C 161 259, 175 313, 199 341 C 219 363, 225 307, 225 275',
        checkpoints: [
          { x: 131, y: 91 },   // Start
          { x: 148, y: 212 },  // Middle of the curve
          { x: 199, y: 341 },  // Bottom of the curve
          { x: 225, y: 275 },  // End of the hook
        ],
      },
      {
        // Stroke 2: The shorter right stroke
        path: 'M 251 101 C 269 114, 307 146, 315 173 C 322 199, 323 236, 321 252',
        checkpoints: [
          { x: 251, y: 101 },  // Start
          { x: 315, y: 173 },  // Middle of the curve
          { x: 321, y: 252 },  // End
        ],
      },
    ],
  },
  {
    kana: 'う',
    romaji: 'u',
    strokes: [
      {
        // Stroke 1: The top dash
        path: 'M 145 90 C 180 80, 220 85, 255 100',
        checkpoints: [
          { x: 145, y: 90 }, // Start
          { x: 200, y: 82 }, // Middle (apex)
          { x: 255, y: 100 }, // End
        ],
      },
      {
        // Stroke 2: The main C-curve
        path: 'M 110 160 C 140 120, 290 120, 290 180 C 290 270, 200 350, 150 320',
        checkpoints: [
          { x: 110, y: 160 }, // Start
          { x: 200, y: 125 }, // Top of the curve
          { x: 290, y: 180 }, // Right-most point
          { x: 200, y: 345 }, // Bottom-most point
          { x: 150, y: 320 }, // End
        ],
      },
    ],
  },
  {
    kana: 'え',
    romaji: 'e',
    strokes: [
      {
        // Stroke 1: The top dash
        path: 'M 140 90 Q 200 80, 260 100',
        checkpoints: [
          { x: 140, y: 90 }, // Start
          { x: 200, y: 80 }, // Middle (apex)
          { x: 260, y: 100 }, // End
        ],
      },
      {
        // Stroke 2: The complex zigzag
        path: 'M 110 160 L 300 130 L 190 260 C 130 330, 260 350, 310 320',
        checkpoints: [
          { x: 110, y: 160 }, // Start
          { x: 300, y: 130 }, // Top-right point
          { x: 190, y: 260 }, // Middle-left point
          { x: 260, y: 350 }, // Bottom-middle point
          { x: 310, y: 320 }, // End
        ],
      },
    ],
  },
  // --- NEW DATA FOR 'お' ADDED BELOW ---
  {
    kana: 'お',
    romaji: 'o',
    strokes: [
      {
        // Stroke 1: Horizontal line
        path: 'M 100 80 H 320',
        checkpoints: [
          { x: 100, y: 80 },
          { x: 210, y: 80 },
          { x: 320, y: 80 },
        ],
      },
      {
        // Stroke 2: Vertical line with loop
        path: 'M 160 30 V 170 C 160 270, 80 270, 80 170 C 80 110, 160 110, 240 170 C 320 230, 280 290, 200 280',
        checkpoints: [
          { x: 160, y: 30 },  // Start
          { x: 160, y: 170 }, // Mid-vertical
          { x: 80, y: 170 },  // Left of loop
          { x: 240, y: 170 }, // Right of loop
          { x: 200, y: 280 }, // End
        ],
      },
      {
        // Stroke 3: The 'ten' (dash)
        path: 'M 290 140 C 320 130, 340 160, 310 180',
        checkpoints: [
          { x: 290, y: 140 }, // Start
          { x: 310, y: 180 }, // End
        ],
      },
    ],
  },
];

export default hiraganaData;

