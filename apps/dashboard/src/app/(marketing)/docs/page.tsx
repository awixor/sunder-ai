export default function DocsPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-24 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Documentation
        </h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Getting Started
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Sunder AI is a local-first privacy firewall that scrubs PII from
              AI prompts before they ever leave your browser. It allows you to
              use powerful AI models without compromising your sensitive data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Installation
            </h2>
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-800 dark:text-slate-200">
              npm install @sunder-ai/core
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              Currently, Sunder AI is available as a library for integration
              into your own applications, or as a standalone dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Usage
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              To use Sunder in your application, initialize the Sunder engine
              and pass your text through the `protect` method.
            </p>
            <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-800 dark:text-slate-200 overflow-x-auto">
              {`import { Sunder } from '@sunder-ai/core';

const sunder = new Sunder();
const protectedText = sunder.protect("My email is john@example.com");

console.log(protectedText); 
// Output: "My email is [EMAIL_1]"`}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
