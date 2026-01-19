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
    // Grab latest game
    const { data: g } = await supabase
      .from("games")
      .select("id, end_time") // Fetch end_time
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!g) return;
    setGameId(g.id);

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

    const map: Record<string, number> = {};
    for (const s of (subs ?? []) as Row[]) {
      map[s.team_id] = (map[s.team_id] ?? 0) + (s.points_awarded ?? 0);
    }
    setTotals(map);

    setGallery((subs ?? []) as GalleryItem[]);
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
      <div className="mt-24 m-6 p-4 rounded-2xl border-steel-blue-950  backdrop-blur-sm bg-steel-blue-50/40 shadow-sm text-steel-blue-950">
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
                  <div className={`mt-3 grid grid-cols-2 md:grid-cols-4 gap-3`}>
                    {items.map((it) => (
                      <figure
                        key={it.id}
                        className={`rounded-2xl bg-white overflow-hidden ${it.verified ? "border-green-500" : "border-red-500"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={it.photo_url}
                          alt={it.riddles?.pub_name ?? "Proof"}
                          className="w-full h-40 object-cover"
                          loading="lazy"
                        />
                        <figcaption className="p-2 text-xs text-gray-700">
                          <div className="font-semibold line-clamp-1">
                            {it.riddles?.pub_name ?? "Unknown pub"}
                          </div>
                          <div className="text-gray-500 line-clamp-1">
                            {it.riddles?.animal ?? ""}
                          </div>
                          {!it.finished && (
                            <>
                              <div className="mt-2 flex items-center gap-2">
                                <label className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={it.went_to_location}
                                    onChange={(e) => toggleField(it.id, "went_to_location", e.target.checked)}
                                  />
                                  Went to Location
                                </label>
                                <label className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={it.challenge_completed}
                                    onChange={(e) => toggleField(it.id, "challenge_completed", e.target.checked)}
                                  />
                                  Challenge Completed
                                </label>
                              </div>
                              <div className="mt-2 flex gap-2">
                                <button
                                  className="text-sm text-green-600 underline"
                                  onClick={() => verifySubmission(it.id)}
                                >
                                  Verify
                                </button>
                                <button
                                  className="text-sm text-red-600 underline"
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
