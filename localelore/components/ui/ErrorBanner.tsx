import { Button } from "@/components/ui/Button";
import { AlertTriangleIcon, RefreshIcon } from "@/components/ui/Icon";

/**
 * Inline error surface with an assertive live region so screen readers announce
 * failures immediately, plus an optional retry action.
 */
export function ErrorBanner({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/15 text-danger">
          <AlertTriangleIcon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-danger">{title}</p>
          <p className="mt-0.5 text-sm text-text/80 leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="shrink-0 gap-1.5 sm:self-center"
        >
          <RefreshIcon aria-hidden="true" className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
