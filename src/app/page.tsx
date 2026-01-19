"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { saveSession } from "@/lib/session";

export default function JoinPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("PRAUGEZOO2026");
  const [teamName, setTeamName] = useState<"A" | "B">("A");
  const [playerName, setPlayerName] = useState("N/A");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setErr(null), [joinCode, teamName, playerName]);

  async function onJoin() {
    setLoading(true);
    setErr(null);

    const code = joinCode.trim();
    const name = playerName.trim();

    if (!code || !name) {
      setErr("Enter the join code and your name.");
      setLoading(false);
      return;
    }

    // Find team by join code + name
    const { data: team, error: teamErr } = await supabase
      .from("teams")
      .select("id, name, game_id, join_code")
      .eq("join_code", code)
      .eq("name", teamName)
      .maybeSingle();

    if (teamErr || !team) {
      setErr("Couldn’t find that team. Check the code and try again.");
      setLoading(false);
      return;
    }

    // Create player record (optional)
    await supabase.from("players").insert({
      team_id: team.id,
      display_name: name,
    });

    saveSession({
      teamId: team.id,
      teamName: team.name,
      joinCode: team.join_code,
      playerName: name,
    });

    router.push("/game");
  }

  return (
    <main className="min-h-screen flex items-end justify-end flex-row p-6">
      <div className="w-full max-w-md rounded-2xl  p-6 backdrop-blur-sm bg-steel-blue-900/30">

      <div className="space-y-4 text-steel-blue-100 ">
      <div>
        <h1 className="text-3xl text-steel-blue-50  font-bold">The "Prague Zoo" Challenge</h1>
       </div>
          <div>
            <label className="text-sm font-medium">Team</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <button
                className={`rounded-xl border-4 border-double text-steel-blue-50 border-steel-blue-50 p-3 text-lg ${
                  teamName === "A" ? "bg-steel-blue-200 text-steel-blue-950 border-steel-blue-950 " : ""
                }`}
                onClick={() => setTeamName("A")}
              >
                Team A
              </button>
              <button
                className={`rounded-xl  border-4 border-double text-steel-blue-50 border-steel-blue-50 p-3 text-lg ${
                  teamName === "B" ? "bg-steel-blue-200 text-steel-blue-950 border-steel-blue-950 " : ""
                }`}
                onClick={() => setTeamName("B")}
              >
                Team B
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Join code</label>
            <input
              className="mt-1 w-full rounded-xl border-4 border-double border-blue-50 p-3 text-lg"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
          </div>
          {err && <div className="text-sm text-red-600">{err}</div>}

          <button
            className="w-full mt-2 rounded-xl bg-steel-blue-950 text-white p-4 text-lg font-semibold disabled:opacity-50"
            onClick={onJoin}
            disabled={loading}
          >
            {loading ? "Joining..." : "Start the Hunt"}
          </button>
        </div>
      </div>
    </main>
  );
}
