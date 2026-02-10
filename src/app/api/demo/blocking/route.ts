import { generateText } from "ai";
import { google} from "@ai-sdk/google";


// export async function GET() {
//   return Response.json({ message: "Use POST to generate text" });
// }

export async function POST() {
  const response = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: "what is the capital of france?",
    experimental_telemetry: {
    isEnabled: true,
    recordInputs: true,
    recordOutputs: true,
  },

  });

  return Response.json({ response: response.text });
}
