import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Aceita tanto GEMINI_API_KEY quanto GOOGLE_API_KEY
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("Erro: Nenhuma chave de API foi encontrada nas variáveis de ambiente.");
      return new Response(JSON.stringify({ error: "Chave da API não configurada no servidor" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!message) {
      return new Response(JSON.stringify({ error: "Mensagem vazia" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Envia o conteúdo no formato esperado pela biblioteca
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
} catch (error: any) {
  console.error("Erro completo:", error);

  return new Response(
    JSON.stringify({
      error: error?.message,
      stack: error?.stack,
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
