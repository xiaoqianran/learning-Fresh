import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FRESH_PRESETS, getPreset } from "@/data/fresh-presets";
import { FreshPlayground } from "@/components/FreshPlayground";
import { Code2, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaygroundSearch = {
  example?: string;
};

export const Route = createFileRoute("/playground")({
  validateSearch: (search: Record<string, unknown>): PlaygroundSearch => ({
    example:
      typeof search.example === "string" && search.example.length > 0
        ? search.example
        : undefined,
  }),
  component: PlaygroundPage,
});

function PlaygroundPage() {
  const { example } = Route.useSearch();
  const [activeId, setActiveId] = useState(example ?? "counter");
  const preset = useMemo(() => getPreset(activeId), [activeId]);

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <header className="mb-5">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Code2 className="h-3.5 w-3.5" />
          Fresh · 示例工作区
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          代码实验室
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          浏览真实{" "}
          <code className="rounded-sm bg-surface-3 px-1.5 py-0.5 font-mono text-xs text-primary">
            routes / islands
          </code>{" "}
          示例结构。源码可对照阅读；右侧提供概念交互预览。完整 Deno 运行请在本机{" "}
          <code className="font-mono text-xs">deno task start</code>。
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {FRESH_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveId(p.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150",
              activeId === p.id
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted hover:text-fg",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          <span className="font-medium text-fg">{preset.title}</span>
          <span className="text-muted"> · {preset.summary}</span>
        </div>
        <p className="inline-flex items-center gap-1.5 text-[11px] text-subtle">
          <Keyboard className="h-3 w-3" />
          切换顶部文件标签阅读多文件示例
        </p>
      </div>

      <FreshPlayground key={preset.id} preset={preset} />

      <aside className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          {
            t: "读源码",
            d: "左侧是 Fresh 项目里的真实文件布局：routes、islands、api。",
          },
          {
            t: "对概念",
            d: "右侧预览帮助理解 handler / form / island，不替代本机 Deno。",
          },
          {
            t: "去工坊",
            d: "鉴权 + 笔记 CRUD 请打开「工坊」用模拟 REST 闯关。",
          },
        ].map((item) => (
          <div
            key={item.t}
            className="rounded-lg border border-border bg-surface-2 px-3.5 py-3"
          >
            <p className="text-sm font-medium text-fg">{item.t}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{item.d}</p>
          </div>
        ))}
      </aside>
    </div>
  );
}
