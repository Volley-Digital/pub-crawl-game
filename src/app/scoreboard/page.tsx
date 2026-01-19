"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadSession } from "@/lib/session"; // Import session utility
import { supabase } from "@/lib/supabase";
import "./scoreboard.css"; // Import CSS for blur effect
import CheckCircleIcon from "@heroicons/react/16/solid/esm/CheckCircleIcon";
import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";

type Team = { id: string; name: string };
type Row = { team_id: string; points_awarded: number };
type GalleryItem = {
  id: string;
  team_id: string;
  photo_url: string;
  created_at?: string;
  verified: boolean;
  finished: boolean;
  teams?: { name: string } | null;
  riddles?: { pub_name: string; animal: string } | null;
};

export default function ScoreboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameEnded, setGameEnded] = useState<boolean>(false); // New state for game status

  // Load session to get user's team ID
  const session = loadSession();
  const userTeamId = session?.teamId ?? null;

  useEffect(() => {
    (async () => {
      // Grab latest game
      const { data: g } = await supabase
        .from("games")
        .select("id, end_time") // Fetch end_time
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!g) return;
      setGameId(g.id);

      // Check if the game has ended
      const currentTime = new Date();
      const endTime = new Date(g.end_time);
      setGameEnded(currentTime > endTime);

      const { data: t } = await supabase
        .from("teams")
        .select("id, name")
        .eq("game_id", g.id);

      setTeams((t ?? []) as Team[]);

      const { data: subs } = await supabase
        .from("submissions")
        .select("team_id, points_awarded")
        .eq("game_id", g.id);

      const map: Record<string, number> = {};
      for (const s of (subs ?? []) as Row[]) {
        map[s.team_id] = (map[s.team_id] ?? 0) + (s.points_awarded ?? 0);
      }
      setTotals(map);

      // Gallery (proved submissions with photo_url)
      const { data: gal, error: galErr } = await supabase
        .from("submissions")
        .select(
          `
          id,
          team_id,
          photo_url,
          verified,
          finished,
          created_at,
          teams ( name ),
          riddles ( pub_name, animal )
        `
        )
        .eq("game_id", g.id)
        .not("photo_url", "is", null)
        .order("created_at", { ascending: false });

      if (!galErr) setGallery((gal ?? []) as any);
    })();
  }, []);

  const galleryByTeam = useMemo(() => {
    const by: Record<string, GalleryItem[]> = {};
    for (const item of gallery) {
      by[item.team_id] = by[item.team_id] ?? [];
      by[item.team_id].push(item);
    }
    return by;
  }, [gallery]);

  return (
    <main className="min-h-screen max-h-screen overflow-scroll max-w-xl mx-auto">
      <div className="sticky z-10 px-6 py-3 top-0 flex items-center justify-between gap-3 w-full backdrop-blur-sm bg-steel-blue-100/30 shadow-xl">
        <div className="flex items-center justify-between w-full text-steel-blue-950">
          <h1 className="text-2xl font-bold">Scoreboard</h1>
          <Link className="text-sm underline" href="/game">
            Back
          </Link>
        </div>
      </div>


      {/* Existing totals UI */}
      <div className="p-6 mt-12 grid grid-cols-2 md:grid-cols-2 gap-3 ">
        {teams.map((t) => (
          <div key={t.id} className=" rounded-2xl border-double border-6 border-steel-blue-900 p-3 shadow-sm bg-steel-blue-950">
            <div className="text-sm text-steel-blue-50">Team {t.name}</div>
            <div className="text-3xl text-steel-blue-50 font-bold">{totals[t.id] ?? 0}</div>
          </div>
        ))}
      </div>

      {/* Gallery */}
      <div className="mt-8 m-6 py-4 pl-6 backdrop-blur-sm bg-steel-blue-50/50 rounded-2xl shadow-sm">
        <div className="flex pr-6 tems-end justify-between gap-3 text-steel-blue-950">
          <div>
            <h2 className="text-xl font-semibold">Proof Gallery</h2>
            <p className="text-sm text-gray-600">
              Photos uploaded during the crawl. (The other team's photos are blurred until the game ends.)
            </p>
          </div>

        </div>

        <div className="mt-6 space-y-10">
          {teams.map((t) => {
            const items = galleryByTeam[t.id] ?? [];
            const isUserTeam = t.id === userTeamId; // Check if this is the user's team
            return (
              <section
                key={t.id}
              >
                <h3 className="text-lg text-steel-blue-950 font-semibold">Team {t.name}</h3>

                {items.length === 0 ? (
                  <div className="mt-2 text-sm text-gray-500">No proofs yet.</div>
                ) : (
                  <div className={`${gameEnded || isUserTeam ? "" : "blur-overlay"} pr-6 mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 `}>
                    {items.map((it) => (
                      <figure
                        key={it.id}
                        className={it.verified ? "block rounded-2xl w-full shrink-0 shadow-sm bg-steel-blue-950 border-double border-10 border-steel-blue-900" : "block rounded-2xl shrink-0 shadow-sm bg-steel-blue-950 border-double border-10 border-steel-blue-900"} >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={it.photo_url}
                          alt={it.riddles?.pub_name ?? "Proof"}
                          className="w-full h-40 object-cover"
                          loading="lazy"
                        />
                        <div className="relative w-full overflow-hidden -mt-4 flex justify-center">
                          <div className="text-sm text-steel-blue-950 flex items-center ">
                            {it.verified ? 
                            <CheckCircleIcon  className="size-8 bg-white text-green-600 rounded-full block pointer-events-none" />
                            :
                            !it.finished ? 
                              <QuestionMarkCircleIcon  className="size-8 bg-white text-orange-500 rounded-full block pointer-events-none" />
                              : 
                              <XCircleIcon  className="size-8 bg-white text-red-600  rounded-full block pointer-events-none" />
                            }                 
                          </div>
                        </div>
                        <figcaption className="p-2 text-md text-steel-blue-50 text-center">
                          <div className="font-semibold line-clamp-1">
                            {it.riddles?.pub_name ?? "Unknown pub"} - "The {it.riddles?.animal ?? ""}"
                          </div>
      
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
