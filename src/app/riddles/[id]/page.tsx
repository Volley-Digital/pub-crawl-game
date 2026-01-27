"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { loadSession } from "@/lib//session";

type Riddle = {
  id: string;
  game_id: string;
  question: string;
  accepted_answers: string[];
  points_solve: number;
};

function norm(s: string) {
  return s.trim().toLowerCase();
}

export default function RiddlePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const riddleId = params.id;

  const [riddle, setRiddle] = useState<Riddle | null>(null);
  const [answer, setAnswer] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (!s) router.push("/");
  }, [router]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("riddles")
        .select("id, game_id, question, accepted_answers, points_solve")
        .eq("id", riddleId)
        .maybeSingle();

      setRiddle(data as any);
    })();
  }, [riddleId]);

  async function upsertSubmission(payload: any) {
    const s = loadSession();
    if (!s || !riddle) return;

    await supabase
      .from("submissions")
      .upsert(
        {
          game_id: s.gameId,
          team_id: s.teamId,
          riddle_id: riddle.id,
          ...payload,
        },
        { onConflict: "team_id,riddle_id" }
      );
  }

  async function submit() {
    setLoading(true);
    setErr(null);

    const s = loadSession();
    if (!s || !riddle) return;

    const a = norm(answer);
    const accepted = new Set((riddle.accepted_answers ?? []).map(norm));
    const correct = accepted.has(a);

    if (!correct) {
      setErr("Nope. Try again or skip.");
      setLoading(false);
      return;
    }

    // Correct answer: award solve points immediately
    await upsertSubmission({
      answered_correct: true,
      used_skip: false,
      status: "revealed",
      points_awarded: riddle.points_solve,
    });

    router.push(`/pub/${riddle.id}`);
  }

  async function skip() {
    setLoading(true);
    setErr(null);

    if (!riddle) return;

    // Skip: reveal pub but no solve points (they can earn photo points later)
    await upsertSubmission({
      answered_correct: false,
      used_skip: true,
      status: "revealed",
      points_awarded: 0,
    });

    router.push(`/pub/${riddle.id}`);
  }

  if (!riddle) {
    return (
      <main className="min-h-screen p-6 max-w-xl mx-auto">
        <div className="text-sm text-gray-600">Loading…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-end p-6 max-w-xl mx-auto">
      <div>
        <button className="text-sm font-bold text-steel-blue-950 bg-steel-blue-50/40 px-2 py-1 rounded" onClick={() => router.push("/game")}>
          Back
        </button>

        <div className="mt-4 rounded-2xl text-steel-blue-950 p-5 backdrop-blur-sm bg-steel-blue-50/40 shadow-sm">
          <div className="text-sm uppercase tracking-wide text-steel-blue-900">Riddle</div>
          <h1 className="mt-2 text-3xl font-bold text-steel-blue-950">{riddle.question}</h1>

          <div className="mt-5">
            <label className="text-sm font-medium text-steel-blue-950">Answer (animal)</label>
            <input
              className="mt-1 w-full rounded-xl border-double border-4 border-steel-blue-950 p-3 text-lg"
              placeholder="Choose your answer here"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              className="rounded-xl bg-steel-blue-950 text-white p-4 font-semibold disabled:opacity-50 "
              onClick={submit}
              disabled={loading}
            >
              Submit
            </button>
            <button
              className="rounded-xl border-double border-4 border-steel-blue-950 p-4 font-semibold disabled:opacity-50"
              onClick={skip}
              disabled={loading}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
