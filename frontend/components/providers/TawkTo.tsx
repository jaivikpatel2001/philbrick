"use client";
import { useEffect } from "react";
import Script from "next/script";

/* =============================================================================
   TAWK.TO LIVE CHAT

   The client already runs Tawk.to on WordPress through the official plugin
   (tawkto-live-chat), configured with `always_display = 1`, so the widget is
   expected on every page. The plugin injects the standard embed snippet:

     https://embed.tawk.to/<property id>/<widget id>

   Those two ids come from the client's wp_options
   (`tawkto-embed-widget-page-id`, `tawkto-embed-widget-widget-id`). They are
   public embed identifiers, not secrets, and are overridable per deployment via
   NEXT_PUBLIC_TAWKTO_PROPERTY_ID / NEXT_PUBLIC_TAWKTO_WIDGET_ID.

   The site renders its own floating chat button (components/ui/FloatingActions)
   so the two buttons in the bottom-right corner stay a matched pair, so Tawk's
   own launcher is hidden as soon as the API is ready. `tawkReady` resolves for
   the button, and `openTawk()` maximizes the chat window.
   ========================================================================== */

const PROPERTY_ID =
  process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID || "6039cf23385de407571a9744";
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID || "1evgt29n1";

export const TAWK_SRC = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;

/** Event the widget fires on window once the Tawk API is usable. */
export const TAWK_READY_EVENT = "philbrick:tawk-ready";
/** Fires whenever the chat window opens or closes; detail is not used. */
export const TAWK_OPEN_EVENT = "philbrick:tawk-open";
export const TAWK_CLOSE_EVENT = "philbrick:tawk-close";

interface TawkApi {
  onLoad?: () => void;
  onChatMaximized?: () => void;
  onChatMinimized?: () => void;
  onChatHidden?: () => void;
  hideWidget?: () => void;
  showWidget?: () => void;
  maximize?: () => void;
  minimize?: () => void;
  toggle?: () => void;
  isChatMaximized?: () => boolean;
  isChatHidden?: () => boolean;
}

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
    __philbrickTawkReady?: boolean;
  }
}

/** True once the Tawk API has loaded and can be opened. */
export function isTawkReady() {
  return typeof window !== "undefined" && window.__philbrickTawkReady === true;
}

/**
 * Open the chat window. Returns false when Tawk is not available yet.
 *
 * `showWidget()` first, deliberately. Tawk is hidden once on load so its
 * launcher never flashes before the skinning runs, but leaving it flagged
 * hidden while the window is maximized puts Tawk in a state it does not expect
 * — and in that state `minimize()` can be ignored, which strands the visitor in
 * a chat window they cannot close. Restoring the widget before maximizing keeps
 * Tawk's own state machine consistent; the launcher stays invisible because
 * `skinTawk()` hides that iframe directly, not through Tawk's API.
 *
 * The open event is announced here rather than relying only on Tawk's
 * `onChatMaximized`, which does not fire for a programmatic `maximize()`.
 */
export function openTawk() {
  const api = typeof window !== "undefined" ? window.Tawk_API : undefined;
  if (!api?.maximize) return false;
  /* Give the window back to Tawk before asking it to open (see closeTawk). */
  forceWindowClosed = false;
  try {
    api.showWidget?.();
  } catch {
    /* Tawk throws if called before it finishes booting; maximize still works. */
  }
  api.maximize();
  window.dispatchEvent(new Event(TAWK_OPEN_EVENT));
  /* Tawk builds the window lazily and re-writes the iframes' inline styles as
     it animates open, so re-skin across the transition. */
  skinTawk();
  window.setTimeout(skinTawk, 250);
  window.setTimeout(skinTawk, 900);
  return true;
}

/** How long to give Tawk to honour `minimize()` before forcing the window away. */
const CLOSE_FALLBACK_MS = 450;

/**
 * Close the chat window.
 *
 * Tawk's own launcher is hidden, so this button is the only way out — it must
 * never fail. `minimize()` is the polite route, and normally it works.
 *
 * When it does not — Tawk can ignore it while a conversation is ongoing — the
 * window is taken off screen directly. `hideWidget()` is NOT the fallback: it
 * flips Tawk's internal flag but leaves an open window exactly where it was,
 * which is the state that stranded visitors in a chat they could not close.
 * Setting `display: none` on the window's own iframe is the one move that
 * cannot fail, because that element is in our document. `openTawk()` hands
 * control straight back, so nothing is lost and the conversation is preserved.
 */
export function closeTawk() {
  const api = typeof window !== "undefined" ? window.Tawk_API : undefined;
  if (!api) return false;
  try {
    api.minimize?.();
  } catch {
    /* fall through to the forced close below */
  }
  window.dispatchEvent(new Event(TAWK_CLOSE_EVENT));

  window.setTimeout(() => {
    if (api.isChatMaximized?.()) {
      forceWindowClosed = true;
      skinTawk();
    }
  }, CLOSE_FALLBACK_MS);
  return true;
}

