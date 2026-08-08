import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";

export const Route = createFileRoute("/cheatsheet")({
  component: CheatsheetPage,
});

const SECTIONS: { title: string; items: { k: string; v: string }[] }[] = [
  {
    title: "核心概念",
    items: [
      { k: "routes/", v: "文件路由；index → /；[id] 动态段" },
      { k: "islands/", v: "客户端水合组件；按需 JS" },
      { k: "components/", v: "纯服务端组件；无 onClick" },
      { k: "static/", v: "静态资源映射到站点根" },
      { k: "handler", v: "GET/POST… 取数；ctx.render(data)" },
      { k: "props.data", v: "页面读 handler 数据" },
      { k: "_middleware.ts", v: "请求管道；ctx.state；ctx.next()" },
      { k: "_app.tsx", v: "全站壳；渲染 <Component />" },
    ],
  },
  {
    title: "Preact / Signals",
    items: [
      { k: "useSignal(x)", v: "组件内信号；.value 读写" },
      { k: "signal(x)", v: "模块级共享状态" },
      { k: "computed", v: "派生值；自动追踪依赖" },
      { k: "class", v: "JSX 类名惯用 class" },
      { k: "onClick", v: "事件；仅 island 内" },
    ],
  },
  {
    title: "HTTP 与数据",
    items: [
      { k: "Response.json", v: "API 返回 JSON" },
      { k: "req.formData()", v: "解析表单 POST" },
      { k: "Set-Cookie", v: "HttpOnly; Secure; SameSite" },
      { k: "Authorization", v: "Bearer token 模式" },
      { k: "AbortController", v: "超时/取消 fetch" },
      { k: "Deno.env.get", v: "服务端密钥" },
      { k: "Deno.openKv()", v: "内置 KV" },
    ],
  },
  {
    title: "工程",
    items: [
      { k: "deno.json", v: "tasks + imports" },
      { k: "deno task start", v: "本地开发" },
      { k: "deno fmt / lint / test", v: "格式、检查、测试" },
      { k: "fresh.config.ts", v: "plugins 等" },
      { k: "Deno Deploy", v: "Git 集成一键上线" },
      { k: "Partial", v: "局部 DOM 更新" },
    ],
  },
  {
    title: "安全与性能",
    items: [
      { k: "少 island", v: "性能第一杠杆" },
      { k: "可序列化 props", v: "勿传函数进 island props" },
      { k: "服务端再校验", v: "前端校验可绕过" },
      { k: "勿泄漏密钥", v: "密钥别进 island 打包" },
      { k: "XSS", v: "慎用原始 HTML 插入" },
    ],
  },
];

function CheatsheetPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <BookMarked className="h-3.5 w-3.5" />
          速查
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg sm:text-3xl">
          Fresh 速查表
        </h1>
        <p className="mt-2 text-sm text-muted">
          写码时扫一眼。系统学习请回{" "}
          <Link to="/" className="text-primary hover:underline">
            首页路径
          </Link>
          。
        </p>
      </header>

      <div className="space-y-5">
        {SECTIONS.map((sec) => (
          <section
            key={sec.title}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <h2 className="border-b border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold text-fg">
              {sec.title}
            </h2>
            <ul className="divide-y divide-border">
              {sec.items.map((item) => (
                <li
                  key={item.k}
                  className="grid gap-1 px-4 py-2.5 sm:grid-cols-[10rem_1fr] sm:gap-4"
                >
                  <code className="font-mono text-xs font-medium text-primary">
                    {item.k}
                  </code>
                  <span className="text-sm text-muted">{item.v}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
