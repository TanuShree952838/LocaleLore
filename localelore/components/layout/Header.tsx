import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CompassIcon } from "@/components/ui/Icon";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md glass">
      <div className="mx-auto flex w-full max-w-[2160px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10 2xl:px-16">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-fg"
          >
            <CompassIcon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-base font-bold text-text tracking-wide">LocaleLore</p>
            <p className="text-xs text-muted">Travel like a local</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
