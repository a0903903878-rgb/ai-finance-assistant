# 💰 AI 理財小助手

> 輸入每月收支，AI 自動生成消費分析與省錢建議

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)]()
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)]()

AI 理財小助手是一個個人理財工具：記錄每月收入與各類別支出，即時掌握消費概況，並透過 AI 生成個人化的消費分析報告——包含花費占比、異常浪費提醒、省錢建議與下月預算規劃。

## ✨ 功能特色

- **📊 收支管理**：支援 7 大支出類別（餐飲、交通、購物、娛樂、水電瓦斯、訂閱服務、其他），可新增、編輯、刪除每一筆紀錄
- **📈 即時概覽**：每月收入、總支出、結餘與儲蓄率一眼掌握，儲蓄率以進度條呈現
- **🤖 AI 消費分析**：串接 AI 能力，逐字串流輸出個人化消費分析報告
  - 各類別花費占比分析
  - 異常浪費偵測與提醒
  - 個人化省錢建議
  - 下月預算規劃
- **🔒 隱私優先**：所有資料（收支紀錄、API Key）只儲存在瀏覽器端，不上傳任何伺服器

## 🚀 快速開始

### 環境需求

- Node.js 18+
- npm

### 安裝與開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 建置

```bash
npm run build
```

> 註：AI 分析功能依賴平台外掛（`@lark-apaas/client-toolkit-lite`），完整功能需在妙搭（Miaoda）平台環境中執行；本機開發可先完成 UI 與紀錄功能。

## 📖 使用方式

1. **設定 API Key**：在頁面頂部輸入你的 AI API Key（僅儲存在瀏覽器本機，不會外傳）
2. **設定每月收入**：輸入你的月收入金額，作為分析基準
3. **記錄支出**：選擇類別、輸入金額與備註，新增每一筆消費；隨時可編輯或刪除
4. **執行 AI 分析**：點擊「開始分析」，AI 會根據你的收支資料生成個人化報告

## 🔒 資料與隱私

- 所有收支資料儲存在瀏覽器 `localStorage`，不會上傳至任何伺服器
- API Key 僅存於瀏覽器端，程式碼中不含任何硬編碼金鑰
- 清除瀏覽器資料（快取）會遺失紀錄，請自行備份

## 🏗️ 專案結構

```
src/
├── index.tsx            # 應用程式入口
├── app.tsx              # 路由配置
├── index.css            # 全域樣式與主題變數
├── components/          # 基礎 UI 元件
│   ├── layout.tsx       # 全域佈局容器
│   └── ui/              # shadcn/ui 元件
├── pages/               # 頁面模組
│   ├── FinanceAssistantPage/
│   │   └── sections/    # 頁面區塊元件
│   └── NotFoundPage/
├── hooks/               # 自訂 Hooks
├── data/                # 資料模型
└── lib/                 # 工具函式

shared/
└── plugin-types.ts      # 平台外掛型別定義
```

## 🛠️ 技術棧

| 類別 | 技術 |
| --- | --- |
| 前端框架 | React 19 |
| 語言 | TypeScript |
| 建置工具 | Vite |
| 樣式 | Tailwind CSS v4 |
| UI 元件 | shadcn/ui |
| 動畫 | framer-motion |
| 圖示 | lucide-react |

## 🤝 貢獻

歡迎提交 Issues 與 Pull Requests！如果你有想法或建議，直接開 Issue 討論，或 fork 後提交 PR。

## 📄 License

本專案採用 [MIT License](LICENSE)。
