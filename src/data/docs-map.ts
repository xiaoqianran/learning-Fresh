/** 对照 fresh.deno.dev 文档 · 左侧官网 / 右侧本站课 */

export type DocLink = {
  title: string;
  official: string;
  lessonSlug?: string;
  note?: string;
};

export type DocSection = {
  title: string;
  items: DocLink[];
};

const DOCS = "https://fresh.deno.dev/docs";

export const DOC_SECTIONS: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        official: `${DOCS}/introduction`,
        lessonSlug: "intro",
      },
      {
        title: "Getting Started",
        official: `${DOCS}/getting-started`,
        lessonSlug: "quick-start",
      },
      {
        title: "Create a Project",
        official: `${DOCS}/getting-started/create-a-project`,
        lessonSlug: "project-layout",
        note: "目录约定",
      },
      {
        title: "Why Fresh",
        official: `${DOCS}/introduction`,
        lessonSlug: "why-fresh",
      },
    ],
  },
  {
    title: "Concepts",
    items: [
      {
        title: "Routing",
        official: `${DOCS}/concepts/routing`,
        lessonSlug: "routes",
      },
      {
        title: "Routes & Handlers",
        official: `${DOCS}/concepts/routes`,
        lessonSlug: "handlers",
      },
      {
        title: "Islands",
        official: `${DOCS}/concepts/islands`,
        lessonSlug: "islands",
      },
      {
        title: "Middleware",
        official: `${DOCS}/concepts/middleware`,
        lessonSlug: "middleware",
      },
      {
        title: "Partials",
        official: `${DOCS}/concepts/partials`,
        lessonSlug: "partials",
      },
      {
        title: "Deployment",
        official: `${DOCS}/concepts/deployment`,
        lessonSlug: "deploy-deno",
      },
      {
        title: "Plugins",
        official: `${DOCS}/concepts/plugins`,
        lessonSlug: "plugins",
        note: "可选",
      },
      {
        title: "App wrapper",
        official: `${DOCS}/concepts/app-wrapper`,
        lessonSlug: "layouts",
      },
      {
        title: "Static files",
        official: `${DOCS}/concepts/static-files`,
        lessonSlug: "static-assets",
      },
    ],
  },
  {
    title: "本站主修路径",
    items: [
      {
        title: "Signals",
        official: "https://preactjs.com/guide/v10/signals/",
        lessonSlug: "signals",
        note: "Preact Signals",
      },
      {
        title: "Forms",
        official: `${DOCS}/concepts/routes`,
        lessonSlug: "forms-basic",
      },
      {
        title: "Auth patterns",
        official: `${DOCS}/concepts/middleware`,
        lessonSlug: "auth-patterns",
      },
      {
        title: "REST CRUD",
        official: `${DOCS}/concepts/routes`,
        lessonSlug: "rest-crud",
      },
      {
        title: "Deno KV",
        official: "https://docs.deno.com/kv/manual",
        lessonSlug: "deno-kv",
      },
      {
        title: "Token 会话",
        official: `${DOCS}/concepts/middleware`,
        lessonSlug: "auth-token",
      },
      {
        title: "全栈工坊",
        official: `${DOCS}/concepts/routes`,
        lessonSlug: "rest-crud",
        note: "本站 /studio",
      },
      {
        title: "毕业作品",
        official: `${DOCS}/introduction`,
        lessonSlug: "capstone",
      },
      {
        title: "面试串讲",
        official: `${DOCS}/introduction`,
        lessonSlug: "interview-fresh",
      },
      {
        title: "代码实验室",
        official: `${DOCS}/getting-started`,
        note: "本站 /playground",
      },
    ],
  },
  {
    title: "参考卡片",
    items: [
      {
        title: "Docs: Introduction",
        official: `${DOCS}/introduction`,
        lessonSlug: "docs-intro",
      },
      {
        title: "Docs: Routing",
        official: `${DOCS}/concepts/routing`,
        lessonSlug: "docs-routing",
      },
      {
        title: "Docs: Islands",
        official: `${DOCS}/concepts/islands`,
        lessonSlug: "docs-islands",
      },
      {
        title: "Docs: Handlers",
        official: `${DOCS}/concepts/routes`,
        lessonSlug: "docs-handlers",
      },
      {
        title: "Docs: Middleware",
        official: `${DOCS}/concepts/middleware`,
        lessonSlug: "docs-middleware",
      },
      {
        title: "Docs: Partials",
        official: `${DOCS}/concepts/partials`,
        lessonSlug: "docs-partials",
      },
      {
        title: "Docs: App wrapper",
        official: `${DOCS}/concepts/app-wrapper`,
        lessonSlug: "docs-app-wrapper",
      },
      {
        title: "Docs: Deployment",
        official: `${DOCS}/concepts/deployment`,
        lessonSlug: "docs-deploy",
      },
      {
        title: "Docs: Plugins",
        official: `${DOCS}/concepts/plugins`,
        lessonSlug: "docs-plugins",
      },
      {
        title: "Docs: Server",
        official: `${DOCS}/concepts/server`,
        lessonSlug: "docs-server",
      },
    ],
  },
];

export const OFFICIAL_HOME = "https://fresh.deno.dev/";

export function getDocsCoverage() {
  let total = 0;
  let linked = 0;
  for (const sec of DOC_SECTIONS) {
    for (const it of sec.items) {
      total += 1;
      if (it.lessonSlug) linked += 1;
    }
  }
  return {
    total,
    linked,
    percent: total === 0 ? 0 : Math.round((linked / total) * 100),
  };
}
