import KanaCanvas from "@/components/KanaCanvas";

export default function HiraganaPage() {
  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-primary">Hiragana Practice</h1>
          <p className="text-base-content/70">
            Practice writing with stroke guidance.
          </p>
        </div>

        <KanaCanvas />
      </div>
    </main>
  );
}
