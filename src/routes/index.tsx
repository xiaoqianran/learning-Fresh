import { createFileRoute, Link } from "@tanstack/react-router";
import { LESSONS, getLessonsByTrack } from "@/data/lessons";
import { useProgress } from "@/store/progress";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Sparkles,
  Search,
  Library,
  BookMarked,
  Server,
  Code2,
  FlaskConical,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  completedCount,
  getContinueLesson,
  isAllComplete,
  orderedTracks,
  progressPercent,
  TRACK_META,
  trackLabel,
} from "@/lib/nav";

export const Route = createFileRoute("/")({
  component: HomePage,
});

type TrackFilter = "全部" | (typeof LESSONS)[number]["track"];

function HomePage() {
  const completed = useProgress((s) => s.completed);
  const quizScores = useProgress((s) => s.quizScores);
  const streak = useProgress((s) => s.streak);
  const [q, setQ] = useState("");
  const [track, setTrack] = useState<TrackFilter>("全部");

  const progress = progressPercent(completed);
  const doneCount = completedCount(completed);
  const cont = getContinueLesson(completed);
  const contIdx = LESSONS.findIndex((l) => l.slug === cont.slug);
  const allDone = isAllComplete(completed);

  const filtered = useMemo(() => {
    let list = track === "全部" ? LESSONS : getLessonsByTrack(track);
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(s) ||
          l.summary.toLowerCase().includes(s) ||
          l.slug.includes(s),
      );
    }
    return list;
  }, [q, track]);

  const pathCards = orderedTracks().map((t) => {
    const list = getLessonsByTrack(t);
    const done = list.filter((l) => completed.includes(l.slug)).length;
    return {
      track: t,
      ...TRACK_META[t],
      done,
      total: list.length,
      pct: list.length ? Math.round((done / list.length) * 100) : 0,
    };
  });

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <section className="relative overflow-hidden rounded-xl border border-border bg-surface px-5 py-8 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Fresh · Islands 优先
            </p>
            {streak > 0 ? (
              <span className="rounded-full bg-surface-3 px-2.5 py-1 font-mono text-xs text-muted">
                连续 {streak} 天
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">
            带你系统学 Deno Fresh
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            讲解 → Fresh 源码对照 → 交互 Demo → 测验（≥80% 掌握）。对照{" "}
            <Link to="/docs" className="text-primary no-underline hover:underline">
              文档地图
            </Link>
            ，工坊里练鉴权与 CRUD。
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {allDone ? (
              <Link to="/certificate" className="no-underline">
                <Button size="lg" className="w-full sm:w-auto">
                  领取结业证明
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/lesson/$slug" params={{ slug: cont.slug }} className="no-underline">
                <Button size="lg" className="w-full sm:w-auto">
                  {doneCount > 0 ? "继续学习" : "从第一节开始"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link to="/hub" className="no-underline">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <LayoutDashboard className="h-4 w-4" />
                学习中心
              </Button>
            </Link>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-bg/50 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-subtle">
              {allDone ? "全部完成" : `下一课 · ${trackLabel(cont.track)}`}
            </p>
            <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-fg">
                  {allDone ? "可以生成结业证明" : cont.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                  {allDone ? "想复习可从下方路径点回任意一课。" : cont.summary}
                </p>
              </div>
              {!allDone ? (
                <span className="shrink-0 font-mono text-xs text-subtle">
                  #{String(contIdx + 1).padStart(2, "0")} · {cont.minutes} 分
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="h-2 min-w-[8rem] flex-1 overflow-hidden rounded-full bg-surface-3 sm:max-w-xs">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-xs tabular-nums text-muted">
              {doneCount}/{LESSONS.filter((l) => l.track !== "官网对齐").length}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <BookOpen className="h-3.5 w-3.5" />约{" "}
              {LESSONS.reduce((a, l) => a + l.minutes, 0)} 分钟
            </span>
            <Link to="/hub" className="text-xs text-primary no-underline hover:underline">
              详细进度 →
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-2 sm:grid-cols-2">
        {[
          {
            to: "/docs" as const,
            icon: Library,
            title: "查 · 文档地图",
            desc: "官网章节 ↔ 本站课",
          },
          {
            to: "/cheatsheet" as const,
            icon: BookMarked,
            title: "查 · 速查表",
            desc: "写码时扫一眼 API",
          },
          {
            to: "/studio" as const,
            icon: Server,
            title: "练 · 全栈工坊",
            desc: "模拟 REST / 鉴权",
          },
          {
            to: "/playground" as const,
            icon: Code2,
            title: "练 · 代码实验室",
            desc: "routes / islands 示例",
          },
          {
            to: "/lab" as const,
            icon: FlaskConical,
            title: "练 · 练习场",
            desc: "刷测验题",
          },
          {
            to: "/hub" as const,
            icon: LayoutDashboard,
            title: "我 · 学习中心",
            desc: "进度 · 打卡 · 错题",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to + item.title}
              to={item.to}
              className="group flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 no-underline transition-colors hover:border-primary/40 hover:bg-surface-2"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-medium text-fg group-hover:text-primary">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted">{item.desc}</span>
              </span>
            </Link>
          );
        })}
      </section>

      <section className="mt-10">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-fg">学习路径</h2>
          <p className="text-xs text-muted">建议顺序：基础 → 进阶 → 工坊 → 工程化</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {pathCards.map((card) => (
            <button
              key={card.track}
              type="button"
              onClick={() => setTrack(card.track)}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                track === card.track
                  ? "border-primary/50 bg-primary-soft"
                  : "border-border bg-surface hover:border-primary/30",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-fg">{card.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{card.blurb}</p>
                </div>
                <span className="font-mono text-[11px] text-subtle">
                  {card.done}/{card.total}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${card.pct}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-semibold text-fg">课程大纲</h2>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索课程…"
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-subtle"
            />
          </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {(["全部", ...orderedTracks()] as TrackFilter[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTrack(t)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                track === t
                  ? "bg-primary text-primary-fg"
                  : "bg-surface-3 text-muted hover:text-fg",
              )}
            >
              {t === "全部" ? "全部" : TRACK_META[t as Exclude<TrackFilter, "全部">]?.label ?? t}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {filtered.map((lesson, i) => {
            const done = completed.includes(lesson.slug);
            const score = quizScores[lesson.slug];
            return (
              <li key={lesson.slug}>
                <Link
                  to="/lesson/$slug"
                  params={{ slug: lesson.slug }}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 no-underline transition-colors hover:border-primary/40"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px]",
                      done
                        ? "bg-primary text-primary-fg"
                        : "bg-surface-3 text-muted",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-fg">{lesson.title}</span>
                      <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[10px] text-subtle">
                        {trackLabel(lesson.track)}
                      </span>
                      {lesson.format === "reference" ? (
                        <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[10px] text-subtle">
                          参考
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">{lesson.summary}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1 text-[11px] text-subtle">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.minutes} 分
                    </span>
                    {typeof score === "number" ? (
                      <span className="font-mono text-primary">{score}%</span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">没有匹配的课程</p>
        ) : null}
      </section>
    </div>
  );
}
