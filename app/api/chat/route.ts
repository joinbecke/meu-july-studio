import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("Nenhuma chave de API encontrada.");
      return new Response(
        JSON.stringify({ error: "Chave da API não configurada no servidor" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Mensagem vazia" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
  console.error("Erro ao chamar a API do Gemini:", error);

  const err = error as Error;

  return new Response(
    JSON.stringify({
      error: err.message,
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
