// Test page for KanaCanvas component
import KanaCanvas from "@/components/KanaCanvas_OLD";

export default function TestKanaCanvas() {
  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Hiragana Practice
          </h1>
          <p className="text-base-content/70">
            Practice writing hiragana characters with stroke-by-stroke guidance
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <KanaCanvas />
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="alert alert-info">
            <div>
              <h3 className="font-bold">How to use:</h3>
              <p>1. Select a character from the dropdown</p>
              <p>2. Follow the gray guide to draw each stroke</p>
              <p>3. Start and end your strokes at the correct points</p>
              <p>4. Complete all strokes to move to the next character</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
