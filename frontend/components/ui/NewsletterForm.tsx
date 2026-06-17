"use client";
import { useState } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import styles from "./NewsletterForm.module.css";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail("");
    window.setTimeout(() => setDone(false), 4000);
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Work email"
        aria-label="Email address"
        className={styles.input}
      />
      <button
        type="submit"
        className={styles.button}
        aria-label="Subscribe"
        data-done={done}
      >
        {done ? <FiCheck /> : <FiArrowRight />}
      </button>
      <span className={styles.hint} role="status">
        {done ? "You're subscribed — welcome aboard." : "Quarterly. No spam."}
      </span>
    </form>
  );
}
