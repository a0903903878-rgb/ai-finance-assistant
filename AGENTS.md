# AI 理財小助手 - 需求拆解文檔

## 產品概述

- **產品類型**: 個人理財工具應用
- **場景類型**: prototype-app
- **目標用戶**: 想要管理個人收支、獲得 AI 消費分析建議的一般使用者
- **核心價值**: 讓使用者簡單記錄每月收支，並透過 AI 獲得個人化的消費分析與省錢建議
- **介面語言**: 繁體中文
- **主題偏好**: 淺色（預設）
- **導航模式**: 無導航（單頁工具型應用）
- **導航佈局**: 無

---

## 頁面結構總覽

> **說明**: 此為單頁工具應用，所有功能集中在同一頁面，無需跳轉。

**頁面文件**: `FinanceAssistantPage.tsx`

| 區域 | 說明 |
|-----|------|
| 頁面頂部標題區 | 應用名稱 + 簡短說明 |
| API Key 設定區 | 使用者輸入並保存自己的 AI API Key |
| 收支輸入區 | 收入金額輸入 + 支出紀錄管理（新增/編輯/刪除） |
| AI 分析按鈕區 | 觸發分析的主要操作按鈕 |
| 分析結果展示區 | AI 消費分析報告的展示區域（含載入態） |

---

## 頁面佈局建議

- **佈局模式**: 上下分區（桌面端可考慮左右分欄：左側輸入區、右側結果區；移動端上下堆疊）
- **視覺重心**: 結果區
- **結果承載區**: 分析報告卡片（含分區標題、佔比圖、建議列表、預算金額）
- **源材料承載區**: 收支紀錄列表（支援多筆輸入、編輯、刪除）

---

## 外掛規劃

| 外掛實例名稱 | 基於官方外掛 | 業務用途 | 輸出模式 | 所屬頁面 |
|------------|-----------|---------|---------|---------|
| 消費分析報告生成 | `ai-text-generate` | 根據使用者輸入的收支資料，生成包含各類別花費佔比、異常項目、省錢建議及下月預算的消費分析報告 | stream | FinanceAssistantPage |

---

## 資料來源聲明

| 資料/操作 | 來源類型 | 實現要求 | mock 兜底 |
|---|---|---|---|
| 收支紀錄資料 | `local-persist` | localStorage key=`__app_finance_records` | 無（預設空清單） |
| AI API Key | `local-persist` | localStorage key=`__app_finance_api_key` | 無（預設空值） |
| AI 消費分析報告 | `real-plugin` | capabilityClient.callStream 調用 ai-text-generate 實例 | 失敗提示（toast "AI 分析失敗，請檢查 API Key 或網路連線"） |
| 支出類別選項 | `demo-mock` | 前端定義固定類別清單：餐飲、交通、購物、娛樂、水電瓦斯、訂閱服務、其他 | ✅ 本身就是靜態設定 |

---

## 功能列表

- **頁面**: AI 理財小助手（單頁）
  - **頁面目標**: 讓使用者輸入收支資料，一鍵獲得 AI 消費分析報告
  - **功能點**:
    - **API Key 管理**: 輸入並保存 AI API Key，僅存於本地瀏覽器
    - **收入金額設定**: 輸入每月收入金額，即時保存到本地
    - **支出紀錄新增**: 支援多筆消費紀錄，每筆包含金額、類別、備註
    - **支出紀錄編輯與刪除**: 可修改金額/類別/備註，也可一鍵刪除
    - **AI 消費分析（流式）**: 點擊「開始分析」按鈕，流式輸出分析報告
    - **收支概覽統計**: 即時顯示總支出、剩餘金額等基礎數值

---

## 資料共享配置

| 儲存鍵名 | 資料說明 | 型別 |
|---------|---------|------|
| `__app_finance_records` | 收支紀錄清單 | `IFinanceRecord[]` |
| `__app_finance_api_key` | 使用者的 AI API Key | `string` |
| `__app_finance_income` | 每月收入金額 | `number` |

```ts
interface IFinanceRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category?: '餐飲' | '交通' | '購物' | '娛樂' | '水電瓦斯' | '訂閱服務' | '其他';
  note?: string;
  createdAt: number;
}
```

---

# UI 設計指南

## 1. 設計推導依據

- **參考意圖**: Free Direction
- **核心情緒 / 應用類型**: 輕量個人理財工具，清晰、可信賴、低壓力
- **獨特記憶點**: 每個支出類別對應一枚柔和色塊標籤 + 迷你圖示

## 2. Art Direction

- **方向名**: 柔色便籤式理財
- **Design Style**: Soft Blocks + Rounded Minimalist
- **DNA 參數**: 圓角 `rounded-xl` / 陰影 `shadow-sm` / 間距 `gap-4` `p-6`
- **應用類型**: Tool — 單列表單 + 結果面板，移動端優先

## 3. Color System

- 柔和青綠主色 + 暖米白背景 + 同色極淺反饋底 + 多類別低飽和區分色
- 使用比例：65% 中性 / 25% 輔助 / 10% primary
- 主色：hsl(172 45% 42%) — 青綠，表達「成長、理性、低壓力」的理財語義

## 4. 字體與節奏

- **font-display/body**: Noto Sans SC
- **字號**: H1 text-3xl；H2 text-xl；body text-base；muted text-sm
- **圓角**: 大（rounded-xl）

## 5. 全域佈局契約

- **Standard Content Zone**: Tool max-w-2xl + `mx-auto`
- **Padding & Rhythm**: `px-4 md:px-6 py-8 md:py-12`，區塊間距 `space-y-6`

## 6. 視覺與動效

- **裝飾**: 分類色塊標籤 + 細線分隔
- **動效**: 克制 — 按鈕與卡片 hover 有 150ms 過渡

## 7. 元件原則

- Primary 按鈕僅用於「開始分析」主行動
- 支出記錄項：左側分類色塊 + 類別名，中間描述，右側金額 + 操作圖示

## 8. Image Direction

- 極簡扁平插畫風格，暖米白底，青綠色主調
- 主體：一本打開的便籤帳本 + 一枚硬幣

## 9. Anti-patterns

- Split personality：頁面之間切換 max-w、主色、圓角或陰影語言
- Default SaaS drift：回到預設藍按鈕、通用紫漸層
- Mono-hue tyranny：主色鋪滿所有元素
