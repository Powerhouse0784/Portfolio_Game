"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { ABOUT } from "@/content/about";
import { playUiTone } from "@/lib/audio/uiSound";
import { backdropMotion, cardMotion } from "./panelMotion";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactPanel() {
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const closePanel = useInteractionStore((s) => s.closePanel);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [delivered, setDelivered] = useState(true);

  if (activePanelId !== "contact") return null;

  const handleClose = () => {
    closePanel();
    playUiTone("close");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Try again in a moment.");
        setStatus("error");
        return;
      }
      setDelivered(Boolean(data.delivered));
      setStatus("success");
      playUiTone("discover");
    } catch {
      setErrorMsg("Couldn't reach the server. Try again in a moment.");
      setStatus("error");
    }
  };

  return (
    <motion.div
      {...backdropMotion}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div
        {...cardMotion}
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12181f] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <h2 className="text-xl font-semibold text-[#FFB800]">Get In Touch</h2>
            <p className="text-xs text-white/40">Open to opportunities — send a message or reach out directly.</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {status === "success" ? (
            <div className="rounded-lg border border-[#00C48C]/30 bg-[#00C48C]/10 p-4 text-sm text-white/90">
              <p className="mb-1 font-semibold text-[#00C48C]">Message sent — thank you!</p>
              {delivered ? (
                <p className="text-white/70">I&apos;ll get back to you soon.</p>
              ) : (
                <p className="text-white/70">
                  Your message was received, but email delivery isn&apos;t configured on the server yet — reach me
                  directly at{" "}
                  <a href={`mailto:${ABOUT.social.email}`} className="underline">
                    {ABOUT.social.email}
                  </a>{" "}
                  in the meantime.
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Field label="Name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#FFB800]/50"
                />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={120}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#FFB800]/50"
                />
              </Field>
              <Field label="Message">
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[#FFB800]/50"
                />
              </Field>
              {status === "error" && <p className="text-xs text-[#FF3D5A]">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-lg bg-[#FFB800] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#ffc633] disabled:opacity-50"
              >
                {status === "submitting" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Or reach out directly</p>
            <div className="flex flex-wrap gap-2">
              <ShortcutLink href={ABOUT.social.github}>GitHub</ShortcutLink>
              <ShortcutLink href={ABOUT.social.linkedin}>LinkedIn</ShortcutLink>
              <ShortcutLink href={`mailto:${ABOUT.social.email}`}>Email</ShortcutLink>
              <a
                href={ABOUT.resumeFile}
                download
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs transition-colors hover:bg-white/10"
              >
                Résumé
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-white/50">{label}</label>
      {children}
    </div>
  );
}

function ShortcutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs transition-colors hover:bg-white/10"
    >
      {children}
    </a>
  );
}
