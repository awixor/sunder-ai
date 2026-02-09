"use client";

import { motion } from "framer-motion";
import { Cpu, ServerOff, KeyRound, Puzzle } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "WASM Powered",
    description: "Near-native speed with Rust security.",
    detail: "Compiled to WebAssembly for maximum performance",
    size: "large",
  },
  {
    icon: ServerOff,
    title: "Zero-Server",
    description: "Your raw data never touches our servers.",
    detail: "100% client-side processing",
    size: "small",
  },
  {
    icon: KeyRound,
    title: "Identity Vault",
    description: "Total control over your token-to-identity mappings.",
    detail: "View, manage, and nuke at any time",
    size: "small",
  },
  {
    icon: Puzzle,
    title: "Model Agnostic",
    description: "Works with OpenAI, Claude, Gemini, and Local LLMs.",
    detail: "Any AI provider, same protection",
    size: "large",
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
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export function FeatureGrid() {
  return (
    <section className="relative py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,#1e293b_1px,transparent_1px)] bg-size-[24px_24px] opacity-50 transition-[background-image] duration-300" />

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
            Built for Privacy Purists
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto transition-colors duration-300">
            Engineering-grade protection without compromises
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              transition={{ duration: 0.4 }}
              className={`
                group relative p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 
                backdrop-blur-sm hover:border-slate-300 dark:hover:bg-slate-800/80 dark:hover:border-slate-600/50 
                transition-all duration-300 cursor-default shadow-sm dark:shadow-none
                ${feature.size === "large" ? "md:col-span-2" : "md:col-span-2"}
              `}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-100 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-2 transition-colors duration-300">
                  {feature.description}
                </p>
                <p className="text-sm text-slate-500">{feature.detail}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-blue-500/10 to-transparent rounded-tr-2xl" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
