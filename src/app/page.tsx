// src/app/page.tsx
import KanaCanvas from "@/components/KanaCanvas";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-100 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Shohoj Nihongo
          </h1>
          <p className="text-xl text-base-content/70">
            Learn Hiragana with Interactive Drawing
          </p>
        </div>

        <KanaCanvas />
      </div>
    </main>
  );
}