// src/app/page.tsx
import KanaCanvas from "@/components/KanaCanvas_OLD";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-base-200">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">
            Practice Hiragana: Shohoj Nihongo
          </h2>
          <KanaCanvas />
        </div>
      </div>
    </main>
  );
}
