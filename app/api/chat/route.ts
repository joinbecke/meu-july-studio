import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json(
        { error: "Mensagem vazia." },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    return Response.json({
      text: response.text,
    });

  } catch (error) {
    console.error(error);

    const err = error as Error;

    return Response.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}
