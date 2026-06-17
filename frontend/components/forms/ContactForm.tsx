"use client";
import { useState } from "react";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import { cn } from "@/utils/cn";
import styles from "./ContactForm.module.css";

const DEFAULT_INTERESTS = [
  "New installation",
  "Maintenance & AMC",
  "Modernization",
  "Become a dealer",
  "General enquiry",
];

interface ContactFormProps {
  interests?: string[];
  title?: string;
  submitLabel?: string;
}

interface Errors {
  [k: string]: string;
}

export function ContactForm({
  interests = DEFAULT_INTERESTS,
  submitLabel = "Send enquiry",
}: ContactFormProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (data: FormData): Errors => {
    const e: Errors = {};
    if (!data.get("name")) e.name = "Please enter your name.";
    const email = String(data.get("email") || "");
    if (!email) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address.";
    if (!data.get("message")) e.message = "Tell us a little about your project.";
    if (!data.get("consent")) e.consent = "Please accept the privacy policy.";
    return e;
  };

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      form.reset();
    }, 900);
  };

  if (sent) {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon}>
          <FiCheck />
        </span>
        <h3>Thank you — we&apos;ll be in touch.</h3>
        <p>
          A VERTIQ specialist will respond within one business day. For urgent
          service, call our 24/7 line.
        </p>
        <button className={styles.again} onClick={() => setSent(false)}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <Field label="Full name" name="name" error={errors.name} required />
        <Field
          label="Work email"
          name="email"
          type="email"
          error={errors.email}
          required
        />
      </div>
      <div className={styles.row}>
        <Field label="Company" name="company" />
        <Field label="Phone" name="phone" type="tel" />
      </div>

      <div className={styles.field}>
        <label htmlFor="interest" className={styles.label}>
          I&apos;m interested in
        </label>
        <select id="interest" name="interest" className={styles.select} defaultValue={interests[0]}>
          {interests.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Project details <span className={styles.req}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={cn(styles.textarea, errors.message && styles.invalid)}
          placeholder="Building type, number of floors, timeline…"
        />
        {errors.message && <span className={styles.error}>{errors.message}</span>}
      </div>

      <label className={styles.consent}>
        <input type="checkbox" name="consent" className={styles.checkbox} />
        <span>
          I agree to VERTIQ&apos;s privacy policy and to being contacted about my
          enquiry.
        </span>
      </label>
      {errors.consent && <span className={styles.error}>{errors.consent}</span>}

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "Sending…" : submitLabel}
        {!submitting && <FiArrowRight />}
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
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
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
        className={cn(styles.input, error && styles.invalid)}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
