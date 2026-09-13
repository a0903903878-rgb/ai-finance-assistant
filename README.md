# 項目技術規範

## 技術棧

- 前端: React 19 + TypeScript
- 樣式: Tailwind CSS v4
- UI 元件: shadcn/ui `import { Button } from "@/components/ui/button";`
- 圖示: lucide-react `import { SearchIcon } from "lucide-react";`
- 圖表: echarts-for-react `import ReactECharts from "echarts-for-react";`
- 動畫: framer-motion `import { motion } from "framer-motion";`
- 路由: react-router-dom `import { Link, useNavigate } from "react-router-dom";`

---

## 目錄結構

```
src/
├── index.tsx            # 入口（勿修改）
├── app.tsx              # 路由配置（僅在 <Routes> 內增刪 <Route>）
├── index.css            # 全域樣式 + 主題變數
├── components/          # 基礎 UI 元件（禁止存放業務元件）
│   ├── layout.tsx       # 全域佈局容器（含 <Outlet />）
│   └── ui/              # shadcn/ui 內建元件（勿修改）
├── pages/               # 頁面模組（每個頁面一個目錄）
│   ├── <PageName>/      # 頁面目錄範例
│   │   ├── PageName.tsx        # 頁面入口檔案與目錄同名
│   │   └── components/         # 頁面專屬元件
│   └── NotFoundPage/
│       └── NotFoundPage.tsx
├── hooks/               # 自訂 Hooks
└── lib/                 # 工具函式（cn() 等）

shared/
└── static/              # 靜態資源
    ├── data/            # 資料檔案（JSON）
    └── images/          # 圖片資源
```

---

## 模板初始狀態

- `app.tsx` 首頁路由指向平台內建的 `<Welcome />` 元件
- 開發時需將 `index` 路由替換為業務首頁，並在 `pages/` 下建立對應頁面目錄
- `layout.tsx` 為空殼容器（僅 `<Outlet />`），需依需求實作導覽與佈局

---

## 禁止修改的檔案

| 檔案 | 原因 |
|------|------|
| `src/index.tsx` | Provider 層級 + 樣式引入，由模板管理 |
| `src/components/ui/*` | shadcn/ui 內建元件，版本鎖定 |

---

## 檔案放置規則

| 內容類型 | 放置位置 |
|---------|---------|
| 新頁面 | `src/pages/<PageName>/PageName.tsx` |
| 頁面專屬元件 | `src/pages/<PageName>/components/` |
| 自訂 Hooks | `src/hooks/` |
| 工具函式 | `src/lib/` |
| 靜態資料檔案 | `shared/static/data/` |
| 靜態圖片 | `shared/static/images/` |

---

## 匯入路徑

```typescript
// @/ 別名 → src/
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// @shared/ 別名 → shared/
import heroImage from "@shared/static/images/hero.png";
import configData from "@shared/static/config.json";
```

---

## 路由配置

- 新增頁面需在 `src/app.tsx` 的 `<Routes>` 內註冊 `<Route>`
- `BrowserRouter` 已在 `index.tsx` 中配置，`app.tsx` 中**禁止**再包裹 Router

---

## 主題變數

主題色定義在 `src/index.css`，透過 `:root` CSS 變數 + `@theme inline` 註冊到 Tailwind。

| 用途 | Tailwind 類別 | CSS 變數 |
|------|--------------|----------|
| 頁面背景 | `bg-background` | `--background` |
| 主文字 | `text-foreground` | `--foreground` |
| 卡片背景 | `bg-card` | `--card` |
| 次要文字 | `text-muted-foreground` | `--muted-foreground` |
| 主色 | `bg-primary` / `text-primary` | `--primary` |
| 強調色 | `bg-accent` | `--accent` |
| 邊框 | `border-border` | `--border` |
| 危險色 | `text-destructive` | `--destructive` |
| 圖表色 | `bg-chart-1` ~ `bg-chart-5` | `--chart-1` ~ `--chart-5` |

HSL 格式使用**空格分隔**：`--primary: hsl(150 60% 40%);`
