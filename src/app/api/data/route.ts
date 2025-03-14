import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Store securely in environment variables

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  },
});

// ✅ Define GitHub event type
interface GitHubEvent {
  type: string;
  payload: {
    commits?: { length: number }[];
  };
}

// ✅ Fetch all repositories with pagination
async function fetchAllRepos(username: string) {
  const repos = [];
  let page = 1;

  while (true) {
    const response = await api.get(`/users/${username}/repos`, {
      params: { per_page: 100, page },
    });

    repos.push(...response.data);
    if (response.data.length < 100) break; // Stop if less than 100 repos are returned
    page++;
  }

  return repos;
}

// ✅ Fetch all PRs with pagination
async function fetchAllPRs(username: string) {
  let page = 1;
  const prs = [];
  while (true) {
    const response = await api.get(
      `/search/issues?q=author:${username}+type:pr&sort=created&order=asc&page=${page}&per_page=100`
    );
    prs.push(...response.data.items);
    if (response.data.items.length < 100) break;
    page++;
  }
  return prs;
}

// ✅ Main function to fetch GitHub data
async function fetchGitHubData(username: string) {
  try {
    const [userRes, repos, eventsRes, issuesRes] = await Promise.all([
      api.get(`/users/${username}`),
      fetchAllRepos(username), // ✅ Now correctly fetching all repositories
      api.get(`/users/${username}/events?per_page=100`),
      api.get(`/search/issues?q=author:${username}+type:issue`),
    ]);

    const user = userRes.data;
    const events: GitHubEvent[] = eventsRes.data;
    const totalIssuesCreated = issuesRes.data.total_count;
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    // Fetch all PRs to get the first PR
    const prs = await fetchAllPRs(username);
    const firstPR = prs.length > 0 ? prs[0] : null;

    const firstPRDetails = firstPR
      ? {
          title: firstPR.title,
          url: firstPR.html_url,
          repo: firstPR.repository_url.split("/").slice(-1)[0], // Extract repo name from URL
          state: firstPR.state,
          created_at: firstPR.created_at,
        }
      : null;

    // ✅ Fixed TypeScript issue by defining GitHubEvent type
    const totalCommits = events
      .filter((e: GitHubEvent) => e.type === "PushEvent")
      .reduce((sum, e) => sum + (e.payload.commits ? e.payload.commits.length : 0), 0);

    const languageCounts = repos.reduce((acc, repo) => {
      if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number)) // ✅ Explicitly cast to number
    .map(([lang]) => lang)
    .slice(0, 3);
  

    const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();

    // Level calculation
    const baseLevel =
      totalStars * 0.03 +
      totalIssuesCreated * 0.15 +
      prs.length * 0.35 +
      totalCommits * 0.08 -
      accountAge * 1.2;

    let level = 0;
    if (baseLevel < 20) level = Math.min(Math.floor(baseLevel * 1.5), 20);
    else if (baseLevel < 50) level = Math.min(Math.floor(20 + (baseLevel - 20) * 1.0), 50);
    else if (baseLevel < 75) level = Math.min(Math.floor(50 + (baseLevel - 50) * 0.6), 75);
    else if (baseLevel < 90) level = Math.min(Math.floor(75 + (baseLevel - 75) * 0.2), 90);
    else if (baseLevel < 95) level = Math.min(Math.floor(90 + (baseLevel - 90) * 0.05), 95);
    else level = Math.min(Math.floor(95 + (baseLevel - 95) * 0.005), 100);

    let tier = "Rookie";
    if (level >= 20) tier = "Challenger";
    if (level >= 40) tier = "Veteran";
    if (level >= 70) tier = "Elite";
    if (level >= 95) tier = "Legend";

    const contributionsChart = `https://github.com/users/${username}/contributions`;

    return NextResponse.json({
      username: user.login,
      avatar: user.avatar_url,
      name: user.name || "No name",
      bio: user.bio || "No bio available",
      accountAge,
      totalRepos: repos.length, // ✅ Now correct
      totalStars,
      topLanguages,
      totalIssuesCreated,
      totalPRsCreated: prs.length,
      totalCommits,
      firstPR: firstPRDetails,
      level,
      tier,
      contributionsChart,
    });
} catch (error: unknown) {
  if (axios.isAxiosError(error) && error.response?.status === 404) {
    return NextResponse.json(
      {
        error: "GitHub User Not Found",
        message: "Oops! Looks like this username doesn't exist on GitHub. Did you type it correctly?",
        githubMeme: "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      error: "GitHub API Error",
      details: error || "Unknown error",
    },
    { status: 500 }
  );
}
}


// ✅ GET API Handler
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  return fetchGitHubData(username);
}
