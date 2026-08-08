export type FreshPreset = {
  id: string;
  title: string;
  summary: string;
  mainFile: string;
  files: Record<string, string>;
};

export const FRESH_PRESETS: FreshPreset[] = [
  {
    id: "counter",
    title: "计数器 Island",
    summary: "useSignal + 点击事件",
    mainFile: "islands/Counter.tsx",
    files: {
      "islands/Counter.tsx": `/** @jsxImportSource preact */
import { useSignal } from "@preact/signals";

export default function Counter() {
  const count = useSignal(0);
  return (
    <div class="wrap">
      <h1>Fresh Island</h1>
      <p>你点了 <strong>{count}</strong> 次</p>
      <button type="button" onClick={() => count.value++}>count++</button>
      <button type="button" class="ghost" onClick={() => (count.value = 0)}>重置</button>
    </div>
  );
}
`,
      "routes/index.tsx": `import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div>
      <h1>欢迎学习 Fresh</h1>
      <Counter />
    </div>
  );
}
`,
    },
  },
  {
    id: "handler",
    title: "Handler 取数",
    summary: "GET handler + props.data",
    mainFile: "routes/index.tsx",
    files: {
      "routes/index.tsx": `import { Handlers, PageProps } from "$fresh/server.ts";

type Data = { time: string };

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    return ctx.render({ time: new Date().toISOString() });
  },
};

export default function Home(props: PageProps<Data>) {
  return (
    <main>
      <h1>服务端时间</h1>
      <p>{props.data.time}</p>
    </main>
  );
}
`,
    },
  },
  {
    id: "form",
    title: "表单 POST",
    summary: "无 JS 也可提交",
    mainFile: "routes/greet.tsx",
    files: {
      "routes/greet.tsx": `import { Handlers, PageProps } from "$fresh/server.ts";

type Data = { name?: string };

export const handler: Handlers<Data> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    return ctx.render({ name });
  },
};

export default function Greet(props: PageProps<Data>) {
  return (
    <form method="POST">
      <label>
        名字
        <input name="name" />
      </label>
      <button type="submit">打个招呼</button>
      {props.data?.name && <p>你好，{props.data.name}！</p>}
    </form>
  );
}
`,
    },
  },
  {
    id: "api",
    title: "JSON API",
    summary: "routes/api + Response.json",
    mainFile: "routes/api/hello.ts",
    files: {
      "routes/api/hello.ts": `import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    return Response.json({ ok: true, framework: "fresh" });
  },
};
`,
      "islands/HelloClient.tsx": `import { useSignal } from "@preact/signals";

export default function HelloClient() {
  const msg = useSignal("…");
  async function load() {
    const res = await fetch("/api/hello");
    const data = await res.json();
    msg.value = JSON.stringify(data);
  }
  return (
    <div>
      <button type="button" onClick={load}>fetch /api/hello</button>
      <pre>{msg}</pre>
    </div>
  );
}
`,
    },
  },
  {
    id: "middleware",
    title: "中间件鉴权",
    summary: "_middleware + ctx.state",
    mainFile: "routes/admin/_middleware.ts",
    files: {
      "routes/admin/_middleware.ts": `import { MiddlewareHandlerContext } from "$fresh/server.ts";

export interface State {
  user?: { id: string };
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const cookie = req.headers.get("cookie") ?? "";
  if (!cookie.includes("session=")) {
    return new Response("Unauthorized", { status: 401 });
  }
  ctx.state.user = { id: "u1" };
  return await ctx.next();
}
`,
      "routes/admin/index.tsx": `import { PageProps } from "$fresh/server.ts";
import type { State } from "./_middleware.ts";

export default function Admin(props: PageProps<unknown, State>) {
  return <h1>Admin · user {props.state.user?.id}</h1>;
}
`,
    },
  },
];

export function getPreset(id: string): FreshPreset {
  return FRESH_PRESETS.find((p) => p.id === id) ?? FRESH_PRESETS[0]!;
}
