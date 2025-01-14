"use client";

import { CheckIcon, CopyIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

type Url = {
  id: string;
  OrignalUrl: string;
  ShortCode: string;
  visits: number;
};

export default function UrlListComponent() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null); // Updated to track the copied URL specifically
  const [loading, setLoading] = useState<boolean>(false);

  // Function to create a shortened URL
  const shortenedUrl = (code: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000"; // Added fallback for safety
    return `${baseUrl}/${code}`;
  };

  // Fetch URLs from API
  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/urls/");
      if (!response.ok) throw new Error("Failed to fetch URLs");
      const data = await response.json();
      console.log("URL Data:", data);
      setUrls(data);
    } catch (error) {
      console.error("Error fetching URLs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch URLs on component mount
  useEffect(() => {
    fetchUrls();
  }, []);

  // Handle copying the URL
  const handleCopyUrl = (code: string) => {
    const fullUrl = shortenedUrl(code);
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedUrl(code); // Track which URL was copied
      setTimeout(() => {
        setCopiedUrl(null); // Reset copied state after 1 second
      }, 1000);
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Recent URLs</h2>
      
      {/* Render skeletons if loading */}
      {loading ? (
        <ul className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="flex items-center gap-2 justify-between border p-2 rounded">
              <Skeleton className="w-[200px] h-[20px] rounded-full" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-[40px] h-[20px] rounded-full" />
                <Skeleton className="w-[50px] h-[20px] rounded-full" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-2">
          {urls.map((url) => (
            <li
              key={url.id}
              className="flex items-center gap-2 justify-between border p-2 rounded"
            >
              {/* Display the shortened URL */}
              <Link
                href={`/${url.ShortCode}`}
                className="text-blue-500 hover:underline"
                target="_blank"
              >
                {shortenedUrl(url.ShortCode)}
              </Link>
              <div className="flex items-center gap-4">
                {/* Copy Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-muted"
                  onClick={() => handleCopyUrl(url.ShortCode)}
                >
                  {copiedUrl === url.ShortCode ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                  <span className="sr-only">
                    {copiedUrl === url.ShortCode
                      ? "Copied to clipboard"
                      : "Copy this URL"}
                  </span>
                </Button>
                {/* Display visit count */}
                <span className="flex items-center gap-2">
                  <EyeIcon className="h-4 w-4" />
                  {url.visits}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
