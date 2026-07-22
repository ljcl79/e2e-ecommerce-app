export default function IframePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">
        Práctica de iframe
      </h1>
      <p className="mb-4 text-slate-600">
        Usa Playwright <code>frameLocator</code> para interactuar con el contenido
        embebido.
      </p>
      <iframe
        id="practice-iframe"
        title="Practice iframe"
        src="/embed/info"
        className="h-[420px] w-full rounded border border-slate-300 bg-white"
      />
    </main>
  );
}
