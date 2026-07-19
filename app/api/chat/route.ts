export async function POST(req: Request) {
  const { message } = await req.json();

  // ====================================================================
  // 1. CONEXÃO COM A INTERNET (RAG - Retrieval-Augmented Generation)
  // ====================================================================
  const informacaoDaInternet = "O presidente dos Estados Unidos hoje, em 2026, é..."; 

  // Criamos um super-prompt que junta a internet com a pergunta do usuário
  const promptEnriquecido = `Você é o assistente do July AI Studio. Responda à pergunta do usuário usando as informações atualizadas abaixo. Se a informação abaixo não ajudar, use seu conhecimento geral.
  
  Informação atualizada da internet:
  ${informacaoDaInternet}
  
  Pergunta do usuário:
  ${message}`;

  // ====================================================================
  // 2. CHAMADA AO OLLAMA COM STREAMING ATIVADO
  // ====================================================================
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: promptEnriquecido,
      stream: true, 
    }),
  });

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}