import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { DemoKind } from "@/data/lessons";
import { getDemoSource } from "@/data/demo-sources";
import { CodeBlock } from "@/components/CodeBlock";

type Props = {
  kind: DemoKind;
  title?: string;
  className?: string;
};

/** 展示源码 + 等价交互面板（模拟 Fresh/Preact 概念） */
export function FreshLiveDemo({ kind, title, className }: Props) {
  const source = getDemoSource(kind);
  return (
    <div className={cn("grid gap-3 lg:grid-cols-2", className)}>
      <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-code-bg">
        <div className="border-b border-border px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-subtle">
          {title ?? source.title} · {source.lang}
        </div>
        <div className="max-h-[340px] overflow-auto p-3">
          <CodeBlock code={source.code} lang={source.lang} />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-primary">
          交互预览（概念等价）
        </p>
        <DemoPanel kind={kind} />
      </div>
    </div>
  );
}

function Shell({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="space-y-3">
      {label ? <p className="text-xs text-muted">{label}</p> : null}
      <div className="rounded-md border border-border bg-surface p-4 text-sm text-fg">
        {children}
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mr-2 mt-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
        variant === "primary"
          ? "bg-primary text-primary-fg hover:bg-primary-dim"
          : "border border-border bg-transparent text-fg hover:bg-surface-3",
      )}
    >
      {children}
    </button>
  );
}

function DemoPanel({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case "counter":
      return <CounterDemo />;
    case "signal":
      return <SignalDemo />;
    case "island":
      return <IslandDemo />;
    case "route":
    case "params":
      return <RouteDemo />;
    case "handler":
    case "fetch":
      return <HandlerDemo />;
    case "middleware":
    case "auth":
      return <AuthDemo />;
    case "form":
    case "validate":
      return <FormDemo />;
    case "cookie":
      return <CookieDemo />;
    case "todo":
      return <TodoDemo />;
    case "layout":
      return <LayoutDemo />;
    case "context":
      return <ContextDemo />;
    case "partial":
      return <PartialDemo />;
    case "async":
      return <AsyncDemo />;
    case "kv":
      return <KvDemo />;
    case "error":
      return <ErrorDemo />;
    case "static":
    case "plugin":
    case "ssr":
    case "deploy":
    case "tsx":
    case "streaming":
    default:
      return <ConceptDemo kind={kind} />;
  }
}

function CounterDemo() {
  const [count, setCount] = useState(0);
  return (
    <Shell label="useSignal(0) 等价交互">
      <p>
        点了 <strong className="text-primary tabular-nums">{count}</strong> 次
      </p>
      <Btn onClick={() => setCount((c) => c + 1)}>count++</Btn>
      <Btn variant="ghost" onClick={() => setCount(0)}>
        重置
      </Btn>
    </Shell>
  );
}

function SignalDemo() {
  const [n, setN] = useState(1);
  const total = n * 42;
  return (
    <Shell label="signal + computed">
      <Btn onClick={() => setN((x) => x + 1)}>数量 {n}</Btn>
      <p className="mt-2">
        合计 <strong className="text-primary">{total}</strong>
      </p>
    </Shell>
  );
}

function IslandDemo() {
  const [hydrated, setHydrated] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <Shell label="静海 + 岛屿">
      <p className="text-muted">服务端 HTML：欢迎来到 Fresh</p>
      <div className="mt-3 rounded-md border border-primary/40 bg-primary-soft p-3">
        <p className="text-xs text-primary">Island · Counter</p>
        {!hydrated ? (
          <Btn onClick={() => setHydrated(true)}>模拟水合</Btn>
        ) : (
          <>
            <p className="mt-1">count = {count}</p>
            <Btn onClick={() => setCount((c) => c + 1)}>+1</Btn>
          </>
        )}
      </div>
    </Shell>
  );
}

