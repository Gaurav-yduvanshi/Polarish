import { step } from "inngest";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import Firecrawl from '@mendable/firecrawl-js';
import { format } from "path";
const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

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
  async ({ step }) => {
    return await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "what is the capital of france?",
    });
  }
);


export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },

  // we have 3 inngest steps
  // 1. extract urls
  // 2. scrape urls
  // 3. generate text

  async ({ step, event }) => {
    // step 1 extract urls from the prompt
    const { prompt } = event.data as { prompt: string };
    const urls = await step.run("extract-urls", async () => {
      return prompt.match(URL_REGEX) ?? [];
    })as string[];

    // step 2 scrape urls
    const scrapedContent = await step.run("scraped-urls", async () => {
      const results = await Promise.all(
        urls.map(async (url) => {
          const result = await firecrawl.scrape(url, { formats: ['markdown'] });
          return result.markdown;
        })
      )
      // results.filter(Boolean)  truthy values like  "hello", "some markdown" etc
      // falsy values null, undefined, false, 0, "", etc
      // so it removes falsy values, .join("\n\n") joins all the truthy values with "\n\n"

      return results.filter(Boolean).join("\n\n");
    })
    
    // combine the scraped content with the prompt
    const finalPrompt = scrapedContent  ? `Context: \n ${scrapedContent} \n\n Question: ${prompt}` : prompt;

    // step 3 generate text
    const  repsonse = await step.run('generate-text', async () => {
      return await generateText({
        model: google("gemini-2.5-flash"),
        prompt: finalPrompt,
      })
    })
    return { response: repsonse };
  }

)
