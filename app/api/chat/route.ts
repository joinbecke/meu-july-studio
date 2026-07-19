import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { message } = await req.json();

  const promptEnriquecido = `Você é o assistente do July AI Studio. Responda à pergunta do usuário: ${message}`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(promptEnriquecido);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return new Response(JSON.stringify({ error: "Erro ao gerar resposta" }), {
      status: 500,
    });
  }
}
