"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function sendMessage() {
    if (!message.trim()) return;

    setLoading(true);
    setReply(""); 

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (data.text) {
        setReply(data.text);
      } else {
        setReply("Erro ao gerar resposta da IA.");
      }
    } catch (e) {
      console.error("Erro na comunicação:", e);
      setReply("Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-white/10 bg-zinc-950 p-6">
          <h1 className="text-2xl font-bold text-purple-400">July AI Studio</h1>
          <nav className="mt-10 space-y-3">
            <button className="w-full rounded-xl bg-purple-600 px-4 py-3 text-left font-semibold">🤖 Chat IA</button>
            <button className="w-full rounded-xl bg-white/5 px-4 py-3 text-left">🎥 Criar Vídeos</button>
            <button className="w-full rounded-xl bg-white/5 px-4 py-3 text-left">🖼️ Gerar Imagens</button>
            <button className="w-full rounded-xl bg-white/5 px-4 py-3 text-left">🎙️ Voz IA</button>
            <button className="w-full rounded-xl bg-white/5 px-4 py-3 text-left">🌐 Internet</button>
          </nav>
        </aside>

        <section className="flex flex-1 flex-col items-center justify-center p-10">
          <h2 className="text-5xl font-bold">Olá 👋</h2>
          <p className="mt-4 text-xl text-zinc-400">Como posso ajudar você hoje?</p>

          <div className="mt-10 w-full max-w-3xl rounded-2xl border border-purple-500/50 bg-zinc-900 p-5">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-32 w-full resize-none bg-transparent text-lg outline-none"
              placeholder="Digite aqui o que deseja criar..."
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={sendMessage}
                disabled={loading}
                className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-500 disabled:opacity-50"
              >
                {loading ? "Pensando..." : "Enviar"}
              </button>
            </div>
          </div>

          {reply && (
            <div className="mt-8 w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <h3 className="mb-3 font-bold text-purple-400">Resposta da IA</h3>
              <p className="whitespace-pre-wrap text-zinc-200">{reply}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
