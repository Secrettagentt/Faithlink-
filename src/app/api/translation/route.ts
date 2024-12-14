import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // console.log(await req.json());
  const { content, target_language, source_language, targetLanguage } =
    await req.json();
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  console.log(content, targetLanguage);
  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  //   const prompt = `Translate the following text to ${targetLanguage}: ${content}`;

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-fr`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          inputs: content,
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    const translatedText = data[0]?.translation_text;

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Error during translation:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
