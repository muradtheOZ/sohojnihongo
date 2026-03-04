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
        // Stroke 1: Made more horizontal and moved up
        path: 'M 140 40 C 180 35, 220 45, 250 55',
        checkpoints: [
          { x: 140, y: 40 }, // Start
          { x: 180, y: 35 }, // Middle (apex)
          { x: 250, y: 55 }, // End
        ],
      },
      {
        // Stroke 2: Scaled and positioned from your trace
        path: 'M 72 128 C 88 125, 123 116, 142 110 C 160 103, 218 81, 245 71 L 174 162 L 105 235 L 72 274 L 63 288 L 120 253 C 130 244, 155 234, 178 256 C 200 278, 206 291, 206 294 C 221 304, 258 322, 286 318 C 314 314, 332 311, 337 309',
        checkpoints: [
          { x: 72, y: 128 },  // Start
          { x: 245, y: 71 },  // Top-right point
          { x: 105, y: 235 }, // Mid-left point
          { x: 63, y: 288 },  // Bottom-left point
          { x: 178, y: 256 }, // Mid-curve
          { x: 337, y: 309 }, // End
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
  {
    kana: 'か',
    romaji: 'ka',
    strokes: [
      {
        path: 'M 80 140 C 120 120, 210 90, 230 110 C 260 140, 245 260, 225 295 C 200 325, 170 315, 155 305',
        checkpoints: [
          { x: 80, y: 140 },
          { x: 155, y: 110 },
          { x: 230, y: 110 },
          { x: 235, y: 220 },
          { x: 155, y: 305 },
        ],
      },
      {
        // Started 40 pixels higher (Y: 100 -> 60)
        path: 'M 190 60 C 170 180, 110 320, 85 345',
        checkpoints: [
          { x: 190, y: 60 },
          { x: 130, y: 220 },
          { x: 85, y: 345 },
        ],
      },
      {
        path: 'M 285 105 C 315 125, 360 175, 340 215',
        checkpoints: [
          { x: 285, y: 105 },
          { x: 340, y: 215 },
        ],
      },
    ],
  },
  {
    kana: 'き',
    romaji: 'ki',
    strokes: [
      {
        // Top horizontal
        path: 'M 90 99 L 309 85',
        checkpoints: [
          { x: 90, y: 99 },
          { x: 309, y: 85 },
        ],
      },
      {
        // Second horizontal
        path: 'M 80 150 L 333 120',
        checkpoints: [
          { x: 80, y: 150 },
          { x: 333, y: 120 },
        ],
      },
      {
        // Diagonal slash and bottom curve combined
        path: 'M 163 40 L 299 224 C 268 212, 197 194, 155 215 C 103 242, 111 260, 111 275 C 111 290, 122 356, 299 322',
        checkpoints: [
          { x: 163, y: 40 },
          { x: 299, y: 224 },
          { x: 155, y: 215 },
          { x: 111, y: 275 },
          { x: 299, y: 322 },
        ],
      },
    ],
  },
  {
    kana: 'く',
    romaji: 'ku',
    strokes: [
      {
        path: 'M 280 100 L 120 200 L 280 300',
        checkpoints: [
          { x: 280, y: 100 },
          { x: 120, y: 200 },
          { x: 280, y: 300 }
        ],
      },
    ],
  },
  {
    kana: 'け',
    romaji: 'ke',
    strokes: [
      {
        path: 'M 130 100 L 130 260 C 130 290, 150 300, 160 280',
        checkpoints: [
          { x: 130, y: 100 },
          { x: 130, y: 260 },
          { x: 160, y: 280 }
        ],
      },
      {
        path: 'M 180 140 L 310 140',
        checkpoints: [
          { x: 180, y: 140 },
          { x: 310, y: 140 }
        ],
      },
      {
        path: 'M 260 100 C 260 180, 260 260, 220 330',
        checkpoints: [
          { x: 260, y: 100 },
          { x: 260, y: 200 },
          { x: 220, y: 330 }
        ],
      },
    ],
  },
  {
    kana: 'こ',
    romaji: 'ko',
    strokes: [
      {
        path: 'M 130 130 C 180 110, 240 110, 290 130 C 290 150, 270 170, 250 170',
        checkpoints: [
          { x: 130, y: 130 },
          { x: 210, y: 118 },
          { x: 290, y: 130 },
          { x: 250, y: 170 }
        ],
      },
      {
        path: 'M 130 270 C 180 290, 240 290, 290 250',
        checkpoints: [
          { x: 130, y: 270 },
          { x: 210, y: 285 },
          { x: 290, y: 250 }
        ],
      },
    ],
  },
  {
    kana: 'さ',
    romaji: 'sa',
    strokes: [
      {
        path: 'M 90 95 C 139 90, 251 75, 305 50',
        checkpoints: [
          { x: 90, y: 95 },
          { x: 197, y: 82 },
          { x: 305, y: 50 }
        ],
      },
      {
        path: 'M 185 50 L 295 237 C 252 219, 155 193, 113 232 C 61 281, 113 332, 137 338 C 156 343, 216 352, 244 356',
        checkpoints: [
          { x: 185, y: 50 },
          { x: 295, y: 237 },
          { x: 113, y: 232 },
          { x: 113, y: 332 },
          { x: 244, y: 356 }
        ],
      },
    ],
  },
  {
    kana: 'し',
    romaji: 'shi',
    strokes: [
      {
        path: 'M 160 80 L 160 250 C 160 330, 260 340, 310 270',
        checkpoints: [
          { x: 160, y: 80 },
          { x: 160, y: 250 },
          { x: 220, y: 330 },
          { x: 310, y: 270 }
        ],
      },
    ],
  },
  {
    kana: 'す',
    romaji: 'su',
    strokes: [
      {
        path: 'M 70 105 C 150 90, 314 62, 327 66',
        checkpoints: [
          { x: 70, y: 105 },
          { x: 190, y: 85 },
          { x: 327, y: 66 }
        ],
      },
      {
        path: 'M 206 65 C 209 81, 212 128, 206 189 C 199 265, 218 284, 186 266 C 154 248, 117 209, 158 199 C 199 189, 210 181, 214 205 C 218 229, 205 321, 178 335',
        checkpoints: [
          { x: 206, y: 65 },
          { x: 206, y: 189 },
          { x: 186, y: 266 },
          { x: 158, y: 199 },
          { x: 214, y: 205 },
          { x: 178, y: 335 }
        ],
      },
    ],
  },
  {
    kana: 'せ',
    romaji: 'se',
    strokes: [
      {
        // Stroke 1: Horizontal
        path: 'M 90 150 L 320 130',
        checkpoints: [
          { x: 90, y: 150 },
          { x: 320, y: 130 }
        ],
      },
      {
        // Stroke 2: Right vertical, hooks LEFT
        path: 'M 260 90 L 260 190 C 260 220, 240 230, 220 210',
        checkpoints: [
          { x: 260, y: 90 },
          { x: 260, y: 190 },
          { x: 220, y: 210 }
        ],
      },
      {
        // Stroke 3: Left vertical, turns RIGHT
        path: 'M 150 110 L 150 240 C 150 310, 230 320, 310 290',
        checkpoints: [
          { x: 150, y: 110 },
          { x: 150, y: 240 },
          { x: 230, y: 310 },
          { x: 310, y: 290 }
        ],
      },
    ],
  }
];

export default hiraganaData;

