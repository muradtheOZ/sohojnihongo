// src/components/KanaCanvas.tsx
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { HiraganaCharacter, Checkpoint } from "@/app/data/hiragana";
import hiraganaData from "@/app/data/hiragana";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const CHECKPOINT_RADIUS = 60; // Much more generous for easier matching

// Helper functions for stroke validation
const getDistance = (p1: Checkpoint, p2: Checkpoint) => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const isPointNearCheckpoint = (
  point: Checkpoint,
  checkpoint: Checkpoint,
  radius: number
) => {
  return getDistance(point, checkpoint) <= radius;
};

export default function KanaCanvas() {
  const [character, setCharacter] = useState<HiraganaCharacter | null>(null);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCorrectStroke, setIsCorrectStroke] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadCharacter = () => {
      setIsLoading(true);
      try {
        // Find the first character (あ) from local data
        const characterData = hiraganaData.find((char) => char.kana === "あ");

        if (!characterData) {
          setMessage("Character data not found.");
          return;
        }

        setCharacter(characterData);
        setCurrentStrokeIndex(0);
        setMessage("Draw the first stroke!");
        setIsCorrectStroke(null);
      } catch {
        setMessage("Error loading character data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCharacter();

    // Cleanup timeouts on unmount
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, []);

  const verifyStroke = useCallback(async () => {
    if (!character || !canvasRef.current) {
      console.log("Verification skipped: missing character or canvas ref");
      return;
    }

    try {
      const drawnPaths = await canvasRef.current.exportPaths();

      if (!drawnPaths || drawnPaths.length === 0) {
        setMessage("No stroke detected. Please try drawing again!");
        setIsCorrectStroke(false);
        return;
      }

      const lastDrawnPath = drawnPaths[drawnPaths.length - 1];

      if (!lastDrawnPath) {
        setMessage("Invalid stroke data. Please try again!");
        setIsCorrectStroke(false);
        return;
      }

      // Extract the path data - react-sketch-canvas uses 'paths' property
      const userPoints = lastDrawnPath.paths || [];

      if (!Array.isArray(userPoints)) {
        setMessage("Unable to process stroke data. Please try again!");
        setIsCorrectStroke(false);
        return;
      }

      console.log(`Stroke verification: ${userPoints.length} points detected`);

      // Check if we have enough points for a valid stroke
      if (userPoints.length < 10) {
        console.log("Stroke too short, likely just a mouse hover or click");
        setMessage("Draw a longer stroke by dragging across the canvas");
        setIsCorrectStroke(false);
        // Auto-clear short strokes after a brief delay
        setTimeout(() => {
          if (canvasRef.current) {
            canvasRef.current.undo();
          }
          setMessage("Try drawing a complete stroke");
        }, 1000);
        return;
      }

      // Get the ideal stroke for current stroke index
      const idealStroke = character.strokes[currentStrokeIndex];

      // Simple validation: check start and end points
      const firstUserPoint = userPoints[0];
      const lastUserPoint = userPoints[userPoints.length - 1];
      const firstCheckpoint = idealStroke.checkpoints[0];
      const lastCheckpoint =
        idealStroke.checkpoints[idealStroke.checkpoints.length - 1];

      const startDistance = getDistance(firstUserPoint, firstCheckpoint);
      const endDistance = getDistance(lastUserPoint, lastCheckpoint);

      console.log(
        `Start distance: ${startDistance}, End distance: ${endDistance}`
      );

      // More lenient validation: check if points are reasonably close
      const maxAllowedDistance = CHECKPOINT_RADIUS * 3; // Much more generous
      
      // Give helpful feedback but don't be too strict
      if (startDistance > maxAllowedDistance) {
        setMessage(
          `Try starting closer to the green START point. Current distance: ${Math.round(startDistance)}`
        );
        setIsCorrectStroke(false);
        // Don't auto-undo, let user try again
        return;
      }

      if (endDistance > maxAllowedDistance) {
        setMessage(
          `Try ending closer to the red END point. Current distance: ${Math.round(endDistance)}`
        );
        setIsCorrectStroke(false);
        // Don't auto-undo, let user try again
        return;
      }

      // Check if stroke follows the general path (sample points along the way)
      let passedCheckpoints = 0;
      for (let i = 0; i < idealStroke.checkpoints.length; i++) {
        const checkpoint = idealStroke.checkpoints[i];
        const nearbyPoint = userPoints.find((point) =>
          isPointNearCheckpoint(point, checkpoint, CHECKPOINT_RADIUS * 1.5)
        );
        if (nearbyPoint) {
          passedCheckpoints++;
        }
      }

      const requiredCheckpoints = Math.max(
        2,
        Math.floor(idealStroke.checkpoints.length * 0.6)
      );

      if (passedCheckpoints >= requiredCheckpoints) {
        setMessage(
          `Excellent! Stroke ${currentStrokeIndex + 1} completed correctly!`
        );
        setIsCorrectStroke(true);
      } else {
        setMessage(
          `Stroke path needs improvement. Passed ${passedCheckpoints}/${idealStroke.checkpoints.length} checkpoints. Follow the guide more closely.`
        );
        setIsCorrectStroke(false);
        if (canvasRef.current) {
          setTimeout(() => {
            canvasRef.current?.undo();
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error verifying stroke:", error);
      setMessage("Error processing stroke. Please try again.");
      setIsCorrectStroke(false);
    } finally {
      // Always reset validation state
      setIsValidating(false);
    }
  }, [character, currentStrokeIndex]);

  // This function is called when a stroke starts
  const handleStrokeStart = useCallback(() => {
    // Clear any pending validation
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = null;
    }

    if (!isDrawing && !isValidating) {
      setIsDrawing(true);
      setMessage("Drawing... Follow the guide line");
      setIsCorrectStroke(null);
    }
  }, [isDrawing, isValidating]);

  // This function is called when stroke data changes
  const handleStrokeEnd = useCallback(() => {
    // Clear any existing timeout first
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = null;
    }

    // Only proceed if we were drawing and not already validating
    if (isDrawing && !isValidating) {
      console.log("Stroke ended, scheduling validation...");
      setIsDrawing(false);
      setIsValidating(true);
      setMessage("Checking stroke...");

      // Clear any existing safety timeout
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }

      // Safety timeout to prevent getting stuck
      safetyTimeoutRef.current = setTimeout(() => {
        console.log("Safety timeout triggered - resetting validation state");
        setIsValidating(false);
        setMessage("Validation timed out. Please try drawing again.");
        setIsCorrectStroke(false);
      }, 3000); // 3 second safety timeout

      // Main validation timeout
      validationTimeoutRef.current = setTimeout(() => {
        console.log("Running validation now...");
        try {
          verifyStroke();
          // Clear safety timeout since validation completed
          if (safetyTimeoutRef.current) {
            clearTimeout(safetyTimeoutRef.current);
            safetyTimeoutRef.current = null;
          }
        } catch (error) {
          console.error("Validation error:", error);
          setMessage("Error validating stroke. Please try again.");
          setIsCorrectStroke(false);
        } finally {
          setIsValidating(false);
        }
      }, 600); // Reduced to 600ms for better responsiveness
    }
  }, [isDrawing, isValidating, verifyStroke]);

  const handleClear = useCallback(() => {
    // Clear any pending validations
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = null;
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    canvasRef.current?.clearCanvas();
    setIsDrawing(false);
    setIsValidating(false);
    setMessage("Draw the first stroke!");
    setIsCorrectStroke(null);
  }, []);

  const handleCharacterSelect = useCallback(
    (selectedKana: string) => {
      const selectedCharacter = hiraganaData.find(
        (char) => char.kana === selectedKana
      );
      if (selectedCharacter) {
        // Clear any pending validation first
        if (validationTimeoutRef.current) {
          clearTimeout(validationTimeoutRef.current);
          validationTimeoutRef.current = null;
        }

        setCharacter(selectedCharacter);
        setCurrentStrokeIndex(0);
        setIsDrawing(false);
        setIsValidating(false);
        setMessage("Draw the first stroke!");
        setIsCorrectStroke(null);
        handleClear();
      }
    },
    [handleClear]
  );

  const handleNextCharacter = useCallback(() => {
    if (!character) return;

    // Find current character index
    const currentIndex = hiraganaData.findIndex(
      (char) => char.kana === character.kana
    );

    // Move to next character, or loop back to first if at the end
    const nextIndex = (currentIndex + 1) % hiraganaData.length;
    const nextCharacter = hiraganaData[nextIndex];

    setCharacter(nextCharacter);
    setCurrentStrokeIndex(0);
    setIsDrawing(false);
    setIsValidating(false);
    setMessage("Draw the first stroke!");
    setIsCorrectStroke(null);
    handleClear();
  }, [character, handleClear]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner text-primary"></span> Loading
        Canvas...
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center text-error">
        Error: Character data not found.
      </div>
    );
  }

  const isLastStroke = currentStrokeIndex === character.strokes.length - 1;

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-lg mx-auto">
      {/* Character Selector */}
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Select Character</span>
        </label>
        <select
          className="select select-bordered"
          value={character.kana}
          onChange={(e) => handleCharacterSelect(e.target.value)}
        >
          {hiraganaData.map((char) => (
            <option key={char.kana} value={char.kana}>
              {char.kana} ({char.romaji})
            </option>
          ))}
        </select>
      </div>

      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-2">
          {character.kana}
        </h1>
        <div className="text-sm text-base-content/70">
          <span className="font-medium">
            Stroke {currentStrokeIndex + 1} of {character.strokes.length}
          </span>
          {character.strokes.length > 1 && (
            <div className="mt-1">
              <span className="text-xs">
                {currentStrokeIndex === 0 && "Draw the first stroke"}
                {currentStrokeIndex > 0 &&
                  currentStrokeIndex < character.strokes.length - 1 &&
                  "Continue with the next stroke"}
                {currentStrokeIndex === character.strokes.length - 1 &&
                  "Final stroke!"}
              </span>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div
          role="alert"
          className={`alert ${
            isCorrectStroke === true
              ? "alert-success"
              : isCorrectStroke === false
              ? "alert-error"
              : "alert-info"
          } shadow-md`}
        >
          <span>{message}</span>
        </div>
      )}

      <div
        className="relative border-2 border-gray-400 rounded-lg shadow-lg bg-white overflow-hidden"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          minWidth: CANVAS_WIDTH,
          minHeight: CANVAS_HEIGHT,
          touchAction: 'none', // Prevent touch gestures from interfering
          userSelect: 'none', // Prevent text selection
        }}
      >
        {/* Show all strokes as guides */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        >
          {character.strokes.map((stroke, index) => {
            let strokeColor = "#e5e7eb"; // Light gray for future strokes
            let strokeOpacity = "0.3";

            if (index < currentStrokeIndex) {
              // Completed strokes - green and more visible
              strokeColor = "#10b981";
              strokeOpacity = "0.6";
            } else if (index === currentStrokeIndex) {
              // Current stroke - blue and most visible
              strokeColor = isCorrectStroke === false ? "#ef4444" : "#3b82f6";
              strokeOpacity =
                isDrawing || isCorrectStroke === true ? "0.2" : "0.8";
            }

            return (
              <g key={index}>
                <path
                  d={stroke.path}
                  stroke={strokeColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={strokeOpacity}
                />
                {/* Show checkpoints for current stroke */}
                {index === currentStrokeIndex && !isDrawing && (
                  <>
                    {stroke.checkpoints.map((checkpoint, cpIndex) => (
                      <circle
                        key={cpIndex}
                        cx={checkpoint.x}
                        cy={checkpoint.y}
                        r={
                          cpIndex === 0
                            ? "8"
                            : cpIndex === stroke.checkpoints.length - 1
                            ? "8"
                            : "4"
                        }
                        fill={
                          cpIndex === 0
                            ? "#22c55e"
                            : cpIndex === stroke.checkpoints.length - 1
                            ? "#ef4444"
                            : "#3b82f6"
                        }
                        opacity="0.7"
                      />
                    ))}
                    {/* Start indicator */}
                    <text
                      x={stroke.checkpoints[0].x}
                      y={stroke.checkpoints[0].y - 15}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#22c55e"
                      fontWeight="bold"
                    >
                      START
                    </text>
                    {/* End indicator */}
                    <text
                      x={stroke.checkpoints[stroke.checkpoints.length - 1].x}
                      y={
                        stroke.checkpoints[stroke.checkpoints.length - 1].y + 25
                      }
                      textAnchor="middle"
                      fontSize="12"
                      fill="#ef4444"
                      fontWeight="bold"
                    >
                      END
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        <ReactSketchCanvas
          ref={canvasRef}
          width={String(CANVAS_WIDTH)}
          height={String(CANVAS_HEIGHT)}
          strokeWidth={6}
          strokeColor="#1e40af"
          canvasColor="transparent"
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          onStroke={handleStrokeStart}
          onChange={handleStrokeEnd}
          withTimestamp={false}
          exportWithBackgroundImage={false}
          allowOnlyPointerType="all"
          style={{ 
            width: "100%", 
            height: "100%",
            touchAction: 'none',
            pointerEvents: 'auto'
          }}
        />
      </div>
      <div className="flex gap-4 w-full justify-center">
        <button className="btn btn-warning" onClick={handleClear}>
          Clear
        </button>
        {isValidating && (
          <button 
            className="btn btn-error btn-sm"
            onClick={() => {
              setIsValidating(false);
              setIsDrawing(false);
              setMessage("Validation reset. Try drawing again.");
            }}
          >
            Reset Validation
          </button>
        )}
        {isCorrectStroke === true && !isLastStroke && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setCurrentStrokeIndex(currentStrokeIndex + 1);
              handleClear();
              setMessage("Draw the next stroke!");
            }}
          >
            Next Stroke
          </button>
        )}
        {isCorrectStroke === true && isLastStroke && (
          <button className="btn btn-success" onClick={handleNextCharacter}>
            Next Character
          </button>
        )}
      </div>
      {/* Progress indicator */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between text-sm mb-2">
          <span>Stroke Progress</span>
          <span>
            {currentStrokeIndex + 1} / {character.strokes.length}
          </span>
        </div>
        <progress
          className="progress progress-primary w-full mb-3"
          value={currentStrokeIndex + 1}
          max={character.strokes.length}
        ></progress>

        {/* Stroke legend */}
        <div className="flex flex-wrap gap-2 justify-center">
          {character.strokes.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                index < currentStrokeIndex
                  ? "bg-success text-success-content border-success"
                  : index === currentStrokeIndex
                  ? "bg-primary text-primary-content border-primary"
                  : "bg-base-300 text-base-content border-base-300"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
