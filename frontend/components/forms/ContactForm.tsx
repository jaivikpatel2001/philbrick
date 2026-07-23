"use client";
import { useState } from "react";
import { FiCheck, FiArrowRight, FiAlertTriangle } from "react-icons/fi";
import { cn } from "@/utils/cn";
import styles from "./ContactForm.module.css";

/* =============================================================================
   CONTACT FORM — real email delivery from a static export.

   Submissions POST to FormSubmit.co's AJAX endpoint (fetch, JSON): no backend,
   no Next API route, no nodemailer, no mailto:, and the visitor never leaves
   the page. The recipient inbox comes from NEXT_PUBLIC_CONTACT_FORM_TO_EMAIL
   (.env.example). NEXT_PUBLIC_* values are inlined into the client bundle —
   acceptable here because it is a delivery address, not a secret (FormSubmit
   uses no API key). To keep the raw address out of the page source, replace it
   with your FormSubmit random alias once the address is activated.

   Spam protection: a hidden honeypot field (_honey) that bots tend to fill —
   FormSubmit silently discards such submissions — plus FormSubmit's own
   server-side filtering. _captcha is disabled (AJAX flow cannot render it).
   ========================================================================== */

const RECIPIENT = process.env.NEXT_PUBLIC_CONTACT_FORM_TO_EMAIL;
const ENDPOINT = RECIPIENT ? `https://formsubmit.co/ajax/${RECIPIENT}` : null;

const INQUIRY_TYPES = [
  "Product Inquiry",
  "Technical Support",
  "Dealer or Network Inquiry",
  "Business Inquiry",
  /* The client's WordPress site had a separate "Download Step Brochure" form;
     documents are now linked directly on /downloads, and this option covers
     anything not published there. */
  "Brochure or Catalogue Request",
  "General Inquiry",
];

type Status = "idle" | "sending" | "success" | "error";

interface ContactFormProps {
  inquiryTypes?: string[];
  submitLabel?: string;
}

interface Errors {
  [k: string]: string;
}

export function ContactForm({
  inquiryTypes = INQUIRY_TYPES,
  submitLabel = "Send enquiry",
}: ContactFormProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<string>("");

  const validate = (data: FormData): Errors => {
    const e: Errors = {};
    if (!String(data.get("name") || "").trim()) e.name = "Please enter your name.";
    const email = String(data.get("email") || "").trim();
    if (!email) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address.";
    if (!String(data.get("message") || "").trim())
      e.message = "Tell us a little about your requirement.";
    if (!data.get("consent")) e.consent = "Please accept the privacy policy.";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (status === "sending") return; // duplicate-submission guard
    const form = ev.currentTarget;
    const data = new FormData(form);

    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) return;

    // Honeypot: humans never see this field. If it holds a value, quietly
    // succeed without sending anything.
    if (String(data.get("_honey") || "")) {
      setStatus("success");
      return;
    }

    if (!ENDPOINT) {
      setFailure(
        "The contact form is not configured on this deployment yet. Please call or email us directly and we'll help right away."
      );
      setStatus("error");
      return;
    }

    setStatus("sending");
    setFailure("");
    const inquiryType = String(data.get("inquiryType") || inquiryTypes[0]);
    const submittedAt =
      new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }).format(new Date()) + " IST";

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          // Readable labels — FormSubmit's table template shows them as rows.
          name: String(data.get("name")),
          email: String(data.get("email")),
          "Phone Number": String(data.get("phone") || "Not provided"),
          "Company Name": String(data.get("company") || "Not provided"),
          Website: String(data.get("website") || "Not provided"),
          Address: String(data.get("address") || "Not provided"),
          City: String(data.get("city") || "Not provided"),
          State: String(data.get("state") || "Not provided"),
          Country: String(data.get("country") || "Not provided"),
          "Inquiry Type": inquiryType,
          Message: String(data.get("message")),
          "Submitted At": submittedAt,
          Page: "philbrickindia.com/contact",
          // FormSubmit configuration
          _subject: `Philbrick website enquiry: ${inquiryType}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = (await res.json().catch(() => null)) as
        | { success?: boolean | string; message?: string }
        | null;
      const ok =
        res.ok && (json?.success === true || json?.success === "true");
      if (ok) {
        setStatus("success");
        form.reset(); // clear only after confirmed success
      } else {
        setFailure(
          json?.message ||
            "We couldn't send your enquiry right now. Your details are still filled in below, please try again in a moment."
        );
        setStatus("error");
      }
    } catch {
      setFailure(
        "Network problem while sending. Your details are still filled in below, please check your connection and try again."
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon}>
          <FiCheck />
        </span>
        <h3>Thank you, your enquiry is on its way.</h3>
        <p>
          The Philbrick team has received your message and will get back to you
          shortly. For anything urgent, please call us directly.
        </p>
        <button className={styles.again} onClick={() => setStatus("idle")}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {status === "error" && (
        <div className={styles.banner} role="alert">
          <FiAlertTriangle className={styles.bannerIcon} aria-hidden />
          <span>{failure}</span>
        </div>
      )}

      <div className={styles.row}>
        <Field
          label="Full name"
          name="name"
          error={errors.name}
          required
          autoComplete="name"
          placeholder="Your name"
        />
        <Field
          label="Work email"
          name="email"
          type="email"
          error={errors.email}
          required
          autoComplete="email"
          placeholder="name@company.com"
        />
      </div>
      <div className={styles.row}>
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91"
        />
        <Field
          label="Company"
          name="company"
          autoComplete="organization"
          placeholder="Company or project name"
        />
      </div>

      {/* The client's WordPress inquiry form also asked for website and a full
          postal location. Kept here so nothing is lost, but optional, so the
          form stays quick to complete. */}
      <div className={styles.row}>
        <Field
          label="Website"
          name="website"
          type="url"
          autoComplete="url"
          placeholder="https://"
        />
        <Field
          label="City"
          name="city"
          autoComplete="address-level2"
          placeholder="City"
        />
      </div>
      <div className={styles.row}>
        <Field
          label="State"
          name="state"
          autoComplete="address-level1"
          placeholder="State"
        />
        <Field
          label="Country"
          name="country"
          autoComplete="country-name"
          placeholder="Country"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="address" className={styles.label}>
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={2}
          className={styles.textarea}
          autoComplete="street-address"
          placeholder="Street address"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="inquiryType" className={styles.label}>
          Inquiry type
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          className={styles.select}
          defaultValue={inquiryTypes[0]}
        >
          {inquiryTypes.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Message <span className={styles.req}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={cn(styles.textarea, errors.message && styles.invalid)}
          placeholder="Building type, number of floors, components needed, timeline…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <span id="message-error" className={styles.error}>
            {errors.message}
          </span>
        )}
      </div>

      {/* Honeypot — visually hidden and skipped by keyboard/screen readers.
          Bots that fill every field reveal themselves here. */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor="_honey">Leave this field empty</label>
        <input
          id="_honey"
          name="_honey"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className={styles.consent}>
        <input type="checkbox" name="consent" className={styles.checkbox} />
        <span>
          I agree to Philbrick&apos;s privacy policy and to being contacted
          about my enquiry.
        </span>
      </label>
      {errors.consent && <span className={styles.error}>{errors.consent}</span>}

      <button
        type="submit"
        className={styles.submit}
        disabled={status === "sending"}
        aria-busy={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <span className={styles.spinner} aria-hidden /> Sending…
          </>
        ) : (
          <>
            {submitLabel} <FiArrowRight />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.req}> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={cn(styles.input, error && styles.invalid)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}
