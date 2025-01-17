// components/ShortenUrlForm.tsx
"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { FormEvent, useState } from "react";

interface ShortenFormProps {
  handleUrl: () => void;
}

export default function ShortenUrlForm({ handleUrl }: ShortenFormProps) {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // New state for error message
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null); // To display the shortened URL

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setError(null); // Reset error message on new submission

    if (!url || !url.startsWith("http")) {
      setError("Please enter a valid URL that starts with 'http' or 'https'.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to shorten URL");
        return;
      }

      const data = await response.json();
      setShortenedUrl(data.shortCode); // Store the shortened URL
      setUrl(""); // Reset the input field
      handleUrl(); // Call the parent handler
    } catch (error) {
      console.error("Error shortening URL:", error);
      setError("An error occurred while shortening the URL.");
    } finally {
      setLoading(false);
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
          aria-invalid={error ? "true" : "false"} // Accessibility: Indicate an error if there is one
          aria-describedby="url-error" // Link error message to the input field
        />
        {error && (
          <div id="url-error" className="text-red-500 text-sm">
            {error} {/* Display error message */}
          </div>
        )}
        <Button
          className="w-full p-2"
          type="submit"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </Button>

        {shortenedUrl && (
          <div className="mt-4">
            <p>
              Shortened URL:{" "}
              <a
                href={`/${shortenedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenedUrl}
              </a>
            </p>{" "}
            {/* Display the shortened URL */}
          </div>
        )}
      </div>
    </form>
  );
}
