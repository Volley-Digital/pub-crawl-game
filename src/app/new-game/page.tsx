"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { saveSession } from "@/lib/session";

export default function NewGame() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("PRAUGEZOO2026");
  const [teamName, setTeamName] = useState<"A" | "B">("A");
  const [gameName, setGameName] = useState("Prauge Zoo Challenge");
  const [gameStartTime, setGameStartTime] = useState("");
  const [gameEndTime, setGameEndTime] = useState("");
  const [finalUnlockTime, setFinalUnlockTime] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setErr(null), [joinCode, teamName, gameName]);

  async function onCreate() {
    setLoading(true);
    setErr(null);

    const code = joinCode.trim();
    const name = gameName.trim();

    if (!code || !name || !gameStartTime || !gameEndTime || !finalUnlockTime) {
      setErr("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      // Check if the join code is unique
      const { data: existingCode, error: codeErr } = await supabase
        .from("teams")
        .select("join_code", { head: true, count: "exact" })
        .eq("join_code", code);

      if (codeErr) {
        setErr("Failed to validate join code. Please try again.");
        setLoading(false);
        return;
      }

      if (existingCode && existingCode.length > 0) {
        setErr("Join code already exists. Please use a different code.");
        setLoading(false);
        return;
      }

      // Insert new game into the database
      const { data: game, error: gameErr } = await supabase
        .from("games")
        .insert({
          name,
          start_time: gameStartTime,
          end_time: gameEndTime,
          final_unlock_time: finalUnlockTime,
        })
        .select("id")
        .single();

      if (gameErr || !game) {
        setErr("Failed to create the game. Please try again.");
        setLoading(false);
        return;
      }

      // Create teams A and B for the new game
      const { data: teams, error: teamErr } = await supabase.from("teams").insert([
        {
          game_id: game.id,
          name: "A",
          join_code: code,
        },
        {
          game_id: game.id,
          name: "B",
          join_code: code,
        },
      ]).select("id, name");

      if (teamErr || !teams) {
        setErr("Failed to create teams. Please try again.");
        setLoading(false);
        return;
      }

      const teamA = teams.find((team) => team.name === "A");

      // Save session and navigate to the game page
      saveSession({
        teamId: teamA?.id, // Assign the UUID of team A
        teamName: "A", // Assign team A for testing
        joinCode: code,
        playerName: "N/A",
      });

      router.push(`/game`);
    } catch (error) {
      setErr("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-end justify-end flex-row p-6">
      <div className="w-full max-w-md rounded-2xl  p-6 backdrop-blur-sm bg-steel-blue-900/30">
        <div className="space-y-4 text-steel-blue-100 ">
          <div>
            <h1 className="text-3xl text-steel-blue-50  font-bold">
              Create New Game
            </h1>
          </div>
          <div>
            <label className="text-sm font-medium">Join code</label>
            <input
              className="mt-1 w-full rounded-xl border-4 border-double border-blue-50 p-3 text-lg"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Game Name</label>
            <input
              className="mt-1 w-full rounded-xl border-4 border-double border-blue-50 p-3 text-lg"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Game Start Time</label>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-xl border-4 border-double border-blue-50 p-3 text-lg"
              onChange={(e) => setGameStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Game End Time</label>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-xl border-4 border-double border-blue-50 p-3 text-lg"
              onChange={(e) => setGameEndTime(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Final Unlock Time</label>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-xl border-4 border-double border-blue-50 p-3 text-lg"
              onChange={(e) => setFinalUnlockTime(e.target.value)}
            />
          </div>
          {err && <div className="text-sm text-red-600">{err}</div>}

          <button
            className="w-full mt-2 rounded-xl bg-steel-blue-950 text-white p-4 text-lg font-semibold disabled:opacity-50"
            onClick={onCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Game"}
          </button>
        </div>
      </div>
    </main>
  );
}
