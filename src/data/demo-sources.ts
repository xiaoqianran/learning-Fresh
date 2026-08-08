import type { DemoKind } from "@/data/lessons";

export type DemoSource = {
  lang: string;
  title: string;
  code: string;
};

/** 每个交互 Demo 对应的 Fresh / Preact 源码（讲解与 live 区共用） */
export const DEMO_SOURCES: Record<DemoKind, DemoSource> = {
  counter: {
    lang: "tsx",
    title: "Island 计数器",
    code: `/** @jsxImportSource preact */
import { useSignal } from "@preact/signals";

export default function Counter() {
  const count = useSignal(0);
  return (
    <div>
      <p>点了 {count} 次</p>
      <button type="button" onClick={() => count.value++}>count++</button>
      <button type="button" onClick={() => (count.value = 0)}>重置</button>
    </div>
  );
}`,
  },
  route: {
    lang: "tsx",
    title: "文件路由",
    code: `// routes/about.tsx → /about
export default function About() {
  return <h1>About Fresh</h1>;
}

// routes/blog/[slug].tsx → /blog/:slug
import { PageProps } from "$fresh/server.ts";
export default function Post(props: PageProps) {
  return <h1>{props.params.slug}</h1>;
}`,
  },
  island: {
    lang: "tsx",
    title: "页面 + Island",
    code: `// routes/index.tsx
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div>
      <h1>静海（无客户端 JS）</h1>
      <Counter start={0} />
    </div>
  );
}`,
  },
  signal: {
    lang: "tsx",
    title: "signal + computed",
    code: `import { useSignal, computed } from "@preact/signals";

export default function Price() {
  const n = useSignal(1);
  const total = computed(() => n.value * 42);
  return (
    <div>
      <button type="button" onClick={() => n.value++}>数量 {n}</button>
      <p>合计 {total}</p>
    </div>
  );
}`,
  },
  handler: {
    lang: "tsx",
    title: "handler 取数",
    code: `import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers<{ msg: string }> = {
  async GET(_req, ctx) {
    return ctx.render({ msg: "来自服务端" });
  },
};

export default function Page(props: PageProps<{ msg: string }>) {
  return <p>{props.data.msg}</p>;
}`,
  },
  middleware: {
    lang: "ts",
    title: "中间件",
    code: `// routes/admin/_middleware.ts
export async function handler(req: Request, ctx) {
  const cookie = req.headers.get("cookie") ?? "";
  if (!cookie.includes("session=")) {
    return new Response("Unauthorized", { status: 401 });
  }
  ctx.state.user = { id: "u1" };
  return await ctx.next();
}`,
  },
  form: {
    lang: "tsx",
    title: "表单 POST",
    code: `export const handler = {
  async POST(req, ctx) {
    const form = await req.formData();
    const name = String(form.get("name") ?? "");
    return ctx.render({ ok: true, name });
  },
};

export default function Page({ data }) {
  return (
    <form method="POST">
      <input name="name" />
      <button type="submit">提交</button>
      {data?.ok && <p>你好 {data.name}</p>}
    </form>
  );
}`,
  },
  cookie: {
    lang: "ts",
    title: "Set-Cookie",
    code: `return new Response(null, {
  status: 303,
  headers: {
    Location: "/dashboard",
    "Set-Cookie":
      "session=abc; Path=/; HttpOnly; Secure; SameSite=Lax",
  },
});`,
  },
  context: {
    lang: "ts",
    title: "ctx.state",
    code: `export interface State {
  user?: { id: string; name: string };
}

// middleware
ctx.state.user = { id: "1", name: "Ada" };

// handler
const user = ctx.state.user;`,
  },
  layout: {
    lang: "tsx",
    title: "_app 布局",
    code: `export default function App({ Component }) {
  return (
    <div class="layout">
      <nav><a href="/">Home</a></nav>
      <main><Component /></main>
    </div>
  );
}`,
  },
  fetch: {
    lang: "ts",
    title: "API JSON",
    code: `// routes/api/hello.ts
export const handler = {
  GET() {
    return Response.json({ ok: true, msg: "hello fresh" });
  },
};

// client
const data = await fetch("/api/hello").then((r) => r.json());`,
  },
  partial: {
    lang: "tsx",
    title: "Partial",
    code: `import { Partial } from "$fresh/runtime.ts";

export default function Page() {
  return (
    <Partial name="list">
      <ul>
        <li>可被局部替换</li>
      </ul>
    </Partial>
  );
}`,
  },
  todo: {
    lang: "tsx",
    title: "笔记列表 Island",
    code: `import { useSignal } from "@preact/signals";

export default function Notes() {
  const text = useSignal("");
  const items = useSignal<string[]>([]);
  return (
    <div>
      <input
        value={text}
        onInput={(e) => (text.value = e.currentTarget.value)}
      />
      <button
        type="button"
        onClick={() => {
          if (!text.value.trim()) return;
          items.value = [...items.value, text.value.trim()];
          text.value = "";
        }}
      >
        添加
      </button>
      <ul>
        {items.value.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}`,
  },
  auth: {
    lang: "ts",
    title: "Bearer 鉴权",
    code: `export const handler = {
  GET(req: Request) {
    const auth = req.headers.get("Authorization");
    if (auth !== "Bearer secret") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ me: "demo" });
  },
};`,
  },
  kv: {
    lang: "ts",
    title: "Deno KV",
    code: `const kv = await Deno.openKv();
await kv.set(["notes", "1"], { title: "hello" });
const entry = await kv.get(["notes", "1"]);
console.log(entry.value);`,
  },
  static: {
    lang: "tsx",
    title: "静态资源",
    code: `<link rel="stylesheet" href="/styles.css" />
<img src="/logo.svg" alt="logo" width="120" />
// 文件位于 static/styles.css、static/logo.svg`,
  },
  plugin: {
    lang: "ts",
    title: "插件配置",
    code: `import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

export default defineConfig({
  plugins: [tailwind()],
});`,
  },
  async: {
    lang: "ts",
    title: "超时 fetch",
    code: `async function fetchWithTimeout(url: string, ms = 3000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}`,
  },
  validate: {
    lang: "ts",
    title: "服务端校验",
    code: `const email = String(form.get("email") ?? "");
const errors: Record<string, string> = {};
if (!/^[^@]+@[^@]+$/.test(email)) {
  errors.email = "邮箱格式不对";
}
if (Object.keys(errors).length) {
  return ctx.render({ errors, email });
}`,
  },
  ssr: {
    lang: "text",
    title: "SSR 流水线",
    code: `Request
  → middleware
  → handler (data)
  → JSX → HTML
  → browser paint
  → island hydrate`,
  },
  deploy: {
    lang: "text",
    title: "Deploy 清单",
    code: `- 密钥进环境变量
- Cookie Secure
- 404/500 就绪
- 主路径烟雾测试
- Git → Deno Deploy`,
  },
  tsx: {
    lang: "tsx",
    title: "组件 props",
    code: `interface Props {
  label: string;
  active?: boolean;
}

export function Chip({ label, active = false }: Props) {
  return (
    <span class={active ? "chip on" : "chip"}>{label}</span>
  );
}`,
  },
  params: {
    lang: "tsx",
    title: "动态参数",
    code: `// routes/users/[id].tsx
import { PageProps } from "$fresh/server.ts";

export default function User(props: PageProps) {
  return <p>用户 ID：{props.params.id}</p>;
}`,
  },
  error: {
    lang: "tsx",
    title: "404 页",
    code: `// routes/_404.tsx
export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <a href="/">回首页</a>
    </div>
  );
}`,
  },
  streaming: {
    lang: "ts",
    title: "缓存头",
    code: `return new Response(body, {
  headers: {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "public, max-age=60",
  },
});`,
  },
};

export function getDemoSource(kind: DemoKind): DemoSource {
  return DEMO_SOURCES[kind] ?? DEMO_SOURCES.counter;
}
