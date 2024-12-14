import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();

  // OpenAI API key
  const apiKey = process.env.HUGGING_FACE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/unitary/toxic-bert",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text: text,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    // Check if the model returned any predictions
    if (!data || !data[0]) {
      return NextResponse.json(
        { error: "No response data from model." },
        { status: 500 }
      );
    }
    console.log({ data });

    const toxicProbability = data[0]?.label === "Toxic" ? data[0]?.score : 0;
    console.log(toxicProbability);
    if (toxicProbability > 0.5) {
      console.log("The text contains vulgar or toxic content.");
    } else {
      console.log("The text is clean.");
    }

    return NextResponse.json({ toxicProbability });
  } catch (error) {
    console.error("Error checking text:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