function RouteDemo() {
  const [path, setPath] = useState("/blog/hello");
  const slug = path.startsWith("/blog/") ? path.slice(6) : "";
  return (
    <Shell label="文件路由 → props.params">
      <div className="flex flex-wrap gap-2">
        {["/about", "/blog/hello", "/blog/fresh"].map((p) => (
          <Btn key={p} variant={path === p ? "primary" : "ghost"} onClick={() => setPath(p)}>
            {p}
          </Btn>
        ))}
      </div>
      <p className="mt-3 font-mono text-xs text-muted">
        routes{path === "/about" ? "/about.tsx" : "/blog/[slug].tsx"}
      </p>
      <p className="mt-2">
        {path === "/about" ? "About Fresh" : `文章 slug：${slug}`}
      </p>
    </Shell>
  );
}

function HandlerDemo() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <Shell label="handler.GET → props.data">
      <Btn
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            setMsg("来自服务端");
            setLoading(false);
          }, 400);
        }}
      >
        触发 GET
      </Btn>
      <p className="mt-3 text-muted">
        {loading ? "加载中…" : msg ? `data.msg = ${msg}` : "尚未请求"}
      </p>
    </Shell>
  );
}

function AuthDemo() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("—");
  return (
    <Shell label="中间件 / Bearer">
      <Btn onClick={() => setToken("secret")}>登录发 token</Btn>
      <Btn variant="ghost" onClick={() => setToken(null)}>
        退出
      </Btn>
      <Btn
        onClick={() => {
          setStatus(token === "secret" ? "200 { me: demo }" : "401 Unauthorized");
        }}
      >
        请求 /api/me
      </Btn>
      <p className="mt-3 font-mono text-xs">token: {token ?? "(null)"}</p>
      <p className="mt-1 text-sm text-muted">{status}</p>
    </Shell>
  );
}

function FormDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  return (
    <Shell label="form POST + 校验">
      <label className="block text-xs text-muted">
        名字
        <input
          className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-fg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="mt-2 block text-xs text-muted">
        邮箱
        <input
          className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-fg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <Btn
        onClick={() => {
          if (!/^[^@]+@[^@]+$/.test(email)) {
            setErr("邮箱格式不对");
            setResult(null);
            return;
          }
          setErr(null);
          setResult(`你好 ${name || "同学"}，已通过服务端校验`);
        }}
      >
        提交
      </Btn>
      {err ? <p className="mt-2 text-sm text-danger">{err}</p> : null}
      {result ? <p className="mt-2 text-sm text-success">{result}</p> : null}
    </Shell>
  );
}

function CookieDemo() {
  const [session, setSession] = useState(false);
  return (
    <Shell label="Set-Cookie 会话">
      <p className="text-muted">session = {session ? "abc (HttpOnly)" : "(无)"}</p>
      <Btn onClick={() => setSession(true)}>模拟登录写 Cookie</Btn>
      <Btn variant="ghost" onClick={() => setSession(false)}>
        清除
      </Btn>
    </Shell>
  );
}

function TodoDemo() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<string[]>([]);
  return (
    <Shell label="CRUD 列表">
      <div className="flex flex-wrap gap-2">
        <input
          className="min-w-[10rem] flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新笔记"
        />
        <Btn
          onClick={() => {
            if (!text.trim()) return;
            setItems((xs) => [...xs, text.trim()]);
            setText("");
          }}
        >
          添加
        </Btn>
      </div>
      <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
        {items.map((t, i) => (
          <li key={`${t}-${i}`} className="flex items-center justify-between gap-2">
            <span>{t}</span>
            <button
              type="button"
              className="text-xs text-danger"
              onClick={() => setItems((xs) => xs.filter((_, j) => j !== i))}
            >
              删
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 ? <p className="mt-2 text-xs text-muted">空列表</p> : null}
    </Shell>
  );
}

function LayoutDemo() {
  return (
    <Shell label="_app 壳">
      <div className="rounded-md border border-border bg-surface-3 px-3 py-2 text-xs">
        nav · Home
      </div>
      <div className="mt-2 rounded-md border border-dashed border-primary/50 bg-surface p-3 font-mono text-xs">
        {"<Component /> 当前页内容"}
      </div>
    </Shell>
  );
}

function ContextDemo() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  return (
    <Shell label="ctx.state 传递">
      <Btn onClick={() => setUser({ id: "1", name: "Ada" })}>middleware 写入 user</Btn>
      <Btn variant="ghost" onClick={() => setUser(null)}>
        清空
      </Btn>
      <pre className="mt-3 overflow-auto rounded-md bg-code-bg p-2 font-mono text-[11px] text-code-fg">
        {JSON.stringify({ state: { user } }, null, 2)}
      </pre>
    </Shell>
  );
}

