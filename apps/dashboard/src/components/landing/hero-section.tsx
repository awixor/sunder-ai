"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Github, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

// Sample data for the scrubbing terminal demo
const DEMO_ORIGINAL = `Hi, I'm John Smith and my email is john.smith@acme.com. 
Can you help me debug this? My API key is sk-abc123xyz.
I'm connecting from 192.168.1.100.`;

const DEMO_PROTECTED = `Hi, I'm [PERSON_1] and my email is [EMAIL_1]. 
Can you help me debug this? My API key is [SECRET_1].
I'm connecting from [IP_ADDR_1].`;

// Text shredding animation for the headline
function ShredText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.02,
            ease: "easeOut",
          }}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Interactive scrubbing terminal with glassmorphism
function ScrubbingTerminal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative mx-auto max-w-4xl mt-12"
    >
      {/* Glow effect behind terminal */}
      <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 via-blue-600/10 to-purple-500/20 rounded-3xl blur-xl transition-colors duration-300" />

      {/* Glassmorphism container */}
      <div className="relative backdrop-blur-xl bg-slate-900/90 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-950/80 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-slate-400 ml-2 font-mono">
            sunder-shield.local
          </span>
          <div className="ml-auto flex items-center gap-2">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
            <span className="text-xs text-green-400">Protected</span>
          </div>
        </div>

        {/* Split pane content */}
        <div className="grid md:grid-cols-2 divide-x divide-white/5">
          {/* Left: Original */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                RAW INPUT
              </div>
            </div>
            <pre className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
              <AnimatePresence mode="wait">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {DEMO_ORIGINAL}
                </motion.span>
              </AnimatePresence>
            </pre>
          </div>

          {/* Right: Protected */}
          <div className="p-4 bg-slate-900/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                SUNDER-ED
              </div>
              <Zap className="w-3 h-3 text-blue-400" />
            </div>
            <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
              <AnimatePresence mode="wait">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-300"
                >
                  {DEMO_PROTECTED.split(/(\[.*?\])/).map((part, i) => {
                    if (part.match(/^\[.*?\]$/)) {
                      return (
                        <motion.span
                          key={i}
                          className="text-blue-400 bg-blue-500/10 px-1 rounded"
                          animate={{ opacity: [1, 0.7, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {part}
                        </motion.span>
                      );
                    }
                    return part;
                  })}
                </motion.span>
              </AnimatePresence>
            </pre>
          </div>
        </div>

        {/* Status bar */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            4 tokens generated • 0 bytes leaked
          </span>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-4 h-4 text-green-400" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-50/50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px),
                            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-200 h-150 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl transition-colors duration-300" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
            <Zap className="w-4 h-4" />
            <span>Powered by Rust + WebAssembly</span>
          </div>
        </motion.div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 text-slate-900 dark:text-white transition-colors duration-300">
          <ShredText text="Sunder Your Identity" className="block" />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="block mt-2"
          >
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600">
              From Your Data.
            </span>
          </motion.span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 text-center max-w-3xl mx-auto mb-10 transition-colors duration-300"
        >
          The local-first privacy firewall that scrubs PII from AI prompts
          before they ever leave your browser.{" "}
          <span className="text-slate-900 dark:text-white font-medium transition-colors duration-300">
            Fast. Private. Open Source.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/shield"
            className="group flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            <Shield className="w-5 h-5" />
            Open Shield
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold rounded-xl transition-all border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
        </motion.div>

        {/* Scrubbing Terminal Demo */}
        <ScrubbingTerminal />
      </div>
    </section>
  );
}
