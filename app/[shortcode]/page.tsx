import prisma from "@/lib/db";
import { redirect } from "next/navigation";

// Define the type for params as a Promise
interface RedirectPageProps {
  params: Promise<{ shortcode: string }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  // Await params as it's a promise
  const { shortcode } = await params; // Destructure after awaiting the promise
  let newUrl: string | undefined;

  try {
    // Log shortcode for debugging
    console.log("ShortCode:", shortcode);

    // Fetch the URL from the database
    const url = await prisma.url.findUnique({
      where: { ShortCode: shortcode },
    });

    // Log URL details for debugging
    console.log("Fetched URL:", url);

    if (!url) {
      // Render a 404 page if the shortcode does not exist
      return <h1>404 - URL Not Found</h1>;
    }

    // Increment the visit count
    await prisma.url.update({
      where: { id: url.id },
      data: { visits: { increment: 1 } },
    });

    newUrl = url.OrignalUrl; // Set newUrl only if no errors occurred
  } catch (error) {
    console.error("Error during redirect:", error);
    return <h1>Something went wrong</h1>;
  }

  // Only perform the redirect if newUrl is set
  if (newUrl) {
    console.log("Redirecting to:", newUrl);
    return redirect(newUrl); // Redirect after try-catch block
  }

  // Default return in case newUrl wasn't set
  return <h1>Something went wrong</h1>;
}
