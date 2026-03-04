// src/app/page.tsx
import KanaCanvas from "@/components/KanaCanvas";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-100 p-4 mx-auto">
      <KanaCanvas />
    </main>
  );
}
