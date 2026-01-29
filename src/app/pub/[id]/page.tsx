"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { StarIcon } from "@heroicons/react/24/solid";
import Popup from "reactjs-popup";

type Riddle = {
  id: string;
  pub_name: string;
  maps_query: string;
  challenge_text: string;
  accepted_answers: string[];
  pub_image_url: string;
  points_photo: number;
  points_challenge: number;
  points_solve: number;
};

export default function PubRevealPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const riddleId = params.id;

  const [riddle, setRiddle] = useState<Riddle | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("riddles")
        .select(
          "id, pub_name, maps_query, challenge_text, accepted_answers, points_photo, points_challenge, points_solve, pub_image_url"
        )
        .eq("id", riddleId)
        .maybeSingle();

      setRiddle(data as any);
    })();
  }, [riddleId]);

  const mapsUrl = useMemo(() => {
    if (!riddle) return "#";
    return `${riddle.maps_query}`;
  }, [riddle]);

  if (!riddle) {
    return (
      <main className="min-h-screen p-6 max-w-xl mx-auto">
        <div className="text-sm text-gray-600">Loading…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-xl mx-auto flex items-end">
      
      <div>
         <Popup modal trigger={<button className="text-sm font-bold text-steel-blue-950 bg-steel-blue-50/40 px-2 py-1 rounded" onClick={() => router.push("/game")}>
        Cancel
      </button>} position="top left">
          {/* @ts-ignore */}
          {(close: () => void): React.ReactNode => (
            <div className="rounded-xl p-2">
              <p>
                If you cancel this riddle, you won't be able to submit proof and you will forfeit the points.
              </p>
             
              <button
                className="w-full mt-4 block rounded-xl bg-steel-blue-950 text-white p-4 text-center font-semibold"
                 onClick={() => router.push("/game")}
              >
                Yes
              </button>
              <button
                className="mt-2 w-full rounded-xl border-double border-4 border-steel-blue-950  p-4 font-semibold"
                onClick={close}
              >
                No
              </button>
            </div>
          )}
        </Popup>

      <div className="text-steel-blue-950 mt-4 rounded-2xl border-steel-blue-950 p-5  backdrop-blur-sm bg-steel-blue-50/40 shadow-sm">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 size-16">
          <StarIcon className="size-16 text-yellow-500 block pointer-events-none" />
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none"> 
            <span className="mt-1 pointer-none text-steel-blue-50 font-semibold text-center">
            +{riddle.points_solve ?? 0}
            </span> 
          </span> 
        </div>
        <div className="text-sm uppercase tracking-wide text-steel-blue-900">Next stop</div>
        <h1 className="mt-2 text-3xl text-steel-blue-950 font-bold">{riddle.pub_name}</h1>
        <img src={riddle.pub_image_url} alt={riddle.pub_name} className="mt-4 w-full h-48 object-cover rounded-xl border-double border-4 border-steel-blue-950" />

        <a
          className="mt-4 block rounded-xl bg-steel-blue-950 text-white p-4 text-center font-semibold"
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open directions
        </a>

        <div className="mt-4 rounded-xl border-double border-4 border-steel-blue-950  p-4 mb-16">
          <div className="text-sm font-semibold">Challenge (+ {riddle.points_challenge} Points)</div>
          <div className="mt-1 text-md text-steel-blue-950">{riddle.challenge_text}</div>
        </div>


        <button
          className="mt-4 w-full rounded-xl border-double border-4 border-steel-blue-950  p-4 font-semibold"
          onClick={() => router.push(`/proof/${riddle.id}`)}
        >
          Upload photo 
        </button>
      </div>
      </div>
    </main>
  );
}
