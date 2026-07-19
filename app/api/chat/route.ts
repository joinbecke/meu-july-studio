import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Chave da API não configurada" }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Usando a sintaxe correta para o modelo
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const text = result.response.text();

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Erro no Gemini:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
