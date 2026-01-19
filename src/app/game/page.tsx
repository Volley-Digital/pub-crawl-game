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
        .select("id, animal, tier, question, pub_image_url, points_solve, points_photo, points_challenge, is_final, sort_order, accepted_answers, pub_name, maps_query")
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

    const result: Riddle[] = [];

    // Show only the final riddle if 30 minutes or less remain
    if (timeInfo.msLeft <= 30 * 60 * 1000) {
      if (finals.length) result.push(finals[0]);
      return result; // Return only the final riddle
    }

    // If no other riddles are available, show the final riddle early
    if (nonFinal.length === 0 && finals.length) {
      result.push(finals[0]);
      return result;
    }

    // Otherwise, exclude the final riddle
    function pickTier(t: "easy" | "med" | "hard") {
      return nonFinal.find((r) => r.tier === t) ?? null;
    }

    const easy = pickTier("easy");
    const med = pickTier("med");
    const hard = pickTier("hard");

    for (const x of [easy, med, hard]) {
      if (x && !result.find((r) => r.id === x.id)) result.push(x);
    }

    // Fill up to 3 choices if needed
    for (const r of nonFinal) {
      if (result.length >= 3) break;
      if (!result.find((x) => x.id === r.id)) result.push(r);
    }

    return result.slice(0, 3);
  }, [riddles, completedRiddleIds, skippedRiddleIds, timeInfo.msLeft]);

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
        <div className="backdrop-blur-sm bg-steel-blue-50/30 px-4 pt-4 pb-6 rounded-2xl">
          <span className="text-sm text-steel-blue-950">{game ? fmt(timeInfo.msLeft) : "—"}</span>

          <h2 className="text-xl font-semibold text-steel-blue-950">Available riddles</h2>
          <div className="mt-3 space-y-3">
            {available.map((r) => (
              <Link
                key={r.id}
                href={timeInfo.locked ? "#" : `/riddles/${r.id}`}
                className={` rounded-2xl border-double border-6 border-steel-blue-900 p-3 shadow-sm bg-steel-blue-950 flex justify-between items-center ${
                  timeInfo.locked ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex items-center mt-1 gap-2">
                  <PuzzlePieceIcon className="size-16 text-steel-blue-300 -mt-2" />
                  <div>
                    <div className="text-2xl font-semibold text-steel-blue-50">
                      Riddle +{r.points_solve}
                      </div>
                    <div className="flex items-center justify-between">
                      
                      <div className="text-sm font-semibold text-steel-blue-300">
                        Challenge: +{r.points_challenge}
                      </div>
                    </div>
                  </div>
                </div>
                
                <ArrowRightCircleIcon className="size-12 text-steel-blue-900 mt-2" />
              </Link>
            ))}
            {!available.length && (
              <div className="text-sm text-steel-blue-950 mt-4">
                No riddles left — head to the finale.
              </div>
            )}
          </div>
        </div>
      <div className="pt-8">
        <div className="backdrop-blur-sm bg-steel-blue-50/30 px-4 pt-4 pb-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-steel-blue-950">Completed riddles</h2>
          <div className="mt-3 space-y-3">
            {riddles.filter((r) => completedRiddleIds.has(r.id)).map((r) => (
              <div
                key={r.id}
                className="block rounded-2xl  shadow-sm bg-steel-blue-950 border-double border-10 border-steel-blue-900"
              >
                <img src={r.pub_image_url}  alt={r.pub_name} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="relative flex flex-row justify-center rounded-2xl gap-1 bg-white overflow-hidden -mt-5 mx-20">
                  <a 
                    className="text-sm text-steel-blue-950 flex items-center "
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.maps_query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                     <MapPinIcon className="size-10 text-steel-blue-950 rounded-full block pointer-events-none" />
                  </a>
                  <div className="relative size-11">
                    <StarIcon className="size-11 text-yellow-500 block pointer-events-none" />
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none"> 
                      <span className="mt-0.5 pointer-none text-steel-blue-50 font-semibold">
                      {submissionsMap.get(r.id)?.points_awarded ?? 0}
                      </span> 
                    </span> 
                  </div>
                  <div className="text-sm text-steel-blue-950 flex items-center ">
                    <CheckCircleIcon  className="size-10 text-green-600 rounded-full block pointer-events-none" />
                  </div>
                </div>
                <div className="p-4 mx-auto">
                  <div className="text-xl text-center text-steel-blue-50">
                    {r.pub_name} - "The {r.animal}"
                  </div>
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
