import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function RedirectPage({ params }: { params: { shortcode: string } }) {
  const { shortcode } = await params;
  let newUrl: string | undefined; // Declare newUrl outside try-catch

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