function PartialDemo() {
  const [page, setPage] = useState(1);
  const items = useMemo(
    () => Array.from({ length: 3 }, (_, i) => `条目 ${(page - 1) * 3 + i + 1}`),
    [page],
  );
  return (
    <Shell label="Partial 局部替换列表">
      <ul className="list-inside list-disc text-sm">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <Btn variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))}>
        上页
      </Btn>
      <Btn onClick={() => setPage((p) => p + 1)}>下页</Btn>
      <p className="mt-2 text-xs text-muted">仅 list 区域更新 · page={page}</p>
    </Shell>
  );
}

function AsyncDemo() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  return (
    <Shell label="异步三态">
      <Btn
        onClick={() => {
          setState("loading");
          const ok = Math.random() > 0.3;
          setTimeout(() => setState(ok ? "ok" : "err"), 600);
        }}
      >
        拉取数据
      </Btn>
      <p className="mt-3 text-sm text-muted">
        {state === "idle" && "idle"}
        {state === "loading" && "loading…"}
        {state === "ok" && "ok · 数据就绪"}
        {state === "err" && "error · 可重试"}
      </p>
    </Shell>
  );
}

function KvDemo() {
  const [store, setStore] = useState<Record<string, string>>({});
  const [key, setKey] = useState("notes:1");
  const [val, setVal] = useState("hello");
  return (
    <Shell label="Deno KV 心智（浏览器模拟）">
      <input
        className="mb-2 w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-xs"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <input
        className="mb-2 w-full rounded-md border border-border bg-surface px-2 py-1.5 text-xs"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <Btn onClick={() => setStore((s) => ({ ...s, [key]: val }))}>kv.set</Btn>
      <pre className="mt-3 overflow-auto rounded-md bg-code-bg p-2 font-mono text-[11px]">
        {JSON.stringify(store, null, 2)}
      </pre>
    </Shell>
  );
}

function ErrorDemo() {
  const [code, setCode] = useState<200 | 404 | 500>(200);
  return (
    <Shell label="状态码与错误页">
      <Btn variant={code === 200 ? "primary" : "ghost"} onClick={() => setCode(200)}>
        200
      </Btn>
      <Btn variant={code === 404 ? "primary" : "ghost"} onClick={() => setCode(404)}>
        404
      </Btn>
      <Btn variant={code === 500 ? "primary" : "ghost"} onClick={() => setCode(500)}>
        500
      </Btn>
      <p className="mt-3">
        {code === 200 && "页面正常渲染"}
        {code === 404 && "routes/_404.tsx → 未找到"}
        {code === 500 && "routes/_500.tsx → 服务器错误"}
      </p>
    </Shell>
  );
}

function ConceptDemo({ kind }: { kind: DemoKind }) {
  const source = getDemoSource(kind);
  return (
    <Shell label={source.title}>
      <p className="text-sm leading-relaxed text-muted">
        此概念以左侧源码为主。结合课程正文理解即可；可在「工坊」练鉴权与 CRUD。
      </p>
      <ul className="mt-3 list-inside list-disc text-xs text-subtle">
        <li>默认 SSR，少发客户端 JS</li>
        <li>交互放 islands/</li>
        <li>数据放 handler</li>
      </ul>
    </Shell>
  );
}
