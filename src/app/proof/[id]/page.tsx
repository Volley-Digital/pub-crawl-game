// app/proof/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { loadSession } from "@/lib/session";
import { compressToJpeg } from "@/lib/image";
import { friendlyUploadError, uploadToPublicBucket, UploadStage } from "@/lib/upload";
import { CameraIcon } from "@heroicons/react/16/solid";

type Riddle = {
  id: string;
  game_id: string;
  pub_name: string;
  points_photo: number;
  points_challenge: number;
};

type Submission = {
  id: string;
  points_awarded: number;
  status: "revealed" | "proved";
  photo_url: string | null;
  went_to_location: boolean | null;
  challenge_completed: boolean | null;

};

function stagePercent(stage: UploadStage) {
  switch (stage) {
    case "idle":
      return 0;
    case "processing":
      return 25;
    case "uploading":
      return 70;
    case "saving":
      return 90;
    case "done":
      return 100;
    case "error":
      return 0;
  }
}

export default function ProofPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const riddleId = params.id;

  const session = useMemo(() => loadSession(), []);
  const [riddle, setRiddle] = useState<Riddle | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<UploadStage>("idle");
  const [attempt, setAttempt] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);
  console.log(submission);
  useEffect(() => {
    if (!session) router.push("/");
  }, [session, router]);

  useEffect(() => {
    if (!session) return;

    (async () => {
      // Load riddle
      const { data: r, error: rErr } = await supabase
        .from("riddles")
        .select("id, game_id, pub_name, points_photo, points_challenge")
        .eq("id", riddleId)
        .maybeSingle();

      if (rErr || !r) {
        setError("Couldn’t load this stop. Go back and try again.");
        return;
      }
      setRiddle(r as any);

      // Ensure a submission exists (revealed state). This makes the proof page usable even if someone deep-links here.
      const { data: up, error: upErr } = await supabase
        .from("submissions")
        .upsert(
          {
            game_id: (r as any).game_id,
            team_id: session.teamId,
            riddle_id: riddleId,
            status: "revealed",
            // Do not set points_awarded to preserve the existing value in the database
          },
          { onConflict: "team_id,riddle_id" }
        )
        .select("id, points_awarded, status, photo_url, went_to_location, challenge_completed")
        .maybeSingle();

        if (upErr) {
          console.error("SUBMISSIONS UPSERT ERROR:", upErr);
          setError(`Submission upsert failed: ${upErr.message}`);
          return;
        }

      // If upsert didn't return row in some configs, fetch it:
      if (!up) {
        const { data: s } = await supabase
          .from("submissions")
          .select("id, points_awarded, status, photo_url")
          .eq("team_id", session.teamId)
          .eq("riddle_id", riddleId)
          .maybeSingle();
        setSubmission(s as any);
      } else {
        setSubmission(up as any);
      }
    })();
  }, [riddleId, session]);

  const percent = stagePercent(stage);

  async function onSubmit() {
    setError("");
    setMessage("");
    setAttempt(0);

    if (!session || !riddle || !submission) return;

    if (submission.status === "proved" && submission.photo_url) {
      setMessage("Already proved ✅");
      return;
    }

    if (!file) {
      setError("Choose a photo first.");
      return;
    }

    try {
      setStage("processing");
      setMessage("Resizing & compressing…");

      // Compress & convert to JPEG (bulletproof for uploads)
      const jpegBlob = await compressToJpeg(file, { maxDim: 1600, quality: 0.78 });

      setStage("uploading");
      setMessage("Uploading…");

      const path = `${riddle.game_id}/${session.teamId}/${riddle.id}-${Date.now()}.jpg`;

      const publicUrl = await uploadToPublicBucket({
        bucket: "proofs",
        path,
        blob: jpegBlob,
        onAttempt: (n) => {
          setAttempt(n);
          if (n > 1) setMessage(`Upload retry ${n}/3…`);
        },
      });

      setStage("saving");
      setMessage("Saving proof…");

      // Add points for proof + challenge completion (honour system: if they uploaded, they did it)
      const addPoints = (riddle.points_photo ?? 1) + (challengeCompleted ? (riddle.points_challenge ?? 1) : 0);

      const { error: saveErr } = await supabase
        .from("submissions")
        .update({
          status: "proved",
          photo_url: publicUrl,
          points_awarded: (submission.points_awarded ?? 0) + addPoints,
          went_to_location: true, // Set to true if photo is uploaded
          challenge_completed: challengeCompleted, // Set based on checkbox state
        })
        .eq("id", submission.id);

      if (saveErr) throw saveErr;

      setStage("done");
      setMessage(`Proof submitted ✅ (+${addPoints} points)`);

      // Go back to game after a tiny beat
      setTimeout(() => router.push("/game"), 500);
    } catch (e: any) {
      setStage("error");
      setError(friendlyUploadError(e));
    }
  }

  return (
    <main className="min-h-screen p-6 max-w-xl flex items-end mx-auto">
      
      <div>
        <button className="text-sm font-bold text-steel-blue-950 bg-steel-blue-50/40 px-2 py-1 rounded" onClick={() => router.push(`/pub/${riddle.id}`)}>
          Back
        </button>
      <div className="mt-4 rounded-2xl  p-5 backdrop-blur-sm bg-steel-blue-50/40 shadow-sm">
        <h1 className="text-2xl font-bold text-steel-blue-950">Upload Proof</h1>

        <p className="text-sm text-steel-blue-950 mt-1">
          {riddle ? (
            <>
              Stop: <span className="font-semibold text-steel-blue-950">{riddle.pub_name}</span>
            </>
          ) : (
            "Loading…"
          )}
        </p>

        <div className="mt-4 text-steel-blue-950">
          <label htmlFor="camera" className="text-sm font-medium text-steel-blue-950 flex flex-col items-center gap-1 border-2 border-dashed border-steel-blue-950 rounded-lg p-4 cursor-pointer hover:bg-steel-blue-50">
              <CameraIcon className="w-6 h-6 text-steel-blue-950" />
              {file ? (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border-4 border-double border-steel-blue-950"
                  />
                  <p className="mt-2 text-sm text-steel-blue-950">{file.name}</p>
                </div>
              ) : (
                "Upload file"
              )}
          </label>


          <input
            className="mt-2 block w-full hidden"
            type="file"
            id="camera"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="mt-2 text-xs text-steel-blue-950">
            Tip: Slow internet? Screenshots upload fastest. We’ll auto-resize & compress.
          </p>
        </div>

        <div className="mt-4 text-steel-blue-950">
          <label className="flex items-center text-md font-semibold">
            <input
              type="checkbox"
              className="mr-2 size-4"
              checked={challengeCompleted}
              onChange={(e) => setChallengeCompleted(e.target.checked)}
            />
            We completed the challenge
          </label>
        </div>

        {/* Progress UI */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-steel-blue-950">
            <span>
              Status: <span className="font-semibold">{stage}</span>
            </span>
            <span>{attempt ? `Attempt ${attempt}/3` : ""}</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-2 bg-black transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          {message && <div className="mt-2 text-sm text-steel-blue-950">{message}</div>}
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </div>

        <button
          className="mt-5 w-full rounded-xl bg-steel-blue-950 text-white p-4 font-semibold disabled:opacity-50"
          onClick={onSubmit}
          disabled={!file || stage === "processing" || stage === "uploading" || stage === "saving"}
        >
          Submit proof
        </button>

        <button
          className="mt-3 w-full rounded-xl border-double border-4 border-steel-blue-950 p-4 font-semibold"
          onClick={() => {
            setFile(null);
            setStage("idle");
            setAttempt(0);
            setMessage("");
            setError("");
          }}
        >
          Reset
        </button>
      </div>
      </div>
    </main>
  );
}
