import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function moderateContent(content: string): Promise<boolean> {
  try {
    const response = await openai.moderations.create({
      input: content,
    })

    return !response.results[0].flagged
  } catch (error) {
    console.error("AI moderation error:", error)
    return true // Default to allowing content if moderation fails
  }
}