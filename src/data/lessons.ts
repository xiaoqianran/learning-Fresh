export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type DemoKind =
  | "counter"
  | "route"
  | "island"
  | "signal"
  | "handler"
  | "middleware"
  | "form"
  | "cookie"
  | "context"
  | "layout"
  | "fetch"
  | "partial"
  | "todo"
  | "auth"
  | "kv"
  | "static"
  | "plugin"
  | "async"
  | "validate"
  | "ssr"
  | "deploy"
  | "tsx"
  | "params"
  | "error"
  | "streaming";

export type LessonBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; title?: string; lang?: string; code: string }
  | { type: "tip"; body: string }
  | { type: "demo"; kind: DemoKind; title: string; hint?: string }
  | { type: "quiz"; questions: QuizQuestion[] };

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  level: "入门" | "进阶" | "实战";
  track: "基础" | "进阶" | "全栈准备" | "全栈实训" | "工程化" | "进阶模式" | "官网对齐";
  format?: "course" | "reference";
  minutes: number;
  official?: string;
  blocks: LessonBlock[];
};

function q(
  id: string,
  question: string,
  options: string[],
  answer: number,
  explain: string,
): QuizQuestion {
  return { id, question, options, answer, explain };
}

export const LESSONS: Lesson[] = [
  // ───────── ① 基础 ─────────
  {
    slug: "intro",
    title: "Fresh 是什么",
    summary: "Deno 上的全栈 Web 框架：默认零 JS、按需 Islands。",
    level: "入门",
    track: "基础",
    minutes: 6,
    official: "https://fresh.deno.dev/docs/introduction",
    blocks: [
      {
        type: "text",
        title: "一句话",
        body: "Fresh 是 Deno 官方主推的 Web 框架。默认服务端渲染，页面不发客户端 JS；只有标了 island 的交互组件才会水合。语法是 Preact + JSX/TSX。",
      },
      {
        type: "code",
        title: "最小计数器 Island",
        lang: "tsx",
        code: `/** @jsxImportSource preact */
import { useSignal } from "@preact/signals";

export default function Counter() {
  const count = useSignal(0);
  return (
    <button type="button" onClick={() => count.value++}>
      点了 {count} 次
    </button>
  );
}`,
      },
      { type: "demo", kind: "counter", title: "动手：Island 计数器" },
      {
        type: "tip",
        body: "本站用 React 壳承载教学内容；示例源码是真实 Fresh / Preact 写法，Demo 用等价交互帮你验证概念。",
      },
      {
        type: "quiz",
        questions: [
          q("i1", "Fresh 默认是否向浏览器发送整页客户端 JS？", ["是，像 SPA", "否，默认零 JS，仅 island 水合", "只发 jQuery", "只发 Vue"], 1, "Fresh 默认 SSR + 零客户端 JS。"),
          q("i2", "Fresh 的 UI 运行时是？", ["React", "Vue", "Preact", "Svelte"], 2, "基于 Preact。"),
        ],
      },
    ],
  },
  {
    slug: "why-fresh",
    title: "为什么选 Fresh",
    summary: "对比 SPA / Next / Remix：性能、部署、Deno 原生。",
    level: "入门",
    track: "基础",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "定位",
        body: "适合内容站、营销页、带少量交互的产品后台。强依赖大量客户端状态的重度 SPA 也能做，但不是最典型场景。Deno Deploy 一键部署是加分项。",
      },
      {
        type: "code",
        title: "项目创建",
        lang: "bash",
        code: `deno run -A -r https://fresh.deno.dev my-app
cd my-app
deno task start`,
      },
      {
        type: "quiz",
        questions: [
          q("w1", "Fresh 最典型的部署目标？", ["Heroku only", "Deno Deploy", "仅 Windows IIS", "FTP 静态"], 1, "官方与 Deno Deploy 深度集成。"),
        ],
      },
    ],
  },
  {
    slug: "quick-start",
    title: "快速开始",
    summary: "装 Deno、脚手架、跑起第一个项目。",
    level: "入门",
    track: "基础",
    minutes: 8,
    official: "https://fresh.deno.dev/docs/getting-started",
    blocks: [
      {
        type: "text",
        title: "准备",
        body: "需要 Deno 1.x+。Fresh 用 deno.json 管理任务与 import map，没有 node_modules（除非你主动兼容 npm）。",
      },
      {
        type: "code",
        title: "deno.json 片段",
        lang: "json",
        code: `{
  "tasks": {
    "start": "deno run -A --watch=static/,routes/ dev.ts",
    "build": "deno run -A dev.ts build",
    "preview": "deno run -A main.ts"
  },
  "imports": {
    "$fresh/": "https://deno.land/x/fresh/",
    "preact": "https://esm.sh/preact",
    "@preact/signals": "https://esm.sh/*@preact/signals"
  }
}`,
      },
      { type: "demo", kind: "route", title: "路由思维：路径即文件" },
      {
        type: "quiz",
        questions: [
          q("qs1", "Fresh 任务通常写在？", ["package.json only", "deno.json tasks", "Makefile only", "Cargo.toml"], 1, "deno.json 的 tasks 字段。"),
        ],
      },
    ],
  },
  {
    slug: "project-layout",
    title: "目录结构",
    summary: "routes / islands / components / static / fresh.config。",
    level: "入门",
    track: "基础",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "约定优于配置",
        body: "routes/ 定义页面与 API；islands/ 放可交互组件；components/ 放纯服务端组件；static/ 静态资源；fresh.config.ts 配置插件等。",
      },
      {
        type: "code",
        title: "典型树",
        lang: "text",
        code: `my-app/
  routes/
    _app.tsx
    index.tsx
    about.tsx
    api/joke.ts
  islands/
    Counter.tsx
  components/
    Button.tsx
  static/
    styles.css
  fresh.config.ts
  main.ts
  dev.ts`,
      },
      {
        type: "quiz",
        questions: [
          q("pl1", "需要 onClick 的按钮应放在？", ["static/", "islands/", "仅 .md", "deno.lock"], 1, "交互组件放 islands/。"),
        ],
      },
    ],
  },
  {
    slug: "routes",
    title: "文件路由",
    summary: "routes 目录映射 URL，动态参数与索引页。",
    level: "入门",
    track: "基础",
    minutes: 8,
    official: "https://fresh.deno.dev/docs/concepts/routing",
    blocks: [
      {
        type: "text",
        title: "映射规则",
        body: "routes/index.tsx → /；routes/about.tsx → /about；routes/blog/[slug].tsx → /blog/:slug；routes/api/hello.ts 可导出 handler 做 API。",
      },
      {
        type: "code",
        title: "动态路由",
        lang: "tsx",
        code: `// routes/blog/[slug].tsx
import { PageProps } from "$fresh/server.ts";

export default function BlogPost(props: PageProps) {
  const { slug } = props.params;
  return <article><h1>{slug}</h1></article>;
}`,
      },
      { type: "demo", kind: "params", title: "动手：动态参数" },
      {
        type: "quiz",
        questions: [
          q("r1", "routes/users/[id].tsx 对应？", ["/users", "/users/:id", "/[id]/users", "/api/users"], 1, "动态段用 [id]。"),
        ],
      },
    ],
  },
  {
    slug: "components",
    title: "服务端组件",
    summary: "默认组件只在服务端渲染，零水合成本。",
    level: "入门",
    track: "基础",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "默认纯渲染",
        body: "components/ 里的组件没有客户端 JS。可以接收 props、渲染 JSX、组合子组件。不要在这里用 useState/onClick——那属于 island。",
      },
      {
        type: "code",
        title: "纯展示组件",
        lang: "tsx",
        code: `// components/Card.tsx
import { ComponentChildren } from "preact";

export function Card(props: { title: string; children?: ComponentChildren }) {
  return (
    <section class="card">
      <h2>{props.title}</h2>
      {props.children}
    </section>
  );
}`,
      },
      { type: "demo", kind: "tsx", title: "组件组合" },
      {
        type: "quiz",
        questions: [
          q("c1", "服务端组件能否直接 onClick？", ["可以且推荐", "不行，交互应放 island", "只能双击", "只能用 jQuery"], 1, "交互放到 islands。"),
        ],
      },
    ],
  },
  {
    slug: "islands",
    title: "Islands 架构",
    summary: "页面是静海，交互是岛屿——按需水合。",
    level: "入门",
    track: "基础",
    minutes: 10,
    official: "https://fresh.deno.dev/docs/concepts/islands",
    blocks: [
      {
        type: "text",
        title: "核心思想",
        body: "整页 HTML 由服务端吐出。只有 islands/ 导出的组件会打包客户端 JS 并在浏览器水合。把交互边界切小，首屏极快。",
      },
      {
        type: "code",
        title: "在页面中使用 island",
        lang: "tsx",
        code: `// routes/index.tsx
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div>
      <h1>欢迎</h1>
      {/* 仅此处有客户端 JS */}
      <Counter start={0} />
    </div>
  );
}`,
      },
      { type: "demo", kind: "island", title: "动手：岛屿边界" },
      {
        type: "quiz",
        questions: [
          q("is1", "Island 的客户端代码何时加载？", ["永远全站", "仅页面引用到该 island 时", "仅 IE", "从不"], 1, "按需为用到的 island 打包。"),
        ],
      },
    ],
  },
  {
    slug: "signals",
    title: "Signals 状态",
    summary: "用 @preact/signals 做细粒度响应式。",
    level: "入门",
    track: "基础",
    minutes: 9,
    blocks: [
      {
        type: "text",
        title: "signal 与 useSignal",
        body: "signal(0) 创建响应式值；.value 读写。JSX 里可直接插 {count}（自动追踪）。useSignal 适合组件内局部状态；跨组件可模块级 signal。",
      },
      {
        type: "code",
        title: "信号计数",
        lang: "tsx",
        code: `import { useSignal, computed } from "@preact/signals";

export default function Price() {
  const n = useSignal(1);
  const total = computed(() => n.value * 42);
  return (
    <div>
      <button onClick={() => n.value++}>数量 {n}</button>
      <p>合计 {total}</p>
    </div>
  );
}`,
      },
      { type: "demo", kind: "signal", title: "动手：signal + computed" },
      {
        type: "quiz",
        questions: [
          q("sg1", "读取 signal 当前值用？", ["count()", "count.value", "count.get", "*count"], 1, ".value 读写。"),
        ],
      },
    ],
  },
  {
    slug: "jsx-tsx",
    title: "JSX / TSX 语法",
    summary: "class 而非 className；Preact 事件与类型。",
    level: "入门",
    track: "基础",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "与 React 的小差异",
        body: "Fresh/Preact 常用 class（也支持 className）。事件仍是 onClick。推荐 TSX + 类型化 props。",
      },
      {
        type: "code",
        title: "TSX props",
        lang: "tsx",
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
      {
        type: "quiz",
        questions: [
          q("jx1", "Fresh 模板里写 CSS 类名更常见？", ["class", "className only", "css=", "styleName"], 0, "Preact/Fresh 惯用 class。"),
        ],
      },
    ],
  },
  {
    slug: "static-assets",
    title: "静态资源",
    summary: "static/ 目录、缓存头与引用路径。",
    level: "入门",
    track: "基础",
    minutes: 5,
    blocks: [
      {
        type: "text",
        title: "static/",
        body: "static/logo.svg → /logo.svg。适合 CSS、图片、favicon。可在配置里调缓存策略。",
      },
      {
        type: "code",
        title: "引用",
        lang: "tsx",
        code: `<link rel="stylesheet" href="/styles.css" />
<img src="/logo.svg" alt="logo" width="120" />`,
      },
      { type: "demo", kind: "static", title: "静态路径演示" },
      {
        type: "quiz",
        questions: [
          q("st1", "static/app.css 的 URL？", ["/static/app.css", "/app.css", "/public/app.css", "/_fresh/app.css"], 1, "static 根映射到站点根。"),
        ],
      },
    ],
  },
  {
    slug: "styling",
    title: "样式方案",
    summary: "全局 CSS、UnoCSS 插件、scoped 思路。",
    level: "入门",
    track: "基础",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "怎么写样式",
        body: "最简单：static/styles.css + link。进阶：官方/社区 Tailwind 或 UnoCSS 插件。Island 内可写少量内联 style，但全局设计系统更可维护。",
      },
      {
        type: "code",
        title: "链接全局样式",
        lang: "tsx",
        code: `// routes/_app.tsx
export default function App({ Component }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}`,
      },
      {
        type: "quiz",
        questions: [
          q("sy1", "全站布局与 head 常写在？", ["_app.tsx", "package.json", "only island", "README"], 0, "_app 包裹所有页面。"),
        ],
      },
    ],
  },

  // ───────── ② 进阶 ─────────
  {
    slug: "layouts",
    title: "布局 _app 与嵌套",
    summary: "全站壳、导航、页面插槽。",
    level: "进阶",
    track: "进阶",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "_app.tsx",
        body: "routes/_app.tsx 是应用壳：html/head/body、导航、页脚。<Component /> 渲染当前页。",
      },
      {
        type: "code",
        title: "简单布局",
        lang: "tsx",
        code: `import { PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <div class="layout">
      <nav><a href="/">Home</a></nav>
      <main><Component /></main>
    </div>
  );
}`,
      },
      { type: "demo", kind: "layout", title: "布局壳演示" },
      {
        type: "quiz",
        questions: [
          q("ly1", "_app 里渲染子页面的插槽是？", ["<Slot />", "<Component />", "<Outlet />", "<RouterView />"], 1, "Fresh 使用 Component。"),
        ],
      },
    ],
  },
  {
    slug: "handlers",
    title: "Handlers 与数据",
    summary: "handler.GET 拉数据，props.data 渲染。",
    level: "进阶",
    track: "进阶",
    minutes: 10,
    official: "https://fresh.deno.dev/docs/concepts/routes",
    blocks: [
      {
        type: "text",
        title: "服务端取数",
        body: "在路由文件导出 handlers 或 handler，在 GET 里 fetch/读 KV，通过 ctx.render(data) 把数据交给页面组件的 props.data。",
      },
      {
        type: "code",
        title: "handler + 页面",
        lang: "tsx",
        code: `import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers<{ joke: string }> = {
  async GET(_req, ctx) {
    const joke = await fetch("https://api.example/joke").then((r) => r.text());
    return ctx.render({ joke });
  },
};

export default function Page(props: PageProps<{ joke: string }>) {
  return <p>{props.data.joke}</p>;
}`,
      },
      { type: "demo", kind: "handler", title: "动手：handler 取数" },
      {
        type: "quiz",
        questions: [
          q("h1", "页面组件读 handler 数据用？", ["props.data", "props.loader", "useLoaderData", "getServerSideProps"], 0, "Fresh 是 props.data。"),
        ],
      },
    ],
  },
  {
    slug: "middleware",
    title: "中间件",
    summary: "routes/_middleware.ts 拦截请求、鉴权、日志。",
    level: "进阶",
    track: "进阶",
    minutes: 9,
    blocks: [
      {
        type: "text",
        title: "请求管道",
        body: "中间件在路由 handler 前运行，可改写请求、写 header、短路返回 401，或 ctx.state 传上下文。",
      },
      {
        type: "code",
        title: "鉴权中间件",
        lang: "ts",
        code: `// routes/admin/_middleware.ts
import { MiddlewareHandlerContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  const cookie = req.headers.get("cookie") ?? "";
  if (!cookie.includes("session=")) {
    return new Response("Unauthorized", { status: 401 });
  }
  ctx.state.user = { id: "u1" };
  return await ctx.next();
}`,
      },
      { type: "demo", kind: "middleware", title: "中间件管道" },
      {
        type: "quiz",
        questions: [
          q("mw1", "中间件放行后续处理调用？", ["ctx.next()", "next.route()", "res.continue()", "handler.pass()"], 0, "await ctx.next()。"),
        ],
      },
    ],
  },
  {
    slug: "context-state",
    title: "Context / state",
    summary: "ctx.state 在中间件与 handler 间传递。",
    level: "进阶",
    track: "进阶",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "共享请求态",
        body: "中间件解析用户后写入 ctx.state，下游 handler 与页面可读取。注意类型扩展 State 接口。",
      },
      {
        type: "code",
        title: "类型化 state",
        lang: "ts",
        code: `export interface State {
  user?: { id: string; name: string };
}

// handler 中
const user = ctx.state.user;`,
      },
      { type: "demo", kind: "context", title: "state 传递" },
      {
        type: "quiz",
        questions: [
          q("cx1", "跨中间件/handler 共享数据常用？", ["全局 var", "ctx.state", "window", "localStorage only"], 1, "ctx.state 绑定单次请求。"),
        ],
      },
    ],
  },
  {
    slug: "forms-basic",
    title: "表单与 POST",
    summary: "原生 form POST 到 handler，无客户端 JS。",
    level: "进阶",
    track: "进阶",
    minutes: 9,
    blocks: [
      {
        type: "text",
        title: "渐进增强",
        body: "Fresh 鼓励 HTML form + handler.POST。即使禁用 JS 也能提交。需要即时校验时再加 island。",
      },
      {
        type: "code",
        title: "POST handler",
        lang: "tsx",
        code: `export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();
    const name = String(form.get("name") ?? "");
    // 保存…
    return ctx.render({ ok: true, name });
  },
};

export default function Page(props: PageProps<{ ok?: boolean; name?: string }>) {
  return (
    <form method="POST">
      <input name="name" />
      <button type="submit">提交</button>
      {props.data?.ok && <p>你好 {props.data.name}</p>}
    </form>
  );
}`,
      },
      { type: "demo", kind: "form", title: "动手：表单 POST" },
      {
        type: "quiz",
        questions: [
          q("fb1", "无 JS 提交表单依赖？", ["仅 fetch", "method=POST + handler.POST", "WebSocket", "localStorage"], 1, "原生 form + POST handler。"),
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie 与会话",
    summary: "Set-Cookie、读取会话、安全标志。",
    level: "进阶",
    track: "进阶",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "会话基础",
        body: "登录成功 Set-Cookie；后续请求 Cookie 头带回。HttpOnly / Secure / SameSite 是标配。",
      },
      {
        type: "code",
        title: "写 Cookie",
        lang: "ts",
        code: `return new Response(null, {
  status: 303,
  headers: {
    Location: "/dashboard",
    "Set-Cookie": "session=abc; Path=/; HttpOnly; Secure; SameSite=Lax",
  },
});`,
      },
      { type: "demo", kind: "cookie", title: "Cookie 会话示意" },
      {
        type: "quiz",
        questions: [
          q("ck1", "防 XSS 偷 Cookie 应设？", ["HttpOnly", "无标志", "仅 Max-Age=0", "Domain=*"], 0, "HttpOnly 禁止 JS 读取。"),
        ],
      },
    ],
  },
  {
    slug: "error-pages",
    title: "错误页与 404",
    summary: "_404 / _500 与主动抛错。",
    level: "进阶",
    track: "进阶",
    minutes: 6,
    blocks: [
      {
        type: "text",
        title: "约定文件",
        body: "routes/_404.tsx、_500.tsx 自定义错误页。handler 可 return new Response(..., { status: 404 })。",
      },
      {
        type: "code",
        title: "404 页",
        lang: "tsx",
        code: `export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <a href="/">回首页</a>
    </div>
  );
}`,
      },
      { type: "demo", kind: "error", title: "错误态演示" },
      {
        type: "quiz",
        questions: [
          q("er1", "自定义 404 文件名？", ["_404.tsx", "notfound.js", "404.html only", "error.vue"], 0, "routes/_404.tsx。"),
        ],
      },
    ],
  },
  {
    slug: "plugins",
    title: "插件系统",
    summary: "fresh.config 注册 Tailwind 等插件。",
    level: "进阶",
    track: "进阶",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "扩展构建",
        body: "插件可注入中间件、构建步骤、路由。官方文档有 twind/tailwind 等示例。",
      },
      {
        type: "code",
        title: "fresh.config.ts",
        lang: "ts",
        code: `import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

export default defineConfig({
  plugins: [tailwind()],
});`,
      },
      { type: "demo", kind: "plugin", title: "插件概念" },
      {
        type: "quiz",
        questions: [
          q("pg1", "插件列表配置在？", ["fresh.config.ts", "only .env", "Dockerfile", "robots.txt"], 0, "defineConfig({ plugins })。"),
        ],
      },
    ],
  },
  {
    slug: "partials",
    title: "Partials 局部更新",
    summary: "不整页刷新，替换页面片段。",
    level: "进阶",
    track: "进阶",
    minutes: 9,
    official: "https://fresh.deno.dev/docs/concepts/partials",
    blocks: [
      {
        type: "text",
        title: "f-partial",
        body: "Partials 让链接/表单只更新页面某一区域，类似小岛式导航增强，仍保持服务端渲染模型。",
      },
      {
        type: "code",
        title: "Partial 标记",
        lang: "tsx",
        code: `import { Partial } from "$fresh/runtime.ts";

export default function Page() {
  return (
    <Partial name="list">
      <ul>{/* 可被局部替换的列表 */}</ul>
    </Partial>
  );
}`,
      },
      { type: "demo", kind: "partial", title: "局部刷新示意" },
      {
        type: "quiz",
        questions: [
          q("pt1", "Partials 的目标？", ["替换整站为 SPA", "局部更新 DOM 片段", "替代 Deno", "编译成 Rust"], 1, "局部更新而非全页重载。"),
        ],
      },
    ],
  },

  // ───────── ③ 全栈准备 ─────────
  {
    slug: "api-routes",
    title: "API 路由",
    summary: "routes/api/* 返回 JSON / Response。",
    level: "进阶",
    track: "全栈准备",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "后端即路由",
        body: "不必另起 Express。routes/api/notes.ts 导出 handler，返回 JSON。与页面共享中间件与 Deno API。",
      },
      {
        type: "code",
        title: "JSON API",
        lang: "ts",
        code: `// routes/api/hello.ts
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    return Response.json({ ok: true, msg: "hello fresh" });
  },
};`,
      },
      { type: "demo", kind: "fetch", title: "调用 API" },
      {
        type: "quiz",
        questions: [
          q("ap1", "返回 JSON 推荐？", ["Response.json(...)", "res.send()", "ctx.json only Vue", "echo"], 0, "Web 标准 Response.json。"),
        ],
      },
    ],
  },
  {
    slug: "async-data",
    title: "异步与加载态",
    summary: "handler 异步、超时、错误边界。",
    level: "进阶",
    track: "全栈准备",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "服务端等待",
        body: "在 handler 里 await 外部 API。可用 Promise.race 做超时。失败时 render 错误态或 502。",
      },
      {
        type: "code",
        title: "超时包装",
        lang: "ts",
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
      { type: "demo", kind: "async", title: "异步三态" },
      {
        type: "quiz",
        questions: [
          q("ad1", "取消 fetch 用？", ["AbortController", "stopFetch()", "xhr.abort only", "Deno.exit"], 0, "标准 AbortController。"),
        ],
      },
    ],
  },
  {
    slug: "validation",
    title: "输入校验",
    summary: "formData 校验、Zod/手动规则、回显错误。",
    level: "进阶",
    track: "全栈准备",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "永远校验服务端",
        body: "客户端提示可有可无；handler 必须再验。返回字段级错误到 props.data.errors。",
      },
      {
        type: "code",
        title: "简单校验",
        lang: "ts",
        code: `const email = String(form.get("email") ?? "");
const errors: Record<string, string> = {};
if (!/^[^@]+@[^@]+$/.test(email)) errors.email = "邮箱格式不对";
if (Object.keys(errors).length) {
  return ctx.render({ errors, email });
}`,
      },
      { type: "demo", kind: "validate", title: "表单校验" },
      {
        type: "quiz",
        questions: [
          q("vl1", "只做前端校验够吗？", ["够", "不够，服务端必须再验", "仅 CSRF 即可", "仅 HTTPS 即可"], 1, "前端可绕过。"),
        ],
      },
    ],
  },
  {
    slug: "auth-patterns",
    title: "鉴权模式",
    summary: "Session cookie、Bearer、中间件保护路由。",
    level: "进阶",
    track: "全栈准备",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "常见套路",
        body: "登录写 session；_middleware 校验；API 也可 Authorization: Bearer。前端展示登录态 ≠ 安全边界。",
      },
      {
        type: "code",
        title: "保护 API",
        lang: "ts",
        code: `export const handler: Handlers = {
  GET(req) {
    const auth = req.headers.get("Authorization");
    if (auth !== "Bearer secret") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ me: "demo" });
  },
};`,
      },
      { type: "demo", kind: "auth", title: "401 与登录" },
      {
        type: "quiz",
        questions: [
          q("au1", "未登录访问受保护 API 应？", ["200 空数据", "401/303 登录", "永远 500", "忽略"], 1, "401 或重定向登录。"),
        ],
      },
    ],
  },
  {
    slug: "ssr-model",
    title: "SSR 心智模型",
    summary: "请求来、HTML 走、岛再醒。",
    level: "进阶",
    track: "全栈准备",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "一次请求的一生",
        body: "Request → middleware → handler 取数 → 渲染 JSX 为 HTML → 浏览器显示 → island 脚本水合交互。",
      },
      {
        type: "code",
        title: "不要在服务端用 window",
        lang: "ts",
        code: `// 坏：handler / 服务端组件
// window.localStorage.getItem("x")

// 好：仅 island 内
if (typeof document !== "undefined") {
  // 浏览器 API
}`,
      },
      { type: "demo", kind: "ssr", title: "SSR 流程" },
      {
        type: "quiz",
        questions: [
          q("ss1", "handler 里能否用 window？", ["能", "不能，无 DOM", "仅 Firefox", "仅用 deno 前缀就能"], 1, "服务端无 window。"),
        ],
      },
    ],
  },
  {
    slug: "env-config",
    title: "环境变量",
    summary: "Deno.env、密钥、本地 .env。",
    level: "进阶",
    track: "全栈准备",
    minutes: 6,
    blocks: [
      {
        type: "text",
        title: "密钥管理",
        body: "用 Deno.env.get(\"API_KEY\")。部署时在 Deno Deploy 控制台配置。切勿把密钥写进 islands 打包的客户端代码。",
      },
      {
        type: "code",
        title: "读取环境变量",
        lang: "ts",
        code: `const key = Deno.env.get("OPENAI_API_KEY");
if (!key) throw new Error("missing OPENAI_API_KEY");`,
      },
      {
        type: "quiz",
        questions: [
          q("ev1", "服务端读环境变量？", ["Deno.env.get", "process.env only always", "import.meta.env.VITE 进 island 密钥", "alert"], 0, "Deno.env.get。"),
        ],
      },
    ],
  },

  // ───────── ④ 全栈实训 ─────────
  {
    slug: "rest-crud",
    title: "REST CRUD 实战",
    summary: "笔记 API：列表、创建、更新、删除。",
    level: "实战",
    track: "全栈实训",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "资源设计",
        body: "GET/POST /api/notes，PUT/DELETE /api/notes/:id。配合工坊用模拟 REST 练一遍完整闭环。",
      },
      {
        type: "code",
        title: "创建笔记",
        lang: "ts",
        code: `export const handler: Handlers = {
  async POST(req, ctx) {
    const user = ctx.state.user;
    if (!user) return new Response("Unauthorized", { status: 401 });
    const body = await req.json();
    const note = await db.notes.create({
      title: body.title,
      body: body.body,
      userId: user.id,
    });
    return Response.json(note, { status: 201 });
  },
};`,
      },
      { type: "demo", kind: "todo", title: "CRUD 列表" },
      {
        type: "quiz",
        questions: [
          q("rc1", "创建资源成功常见状态码？", ["201", "204 always", "302", "418"], 0, "201 Created。"),
        ],
      },
    ],
  },
  {
    slug: "auth-token",
    title: "Token 会话实训",
    summary: "登录拿 token，带 Authorization，处理 401。",
    level: "实战",
    track: "全栈实训",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "工坊同款",
        body: "打开「工坊」用 demo@fresh.dev / password123 登录，故意触发 401，再完成笔记 CRUD。",
      },
      {
        type: "code",
        title: "客户端带 Token",
        lang: "ts",
        code: `const res = await fetch("/api/notes", {
  headers: {
    Authorization: \`Bearer \${token}\`,
    Accept: "application/json",
  },
});
if (res.status === 401) {
  // 清会话，跳转登录
}`,
      },
      { type: "demo", kind: "auth", title: "Token 与 401" },
      {
        type: "quiz",
        questions: [
          q("at1", "演示账号邮箱？", ["demo@fresh.dev", "admin@admin", "root", "test@vue.dev"], 0, "demo@fresh.dev / password123。"),
        ],
      },
    ],
  },
  {
    slug: "deno-kv",
    title: "Deno KV 入门",
    summary: "内置键值库：存会话与笔记。",
    level: "实战",
    track: "全栈实训",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "零配置存储",
        body: "Deno.openKv() 在 Deploy 上开箱即用。适合会话、计数、小型数据。复杂关系仍考虑 Postgres 等。",
      },
      {
        type: "code",
        title: "KV 读写",
        lang: "ts",
        code: `const kv = await Deno.openKv();
await kv.set(["notes", id], { title, body, at: Date.now() });
const entry = await kv.get(["notes", id]);
console.log(entry.value);`,
      },
      { type: "demo", kind: "kv", title: "KV 心智模型" },
      {
        type: "quiz",
        questions: [
          q("kv1", "打开 Deno KV？", ["Deno.openKv()", "new Redis()", "fs.write", "localStorage.open"], 0, "Deno.openKv()。"),
        ],
      },
    ],
  },
  {
    slug: "deploy-deno",
    title: "部署到 Deno Deploy",
    summary: "Git 集成、项目链接、生产环境变量。",
    level: "实战",
    track: "全栈实训",
    minutes: 9,
    blocks: [
      {
        type: "text",
        title: "上线路径",
        body: "推 GitHub → Deno Deploy 导入仓库 → 选入口 main.ts → 配置环境变量 → 自动构建。",
      },
      {
        type: "code",
        title: "生产检查清单",
        lang: "text",
        code: `- [ ] 密钥在 Deploy 环境变量，不在仓库
- [ ] Cookie Secure + 正确 Domain
- [ ] 404/500 页可用
- [ ] 静态资源缓存合理
- [ ] 烟雾测试主路径：首页 / 登录 / CRUD`,
      },
      { type: "demo", kind: "deploy", title: "部署清单" },
      {
        type: "quiz",
        questions: [
          q("dp1", "Fresh 官方友好的托管？", ["Deno Deploy", "仅 FTP", "仅家用 NAS", "仅 IE toolbar"], 0, "Deno Deploy。"),
        ],
      },
    ],
  },
  {
    slug: "capstone",
    title: "毕业作品清单",
    summary: "从零做一个带登录的笔记站。",
    level: "实战",
    track: "全栈实训",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "验收标准",
        body: "注册/登录、中间件保护、笔记 CRUD、基础样式、Deploy 可访问、README 说明。",
      },
      {
        type: "code",
        title: "功能切片",
        lang: "text",
        code: `1. routes + _app 壳
2. islands 计数器热身
3. /api/auth/* + cookie
4. /api/notes CRUD + KV
5. 表单页 + 校验
6. 部署与环境变量`,
      },
      { type: "demo", kind: "todo", title: "作品任务板" },
      {
        type: "quiz",
        questions: [
          q("cp1", "毕业作品最低后端能力？", ["仅静态 HTML", "鉴权 + CRUD", "仅 CSS 动画", "仅 Markdown"], 1, "鉴权与 CRUD 是全栈底线。"),
        ],
      },
    ],
  },

  // ───────── ⑤ 工程化 ─────────
  {
    slug: "typescript",
    title: "TypeScript 与 Fresh",
    summary: "PageProps、Handlers 泛型、严格模式。",
    level: "进阶",
    track: "工程化",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "类型从路由长出来",
        body: "Handlers<T> 与 PageProps<T> 共用 data 形状，改一处类型两边报错，最省心。",
      },
      {
        type: "code",
        title: "共享 Data 类型",
        lang: "tsx",
        code: `type Data = { items: { id: string; title: string }[] };

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    return ctx.render({ items: [] });
  },
};

export default function Page(props: PageProps<Data>) {
  return <ul>{props.data.items.map((i) => <li key={i.id}>{i.title}</li>)}</ul>;
}`,
      },
      {
        type: "quiz",
        questions: [
          q("ts1", "页面 data 类型应对齐？", ["Handlers 泛型", "任意 any", "仅 CSS", "仅 slug"], 0, "Handlers<Data> 与 PageProps<Data>。"),
        ],
      },
    ],
  },
  {
    slug: "testing",
    title: "测试入门",
    summary: "deno test、handler 单测、关键路径。",
    level: "进阶",
    track: "工程化",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "测什么",
        body: "优先测纯函数与 handler 状态码/JSON。UI 可用少量浏览器测试。",
      },
      {
        type: "code",
        title: "deno test 示例",
        lang: "ts",
        code: `import { assertEquals } from "$std/assert/mod.ts";

Deno.test("sum", () => {
  assertEquals(1 + 2, 3);
});`,
      },
      {
        type: "quiz",
        questions: [
          q("tt1", "Deno 内置测试命令？", ["deno test", "jest only", "phpunit", "cargo test only"], 0, "deno test。"),
        ],
      },
    ],
  },
  {
    slug: "lint-fmt",
    title: "Lint 与格式化",
    summary: "deno lint / deno fmt 统一风格。",
    level: "入门",
    track: "工程化",
    minutes: 5,
    blocks: [
      {
        type: "text",
        title: "零配置工具链",
        body: "deno fmt、deno lint 开箱即用，CI 里加一步即可卡住风格漂移。",
      },
      {
        type: "code",
        title: "CI 片段",
        lang: "yaml",
        code: `- run: deno fmt --check
- run: deno lint
- run: deno test -A`,
      },
      {
        type: "quiz",
        questions: [
          q("lf1", "检查格式是否已格式化？", ["deno fmt --check", "deno fmt --force-yes", "eslint --fix only", "prettier 必须"], 0, "fmt --check 用于 CI。"),
        ],
      },
    ],
  },
  {
    slug: "import-maps",
    title: "Import Maps",
    summary: "deno.json imports、版本锁定、npm: 说明。",
    level: "进阶",
    track: "工程化",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "别名与锁定",
        body: "imports 把 $fresh/ 映射到 URL。deno.lock 锁版本。也可 npm: 前缀拉 npm 包。",
      },
      {
        type: "code",
        title: "imports",
        lang: "json",
        code: `{
  "imports": {
    "$fresh/": "https://deno.land/x/fresh/",
    "$std/": "https://deno.land/std@0.224.0/",
    "preact": "https://esm.sh/preact@10.22.0"
  }
}`,
      },
      {
        type: "quiz",
        questions: [
          q("im1", "Fresh 路径别名常写在？", ["deno.json imports", "only tsconfig paths for tsc node", "hosts 文件", "CSS @import"], 0, "deno.json imports。"),
        ],
      },
    ],
  },
  {
    slug: "ci-cd",
    title: "CI/CD",
    summary: "GitHub Actions + Deploy 自动发布。",
    level: "进阶",
    track: "工程化",
    minutes: 7,
    blocks: [
      {
        type: "text",
        title: "流水线",
        body: "PR：fmt/lint/test；main：Deploy 自动构建。本学习站本身也可 GitHub Pages 静态发布教学内容。",
      },
      {
        type: "code",
        title: "最小 Actions",
        lang: "yaml",
        code: `on: [push]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v1
      - run: deno fmt --check
      - run: deno lint
      - run: deno test -A`,
      },
      {
        type: "quiz",
        questions: [
          q("ci1", "Actions 里装 Deno 常用？", ["denoland/setup-deno", "setup-php", "install-vue-cli", "npx create-react-app"], 0, "官方 setup-deno。"),
        ],
      },
    ],
  },

  // ───────── ⑥ 进阶模式 ─────────
  {
    slug: "island-patterns",
    title: "Island 设计模式",
    summary: "边界怎么切、props 序列化、避免过大岛。",
    level: "进阶",
    track: "进阶模式",
    minutes: 9,
    blocks: [
      {
        type: "text",
        title: "切岛原则",
        body: "一个交互焦点 = 一个岛。不要把整页做成巨型 island，否则回到 SPA 体积。props 必须可序列化。",
      },
      {
        type: "code",
        title: "好的边界",
        lang: "tsx",
        code: `// 页面：大量静态 SEO 文案（服务端）
// 岛：仅搜索框 / 仅点赞按钮 / 仅图表
<ArticleMarkdown body={md} />
<LikeButton id={post.id} initial={post.likes} />`,
      },
      { type: "demo", kind: "island", title: "切岛练习" },
      {
        type: "quiz",
        questions: [
          q("ip1", "Island props 应？", ["可序列化", "传函数与 class 实例", "传 window", "传 socket"], 0, "需序列化到 HTML。"),
        ],
      },
    ],
  },
  {
    slug: "performance",
    title: "性能模式",
    summary: "少 JS、缓存、图片、流式可能性。",
    level: "进阶",
    track: "进阶模式",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "性能清单",
        body: "减少 island 数量与体积；静态资源长期缓存；图片尺寸正确；handler 避免 N+1 请求。",
      },
      {
        type: "code",
        title: "Cache-Control",
        lang: "ts",
        code: `return new Response(html, {
  headers: {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "public, max-age=60",
  },
});`,
      },
      { type: "demo", kind: "streaming", title: "性能相关" },
      {
        type: "quiz",
        questions: [
          q("pf1", "Fresh 性能第一杠杆？", ["尽量少客户端 JS", "全站 island", "关掉 SSR", "仅用 base64 图"], 0, "默认零 JS 是核心优势。"),
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "安全清单",
    summary: "XSS、CSRF、密钥、依赖。",
    level: "进阶",
    track: "进阶模式",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "基线",
        body: "输出默认转义；慎用 dangerouslySetInnerHTML 等价物；Cookie SameSite；状态变更验证来源；密钥只留服务端。",
      },
      {
        type: "code",
        title: "注意原始 HTML",
        lang: "tsx",
        code: `// 危险：未消毒的用户 HTML
// <div dangerouslySetInnerHTML={{ __html: userHtml }} />

// 更好：纯文本或可信 Markdown 消毒后输出`,
      },
      {
        type: "quiz",
        questions: [
          q("sc1", "用户 HTML 直接插入会？", ["XSS 风险", "自动变安全", "加速 SEO", "无影响"], 0, "可能导致 XSS。"),
        ],
      },
    ],
  },
  {
    slug: "interview-fresh",
    title: "面试串讲",
    summary: "用一张图讲完 Fresh 架构。",
    level: "进阶",
    track: "进阶模式",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "口述提纲",
        body: "1) Deno 运行时 2) 文件路由 3) SSR 默认 4) Islands 按需水合 5) handler 取数 6) Deploy。对比 Next：无 Node 必须、默认更少 JS。",
      },
      {
        type: "code",
        title: "一分钟架构",
        lang: "text",
        code: `Request
  → middleware (auth/log)
  → route handler (data)
  → JSX render → HTML
  → browser paint
  → island hydrate (only if needed)`,
      },
      {
        type: "quiz",
        questions: [
          q("iv1", "Fresh 与传统 SPA 最大差别？", ["默认 SSR + 少 JS", "不能写后端", "不能用 TS", "必须 jQuery"], 0, "SSR 与按需岛。"),
        ],
      },
    ],
  },
  {
    slug: "fresh-vs-others",
    title: "与其他框架对比",
    summary: "Next / Remix / Astro / Vue SSR。",
    level: "进阶",
    track: "进阶模式",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "怎么选",
        body: "团队在 Node/React 生态 → Next/Remix；内容站多静态 → Astro；Deno/边缘优先 → Fresh。没有银弹。",
      },
      {
        type: "code",
        title: "对照表（心智）",
        lang: "text",
        code: `Fresh  → Deno, islands, 零 JS 默认
Next   → Node/React, 生态大
Remix  → Web 标准 form/fetch 深
Astro  → 多框架岛屿、内容站`,
      },
      {
        type: "quiz",
        questions: [
          q("vs1", "边缘 Deno 优先更贴？", ["Fresh", "只 jQuery", "Flash", "PHP 4"], 0, "Fresh。"),
        ],
      },
    ],
  },

  // ───────── ⑦ 官网对齐（reference） ─────────
  {
    slug: "docs-intro",
    title: "文档：Introduction",
    summary: "对照官网介绍页。",
    level: "入门",
    track: "官网对齐",
    format: "reference",
    minutes: 4,
    official: "https://fresh.deno.dev/docs/introduction",
    blocks: [
      {
        type: "text",
        body: "官网 Introduction 讲设计目标：简单、快速、边缘友好。本课 intro / why-fresh 已覆盖主路径。",
      },
      {
        type: "quiz",
        questions: [
          q("di1", "Fresh 文档站点？", ["fresh.deno.dev", "fresh.vuejs.org", "getfresh.com", "npmjs.com/fresh-css"], 0, "fresh.deno.dev。"),
        ],
      },
    ],
  },
  {
    slug: "docs-routing",
    title: "文档：Routing",
    summary: "动态路由、分组、方法。",
    level: "入门",
    track: "官网对齐",
    format: "reference",
    minutes: 4,
    official: "https://fresh.deno.dev/docs/concepts/routing",
    blocks: [
      {
        type: "text",
        body: "详见主修「文件路由」「Handlers」。可选阅读官网 Advanced routing。",
      },
      {
        type: "quiz",
        questions: [
          q("dr1", "动态段语法？", ["[slug]", "{slug}", ":slug.vue", "*slug.jsx only"], 0, "[slug]。"),
        ],
      },
    ],
  },
  {
    slug: "docs-islands",
    title: "文档：Islands",
    summary: "水合与交互边界。",
    level: "入门",
    track: "官网对齐",
    format: "reference",
    minutes: 4,
    official: "https://fresh.deno.dev/docs/concepts/islands",
    blocks: [
      {
        type: "text",
        body: "主修 islands / signals / island-patterns 已展开。官网有更多边缘案例。",
      },
      {
        type: "quiz",
        questions: [
          q("dis1", "交互组件目录？", ["islands/", "server-only/", "cgi-bin/", "vendor/php"], 0, "islands/。"),
        ],
      },
    ],
  },
  {
    slug: "docs-handlers",
    title: "文档：Handlers",
    summary: "HTTP 方法与 render。",
    level: "入门",
    track: "官网对齐",
    format: "reference",
    minutes: 4,
    official: "https://fresh.deno.dev/docs/concepts/routes",
    blocks: [
      {
        type: "text",
        body: "handler.GET/POST/... 与 ctx.render 是数据入口。见主修 handlers / forms-basic / api-routes。",
      },
      {
        type: "quiz",
        questions: [
          q("dh1", "把数据交给页面？", ["ctx.render(data)", "res.vue(data)", "only useEffect", "alert(data)"], 0, "ctx.render。"),
        ],
      },
    ],
  },
  {
    slug: "docs-middleware",
    title: "文档：Middleware",
    summary: "官网中间件说明。",
    level: "入门",
    track: "官网对齐",
    format: "reference",
    minutes: 3,
    official: "https://fresh.deno.dev/docs/concepts/middleware",
    blocks: [
      {
        type: "text",
        body: "对照主修 middleware / context-state / auth-patterns。",
      },
      {
        type: "quiz",
        questions: [
          q("dm1", "子目录中间件文件？", ["_middleware.ts", "middleware.vue", "express.js", "gatekeeper.php"], 0, "_middleware.ts。"),
        ],
      },
    ],
  },
  {
    slug: "docs-partials",
    title: "文档：Partials",
    summary: "局部导航更新。",
    level: "入门",
    track: "官网对齐",
    format: "reference",
    minutes: 3,
    official: "https://fresh.deno.dev/docs/concepts/partials",
    blocks: [
      {
        type: "text",
        body: "见主修 partials。适合列表筛选、分页等不必整页刷新的场景。",
      },
      {
        type: "quiz",
        questions: [
          q("dpt1", "Partial 组件来自？", ["$fresh/runtime.ts", "jquery", "lodash", "moment"], 0, "$fresh/runtime。"),
        ],
      },
    ],
  },
  {
    slug: "docs-app-wrapper",
    title: "文档：App wrapper",
    summary: "_app 与文档布局章节。",
    level: "入门",
    track: "官网对齐",
    format: "reference",
    minutes: 3,
    blocks: [
      {
        type: "text",
        body: "见 layouts / styling。_app 负责 document 壳与公共导航。",
      },
      {
        type: "quiz",
        questions: [
          q("da1", "全站壳文件？", ["_app.tsx", "_document.php", "App.vue only", "layout.css only"], 0, "_app.tsx。"),
        ],
      },
    ],
  },
  {
    slug: "docs-deploy",
    title: "文档：Deployment",
    summary: "Deploy 与自托管提示。",
    level: "入门",
    track: "官网对齐",
    format: "reference",
    minutes: 3,
    official: "https://fresh.deno.dev/docs/concepts/deployment",
    blocks: [
      {
        type: "text",
        body: "主修 deploy-deno。也可自托管 deno run -A main.ts。",
      },
      {
        type: "quiz",
        questions: [
          q("dd1", "生产入口常见？", ["main.ts", "index.php", "app.exe", "only Dockerfile.scratch"], 0, "main.ts 常见。"),
        ],
      },
    ],
  },
  {
    slug: "docs-plugins",
    title: "文档：Plugins",
    summary: "插件扩展点。",
    level: "入门",
    track: "官网对齐",
    format: "reference",
    minutes: 3,
    blocks: [
      {
        type: "text",
        body: "见 plugins。从官方仓库示例抄配置最快。",
      },
      {
        type: "quiz",
        questions: [
          q("dpl1", "注册插件？", ["defineConfig({ plugins })", "plugins.html", "only CDN script", "Windows 注册表"], 0, "fresh.config。"),
        ],
      },
    ],
  },
  {
    slug: "docs-server",
    title: "文档：Server concepts",
    summary: "Request/Response 标准。",
    level: "入门",
    track: "官网对齐",
    format: "reference",
    minutes: 3,
    blocks: [
      {
        type: "text",
        body: "Fresh 站在 Web 标准上：Request、Response、Headers、fetch。会标准就好迁移。",
      },
      {
        type: "quiz",
        questions: [
          q("dsv1", "handler 收到的请求类型？", ["Request", "IncomingMessage only", "HttpServlet", "Socket"], 0, "标准 Request。"),
        ],
      },
    ],
  },
];

