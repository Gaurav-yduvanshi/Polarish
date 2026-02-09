"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Demo() {
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
        return (
            <div>
                <Button disabled={loading} onClick={handleBlocking}>
                    {loading ? "Generating..." : "Generate Text"}
                </Button>
                <Button disabled={loading2} onClick={handleBackground}>
                    {loading2 ? "Sending Event..." : "Send Background Event"}
                </Button>
            </div>
        )
    };