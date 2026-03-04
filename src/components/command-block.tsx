import { CopyButton } from "@/components/copy-button";

interface CommandBlockProps {
  command: string;
  label?: string;
}

export function CommandBlock({ command, label }: CommandBlockProps) {
  return (
    <div className="group relative">
      {label && (
        <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
          {label}
        </p>
      )}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 font-mono text-sm transition-colors hover:bg-muted group-hover:border-primary/20">
        <code className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {command}
        </code>
        <CopyButton text={command} className="shrink-0" />
      </div>
    </div>
  );
}
