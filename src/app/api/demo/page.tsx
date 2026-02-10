"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { useAuth } from "@clerk/nextjs";


export default function Demo() {
    const {userId} = useAuth();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const handleBlocking = async () => {
        setLoading(true);
        const response = await fetch("/api/demo/blocking", {
            method: "POST",
        });
        setLoading(false);
        const data = await response.json();
        console.log(data);
    }

    const handleBackground = async () => {
        setLoading2(true);
        const response = await fetch("/api/demo/background", {
            method: "POST",
        });
        setLoading2(false);
        const data = await response.json();
        console.log(data);
        
    }

    const handleClientError = ()=> {
        Sentry.logger.info("user attempting to click handleClientError", {userId});
        throw new Error("Client Error: Something went wrong in the browswer.");
    }

    const handleApiError = async()=>{
        await fetch("/api/demo/error", {
            method: "POST",
        });
    }

    const handleInngestError = async()=>{
        await fetch("/api/demo/inngest-error", {
            method: "POST",
        });
    }

        return (
            <div>
                <Button disabled={loading} onClick={handleBlocking}>
                    {loading ? "Generating..." : "Generate Text"}
                </Button>
                <Button disabled={loading2} onClick={handleBackground}>
                    {loading2 ? "Sending Event..." : "Send Background Event"}
                </Button>
                <Button variant = {'destructive'} onClick={handleClientError}>
                    Throw Client Error
                </Button>
                <Button variant = {'destructive'} onClick={handleApiError}>
                    Throw API Error
                </Button>
                <Button variant = {'destructive'} onClick={handleInngestError}>
                    Throw Inngest Error
                </Button>
            </div>
        )
    };