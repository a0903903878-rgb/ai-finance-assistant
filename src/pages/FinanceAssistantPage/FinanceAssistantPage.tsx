import { useState, useCallback } from 'react';
import { capabilityClient, logger } from '@lark-apaas/client-toolkit-lite';
import { toast } from 'sonner';
import { useFinanceRecords } from '@/hooks/useFinanceRecords';
import HeaderSection from './sections/HeaderSection';
import ApiKeySection from './sections/ApiKeySection';
import FinanceInputSection from './sections/FinanceInputSection';
import AnalysisSection from './sections/AnalysisSection';

const PLUGIN_INSTANCE_ID = 'consumption_analysis_report_generator_1';

function buildAnalysisPrompt(params: {
  monthlyIncome: number;
  totalExpense: number;
  categoryTotals: Map<string, number>;
  expenseRecords: Array<{ category?: string; amount: number; note?: string; createdAt: number }>;
}): string {
  const { monthlyIncome, totalExpense, categoryTotals, expenseRecords } = params;
  const lines: string[] = [];

  lines.push('【使用者收支資料】');
  lines.push(`每月收入：NT$ ${monthlyIncome.toLocaleString()}`);
  lines.push(`本月總支出：NT$ ${totalExpense.toLocaleString()}`);
  lines.push(`本月結餘：NT$ ${(monthlyIncome - totalExpense).toLocaleString()}`);
  lines.push('');

  lines.push('【各類別支出統計】');
  const sortedCategories = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1]);
  for (const [cat, amt] of sortedCategories) {
    const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : '0';
    lines.push(`- ${cat}：NT$ ${amt.toLocaleString()}（${pct}%）`);
  }
  lines.push('');

  lines.push('【明細支出紀錄】');
  if (expenseRecords.length === 0) {
    lines.push('（尚無支出紀錄）');
  } else {
    for (let i = 0; i < expenseRecords.length; i++) {
      const r = expenseRecords[i];
      const dateStr = new Date(r.createdAt).toLocaleDateString('zh-TW');
      lines.push(
        `${i + 1}. [${dateStr}] ${r.category ?? '其他'} - NT$ ${r.amount.toLocaleString()}${r.note ? `（${r.note}）` : ''}`,
      );
    }
  }

  return lines.join('\n');
}

export default function FinanceAssistantPage() {
  const {
    expenseRecords,
    monthlyIncome,
    setMonthlyIncome,
    apiKey,
    setApiKey,
    totalExpense,
    remaining,
    categoryTotals,
    addExpense,
    updateRecord,
    deleteRecord,
  } = useFinanceRecords();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState('');

  const handleAnalyze = useCallback(async () => {
    if (expenseRecords.length === 0) {
      toast.error('請先新增至少一筆支出紀錄');
      return;
    }

    if (!apiKey.trim()) {
      toast.error('請先設定你的 AI API Key');
      return;
    }

    setIsAnalyzing(true);
    setReport('');

    try {
      const incomeExpenseData = buildAnalysisPrompt({
        monthlyIncome,
        totalExpense,
        categoryTotals,
        expenseRecords,
      });

      const executor = (capabilityClient as any).load(PLUGIN_INSTANCE_ID);
      const stream = (executor as any).callStream('textGenerate', {
        income_expense_data: incomeExpenseData,
      });

      let fullText = '';
      for await (const chunk of stream) {
        const piece = chunk.content ?? chunk.response ?? '';
        if (piece) {
          fullText += piece;
          setReport(fullText);
        }
      }

      if (!fullText.trim()) {
        toast.error('AI 未返回內容，請稍後再試');
      } else {
        toast.success('分析完成！');
      }
    } catch (error) {
      logger.error('AI analysis failed:', String(error));
      toast.error('AI 分析失敗，請檢查 API Key 或網路連線');
    } finally {
      setIsAnalyzing(false);
    }
  }, [expenseRecords, monthlyIncome, totalExpense, categoryTotals, apiKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <HeaderSection />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
            <ApiKeySection apiKey={apiKey} onSave={setApiKey} />
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2">
            <AnalysisSection
              isLoading={isAnalyzing}
              report={report}
              hasRecords={expenseRecords.length > 0}
              hasApiKey={apiKey.trim().length > 0}
              onAnalyze={handleAnalyze}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <FinanceInputSection
            monthlyIncome={monthlyIncome}
            totalExpense={totalExpense}
            remaining={remaining}
            expenseRecords={expenseRecords}
            categoryTotals={categoryTotals}
            onIncomeChange={setMonthlyIncome}
            onAddExpense={addExpense}
            onUpdateRecord={updateRecord}
            onDeleteRecord={deleteRecord}
          />
        </div>

        <footer className="text-center text-xs text-muted-foreground pt-4 pb-2">
          <p>AI 理財小助手 · 資料僅儲存於你的瀏覽器</p>
        </footer>
      </main>
    </div>
  );
}
