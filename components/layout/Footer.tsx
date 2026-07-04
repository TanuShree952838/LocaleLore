import { ChefHatIcon } from "@/components/ui/Icon";

// LinkedIn brand glyph inlined (the app's icon set is intentionally brand-free).
function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-surface/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-text">
            <ChefHatIcon className="h-4 w-4 text-accent" />
            CookFlow
          </p>
          <p className="mt-1 text-xs text-muted">
            AI cooking to-do list · Powered by Google Gemini
          </p>
          <p className="mt-1 text-xs text-muted">
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/tanushree--sharma/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-accent underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              aria-label="Tanushree Sharma on LinkedIn (opens in a new tab)"
            >
              <LinkedInGlyph className="h-3.5 w-3.5" />
              Tanushree Sharma
            </a>
          </p>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-muted sm:text-right">
          Plans are AI-generated. Double-check quantities, prices, and dietary
          needs before you cook.
        </p>
      </div>
    </footer>
  );
}
