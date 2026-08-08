import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  getAdjacent,
  getLesson,
  LESSONS,
} from "@/data/lessons";
import { useProgress } from "@/store/progress";
import { InteractiveDemo } from "@/components/demos/InteractiveDemos";
import { CodeBlock } from "@/components/CodeBlock";
import { Quiz } from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { trackLabel } from "@/lib/nav";

export const Route = createFileRoute("/lesson/$slug")({
  loader: ({ params }) => {
    const lesson = getLesson(params.slug);
    if (!lesson) throw notFound();
    return { lesson };
  },
  component: LessonPage,
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const slug = lesson.slug;
  const { prev, next } = getAdjacent(slug);
  const markVisited = useProgress((s) => s.markVisited);
  const markComplete = useProgress((s) => s.markComplete);
  const completed = useProgress((s) => s.completed);
  const bookmarks = useProgress((s) => s.bookmarks);
  const notes = useProgress((s) => s.notes);
  const setNote = useProgress((s) => s.setNote);
  const toggleBookmark = useProgress((s) => s.toggleBookmark);
  const bookmarked = bookmarks.includes(slug);
  const done = completed.includes(slug);
  const [note, setNoteLocal] = useState(notes[slug] ?? "");

  useEffect(() => {
    markVisited(slug);
  }, [slug, markVisited]);

  useEffect(() => {
    setNoteLocal(notes[slug] ?? "");
  }, [slug, notes]);

  const idx = LESSONS.findIndex((l) => l.slug === slug);

  return (
    <div className="mx-auto max-w-3xl pb-20">
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <Link to="/" className="text-muted no-underline hover:text-primary">
            首页
          </Link>
          <span>/</span>
          <span>{trackLabel(lesson.track)}</span>
          <span className="rounded-full bg-surface-3 px-2 py-0.5 font-mono text-[10px]">
            #{String(idx + 1).padStart(2, "0")} · {lesson.minutes} 分 · {lesson.level}
          </span>
          {done ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary">
              <Check className="h-3 w-3" />
              已完成
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            {lesson.title}
          </h1>
          <button
            type="button"
            onClick={() => toggleBookmark(slug)}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors",
              bookmarked
                ? "border-primary/40 bg-primary-soft text-primary"
                : "border-border bg-surface text-muted hover:text-fg",
            )}
          >
            {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {bookmarked ? "已收藏" : "收藏"}
          </button>
        </div>
        <p className="mt-2 text-base text-muted">{lesson.summary}</p>
        {lesson.official ? (
          <p className="mt-3">
            <a
              href={
                lesson.official.startsWith("http")
                  ? lesson.official
                  : `https://fresh.deno.dev${lesson.official}`
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary no-underline hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              对照官网文档
            </a>
            <span className="ml-2 break-all font-mono text-[11px] text-subtle">
              {lesson.official.startsWith("http")
                ? lesson.official.replace(/^https?:\/\//, "")
                : `fresh.deno.dev${lesson.official}`}
            </span>
          </p>
        ) : null}
      </header>

      <div className="mt-8 space-y-8">
        {lesson.blocks.map((block, i) => {
          if (block.type === "text") {
            return (
              <section key={i}>
                {block.title ? (
                  <h2 className="mb-2 font-display text-lg font-semibold text-fg">
                    {block.title}
                  </h2>
                ) : null}
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-muted">
                  {block.body}
                </p>
              </section>
            );
          }
          if (block.type === "code") {
            return (
              <CodeBlock
                key={i}
                code={block.code}
                title={block.title}
                lang={block.lang ?? "tsx"}
              />
            );
          }
          if (block.type === "tip") {
            return (
              <aside
                key={i}
                className="flex gap-3 rounded-xl border border-primary/25 bg-primary-soft/40 px-4 py-3"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-fg/90">{block.body}</p>
              </aside>
            );
          }
          if (block.type === "demo") {
            return (
              <InteractiveDemo
                key={i}
                kind={block.kind}
                title={block.title}
                hint={block.hint}
              />
            );
          }
          if (block.type === "quiz") {
            return <Quiz key={i} slug={slug} questions={block.questions} />;
          }
          return null;
        })}
      </div>

      <section className="mt-10 rounded-xl border border-border bg-surface p-4">
        <h3 className="text-sm font-semibold text-fg">本课笔记</h3>
        <textarea
          value={note}
          onChange={(e) => setNoteLocal(e.target.value)}
          onBlur={() => setNote(slug, note)}
          rows={4}
          placeholder="记下你的疑问或总结…"
          className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setNote(slug, note);
              markComplete(slug);
            }}
          >
            标记完成
          </Button>
        </div>
      </section>

      <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        {prev ? (
          <Link
            to="/lesson/$slug"
            params={{ slug: prev.slug }}
            className="inline-flex items-center gap-1.5 text-sm text-muted no-underline hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/lesson/$slug"
            params={{ slug: next.slug }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline hover:underline"
          >
            {next.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link to="/certificate" className="text-sm text-primary no-underline hover:underline">
            查看结业
          </Link>
        )}
      </nav>
    </div>
  );
}
