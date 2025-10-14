import KanaCanvas from "@/components/KanaCanvas";

export default function HiraganaPage() {
  return (
    <main className="min-h-screen bg-base-100 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Hiragana Practice</h1>
          <p className="text-xl text-base-content/70">Practice writing with stroke guidance.</p>
        </div>

        <KanaCanvas />
      </div>
    </main>
  );
}
