"use client";

import { motion } from "framer-motion";
import { MailX, ScrollText, MessageSquareOff, KeyRound } from "lucide-react";

const privacyItems = [
  {
    icon: MailX,
    label: "No Emails",
    description: "We never see your email addresses",
  },
  {
    icon: ScrollText,
    label: "No Logs",
    description: "Zero server-side logging",
  },
  {
    icon: MessageSquareOff,
    label: "No Prompts",
    description: "Your prompts stay on your device",
  },
  {
    icon: KeyRound,
    label: "No API Keys",
    description: "Your credentials are yours alone",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TrustBar() {
  return (
    <section className="relative py-20 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-linear-to-r from-red-500/5 via-transparent to-red-500/5" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
            <span className="font-mono">ZERO-KNOWLEDGE</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
            What We <span className="text-red-400">NEVER</span> See
          </h2>
        </motion.div>

        {/* Privacy items grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {privacyItems.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              transition={{ duration: 0.4 }}
              className="group text-center"
            >
              {/* Icon with X overlay */}
              <div className="relative w-16 h-16 mx-auto mb-3">
                <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-colors">
                  <item.icon className="w-7 h-7 text-slate-400 group-hover:text-red-400 transition-colors" />
                </div>
                {/* Crossed out indicator */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">✕</span>
                </motion.div>
              </div>

              {/* Label */}
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1 transition-colors duration-300">
                {item.label}
              </h3>
              <p className="text-sm text-slate-500">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust statement */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-600 dark:text-slate-400 mt-10 max-w-2xl mx-auto transition-colors duration-300"
        >
          All processing happens locally in your browser. We can&apos;t see your
          data even if we wanted to — it never leaves your device.
        </motion.p>
      </div>
    </section>
  );
}
