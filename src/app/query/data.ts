"use client";
import { useQuery } from "@tanstack/react-query";

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");

      // Fetch user data dynamically based on the provided username
      const userRes = await fetch(`/api/data?username=${username}`);
      if (!userRes.ok) throw new Error("Failed to fetch GitHub data");
      const userData = await userRes.json();

      // Fetch AI summary
      const aiRes = await fetch("/api/data/aidata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
      });
      if (!aiRes.ok) throw new Error("Failed to fetch AI summary");
      const { summary } = await aiRes.json();

      return { ...userData, summary };
    },
    enabled: !!username, // Ensures query runs only when username exists
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
