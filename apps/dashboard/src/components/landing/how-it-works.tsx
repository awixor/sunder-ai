"use client";

import { motion } from "framer-motion";
import { Crosshair, RefreshCw, Eye } from "lucide-react";

const steps = [
  {
    icon: Crosshair,
    title: "Intercept",
    description: "Sunder hooks into your chat or API call locally.",
    detail: "Before any data leaves your machine",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: RefreshCw,
    title: "Sunder",
    description: "Our Rust-WASM engine replaces PII with context-aware tokens.",
    detail: "E.g., john@acme.com → [EMAIL_1]",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Eye,
    title: "Reveal",
    description: "AI responses are re-hydrated with your original data.",
    detail: "Only on your screen, nowhere else",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function HowItWorks() {
  return (
    <section className="relative py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-950 transition-colors duration-300" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto transition-colors duration-300">
            Three simple steps to keep your identity safe while using AI
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-px bg-linear-to-r from-slate-200 dark:from-slate-700 to-transparent z-0 transition-colors duration-300" />
              )}

              {/* Card */}
              <div
                className={`relative p-6 rounded-2xl ${step.bgColor} border ${step.borderColor} backdrop-blur-sm bg-white/50 dark:bg-transparent`}
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors duration-300">
                  <span className={`text-sm font-bold ${step.color}`}>
                    {index + 1}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center mb-4`}
                >
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3 transition-colors duration-300">
                  {step.description}
                </p>
                <p className="text-sm text-slate-500 font-mono">
                  {step.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual flow arrow - mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="md:hidden flex justify-center my-8"
        >
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-8 h-px bg-slate-300 dark:bg-slate-700 transition-colors duration-300" />
            <span className="text-xs">→</span>
            <div className="w-8 h-px bg-slate-300 dark:bg-slate-700 transition-colors duration-300" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
