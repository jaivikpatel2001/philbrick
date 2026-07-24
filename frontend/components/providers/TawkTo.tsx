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

   TAWK'S OWN LAUNCHER IS THE CHAT CONTROL. The site briefly drew its own button
   and hid Tawk's; that was reverted on client direction. Nothing here opens,
   closes, hides or shows the widget any more — Tawk owns its state end to end,
   which is also what makes it reliable (fighting that state machine is what
   once left a chat window that could not be closed).

   The only thing still done to the widget is cosmetic: the chat window's iframe
   gets the site's radius, hairline and shadow. Its INSIDE is cross-origin and
   cannot be reached from here — see TAWK_BRAND_NOTE.
   ========================================================================== */

const PROPERTY_ID =
  process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID || "6039cf23385de407571a9744";
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID || "1evgt29n1";

export const TAWK_SRC = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;

/** Event fired on window once the Tawk API is usable. */
export const TAWK_READY_EVENT = "philbrick:tawk-ready";

interface TawkApi {
  onLoad?: () => void;
  maximize?: () => void;
  minimize?: () => void;
  toggle?: () => void;
}

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
    __philbrickTawkReady?: boolean;
  }
}

/** True once the Tawk API has loaded. */
export function isTawkReady() {
  return typeof window !== "undefined" && window.__philbrickTawkReady === true;
}

/* ---------------------------------------------------------------------------
   Cosmetic framing.

   Tawk gives its iframes random ids on every page load, so the chat window is
   found by the one marker that holds: it is the only frame Tawk labels, with an
   `open` / `closed` class that it keeps in both states. Its own launcher and the
   "Powered by tawk.to" strip are left exactly as Tawk made them.

   The overrides are applied inline because Tawk writes its own inline
   `!important` declarations, which no stylesheet rule can outrank. The matching
   rules in styles/globals.css document the intent and take over if Tawk ever
   stops using !important.
   -------------------------------------------------------------------------- */
export function skinTawk() {
  if (typeof document === "undefined") return;

  const chatWindow = document.querySelector<HTMLIFrameElement>(
    "iframe.open, iframe.closed"
  );
  if (!chatWindow) return;

  chatWindow.parentElement?.setAttribute("data-philbrick-tawk", "");
  chatWindow.dataset.tawkPart = "window";
  chatWindow.style.setProperty("border-radius", "var(--radius-lg)", "important");
  chatWindow.style.setProperty("border", "1px solid var(--border-accent)", "important");
  chatWindow.style.setProperty("box-shadow", "var(--shadow-xl)", "important");
}

const bootstrap = `
window.Tawk_API = window.Tawk_API || {};
window.Tawk_LoadStart = new Date();
window.Tawk_API.onLoad = function () {
  window.__philbrickTawkReady = true;
  window.dispatchEvent(new Event(${JSON.stringify(TAWK_READY_EVENT)}));
};
`;

/**
 * The one part of the widget this code cannot reach.
 *
 * The chat window's header colour, message-bubble colour, launcher colour,
 * corner radius and size are Tawk property settings, served inside a
 * cross-origin iframe. To bring the widget onto the brand, set them once in the
 * Tawk dashboard:
 *
 *   Administration → Chat Widget → Appearance
 *     Widget colour ......... #109BDD   (light theme --accent)
 *
 * There is no JavaScript API for it; this build's `Tawk_API` has no
 * `customStyle` property at all.
 */
export const TAWK_BRAND_NOTE =
  "Set the widget colour to #109BDD in Tawk → Administration → Chat Widget → Appearance.";

export function TawkTo() {
  /* Tawk builds its iframes lazily and rewrites their inline styles as the chat
     opens and closes, so the framing is re-applied on load and on a slow tick.
     Cheap: a single querySelector and three style writes. */
  useEffect(() => {
    const run = () => skinTawk();
    window.addEventListener(TAWK_READY_EVENT, run);
    const id = window.setInterval(run, 2000);
    return () => {
      window.removeEventListener(TAWK_READY_EVENT, run);
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
      />
    </>
  );
}
