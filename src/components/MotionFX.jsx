import { useEffect, useRef, useState } from "react";
import { HeartIcon } from "./Icons";
import { usePlayer } from "../context/PlayerContext";
function LikeBurstLayer() {
  const { likedIds } = usePlayer();
  const prev = useRef(new Set(likedIds));
  const [bursts, setBursts] = useState([]);
  const seq = useRef(0);
  useEffect(() => {
    const before = prev.current;
    let added = false;
    likedIds.forEach((id) => {
      if (!before.has(id)) added = true;
    });
    prev.current = new Set(likedIds);
    if (!added) return;
    const btn = document.querySelector(".player-bar .like-btn");
    const rect = btn?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : 120;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight - 48;
    const next = Array.from({ length: 7 }, (_, i) => {
      seq.current += 1;
      const spread = (i - 3) * 18;
      return {
        id: seq.current,
        x: originX,
        y: originY,
        dx: spread + (Math.random() * 8 - 4),
        dy: -(48 + Math.random() * 36 + Math.abs(spread) * 0.15),
        size: 10 + i % 3 * 2,
        delay: i * 0.03
      };
    });
    setBursts((b) => [...b, ...next]);
    const clear = window.setTimeout(() => {
      setBursts((b) => b.filter((p) => !next.some((n) => n.id === p.id)));
    }, 750);
    return () => window.clearTimeout(clear);
  }, [likedIds]);
  if (!bursts.length) return null;
  return <div className="like-burst-layer" aria-hidden>
      {bursts.map((p) => <span
    key={p.id}
    className="like-burst-heart"
    style={{
      left: p.x,
      top: p.y,
      width: p.size,
      height: p.size,
      ["--dx"]: `${p.dx}px`,
      ["--dy"]: `${p.dy}px`,
      animationDelay: `${p.delay}s`
    }}
  >
          <HeartIcon size={p.size} />
        </span>)}
    </div>;
}
function CursorSpotlight({ targetSelector = ".main-column" }) {
  useEffect(() => {
    const el = document.querySelector(targetSelector);
    if (!el) return;
    el.classList.add("has-spotlight");
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
      el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.classList.remove("has-spotlight");
    };
  }, [targetSelector]);
  return null;
}
function SpectrumBars({ active }) {
  return <div className={`spectrum ${active ? "on" : ""}`} aria-hidden>
      {Array.from({ length: 6 }, (_, i) => <i key={i} style={{ ["--bi"]: i }} />)}
    </div>;
}
export {
  CursorSpotlight,
  LikeBurstLayer,
  SpectrumBars
};
