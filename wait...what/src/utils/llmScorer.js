export async function scoreArticleWithLLM(article) {
    const prompt = `
  You're a news analyst, Who wants to create a concise highlight reel of the complete lifecycle of this news story. Rate how historically or contextually significant this article is based on if it should be a part of that
  extremely concise highlight reel (1 = minor update, 100 = major turning point). Respond only with a number.
  
  Title: "${article.title}"
  Snippet: "${article.description}"
    `.trim();
  
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-saba-24b",
        messages: [
          { role: "system", content: "You are a timeline editor for a news app." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });
  
    const data = await res.json();
    const response = data?.choices?.[0]?.message?.content ?? "1";
  
    const match = response.match(/\d/);
    return match ? parseInt(match[0], 10) : 1;
  }