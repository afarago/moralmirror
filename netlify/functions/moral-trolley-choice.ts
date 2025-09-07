import { Handler } from "@netlify/functions";
import OpenAI from "openai";
import { sendAnalyticsEvent } from "./google-analytics-helper";
import { AIChoiceResult } from "../../src/types";

const apiKey = process.env.GROQ_API_KEY;
const openai = new OpenAI({
  apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are an assistant that answers moral dilemmas using a person's moral credo.
You are given a trolley problem with two tracks, each with a person (with name and description), and a moral credo.
Yoo will answer which track the person would choose the trolley to hit (A or B) and the reason for the choice.
Base your reasoning strictly on the provided credo and the descriptions.

Double check that you return the right person who should survive.

Return your answer as a plain text in four lines without any additional text or explanation.

first line: name of the person who survives
second line: reason considered when saving ot letting die for person-1/track-1
third line: reason considered when saving ot letting die for person-2/track-2
fourth line: a slightly modify original moral credo that would lead to the opposite choice. Keep a similar length.
`;

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

    const { credo, tracks } = input;
    if (!credo || !tracks || tracks.length !== 2) {
      return {
        statusCode: 400,
        body: "Missing credo, trackA, or trackB in request body",
      };
    }

    const userPrompt = `
Consider the trolley problem with two identical tracks with no default track.
Given a person with a moral credo, which track would this person choose to survive and why? The person must choose a track.
Credo: "${credo}"

These characters are on the tracks.

person-1: ${tracks[0].name} lies on track-1
person-description-1: "${tracks[0].description}"

person-2: ${tracks[1].name} lies on track-2
person-description-2: "${tracks[1].description}"
`;

    // console.log("User prompt:", userPrompt);

    // Return your answer as a JSON object with the following fields:
    // {
    //   "track_id": "A" or "B",
    //   "name": "<name of the person saved>",
    //   "reason": "<your reasoning>"
    // }

    const response = await openai.chat.completions.create({
      //   model: "llama-3.1-8b-instant", // Meta
      //   model: "gemma2-9b-it", // Google
      model: "llama-3.3-70b-versatile", // Meta
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      //   response_format: {
      //     type: "json_schema",
      //     json_schema: {
      //       name: "TrolleyChoiceResponse",
      //       schema: {
      //         type: "object",
      //         properties: {
      //           track_id: { type: "string", enum: ["A", "B"] },
      //           name: { type: "string" },
      //           reason: { type: "string" },
      //         },
      //         required: ["track_id", "name", "reason"],
      //       },
      //     },
      //   },
    });

    // console.log("Model response:", response);

    // Try to parse the response as JSON
    let result = {};
    try {
      const content = response.choices?.[0]?.message?.content || "";
      // console.log("Model response content:", content);

      const lines = content.split("\n").map((line) => line.trim());
      result = {
        survivor: lines[0],
        reasons: [lines[1], lines[2]],
        revised_credo: lines[3],
        model: response.model,
      } satisfies AIChoiceResult;
    } catch {
      // fallback: return raw text if parsing fails
      result = {
        error: "Failed to parse model response",
        raw: response.choices?.[0]?.message?.content || "",
      };
    }

    // track GA
    await sendAnalyticsEvent("aidecision", 200); // Track successful call

    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };
  } catch (error: unknown) {
    await sendAnalyticsEvent("convert", 500); // Track error
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
