"use client";

import { loadSession } from "@/lib/session"; // Import session utility
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./scoreboard.css"; // Import CSS for blur effect

type Team = { id: string; name: string };

type Row = {
  team_id: string;
  points_awarded: number;
};

type GalleryItem = {
  id: string;
  team_id: string;
  photo_url: string;
  created_at?: string;
  verified: boolean;
  went_to_location: boolean;
  challenge_completed: boolean;
  points_awarded: number;
  finished: boolean;
  teams?: { name: string } | null;
  riddles?: { pub_name: string; animal: string } | null;
};

export default function GameMaster() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [gameId, setGameId] = useState<string | null>(null);

  // Load session to get user's team ID
  const session = loadSession();
  const userTeamId = session?.teamId ?? null;

  const fetchData = useCallback(async () => {
    // Fetch the game ID related to the user's team
    const { data: teamGame } = await supabase
      .from("teams")
      .select("game_id")
      .eq("id", userTeamId)
      .maybeSingle();

    if (!teamGame) return;
    setGameId(teamGame.game_id);

    // Fetch game details
    const { data: g } = await supabase
      .from("games")
      .select("id, end_time")
      .eq("id", teamGame.game_id)
      .maybeSingle();

    if (!g) return;

    const { data: t } = await supabase
      .from("teams")
      .select("id, name")
      .eq("game_id", g.id);

    setTeams((t ?? []) as Team[]);

    const { data: subs } = await supabase
      .from("submissions")
      .select(`
        id,
        team_id,
        photo_url,
        created_at,
        verified,
        went_to_location,
        challenge_completed,
        points_awarded,
        finished,
        teams ( name ),
        riddles ( pub_name, animal )
      `)
      .eq("game_id", g.id)
      .not("photo_url", "is", null) // Only fetch submissions with a photo_url
      .not("finished", "is", true); // Exclude finished submissions

    const mappedSubs = (subs ?? []).map((item) => ({
      ...item,
      teams: Array.isArray(item.teams)
        ? item.teams.length > 0
          ? { name: item.teams[0].name }
          : null
        : item.teams ?? null,
      riddles: Array.isArray(item.riddles)
        ? item.riddles.length > 0
          ? { pub_name: item.riddles[0].pub_name, animal: item.riddles[0].animal }
          : null
        : item.riddles ?? null,
    }));

    const map: Record<string, number> = {};
    for (const s of mappedSubs as Row[]) {
      map[s.team_id] = (map[s.team_id] ?? 0) + (s.points_awarded ?? 0);
    }
    setTotals(map);

    setGallery(mappedSubs as GalleryItem[]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const galleryByTeam = useMemo(() => {
    const by: Record<string, GalleryItem[]> = {};
    for (const item of gallery) {
      by[item.team_id] = by[item.team_id] ?? [];
      by[item.team_id].push(item);
    }
    return by;
  }, [gallery]);

  const toggleField = useCallback(
    async (submissionId: string, field: "went_to_location" | "challenge_completed", value: boolean) => {

      const updatedGallery = gallery.map((item) =>
        item.id === submissionId ? { ...item, [field]: value } : item
      );
      setGallery(updatedGallery);
    },
    [gallery]
  );

  const verifySubmission = useCallback(
    async (submissionId: string) => {
      await supabase
        .from("submissions")
        .update({ verified: true, finished: true })
        .eq("id", submissionId);

      fetchData(); // Revalidate the query
    },
    [fetchData]
  );

  const rejectSubmission = useCallback(
    async (submissionId: string, wentToLocation: boolean, challengeCompleted: boolean) => {
      const deduction = (wentToLocation ? 0 : 2) + (challengeCompleted ? 0 : 1);

      await supabase
        .from("submissions")
        .update({
          points_awarded: 0,
          went_to_location: wentToLocation,
          challenge_completed: challengeCompleted,
          finished: true,
        })
        .eq("id", submissionId);

      fetchData(); // Revalidate the query
    },
    [fetchData]
  );

  return (
    <main className="min-h-screen max-h-screen overflow-scroll max-w-xl mx-auto">
       <div className="sticky z-10 px-6 py-3 top-0 flex items-center justify-between gap-3 w-full backdrop-blur-sm bg-steel-blue-100/30 shadow-xl">
        <div className="flex items-center justify-between w-full text-steel-blue-950">
          <h1 className="text-2xl font-bold">Game Master</h1>
          <Link className="text-sm underline" href="/game">
            Back
          </Link>
        </div>
      </div>

      {/* Gallery */}
      <div className="mt-24 m-6 p-4 rounded-2xl backdrop-blur-sm bg-steel-blue-50/40 shadow-sm text-steel-blue-950">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Verification</h2>
          </div>
        </div>

        <div className="mt-6 space-y-10">
          {teams.map((t) => {
            const items = galleryByTeam[t.id] ?? [];
            return (
              <section
                key={t.id}
              >
                <h3 className="text-lg font-semibold">Team {t.name}</h3>

                {items.length === 0 ? (
                  <div className="mt-2 text-sm text-gray-500">No proofs yet.</div>
                ) : (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-2 gap-3">
                    {items.map((it) => (
                      <figure
                        key={it.id}
                        className={`group rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-steel-blue-950 to-steel-blue-900 border-double border-10 border-steel-blue-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${it.verified ? "ring-2 ring-green-400" : "ring-2 ring-rose-400"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={it.photo_url}
                          alt={it.riddles?.pub_name ?? "Proof"}
                          className="w-full h-40 object-cover rounded-t-xl"
                          loading="lazy"
                        />
                        <figcaption className="p-3 text-xs text-steel-blue-50">
                          <div className="font-semibold line-clamp-1">
                            {it.riddles?.pub_name ?? "Unknown pub"}
                          </div>
                          <div className="text-steel-blue-200 line-clamp-1">
                            {it.riddles?.animal ?? ""}
                          </div>
                          {!it.finished && (
                            <>
                              <div className="mt-3 flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-steel-blue-100">
                                  <input
                                    type="checkbox"
                                    checked={it.went_to_location}
                                    onChange={(e) => toggleField(it.id, "went_to_location", e.target.checked)}
                                  />
                                  Went to Location
                                </label>
                                <label className="flex items-center gap-2 text-steel-blue-100">
                                  <input
                                    type="checkbox"
                                    checked={it.challenge_completed}
                                    onChange={(e) => toggleField(it.id, "challenge_completed", e.target.checked)}
                                  />
                                  Challenge Completed
                                </label>
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <button
                                  className="rounded-xl bg-emerald-500/90 text-white px-3 py-2 text-xs font-semibold hover:bg-emerald-500"
                                  onClick={() => verifySubmission(it.id)}
                                >
                                  Verify
                                </button>
                                <button
                                  className="rounded-xl bg-rose-500/90 text-white px-3 py-2 text-xs font-semibold hover:bg-rose-500"
                                  onClick={() => rejectSubmission(it.id, it.went_to_location, it.challenge_completed)}
                                >
                                  Reject
                                </button>
                              </div>
                            </>
                          )}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
