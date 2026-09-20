import React, { useEffect, useRef, useState } from 'react';

interface Props {
  existingSignature?: string | null;
  tool: 'pen' | 'eraser';
  onInkChange?: (hasInk: boolean, dirty: boolean) => void;
  clearTrigger?: number; // Increment to trigger clear
  cardColor: string;
}

const PEN_WIDTH = 2;
const ERASER_WIDTH = 28;
const SIG_MIN_DPR = 3;

export const SignaturePad: React.FC<Props> = ({ existingSignature, tool, onInkChange, clearTrigger, cardColor }) => {
  const padRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [hasInk, setHasInk] = useState(false);
  const [dirty, setDirty] = useState(false);
  const drawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const activePointersRef = useRef(new Set<number>());

  useEffect(() => {
    if (onInkChange) {
      onInkChange(hasInk, dirty);
    }
  }, [hasInk, dirty, onInkChange]);

  const checkHasInk = () => {
    const pad = padRef.current;
    if (!pad) return;
    const ctx = pad.getContext('2d');
    if (!ctx) return;
    try {
      const data = ctx.getImageData(0, 0, pad.width, pad.height).data;
      for (let i = 3; i < data.length; i += 4 * 16) {
        if (data[i] !== 0) {
          setHasInk(true);
          return;
        }
      }
      setHasInk(false);
    } catch {}
  };

  const currentStroke = () => {
    if (!wrapRef.current) return '#ffffff';
    const val = getComputedStyle(wrapRef.current).getPropertyValue('--pen-stroke').trim();
    return val || '#ffffff';
  };

  // Read the card's actual background color for the eraser to paint over with
  const currentCardBg = () => {
    if (!wrapRef.current) return 'transparent';
    // Walk up to the .library-card element to read its computed background
    let el: HTMLElement | null = wrapRef.current;
    while (el && !el.classList.contains('library-card')) el = el.parentElement;
    if (!el) return 'transparent';
    return getComputedStyle(el).backgroundColor || 'transparent';
  };

  const resolveRgb = (color: string): [number, number, number] | null => {
    const probe = document.createElement('span');
    probe.style.color = color;
    probe.style.display = 'none';
    document.body.appendChild(probe);
    const rgb = getComputedStyle(probe).color;
    document.body.removeChild(probe);
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return null;
    return [+m[1], +m[2], +m[3]];
  };

  // Re-tint ink when cardColor changes
  useEffect(() => {
    if (!hasInk) return;
    const pad = padRef.current;
    const ctx = pad?.getContext('2d');
    if (!pad || !ctx) return;
    const rgb = resolveRgb(currentStroke());
    if (!rgb) return;
    const [r, g, b] = rgb;
    const img = ctx.getImageData(0, 0, pad.width, pad.height);
    const px = img.data;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i + 3] > 0) {
        px[i] = r;
        px[i + 1] = g;
        px[i + 2] = b;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [cardColor, hasInk]); // Depend on cardColor to trigger retint

  // Initialization & Resize
  useEffect(() => {
    const pad = padRef.current;
    if (!pad) return;
    let dpr = Math.max(window.devicePixelRatio || 1, SIG_MIN_DPR);

    const size = () => {
      const r = pad.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const newDpr = Math.max(window.devicePixelRatio || 1, SIG_MIN_DPR);
      const newW = Math.round(r.width * newDpr);
      const newH = Math.round(r.height * newDpr);
      
      const ctx = pad.getContext('2d');
      if (!ctx) return;

      let snapshot: ImageData | null = null;
      if (pad.width > 0 && pad.height > 0 && hasInk) {
        try { snapshot = ctx.getImageData(0, 0, pad.width, pad.height); } catch {}
      }

      pad.width = newW;
      pad.height = newH;
      ctx.setTransform(newDpr, 0, 0, newDpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (snapshot) {
        ctx.putImageData(snapshot, 0, 0);
      }
    };

    size();
    const observer = new ResizeObserver(size);
    observer.observe(pad);

    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        size();
        const ctx = pad.getContext('2d');
        ctx?.drawImage(img, 0, 0, pad.width / dpr, pad.height / dpr);
        setHasInk(true);
      };
      img.src = existingSignature;
    }

    return () => observer.disconnect();
  }, [existingSignature]);

  const pos = (e: React.PointerEvent) => {
    const r = padRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const setPreview = (x: number, y: number, visible: boolean) => {
    const preview = previewRef.current;
    if (!preview) return;
    if (tool !== 'eraser') {
      preview.removeAttribute('data-active');
      return;
    }
    preview.style.width = `${ERASER_WIDTH}px`;
    preview.style.height = `${ERASER_WIDTH}px`;
    preview.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    if (visible) preview.setAttribute('data-active', '');
    else preview.removeAttribute('data-active');
  };

  const paintTo = (x: number, y: number) => {
    const pad = padRef.current;
    const ctx = pad?.getContext('2d');
    const last = lastPosRef.current;
    if (!pad || !ctx || !last) return;

    if (tool === 'eraser') {
      // Paint over with card background color so erasing reveals the card, not transparency
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentCardBg();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentStroke();
    }
    ctx.lineWidth = tool === 'eraser' ? ERASER_WIDTH : PEN_WIDTH;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (tool === 'pen') setHasInk(true);
    setDirty(true);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    activePointersRef.current.add(e.pointerId);
    if (activePointersRef.current.size > 1) {
      drawingRef.current = false;
      lastPosRef.current = null;
      return;
    }
    drawingRef.current = true;
    lastPosRef.current = pos(e);
    padRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (activePointersRef.current.size > 1) return;
    const p = pos(e);
    setPreview(p.x, p.y, tool === 'eraser');
    if (!drawingRef.current || !lastPosRef.current) {
      lastPosRef.current = p;
      return;
    }
    paintTo(p.x, p.y);
    lastPosRef.current = p;
  };

  const onPointerUpOrCancel = (e: React.PointerEvent) => {
    activePointersRef.current.delete(e.pointerId);
    drawingRef.current = false;
    lastPosRef.current = null;
    try { padRef.current?.releasePointerCapture(e.pointerId); } catch {}
    if (tool === 'eraser' && hasInk) checkHasInk();
  };

  const onPointerLeave = () => {
    drawingRef.current = false;
    lastPosRef.current = null;
    activePointersRef.current.clear();
    previewRef.current?.removeAttribute('data-active');
  };

  const onPointerEnter = (e: React.PointerEvent) => {
    const p = pos(e);
    setPreview(p.x, p.y, tool === 'eraser');
  };

  // Clear Logic
  useEffect(() => {
    if (clearTrigger && clearTrigger > 0) {
      const pad = padRef.current;
      const ctx = pad?.getContext('2d');
      const wrap = wrapRef.current;
      if (!pad || !ctx || !wrap) return;

      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      
      if (!reduced && hasInk) {
        const FADE_DURATION = 820;
        const overlay = document.createElement('canvas');
        overlay.width = pad.width;
        overlay.height = pad.height;
        overlay.style.cssText = `
          position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
          z-index: 5; opacity: 1; transform: scale(1); filter: blur(0px);
          transform-origin: 50% 50%;
          transition: opacity ${FADE_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform ${FADE_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
                      filter ${FADE_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform, filter;
        `;
        const oCtx = overlay.getContext('2d');
        oCtx?.drawImage(pad, 0, 0);
        wrap.appendChild(overlay);

        requestAnimationFrame(() => {
          overlay.style.opacity = '0';
          overlay.style.transform = 'scale(1.06)';
          overlay.style.filter = 'blur(6px)';
        });
        window.setTimeout(() => overlay.remove(), FADE_DURATION + 80);
      }

      ctx.clearRect(0, 0, pad.width, pad.height);
      ctx.globalCompositeOperation = 'source-over';
      drawingRef.current = false;
      lastPosRef.current = null;
      setHasInk(false);
      setDirty(true);
    }
  }, [clearTrigger]);

  return (
    <div
      ref={wrapRef}
      data-signature-wrap
      data-existing-signature={existingSignature ?? undefined}
      data-has-ink={hasInk ? "" : undefined}
      className="absolute inset-0"
    >
      <canvas
        ref={padRef}
        data-signature-pad
        data-cursor={tool}
        data-tool={tool}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpOrCancel}
        onPointerCancel={onPointerUpOrCancel}
        onPointerLeave={onPointerLeave}
        onPointerEnter={onPointerEnter}
      />

      <div
        ref={previewRef}
        data-eraser-preview
        aria-hidden="true"
        className="eraser-preview pointer-events-none absolute top-0 left-0 rounded-full border border-white/90 mix-blend-difference"
        style={{ display: tool === 'eraser' ? 'block' : 'none' }}
      />
    </div>
  );
};
