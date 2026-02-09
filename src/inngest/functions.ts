import { step } from "inngest";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const anotherFunction = inngest.createFunction(
    { id: "another-function" },
    { event: "test/another.function" },
    async({step}) => {
        return await generateText({
    model: google("gemini-2.5-flash"),
    prompt: "what is the capital of france?",
        });
    }
);