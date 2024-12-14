import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();

  // OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  const prompt = `Check the following text for any inappropriate or vulgar words. If any are found, return 'true'. Otherwise, return 'false'.\nText: ${text}`;

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        prompt: prompt,
        max_tokens: 10,
        temperature: 0, // Low temperature for factual responses
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    // Assuming a response like 'true' or 'false' from the model
    const containsVulgarWords =
      data.choices[0].text.trim().toLowerCase() === "true";

    return NextResponse.json({ containsVulgarWords });
  } catch (error) {
    console.error("Error checking text:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