/* ---------------------------------------------------------------------------
   SKINNING

   Tawk renders into cross-origin iframes, so the inside of the chat window
   (its header colour, its bubbles, its own launcher glyph) cannot be restyled
   from here — that is a dashboard setting, see the note in TAWK_BRAND_NOTE.

   What we CAN do is style the iframe ELEMENTS, which live in our own document:
   hide Tawk's launcher bubble entirely so the site's own floating button is the
   only control, and give the chat window our radius and shadow so it reads as
   part of the site. Tawk gives those iframes random ids on every load, so they
   are tagged here by role and targeted from styles/globals.css.
   -------------------------------------------------------------------------- */

/* Identifying the parts of the widget, the hard way.

   Tawk keeps five iframes in its container, all with randomised ids, and two
   of them draw a launcher bubble (64x60 and 124x95 were both observed live).
   Two earlier rules were tried and both were wrong:

     • by size — the window animates open through sizes that belong to no role
       (300x150), and it is sized responsively, so any "big" threshold fails on
       a phone;
     • by z-index — picks only one of the two launcher frames, leaving the other
       one on screen. That is the bug that left Tawk's green bubble visible next
       to the site's own button.

   What holds:
     • the chat window is the only frame Tawk labels, with an `open` / `closed`
       class that it keeps in both states;
     • a launcher is any other frame that is actually drawing something small,
       at most LAUNCHER_MAX in BOTH directions. The "Powered by tawk.to" strip
       is 350 wide so it can never match, and Tawk's zero-size helper frames are
       never touched — hiding one of those could break its message transport.

   A frame hidden this way then measures 0x0, so hidden launchers are remembered
   and re-hidden on every pass. */

/** Largest a frame can be, in both directions, and still be a launcher bubble. */
const LAUNCHER_MAX = 200;

/** Launcher frames already hidden; they measure 0x0 afterwards. */
const hiddenLaunchers = new WeakSet<HTMLIFrameElement>();

/**
 * Set when Tawk refused to close its own window and the site had to take it off
 * screen directly. Cleared by `openTawk()`. See `closeTawk()`.
 */
let forceWindowClosed = false;

/**
 * Frames hidden by that forced close. Tracked as a set rather than re-derived,
 * because a hidden frame measures 0x0 and so can no longer be recognised by
 * size or position — without this, a forced close could never be undone and the
 * chat would refuse to reopen.
 */
const forcedHidden = new WeakSet<HTMLIFrameElement>();

/**
 * Find Tawk's iframe container. Every id and class it writes is randomised per
 * page load, and the `open` class on the window comes and goes, so the only
 * dependable signature is its shape: a div appended to <body> whose children
 * are all iframes.
 */
function tawkContainer(): HTMLElement | null {
  for (const el of document.body.children) {
    if (el.tagName !== "DIV" || el.children.length < 3) continue;
    if ([...el.children].every((c) => c.tagName === "IFRAME")) {
      return el as HTMLElement;
    }
  }
  return null;
}

export function skinTawk() {
  if (typeof document === "undefined") return;
  const container = tawkContainer();
  if (!container) return;
  container.setAttribute("data-philbrick-tawk", "");

  const frames = [...container.querySelectorAll("iframe")];

  /* Undo a previous forced close first, before anything is measured: those
     frames are 0x0 while hidden, so they have to be restored by identity. */
  if (!forceWindowClosed) {
    for (const frame of frames) {
      if (forcedHidden.has(frame)) {
        forcedHidden.delete(frame);
        frame.style.removeProperty("display");
      }
    }
  }

  /* The chat window: the only frame Tawk labels, and it keeps the label in
     both states. */
  const chatWindow = frames.find(
    (f) => f.classList.contains("open") || f.classList.contains("closed")
  );

  /* Tawk writes its own inline `!important` declarations onto these iframes,
     which no stylesheet rule can outrank, so the overrides have to be inline
     too. The matching rules in styles/globals.css document the intent and
     cover the case where Tawk stops using !important. Re-applied on every
     skin pass because Tawk rewrites the inline styles as the chat opens and
     closes. */
  for (const frame of frames) {
    if (frame === chatWindow) {
      frame.dataset.tawkPart = "window";
      continue;
    }

    const { width, height } = frame.getBoundingClientRect();
    const isLauncher =
      hiddenLaunchers.has(frame) ||
      (width > 0 && height > 0 && width <= LAUNCHER_MAX && height <= LAUNCHER_MAX);

    if (isLauncher) {
      hiddenLaunchers.add(frame);
      frame.dataset.tawkPart = "launcher";
      frame.style.setProperty("display", "none", "important");
      frame.style.setProperty("pointer-events", "none", "important");
      continue;
    }

    /* Anything else that is actually drawing is the "Powered by tawk.to" strip;
       zero-size frames are Tawk's helpers and are never touched. */
    if (width > 0 && height > 0) {
      frame.dataset.tawkPart = "branding";
      applyForcedClose(frame);
    } else {
      delete frame.dataset.tawkPart;
    }
  }

  if (chatWindow) {
    chatWindow.style.setProperty("border-radius", "var(--radius-lg)", "important");
    chatWindow.style.setProperty("border", "1px solid var(--border-accent)", "important");
    chatWindow.style.setProperty("box-shadow", "var(--shadow-xl)", "important");
    applyForcedClose(chatWindow);
  }
}

