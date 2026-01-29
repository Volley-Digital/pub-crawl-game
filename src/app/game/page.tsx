"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { clearSession, loadSession } from "@/lib/session";
import { ArrowRightCircleIcon, MapPinIcon, PuzzlePieceIcon } from "@heroicons/react/16/solid";
import { CheckBadgeIcon, CheckCircleIcon, CheckIcon, ClipboardDocumentListIcon, MapIcon, StarIcon } from "@heroicons/react/24/solid";


type Riddle = {
  id: string;
  animal: string;
  tier: "easy" | "med" | "hard";
  zone: number;
  icon: string;
  question: string;
  points_solve: number;
  points_photo: number;
  maps_query: string;
  points_challenge: number;
  pub_name: string;
  pub_image_url: string;
  is_final: boolean;
  sort_order: number;
  accepted_answers: string[];
};

type Game = {
  id: string;
  start_time: string;
  end_time: string;
  final_unlock_time: string;
};

type Submission = {
  riddle_id: string;
  points_awarded: number;
  answered_correct: boolean;
  went_to_location: boolean;
  challenge_completed: boolean;
};

export default function GamePage() {
  const router = useRouter();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [completedRiddleIds, setCompletedRiddleIds] = useState<Set<string>>(new Set());
  const [skippedRiddleIds, setSkippedRiddleIds] = useState<Set<string>>(new Set());
  const [now, setNow] = useState<Date>(new Date());
  const [score, setScore] = useState<number>(0);
  const [submissionsMap, setSubmissionsMap] = useState<Map<string, Submission>>(new Map());

  useEffect(() => {
    const s = loadSession();
    if (!s) router.push("/");
    else setTeamId(s.teamId);
  }, [router]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!teamId) return;
    console.log("Loading game data for team:", teamId);
    (async () => {
      // get team -> game
      const { data: team } = await supabase
        .from("teams")
        .select("id, game_id")
        .eq("id", teamId)
        .maybeSingle();

      if (!team) return;

      const { data: g } = await supabase
        .from("games")
        .select("id, start_time, end_time, final_unlock_time")
        .eq("id", team.game_id)
        .maybeSingle();

      if (!g) return;
      setGame(g);

      // all riddles
      const { data: rs } = await supabase
        .from("riddles")
        .select("id, animal, tier, zone, icon, question, pub_image_url, points_solve, points_photo, points_challenge, is_final, sort_order, accepted_answers, pub_name, maps_query")
        .order("sort_order", { ascending: true });

      setRiddles((rs ?? []) as Riddle[]);

      // submissions for this team
      const { data: subs } = await supabase
        .from("submissions")
        .select("riddle_id, points_awarded, answered_correct, went_to_location, challenge_completed")
        .eq("team_id", teamId);

      const subsMap = new Map<string, Submission>();
      for (const s of subs ?? []) {
        subsMap.set(s.riddle_id, s); // Store the entire submission object
      }
      setSubmissionsMap(subsMap);

      const done = new Set<string>();
      let total = 0;
      for (const s of subs ?? []) {
        done.add(s.riddle_id);
        total += s.points_awarded ?? 0;
      }
      setCompletedRiddleIds(done);
      setScore(total);
    })();
  }, [teamId]);

  const timeInfo = useMemo(() => {
    if (!game) return { locked: false, finalUnlocked: false, msLeft: 0 };
    const end = new Date(game.end_time).getTime();
    const finalUnlock = new Date(game.final_unlock_time).getTime();
    const nowMs = now.getTime();
    return {
      locked: nowMs >= end,
      finalUnlocked: nowMs >= finalUnlock,
      msLeft: Math.max(0, end - nowMs),
    };
  }, [game, now]);

  const available = useMemo(() => {
    const pool = riddles.filter(
      (r) => !completedRiddleIds.has(r.id) && !skippedRiddleIds.has(r.id)
    );
    const finals = pool.filter((r) => r.is_final);
    const nonFinal = pool.filter((r) => !r.is_final);

    // Show only the final riddle after unlock time
    if (timeInfo.finalUnlocked) {
      return finals.length ? [finals[0]] : [];
    }

    // If no other riddles are available, show the final riddle early
    if (nonFinal.length === 0 && finals.length) {
      return [finals[0]];
    }

    // Otherwise, show all non-final riddles
    return nonFinal;
  }, [riddles, completedRiddleIds, skippedRiddleIds, timeInfo.finalUnlocked]);

  const tierOrder: Record<Riddle["tier"], number> = {
    easy: 1,
    med: 2,
    hard: 3,
  };

  const tierBadgeClass = (tier: Riddle["tier"]) => {
    switch (tier) {
      case "easy":
        return "bg-emerald-100 text-emerald-900";
      case "med":
        return "bg-amber-100 text-amber-900";
      case "hard":
      default:
        return "bg-rose-100 text-rose-900";
    }
  };

  const availableZone1 = useMemo(
    () =>
      available
        .filter((r) => r.zone === 1)
        .slice()
        .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]),
    [available]
  );
  const availableZone2 = useMemo(
    () =>
      available
        .filter((r) => r.zone === 2)
        .slice()
        .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]),
    [available]
  );

  function fmt(ms: number) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);

    const days = d > 0 ? `${d} day${d > 1 ? "s" : ""}, ` : "";
    const hours = h % 24;
    const minutes = m % 60;

    return `${days}${hours} hour${hours !== 1 ? "s" : ""}, ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  async function refresh() {
    if (!teamId) return;
    const { data: subs } = await supabase
      .from("submissions")
      .select("riddle_id, points_awarded")
      .eq("team_id", teamId);

    const done = new Set<string>();
    let total = 0;
    for (const s of subs ?? []) {
      done.add(s.riddle_id);
      total += s.points_awarded ?? 0;
    }
    setCompletedRiddleIds(done);
    setScore(total);
  };

  return (
    <main className="min-h-screen max-h-screen overflow-scroll max-w-xl mx-auto">
      <div className="sticky z-10 px-6 py-1 top-0 flex items-center justify-between gap-3 w-full backdrop-blur-sm bg-steel-blue-100/30 shadow-xl">
        <div className="">
          <div className="text-lg text-steel-blue-950 relative block">
            <StarIcon className="size-16 text-yellow-500 block pointer-events-none" />
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none"> 
              <span className="mt-1 pointer-none text-steel-blue-50 font-semibold">
                {score}
              </span> 
            </span> 
          </div>
          {timeInfo.locked && (
            <p className="text-sm text-red-600 mt-1">
              Zoo closed — scoreboard only.
            </p>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src="/head.png" alt="logo" className="absolute mt-10 w-20"/>

        </div>
        <div className="flex gap-2 items-center">
          <Link className="rounded-full bg-steel-blue-900 px-2 py-2 text-sm text-steel-blue-100" href="/scoreboard">
            <ClipboardDocumentListIcon className="size-10 text-steel-blue-50 block" />
          </Link>
        </div>
      </div>
      <div className="pt-28 p-6">
        {timeInfo.locked && (
          <div className="mb-6 rounded-2xl backdrop-blur-sm bg-steel-blue-50/30 shadow-sm overflow-hidden border-double border-6 border-steel-blue-900">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1mxp4T7oD0b4rbBoH7h8qCshswExnU2I&ehbc=2E312F"
              className="w-full h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
        <div className="backdrop-blur-sm bg-steel-blue-50/30 px-4 pt-4 pb-6 rounded-2xl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-steel-blue-950">Available riddles</h2>
            <span className="inline-flex items-center rounded-full bg-steel-blue-900/10 px-3 py-1 text-xs font-semibold text-steel-blue-900">
              {game ? fmt(timeInfo.msLeft) : "—"}
            </span>
          </div>
          <div className="mt-3 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-steel-blue-900/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-steel-blue-900">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                🏛️ Zone 1
              </div>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {availableZone1.map((r) => (
                  <Link
                    key={r.id}
                    href={timeInfo.locked ? "#" : `/riddles/${r.id}`}
                    className={`group rounded-2xl border-double border-6 border-steel-blue-900 p-3 shadow-sm bg-gradient-to-br from-steel-blue-950 to-steel-blue-900 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue-300 ${
                      timeInfo.locked ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {r.is_final && (
                      <div className="w-full text-steel-blue-200 mb-1 text-xs font-semibold tracking-wide">
                        FINAL RIDDLE
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <PuzzlePieceIcon className="size-10 text-steel-blue-200" />
                      <div className="text-lg font-semibold text-steel-blue-50">
                        +{r.points_solve}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                     
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${tierBadgeClass(r.tier)}`}>
                        {r.tier}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-steel-blue-300">
                      Challenge: +{r.points_challenge}
                    </div>

                  </Link>
                ))}
                {!availableZone1.length && (
                  <div className="text-sm text-steel-blue-950 mt-2">
                    No riddles in Zone 1.
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-steel-blue-900/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-steel-blue-900">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                🏰 Zone 2
              </div>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {availableZone2.map((r) => (
                  <Link
                    key={r.id}
                    href={timeInfo.locked ? "#" : `/riddles/${r.id}`}
                    className={`group rounded-2xl border-double border-6 border-steel-blue-900 p-3 shadow-sm bg-gradient-to-br from-steel-blue-950 to-steel-blue-900 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue-300 ${
                      timeInfo.locked ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {r.is_final && (
                      <div className="w-full text-steel-blue-200 mb-1 text-xs font-semibold tracking-wide">
                        FINAL RIDDLE
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <PuzzlePieceIcon className="size-10 text-steel-blue-200" />
                      <div className="text-lg font-semibold text-steel-blue-50">
                        +{r.points_solve}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                     
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${tierBadgeClass(r.tier)}`}>
                        {r.tier}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-steel-blue-300">
                      Challenge: +{r.points_challenge}
                    </div>
                  </Link>
                ))}
                {!availableZone2.length && (
                  <div className="text-sm text-steel-blue-950 mt-2">
                    No riddles in Zone 2.
                  </div>
                )}
              </div>
            </div>

            {!available.length && (
              <div className="text-sm text-steel-blue-950 mt-1">
                No riddles left — head to the finale.
              </div>
            )}
          </div>
        </div>
      <div className="pt-8">
        <div className="backdrop-blur-sm bg-steel-blue-50/30 px-4 pt-4 pb-6 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold uppercase text-emerald-900">
              Completed riddles
            </span>
          </div>
          <div className="mt-3 space-y-3 grid grid-cols-1">
            {riddles.filter((r) => completedRiddleIds.has(r.id)).map((r) => (
              <div
                key={r.id}
                className="group block rounded-2xl shadow-sm bg-gradient-to-br from-steel-blue-950 to-steel-blue-900 border-double border-10 border-steel-blue-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <img src={r.pub_image_url}  alt={r.pub_name} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="relative flex flex-row justify-center rounded-2xl gap-2 bg-white/90 backdrop-blur-sm overflow-hidden -mt-5 mx-16 px-2 py-1 shadow-sm">
                  <div className="text-sm text-steel-blue-950 flex items-center px-1">
                    <span className="text-2xl" aria-hidden="true">{r.icon}</span>
                  </div>
                  <a 
                    className="text-sm text-steel-blue-950 flex items-center"
                    href={`${r.maps_query}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                     <MapPinIcon className="size-9 text-steel-blue-950 rounded-full block pointer-events-none" />
                  </a>
                  <div className="relative size-10">
                    <StarIcon className="size-10 text-yellow-500 block pointer-events-none" />
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none"> 
                      <span className="mt-0.5 pointer-none text-steel-blue-50 font-semibold text-sm">
                      {submissionsMap.get(r.id)?.points_awarded ?? 0}
                      </span> 
                    </span> 
                  </div>
                  <div className="text-sm text-steel-blue-950 flex items-center">
                    <CheckCircleIcon  className="size-9 text-green-600 rounded-full block pointer-events-none" />
                  </div>
                </div>
                <div className="p-4 mx-auto text-center">
                  <div className="text-xl text-steel-blue-50 font-semibold">
                    {r.pub_name}
                  </div>
                  <div className="text-sm text-steel-blue-200">"The {r.animal}"</div>
                </div>
              
              </div>
            ))}
            {!riddles.filter((r) => completedRiddleIds.has(r.id)).length && (
              <div className="text-sm text-gray-600 mt-4">
                No riddles completed yet.
              </div>
            )}
          </div>
        </div>
      </div>
  
      </div>

    </main>
  );
}