export const TRACKS = [
  "基础",
  "进阶",
  "全栈准备",
  "全栈实训",
  "工程化",
  "进阶模式",
  "官网对齐",
] as const;

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonIndex(slug: string): number {
  return LESSONS.findIndex((l) => l.slug === slug);
}

export function getAdjacent(slug: string): {
  prev?: Lesson;
  next?: Lesson;
} {
  const i = getLessonIndex(slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? LESSONS[i - 1] : undefined,
    next: i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined,
  };
}

export function getLessonsByTrack(track: Lesson["track"]) {
  return LESSONS.filter((l) => l.track === track);
}

export function getAllQuizQuestions(): Array<
  QuizQuestion & { lessonSlug: string; lessonTitle: string }
> {
  const out: Array<QuizQuestion & { lessonSlug: string; lessonTitle: string }> =
    [];
  for (const lesson of LESSONS) {
    for (const block of lesson.blocks) {
      if (block.type === "quiz") {
        for (const q of block.questions) {
          out.push({
            ...q,
            lessonSlug: lesson.slug,
            lessonTitle: lesson.title,
          });
        }
      }
    }
  }
  return out;
}

export function isCourseLesson(l: Lesson): boolean {
  if (l.format === "reference") return false;
  if (l.format === "course") return true;
  return l.track !== "官网对齐";
}

export function getCourseLessons(): Lesson[] {
  return LESSONS.filter(isCourseLesson);
}
