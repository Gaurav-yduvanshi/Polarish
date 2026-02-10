import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { anotherFunction, helloWorld, demoGenerate } from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    anotherFunction,
    demoGenerate,

    /* your functions will be passed here later! */
  ],
});