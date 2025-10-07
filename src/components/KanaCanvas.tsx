// src/components/KanaCanvas.tsx
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { HiraganaCharacter, Checkpoint } from "@/app/data/hiragana";
import hiraganaData from "@/app/data/hiragana";
import OverlayArrowButton from "./OverlayArrowButton";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

// Types for drawn points from react-sketch-canvas
interface Point {
  x: number;
  y: number;
}

export default function KanaCanvas() {
  const [character, setCharacter] = useState<HiraganaCharacter | null>(null);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isCorrectStroke, setIsCorrectStroke] = useState<boolean | null>(null);
  const [completedStrokes, setCompletedStrokes] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState("");

  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const strokeEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasValidatedCurrentStroke = useRef(false);

  // Load character data
  useEffect(() => {
    const loadCharacter = () => {
      setIsLoading(true);
      try {
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

    return () => {
      if (strokeEndTimeoutRef.current) {
        clearTimeout(strokeEndTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to validate drawn stroke against expected checkpoints
  const validateStrokeAgainstCheckpoints = useCallback(
    (drawnPoints: Point[], expectedCheckpoints: Checkpoint[]) => {
      if (
        !drawnPoints ||
        drawnPoints.length === 0 ||
        !expectedCheckpoints ||
        expectedCheckpoints.length === 0
      ) {
        return false;
      }

      // Convert drawn points to x,y coordinates
      const userPath = drawnPoints.map((point: Point) => ({
        x: point.x,
        y: point.y,
      }));

      // Helper function to calculate distance between two points
      const distance = (
        p1: { x: number; y: number },
        p2: { x: number; y: number }
      ) => {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      };

      // Check if user's stroke passes near enough to each checkpoint
      const tolerance = 7; // pixels - how close the user needs to be to checkpoints
      let passedCheckpoints = 0;

      for (const checkpoint of expectedCheckpoints) {
        // Find the closest point in user's stroke to this checkpoint
        let minDistance = Infinity;
        for (const userPoint of userPath) {
          const dist = distance(userPoint, checkpoint);
          if (dist < minDistance) {
            minDistance = dist;
          }
        }

        // If user passed close enough to this checkpoint, count it
        if (minDistance <= tolerance) {
          passedCheckpoints++;
        }
      }

      // User needs to pass at least 60% of checkpoints for the stroke to be valid
      const requiredCheckpoints = Math.ceil(expectedCheckpoints.length * 0.6);
      return passedCheckpoints >= requiredCheckpoints;
    },
    []
  );

  // Simple stroke validation
  const validateStroke = useCallback(async () => {
    if (!character || !canvasRef.current) return;

    try {
      const paths = await canvasRef.current.exportPaths();

      if (!paths || paths.length === 0) {
        setMessage("No stroke detected. Try drawing something.");
        setIsCorrectStroke(false);
        return;
      }

      const lastPath = paths[paths.length - 1];
      const points = lastPath?.paths || [];

      if (points.length < 5) {
        setMessage("Stroke too short. Draw a longer line.");
        setIsCorrectStroke(false);
        // Reset validation states to enable drawing again
        setIsValidating(false);
        hasValidatedCurrentStroke.current = false;
        setTimeout(() => canvasRef.current?.clearCanvas(), 500);
        return;
      }

      // Real stroke validation against checkpoints
      const currentStroke = character.strokes[currentStrokeIndex];
      const isValidStroke = validateStrokeAgainstCheckpoints(
        points,
        currentStroke.checkpoints
      );

      if (!isValidStroke) {
        setMessage(
          "Stroke doesn't match the guide. Try to follow the gray line more closely."
        );
        setIsCorrectStroke(false);
        // Reset validation states to enable drawing again
        setIsValidating(false);
        hasValidatedCurrentStroke.current = false;
        setTimeout(() => canvasRef.current?.clearCanvas(), 1000);
        return;
      }

      // Stroke is valid
      const isCompleted = currentStrokeIndex === character.strokes.length - 1;

      // Mark this stroke as completed
      setCompletedStrokes(prev => new Set([...prev, currentStrokeIndex]));

      // Clear the drawn line immediately
      canvasRef.current?.clearCanvas();
      setIsValidating(false); // Stop showing light blue guide

      // Then show the dark green guide after a brief moment
      setTimeout(() => {
        setIsCorrectStroke(true);
      }, 100);

      if (isCompleted) {
        // Character completed - show completion message
        setMessage(`🎉 Character completed! Great job!`);
      } else {
        // Move to next stroke automatically without success message
        // Auto-advance to next stroke after clearing
        setTimeout(() => {
          // Ensure canvas is completely clear for next stroke
          canvasRef.current?.clearCanvas();
          setCurrentStrokeIndex(currentStrokeIndex + 1);
          hasValidatedCurrentStroke.current = false;
          setIsDrawing(false);
          setIsValidating(false);
          setMessage("Draw the next stroke!");
          setIsCorrectStroke(null);
        }, 100);
      }
    } catch (error) {
      console.error("Validation error:", error);
      setMessage("Error validating stroke. Try again.");
      setIsCorrectStroke(false);
      // Reset validation states to enable drawing again
      setIsValidating(false);
      hasValidatedCurrentStroke.current = false;
    }
  }, [character, currentStrokeIndex, validateStrokeAgainstCheckpoints]);

  // Handle when user starts drawing
  const handleDrawStart = useCallback(() => {
    if (strokeEndTimeoutRef.current) {
      clearTimeout(strokeEndTimeoutRef.current);
      strokeEndTimeoutRef.current = null;
    }

    hasValidatedCurrentStroke.current = false;
    setIsDrawing(true);
    setMessage("Drawing...");
    setIsCorrectStroke(null);
  }, []);

  // Handle when user stops drawing
  const handleDrawEnd = useCallback(() => {
    if (!isDrawing || hasValidatedCurrentStroke.current) {
      return;
    }

    setIsValidating(true); // Set validation state FIRST to keep guide light
    setIsDrawing(false); // Then set drawing to false
    // Keep the "Drawing..." message until validation completes

    // Clear any existing timeout
    if (strokeEndTimeoutRef.current) {
      clearTimeout(strokeEndTimeoutRef.current);
    }

    // Wait a bit then validate (reduced time for faster feedback)
    strokeEndTimeoutRef.current = setTimeout(() => {
      if (!hasValidatedCurrentStroke.current) {
        hasValidatedCurrentStroke.current = true;
        validateStroke();
      }
    }, 150);
  }, [isDrawing, validateStroke]);

  // Clear canvas
  const handleClear = useCallback(() => {
    if (strokeEndTimeoutRef.current) {
      clearTimeout(strokeEndTimeoutRef.current);
      strokeEndTimeoutRef.current = null;
    }

    hasValidatedCurrentStroke.current = false;
    canvasRef.current?.clearCanvas();
    setIsDrawing(false);
    setIsValidating(false);
    setCompletedStrokes(new Set()); // Reset completed strokes
    setMessage("Draw the first stroke!");
    setIsCorrectStroke(null);
  }, []);

  // Next character
  const handleNextCharacter = useCallback(() => {
    if (!character) return;

    const currentIndex = hiraganaData.findIndex(
      (char) => char.kana === character.kana
    );
    const nextIndex = (currentIndex + 1) % hiraganaData.length;
    const nextCharacter = hiraganaData[nextIndex];

    setCharacter(nextCharacter);
    setCurrentStrokeIndex(0);
    handleClear();
    setMessage("Draw the first stroke!");
  }, [character, handleClear]);

  // Character selector
  const handleCharacterSelect = useCallback(
    (selectedKana: string) => {
      const selectedCharacter = hiraganaData.find(
        (char) => char.kana === selectedKana
      );
      if (selectedCharacter) {
        setCharacter(selectedCharacter);
        setCurrentStrokeIndex(0);
        handleClear();
        setMessage("Draw the first stroke!");
      }
    },
    [handleClear]
  );

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

      {/* Character Display */}
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-2">
          {character.kana}
        </h1>
        <div className="text-sm text-base-content/70">
          <span className="font-medium">
            Stroke {currentStrokeIndex + 1} of {character.strokes.length}
          </span>
        </div>
      </div>

      {/* Message - Fixed height container to prevent layout shifts */}
      <div className="h-16 flex items-center justify-center">
        {message && (
          <div
            role="alert"
            className={`alert ${
              isCorrectStroke === true
                ? "alert-success"
                : isCorrectStroke === false
                ? "alert-error"
                : "alert-info"
            } shadow-md transition-all duration-200`}
          >
            <span>{message}</span>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div
        className="relative border-2 border-gray-400 rounded-lg shadow-lg bg-white"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        {/* Stroke guides */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        >
          {character.strokes.map((stroke, index) => {
            let strokeColor = "#e5e7eb"; // Future strokes
            let strokeOpacity = "0.3";

            // Explicitly completed strokes are always green
            if (completedStrokes.has(index)) {
              strokeColor = "#10b981"; // Completed strokes
              strokeOpacity = "0.8"; // Dark green for completed strokes
            } else if (index === currentStrokeIndex) {
              // Check if current stroke is completed
              if (isCorrectStroke === true) {
                strokeColor = "#10b981"; // Completed stroke (green)
                strokeOpacity = "0.9"; // Very dark green for just completed stroke
              } else if (
                isDrawing ||
                isValidating ||
                hasValidatedCurrentStroke.current
              ) {
                // Light blue guide while user is drawing, validating, or has just finished
                strokeColor = "#3b82f6"; // Current active stroke (blue)
                strokeOpacity = "0.1"; // Very light while drawing/validating
              } else {
                strokeColor = "#3b82f6"; // Current active stroke (blue)
                strokeOpacity = "0.8"; // Visible when not drawing
              }
            }

            return (
              <path
                key={index}
                d={stroke.path}
                stroke={strokeColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={strokeOpacity}
              />
            );
          })}

          {/* Success tick mark when all strokes completed */}
          {isCorrectStroke === true && isLastStroke && (
            <g>
              <circle
                cx={CANVAS_WIDTH - 50}
                cy="50"
                r="25"
                fill="#10b981"
                opacity="0.9"
              />
              <path
                d="M 340 50 L 348 58 L 365 42"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          )}
        </svg>

        {/* Drawing canvas */}
        <div
          onMouseUp={handleDrawEnd}
          onTouchEnd={handleDrawEnd}
          className="absolute top-0 left-0 w-full h-full"
        >
          <ReactSketchCanvas
            ref={canvasRef}
            width={String(CANVAS_WIDTH)}
            height={String(CANVAS_HEIGHT)}
            strokeWidth={6}
            strokeColor="#3b82f6"
            canvasColor="transparent"
            className="w-full h-full rounded-lg"
            onStroke={handleDrawStart}
            withTimestamp={false}
            style={{ width: "100%", height: "100%" }}
          />

          {/* Disable overlay during validation */}
          {(isValidating || isCorrectStroke === true) && (
            <div className="absolute top-0 left-0 w-full h-full bg-transparent cursor-not-allowed z-10" />
          )}
        </div>

        {/* Mobile Next Character Arrow Overlay */}
        <OverlayArrowButton
          onClick={handleNextCharacter}
          position="middle-right"
          size="md"
          ariaLabel="Next Character"
          show={isCorrectStroke === true && isLastStroke}
          hideOnDesktop={true}
        />
      </div>

      {/* Controls - Next Character for Desktop */}
      <div className="hidden md:flex gap-4 w-full justify-center">
        {isCorrectStroke === true && isLastStroke && (
          <button className="btn btn-success" onClick={handleNextCharacter}>
            Next Character
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>
            {currentStrokeIndex + 1} / {character.strokes.length}
          </span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={currentStrokeIndex + 1}
          max={character.strokes.length}
        ></progress>
      </div>
    </div>
  );
}
