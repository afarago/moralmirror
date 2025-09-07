import { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { sendAnalyticsEvent } from "./google-analytics-helper";

const apiKey = process.env.GROQ_API_KEY;
const openai = new OpenAI({
  apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT =
  "You are a helpful assistant that expands a character description from a short version into a detailed backstory, including a full name. Make the character morally interesting. Use markdown formatting for emphasis and structure. Start with a 6 sentence summary then a detailed and sectioned part.";
const MODEL = "llama-3.3-70b-versatile";

const handler: Handler = async (event) => {
  try {
    if (!openai) {
      return {
        statusCode: 500,
        body: "OpenAI client is not configured.",
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: "No input provided in request body",
      };
    }

    let input;
    try {
      input = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        body: "Request body must be valid JSON",
      };
    }

    const { name, description } = input;
    if (!name || !description) {
      return {
        statusCode: 400,
        body: "Missing 'name' or 'description' in request body",
      };
    }

    const userPrompt = `Name: ${name}. ${description}`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices?.[0]?.message?.content || "";

    await sendAnalyticsEvent("backstory", 200);

    return {
      statusCode: 200,
      body: JSON.stringify({ backstory: content, model: response.model }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };
  } catch (error: unknown) {
    await sendAnalyticsEvent("backstory", 500);
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export { handler };
