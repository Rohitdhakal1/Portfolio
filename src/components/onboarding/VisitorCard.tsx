import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LibraryCard } from './LibraryCard';
import { CardColorPicker } from './CardColorPicker';
import { WalletTransition } from './WalletTransition';
import type { CardColor, VisitorCard as IVisitorCard } from '../../lib/visitor';
import { generateVisitorName } from '../../lib/visitor-name';
import { rippleColor, dissolveText, setTextPlain } from '../../lib/card-transitions';
import { playSunrise } from '../../lib/sunrise-sound';
import { submitCard } from '../../lib/visitor';
import { primeAudio as primeWalletAudio } from '../../lib/wallet-sound';

interface Props {
  nextNumber: number;
  edit?: boolean;
  existingName?: string;
  startColor?: CardColor;
  existingSignature?: string | null;
  fromGallery?: boolean;
}

const SUNRISE_MS = 1100;

export const VisitorCard: React.FC<Props> = ({
  nextNumber,
  edit = false,
  existingName,
  startColor = 'pink',
  existingSignature,
  fromGallery = false,
}) => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const cardNameRef = useRef<HTMLElement>(null);
  const shuffleBtnRef = useRef<HTMLButtonElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const [name, setName] = useState(existingName ?? '');
  const [color, setColor] = useState<CardColor>(startColor);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [hasInk, setHasInk] = useState(false);
  const [sigDirty, setSigDirty] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);

  // Initialize seed name on mount if none provided
  const [seed] = useState(() => (edit && existingName) ? existingName : generateVisitorName());

  useEffect(() => {
    if (!name && !edit) {
      setName(seed);
    }
  }, [name, seed, edit]);

  // Handle Sunrise
  useEffect(() => {
    let armed = false;
    try {
      armed = sessionStorage.getItem("sunrise:armed") === "1";
      if (armed) sessionStorage.removeItem("sunrise:armed");
    } catch { }

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (armed && !edit) {
      window.setTimeout(() => {
        document.documentElement.removeAttribute("data-sunrise-play");
      }, 800);
    }

    if (armed && !reducedMotion && !edit) {
      let played = false;
      const tryPlay = () => {
        if (played) return;
        if (playSunrise()) {
          played = true;
          window.removeEventListener("pointerdown", tryPlay);
          window.removeEventListener("keydown", tryPlay);
        }
      };
      tryPlay();
      if (!played) {
        window.addEventListener("pointerdown", tryPlay);
        window.addEventListener("keydown", tryPlay);
      }
    }
  }, [edit]);

  const buildReverseDisc = (cx: number, cy: number) => {
    const d = document.createElement("div");
    d.setAttribute("aria-hidden", "true");
    d.setAttribute("data-sunrise-disc", "");
    d.style.cssText = [
      "position:fixed",
      "left:" + cx + "px",
      "top:" + cy + "px",
      "width:260vmax",
      "height:260vmax",
      "margin-left:-130vmax",
      "margin-top:-130vmax",
      "background:var(--color-bg)",
      "border-radius:50%",
      "z-index:9999",
      "pointer-events:none",
      "transform-origin:center center",
      "transform:scale(1)",
      "will-change:transform",
    ].join(";");
    return d;
  };

  const handleBack = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (edit || fromGallery) {
      navigate("/");
      return;
    }

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      navigate("/");
      return;
    }

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    try {
      const raw = sessionStorage.getItem("sunrise:origin");
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.x === "number" && typeof p.y === "number") {
          cx = p.x;
          cy = p.y;
        }
      }
    } catch { }

    document.documentElement.setAttribute("data-sunrise-play", "");
    const disc = buildReverseDisc(cx, cy);
    document.documentElement.appendChild(disc);

    navigate("/");

    const shrink = disc.animate(
      [{ transform: "scale(1)" }, { transform: "scale(0.01)" }],
      { duration: SUNRISE_MS, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }
    );
    try {
      await shrink.finished;
    } catch { }
    disc.remove();
    document.documentElement.removeAttribute("data-sunrise-play");
  };

  const handleShuffle = () => {
    const v = generateVisitorName();
    setName(v);
    if (cardNameRef.current) {
      dissolveText(cardNameRef.current, v);
    }

    if (shuffleBtnRef.current) {
      shuffleBtnRef.current.setAttribute("data-spinning", "");
      window.setTimeout(() => shuffleBtnRef.current?.removeAttribute("data-spinning"), 520);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const v = val.trim() || generateVisitorName();
    if (cardNameRef.current) {
      setTextPlain(cardNameRef.current, v);
    }
  };

  const handleColorChange = (newColor: CardColor, e: React.ChangeEvent<HTMLInputElement>) => {
    const cardEl = document.getElementById("library-card");
    if (!cardEl) return;

    let origin = { x: 0.5, y: 0.5 };
    const swatch = e.target.closest("label");
    const cardRect = cardEl.getBoundingClientRect();
    if (swatch) {
      const sRect = swatch.getBoundingClientRect();
      const ox = (sRect.left + sRect.width / 2 - cardRect.left) / cardRect.width;
      const oy = (sRect.top + sRect.height / 2 - cardRect.top) / cardRect.height;
      origin = { x: ox, y: oy };
    }

    rippleColor(cardEl, newColor, origin);
    setColor(newColor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrorMsg('');
    primeWalletAudio();

    try {
      const finalName = name.trim() || seed;

      let finalSignature: string | null = null;
      if (!sigDirty && existingSignature) {
        finalSignature = existingSignature;
      } else if (hasInk) {
        const pad = document.querySelector<HTMLCanvasElement>("#library-card [data-signature-pad]");
        if (pad && pad.width && pad.height) {
          try {
            finalSignature = pad.toDataURL("image/png");
          } catch {
            finalSignature = null;
          }
        }
      }

      const issued = await submitCard({ name: finalName, color, signature: finalSignature });

      if (edit) {
        navigate("/");
        return;
      }

      const event = new CustomEvent<IVisitorCard>("wallet:play", { detail: issued });
      window.dispatchEvent(event);
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center px-4 sm:px-6 py-6 overflow-hidden onboarding-section">
      <div aria-hidden="true" data-sunrise className="sunrise absolute rounded-full bg-[var(--color-bg)] pointer-events-none"></div>

      <a
        href="#"
        onClick={handleBack}
        data-back-link
        aria-label="Back to welcome"
        className="group absolute top-3 left-3 sm:top-5 sm:left-5 z-10 flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] opacity-0 [animation:fade-in_0.4s_var(--ease-out-soft)_0.2s_forwards] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-soft)] group-hover:-translate-x-0.5">
          <path d="M19 12H5"></path>
          <path d="M12 19l-7-7 7-7"></path>
        </svg>
        Back
      </a>

      <div className="group absolute top-3 right-3 z-10 flex items-center gap-1.5 p-2 opacity-0 [animation:fade-in_0.4s_var(--ease-out-soft)_0.2s_forwards]">
        <span className="hidden sm:inline overflow-hidden max-w-0 group-hover:max-w-[480px] transition-all duration-300 ease-[var(--ease-out-soft)] whitespace-nowrap font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)] leading-none">
          INSPIRED BY <a href="https://x.com/joshpuckett" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-ink)] transition-colors">@JOSHPUCKETT</a>'S ONBOARDING FOR <a href="https://interfacecraft.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-ink)] transition-colors">INTERFACECRAFT.DEV</a>&nbsp;
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[var(--color-ink-dim)]">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </div>

      <form
        id="visitor-form"
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        className="relative w-full max-w-[512px] flex flex-col items-center gap-8 sm:gap-10 text-[var(--color-ink)] my-auto"
      >
        <header className="font-[family-name:var(--font-mono)] text-sm sm:text-base uppercase text-center w-full leading-none">
          {edit ? (
            <>
              <p className="text-[var(--color-ink)]">Edit your card.</p>
              <p className="text-[var(--color-ink-dim)] mt-2">change anything you like.</p>
            </>
          ) : (
            <>
              <p className="text-[var(--color-ink)]">Welcome, visitor.</p>
              <p className="text-[var(--color-ink-dim)] mt-2">i hope you enjoy your time here.</p>
            </>
          )}
        </header>

        <div className="flex items-center gap-3 sm:gap-6 w-full">
          <label htmlFor="visitor-name" className="font-[family-name:var(--font-mono)] text-sm sm:text-base uppercase whitespace-nowrap">
            Name:
          </label>
          <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3">
            <input
              id="visitor-name"
              name="name"
              type="text"
              required
              autoComplete="off"
              spellCheck="false"
              maxLength={40}
              value={name}
              onChange={handleNameChange}
              className="flex-1 min-w-0 bg-[var(--color-bg-white)] rounded-[12px] px-3 py-2.5 font-[family-name:var(--font-mono)] text-sm sm:text-base uppercase text-[var(--color-ink-dim)] focus:text-[var(--color-ink)] outline-none border border-transparent focus:border-[var(--color-bg-neutral-2)] transition-colors"
            />
            <button
              type="button"
              ref={shuffleBtnRef}
              onClick={handleShuffle}
              aria-label="Shuffle name"
              className="shuffle-btn bg-[var(--color-bg-neutral)] rounded-[8px] px-2 py-1.5 text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
            </button>
          </div>
        </div>

        <p className="sm:hidden font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-dim)] text-center">
          Draw on the card to sign it
        </p>

        <div className="onboarding-card-scale">
          <LibraryCard
            name={name || seed || "flower dreamer"}
            color={color}
            number={nextNumber}
            signable
            existingSignature={edit ? existingSignature : undefined}
            tool={tool}
            clearTrigger={clearTrigger}
            onInkChange={(h, d) => {
              setHasInk(h);
              if (d) setSigDirty(true);
            }}
          />
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <CardColorPicker selected={color} onChange={handleColorChange} />

          <div role="radiogroup" aria-label="Drawing tool" className="flex items-center gap-1 bg-[var(--color-bg-neutral)] rounded-[8px] p-1">
            <button
              type="button"
              onClick={() => setTool('pen')}
              aria-label="Pen"
              aria-pressed={tool === 'pen'}
              data-active={tool === 'pen' ? "" : undefined}
              className="w-7 h-7 rounded-[6px] grid place-items-center text-[var(--color-ink-dim)] transition-colors data-[active]:bg-[var(--color-bg-white)] data-[active]:text-[var(--color-ink)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setTool('eraser')}
              aria-label="Eraser"
              aria-pressed={tool === 'eraser'}
              data-active={tool === 'eraser' ? "" : undefined}
              className="w-7 h-7 rounded-[6px] grid place-items-center text-[var(--color-ink-dim)] transition-colors data-[active]:bg-[var(--color-bg-white)] data-[active]:text-[var(--color-ink)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 20H7l-4-4 12-12 8 8-8 8"></path>
                <path d="M14 4l8 8"></path>
              </svg>
            </button>
          </div>

          {/* Clear signature button — only shown when there's ink */}
          {hasInk && (
            <button
              type="button"
              onClick={() => setClearTrigger(t => t + 1)}
              aria-label="Clear signature"
              className="btn-springy font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-[8px] bg-[var(--color-bg-neutral)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors"
            >
              clear
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="submit"
            ref={submitBtnRef}
            disabled={submitting}
            className="btn-springy font-[family-name:var(--font-mono)] inline-flex items-center justify-center px-5 py-3 rounded-[14px] bg-[var(--color-ink)] text-[var(--color-ink-inverted)] text-[15px] uppercase leading-none whitespace-nowrap disabled:opacity-60"
          >
            {edit ? "save →" : "enter →"}
          </button>
          {!edit && (
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-small)] text-[var(--color-ink-mute)] tracking-[0.02em] text-center leading-[var(--text-body--line-height)]">
              Your card will appear in the visitor gallery after review.
            </p>
          )}
          <p
            data-submit-error
            className={`font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-pink)] transition-opacity duration-200 ${errorMsg ? 'opacity-100' : 'opacity-0'}`}
            aria-live="polite"
          >
            {errorMsg}
          </p>
        </div>
      </form>

      <WalletTransition />

      <style>{`
        @keyframes fade-in { to { opacity: 1; } }
        .onboarding-card-scale {
          --card-w: 388px;
          --card-h: 252px;
          --card-scale: 1;
          position: relative;
          width: calc(var(--card-w) * var(--card-scale));
          height: calc(var(--card-h) * var(--card-scale));
          overflow: hidden;
        }
        .onboarding-card-scale > :first-child {
          position: absolute;
          top: 0;
          left: 0;
          transform: scale(var(--card-scale));
          transform-origin: top left;
        }
        @media (max-width: 480px) { .onboarding-card-scale { --card-scale: 0.88; } }
        @media (max-width: 419px) { .onboarding-card-scale { --card-scale: 0.78; } }
        @media (max-width: 360px) { .onboarding-card-scale { --card-scale: 0.68; } }
        
        .sunrise {
          left: 50vw;
          top: 50vh;
          width: 220vmax;
          height: 220vmax;
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        
        html[data-sunrise-play], html[data-sunrise-play] body {
          background: var(--color-bg);
        }
        
        @media (max-width: 639px) {
          html, body { background: var(--color-bg) !important; }
        }
        
        html[data-sunrise-play] #visitor-form {
          opacity: 0;
          animation: fade-in 0.4s var(--ease-out-soft) forwards;
        }
        
        .shuffle-btn svg { transition: transform 0.18s var(--ease-out-soft); }
        .shuffle-btn[data-spinning] svg { animation: shuffle-btn-spin 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes shuffle-btn-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};
