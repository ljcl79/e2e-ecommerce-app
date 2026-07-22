"use client";

import { FormEvent, useState } from "react";

export default function EmbedInfoPage() {
  const [message, setMessage] = useState(
    "Completa el formulario dentro del iframe.",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    setMessage(`Email recibido: ${email}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <h1 id="iframe-title" className="mb-3 text-xl font-bold">
        Contenido del iframe
      </h1>
      <p id="iframe-message" className="mb-4 text-sm text-slate-700">
        {message}
      </p>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-3">
        <label htmlFor="iframe-email-input" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="iframe-email-input"
          name="email"
          type="email"
          defaultValue=""
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <button
          id="iframe-submit-btn"
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
