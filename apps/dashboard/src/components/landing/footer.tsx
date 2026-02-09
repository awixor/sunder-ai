"use client";

import { motion } from "framer-motion";
import { BookOpen, Bomb, Shield } from "lucide-react";
import { Github } from "@/components/icons";
import Link from "next/link";

const footerLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com",
    description: "View the source",
  },
  {
    icon: BookOpen,
    label: "Documentation",
    href: "/docs",
    description: "Learn more",
  },
  {
    icon: Bomb,
    label: "Nuke Data",
    href: "/vault",
    description: "Clear all tokens",
  },
];

export function Footer() {
  return (
    <footer className="relative py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white transition-colors duration-300">
                Sunder
              </h3>
              <p className="text-xs text-slate-500">Local-first privacy</p>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600 transition-all"
              >
                <link.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Nuke Data explanation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12 p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 transition-colors duration-300"
        >
          <div className="flex items-start gap-3">
            <Bomb className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-red-600 dark:text-red-400 text-sm mb-1 transition-colors duration-300">
                Nuke Data Policy
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                At any time, you can instantly destroy all token mappings stored
                in your browser. This is irreversible — your identity vault will
                be completely wiped, ensuring no trace remains.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/50 text-center transition-colors duration-300">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Sunder. Open source under MIT license.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Your privacy is not a product. It&apos;s a right.
          </p>
        </div>
      </div>
    </footer>
  );
}
