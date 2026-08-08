import { useMemo, useState } from "react";
import type { FreshPreset } from "@/data/fresh-presets";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/CodeBlock";
import { FreshLiveDemo } from "@/components/FreshLiveDemo";
import type { DemoKind } from "@/data/lessons";

const PRESET_DEMO: Record<string, DemoKind> = {
  counter: "counter",
  handler: "handler",
  form: "form",
  api: "fetch",
  middleware: "middleware",
};

export function FreshPlayground({ preset }: { preset: FreshPreset }) {
  const files = useMemo(() => Object.keys(preset.files), [preset]);
  const [active, setActive] = useState(preset.mainFile);
  const code = preset.files[active] ?? preset.files[files[0]!] ?? "";
  const demoKind = PRESET_DEMO[preset.id] ?? "counter";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-2 px-2 py-2">
        {files.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors",
              active === f
                ? "bg-primary text-primary-fg"
                : "text-muted hover:bg-surface-3 hover:text-fg",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2">
        <div className="max-h-[420px] overflow-auto border-b border-border p-4 lg:border-b-0 lg:border-r">
          <CodeBlock code={code} lang={active.endsWith(".ts") ? "ts" : "tsx"} />
        </div>
        <div className="p-4">
          <p className="mb-3 text-xs text-muted">
            预设说明：{preset.summary}。下方为概念预览（非 Deno 运行时）。
          </p>
          <FreshLiveDemo kind={demoKind} title={preset.title} />
        </div>
      </div>
    </div>
  );
}
