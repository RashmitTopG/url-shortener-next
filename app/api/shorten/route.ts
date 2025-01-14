import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const { url } = await request.json();

        // Basic URL validation
        if (!url || !url.startsWith("http")) {
            return NextResponse.json(
                { error: "Invalid URL. Ensure it starts with 'http' or 'https'." },
                { status: 400 }
            );
        }

        // Generate a unique short code
        const shortCode = nanoid(8);

        // Save the original URL and short code to the database
        const shortenedUrl = await prisma.url.create({
            data: {
                OrignalUrl: url,
                ShortCode: shortCode,
            },
        });

        console.log("Generated shortCode:", shortCode);

        // Return the created shortCode
        return NextResponse.json({
            shortcode: shortenedUrl.ShortCode,
        });
    } catch (error) {
        console.error("Error processing the POST request:", error);
        return NextResponse.json(
            { error: "Failed to process the request" },
            { status: 500 }
        );
    }
}
