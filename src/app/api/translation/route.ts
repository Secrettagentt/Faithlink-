import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content, targetLanguage } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  //   const prompt = `Translate the following text to ${targetLanguage}: ${content}`;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-${source_language}-${target_language}",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          q: content,
          source: "en",
          target: targetLanguage,
          format: "text",
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ translatedText: data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error during translation:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