/**
 * Take a frame off screen when Tawk would not close its own window. Restoring
 * happens at the top of `skinTawk()` by identity, not here, because a hidden
 * frame is 0x0 and would never be classified again.
 */
function applyForcedClose(frame: HTMLIFrameElement) {
  if (!forceWindowClosed) return;
  forcedHidden.add(frame);
  frame.style.setProperty("display", "none", "important");
}

/* Set up Tawk_API before the remote script runs: the callbacks must already
   exist when the widget boots, otherwise the hide never happens and both
   launchers show.

   The launcher is hidden ONCE here, at load, purely so it does not flash before
   the skinning runs. It is deliberately NOT hidden again on minimize: keeping
   Tawk flagged hidden while the window is open leaves its state machine
   inconsistent, and in that state it can ignore `minimize()` — which strands the
   visitor in a window they cannot close. From the first open onwards the
   launcher is kept invisible by `skinTawk()` hiding that iframe directly, and
   Tawk's own show/hide state is left alone. */
const bootstrap = `
window.Tawk_API = window.Tawk_API || {};
window.Tawk_LoadStart = new Date();
window.Tawk_API.onLoad = function () {
  window.__philbrickTawkReady = true;
  try { window.Tawk_API.hideWidget(); } catch (e) {}
  window.dispatchEvent(new Event(${JSON.stringify(TAWK_READY_EVENT)}));
};
window.Tawk_API.onChatMaximized = function () {
  window.dispatchEvent(new Event(${JSON.stringify(TAWK_OPEN_EVENT)}));
};
window.Tawk_API.onChatMinimized = function () {
  window.dispatchEvent(new Event(${JSON.stringify(TAWK_CLOSE_EVENT)}));
};
window.Tawk_API.onChatHidden = function () {
  window.dispatchEvent(new Event(${JSON.stringify(TAWK_CLOSE_EVENT)}));
};
`;

/**
 * The one part of the widget this code cannot reach.
 *
 * The chat window's header colour, message-bubble colour, corner radius and
 * size are Tawk property settings, served inside a cross-origin iframe. To
 * finish matching the brand, set them once in the Tawk dashboard:
 *
 *   Administration → Chat Widget → Appearance
 *     Widget colour ......... #109BDD   (light theme --accent)
 *     Bubble / launcher ..... hidden is fine; the site draws its own
 *     Corner radius ......... rounded
 *
 * Everything else — hiding Tawk's launcher, the window's frame, position and
 * the button that opens it — is handled here.
 */
export const TAWK_BRAND_NOTE =
  "Set the widget colour to #109BDD in Tawk → Administration → Chat Widget → Appearance.";

export function TawkTo() {
  /* Re-tag on load and on every open/close: Tawk creates the iframes lazily,
     rewrites their inline styles as it animates, and re-shows its launcher when
     the window is maximized. The interval is the backstop for state changes the
     visitor triggers inside the iframe, which fire no event we can see. */
  useEffect(() => {
    const run = () => skinTawk();
    /* One pass immediately after a transition starts and one after it ends —
       a frame caught mid-animation is skipped by skinTawk, not mis-tagged. */
    const runTwice = () => {
      run();
      window.setTimeout(run, 500);
    };
    window.addEventListener(TAWK_READY_EVENT, run);
    window.addEventListener(TAWK_OPEN_EVENT, runTwice);
    window.addEventListener(TAWK_CLOSE_EVENT, runTwice);
    const id = window.setInterval(run, 2000);
    return () => {
      window.removeEventListener(TAWK_READY_EVENT, run);
      window.removeEventListener(TAWK_OPEN_EVENT, runTwice);
      window.removeEventListener(TAWK_CLOSE_EVENT, runTwice);
      window.clearInterval(id);
    };
  }, []);

  /* No ids configured (a fork or a preview deployment) — render nothing rather
     than request an invalid embed. */
  if (!PROPERTY_ID || !WIDGET_ID) return null;

  return (
    <>
      <Script id="tawk-bootstrap" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <Script
        id="tawk-embed"
        src={TAWK_SRC}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
    </>
  );
}
