import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY!; // Ensure API key is set

const together = new Together({
  apiKey: TOGETHER_API_KEY,
});

// Define types for expected GitHub user data
interface GitHubUserData {
  username: string;
  accountAge: number;
  totalRepos: number;
  totalStars: number;
  totalIssuesCreated: number;
  totalPRsCreated: number;
  firstPR: { html_url: string };
}

// Function to fetch GitHub user data from `/api/data`
async function fetchUserData(): Promise<GitHubUserData> {
  const response = await fetch("/api/data", { method: "GET" }); // Using relative path
  if (!response.ok) throw new Error("Failed to fetch user data");
  return response.json();
}

export async function POST(req: NextRequest) {
  try {
    let { userData }: { userData?: GitHubUserData } = await req.json();

    // Fetch user data if missing
    if (!userData) {
      console.log("Fetching data from /data...");
      userData = await fetchUserData();
    }

    console.log("User Data Received:", userData);

    return summarizeUser(userData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { 
        error: "Server Error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}
// 📝 AI Summary for a GitHub user
async function summarizeUser(userData: GitHubUserData) {
    const prompt = `
    Analyze this GitHub user with a slightly roasting tone:
    - Username: ${userData.username || "Unknown"}
    - Account Age: ${userData.accountAge ? `${userData.accountAge} years` : "Less than a year"}
    - Total Repositories: ${userData.totalRepos ?? "No repositories"}
    - Total Stars: ${userData.totalStars ?? "No stars"}
    - Total Issues Created: ${userData.totalIssuesCreated ?? "No issues created"}
    - Total PRs Created: ${userData.totalPRsCreated ?? "No PRs created"}
    - First PR: ${userData.firstPR?.html_url || "No PRs yet"}
  
    Give a **short, witty** summary of their contributions. Make it fun, with a slight roast, but not too harsh.
    `;
  
    try {
      const response = await together.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      });
  
      // Fix: Ensure content is a string and not null
      const summary = response.choices?.[0]?.message?.content ?? "No response generated. Try again!";
      return NextResponse.json({ summary });
  
    } catch (error) {
      console.error("Error generating AI summary:", error);
      return NextResponse.json({ summary: "An error occurred while generating the summary." }, { status: 500 });
    }
  }
  