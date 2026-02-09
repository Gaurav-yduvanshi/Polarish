

import { inngest } from "@/inngest/client";
export async function POST() {
    await inngest.send({
        name: "test/another.function",
        data:{}
    })
    return Response.json({ message: "Event sent" });
}