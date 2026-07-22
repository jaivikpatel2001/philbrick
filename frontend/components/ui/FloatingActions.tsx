"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { FiArrowUp, FiChevronDown, FiMessageSquare } from "react-icons/fi";
import { scrollToTop } from "@/components/providers/SmoothScroll";
import {
  TAWK_CLOSE_EVENT,
  TAWK_OPEN_EVENT,
  TAWK_READY_EVENT,
  closeTawk,
  isTawkReady,
  openTawk,
} from "@/components/providers/TawkTo";
import { SITE } from "@/constants/site";
import styles from "./FloatingActions.module.css";

/* =============================================================================
   FLOATING ACTION BUTTONS (bottom-right)

     • Scroll to top — appears once the visitor is past one viewport, and
       returns to the top through Lenis so the motion matches the site.
     • Chat — opens the Tawk.to window (components/providers/TawkTo). The
       button is draggable with a mouse or a finger and can be parked anywhere
       on screen; the offset lives in component state only, so a refresh puts
       it back at its default corner, as specified.

   Drag vs click: a pointer that travels less than DRAG_THRESHOLD px counts as
   a click, so dragging never opens the chat by accident and a plain tap always
   does. `touch-action: none` on the chat button keeps a touch drag from
   scrolling the page instead.

   If Tawk has not loaded (blocked, offline, or ids not configured) the button
   falls back to the client's WhatsApp chat rather than doing nothing.
   ========================================================================== */

const DRAG_THRESHOLD = 5;
/** Keep the button this far from the viewport edge while dragging. */
const EDGE_PADDING = 8;

/** useSyncExternalStore subscription for "the Tawk API finished loading". */
function subscribeTawk(onChange: () => void) {
  window.addEventListener(TAWK_READY_EVENT, onChange);
  return () => window.removeEventListener(TAWK_READY_EVENT, onChange);
}

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const chatRef = useRef<HTMLButtonElement>(null);
  /* Pointer bookkeeping kept in a ref: it changes every move event and must not
     trigger a re-render on its own. */
  const drag = useRef({ startX: 0, startY: 0, baseX: 0, baseY: 0, moved: false });

  /* Reveal the scroll-to-top button past one viewport height. */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Tawk may finish loading before or after this mounts, so subscribe to the
     ready event and read the current value, rather than assuming an order. */
  const tawkReady = useSyncExternalStore(subscribeTawk, isTawkReady, () => false);

  /* Tawk brings its own launcher back whenever the chat window opens, so this
     button steps aside while the chat is on screen. */
  useEffect(() => {
    const open = () => setChatOpen(true);
    const close = () => setChatOpen(false);
    window.addEventListener(TAWK_OPEN_EVENT, open);
    window.addEventListener(TAWK_CLOSE_EVENT, close);
    return () => {
      window.removeEventListener(TAWK_OPEN_EVENT, open);
      window.removeEventListener(TAWK_CLOSE_EVENT, close);
    };
  }, []);

  /** Keep a parked button on screen when the viewport changes size. */
  const clampToViewport = useCallback((next: { x: number; y: number }) => {
    const el = chatRef.current;
    if (!el) return next;
    const rect = el.getBoundingClientRect();
    /* rect already includes the current offset, so work out the untranslated
       box first and clamp the offset against that. */
    const baseLeft = rect.left - offset.x;
    const baseTop = rect.top - offset.y;
    const minX = EDGE_PADDING - baseLeft;
    const maxX = window.innerWidth - rect.width - EDGE_PADDING - baseLeft;
    const minY = EDGE_PADDING - baseTop;
    const maxY = window.innerHeight - rect.height - EDGE_PADDING - baseTop;
    return {
      x: Math.min(Math.max(next.x, minX), maxX),
      y: Math.min(Math.max(next.y, minY), maxY),
    };
  }, [offset.x, offset.y]);

  useEffect(() => {
    const onResize = () => setOffset((o) => clampToViewport(o));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampToViewport]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    /* Ignore secondary buttons so a right-click never starts a drag. */
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: offset.x,
      baseY: offset.y,
      moved: false,
    };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (!drag.current.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      drag.current.moved = true;
    }
    if (!drag.current.moved) return;
    setOffset(
      clampToViewport({ x: drag.current.baseX + dx, y: drag.current.baseY + dy })
    );
  };

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  const onChatClick = () => {
    /* A drag that ends over the button still fires click; swallow it. */
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    if (chatOpen) {
      closeTawk();
      return;
    }
    if (openTawk()) return;
    window.open(SITE.whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const chatLabel = chatOpen
    ? "Close the chat"
    : tawkReady
      ? "Open live chat. Drag to move this button."
      : "Chat with us on WhatsApp. Drag to move this button.";

  return (
    <div className={styles.dock}>
      <button
        type="button"
        className={`${styles.fab} ${styles.top} ${showTop ? styles.visible : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
      >
        <FiArrowUp aria-hidden />
      </button>

      <button
        ref={chatRef}
        type="button"
        className={`${styles.fab} ${styles.chat} ${dragging ? styles.dragging : ""} ${
          chatOpen ? styles.open : ""
        }`}
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={onChatClick}
        aria-label={chatLabel}
        aria-expanded={chatOpen}
        title={chatOpen ? "Close the chat" : "Chat with us"}
      >
        {/* The same circle in both states: a speech bubble to open, a chevron
            to close, cross-fading in place. Tawk's own launcher is hidden
            (styles/globals.css), so this is the only chat control on screen.

            A speech bubble, not the WhatsApp mark: this opens the Tawk.to live
            chat. WhatsApp is only the fallback when Tawk is unavailable, and
            the label says so. */}
        <span className={styles.icon} aria-hidden>
          <FiMessageSquare className={styles.iconOpen} />
          <FiChevronDown className={styles.iconClose} />
        </span>
        <span className={styles.pulse} aria-hidden />
      </button>
    </div>
  );
}
