"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { FormEvent, useState } from "react";

export default function ShortenUrlForm() {
    const [url, setUrl] = useState<string>("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        try {
            console.log(url);

            const response = await fetch("/api/shorten", {
                method: "POST", // Correct syntax for specifying HTTP method
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }), // Pass the URL in the request body
            });

            if (!response.ok) {
                throw new Error("Failed to shorten URL");
            }

            const data = await response.json(); // Parse the JSON response
            console.log(data);

            setUrl("");
        } catch (error) {
            console.error("Error shortening URL", error);
        } finally {
            console.log(url);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="space-y-4">
                <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-12"
                    type="url"
                    placeholder="Enter URL to shorten"
                    required
                />
                <Button children={"Shorten URL"} className="w-full p-2" type="submit" />
            </div>
        </form>
    );
}
    