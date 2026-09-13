import { useState, useEffect, useCallback, useMemo } from 'react';
import { scopedStorage, logger } from '@lark-apaas/client-toolkit-lite';
import type { IFinanceRecord } from '@/data/finance-record';

const RECORDS_KEY = '__app_finance_records';
const INCOME_KEY = '__app_finance_income';
const API_KEY_KEY = '__app_finance_api_key';

function loadRecords(): IFinanceRecord[] {
  try {
    const raw = scopedStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    logger.error('Failed to load records:', String(error));
    return [];
  }
}

function saveRecords(records: IFinanceRecord[]) {
  try {
    scopedStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (error) {
    logger.error('Failed to save records:', String(error));
  }
}

function loadIncome(): number {
  try {
    const raw = scopedStorage.getItem(INCOME_KEY);
    if (!raw) return 0;
    const num = Number(raw);
    return Number.isFinite(num) ? num : 0;
  } catch (error) {
    logger.error('Failed to load income:', String(error));
    return 0;
  }
}

function saveIncome(income: number) {
  try {
    scopedStorage.setItem(INCOME_KEY, String(income));
  } catch (error) {
    logger.error('Failed to save income:', String(error));
  }
}

function loadApiKey(): string {
  try {
    return scopedStorage.getItem(API_KEY_KEY) ?? '';
  } catch (error) {
    logger.error('Failed to load api key:', String(error));
    return '';
  }
}

function saveApiKey(key: string) {
  try {
    scopedStorage.setItem(API_KEY_KEY, key);
  } catch (error) {
    logger.error('Failed to save api key:', String(error));
  }
}

export function useFinanceRecords() {
  const [records, setRecords] = useState<IFinanceRecord[]>(() => loadRecords());
  const [monthlyIncome, setMonthlyIncome] = useState<number>(() => loadIncome());
  const [apiKey, setApiKey] = useState<string>(() => loadApiKey());

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  useEffect(() => {
    saveIncome(monthlyIncome);
  }, [monthlyIncome]);

  useEffect(() => {
    saveApiKey(apiKey);
  }, [apiKey]);

  const expenseRecords = useMemo(
    () => records.filter((r) => r.type === 'expense').sort((a, b) => b.createdAt - a.createdAt),
    [records],
  );

  const totalExpense = useMemo(
    () => expenseRecords.reduce((sum, r) => sum + r.amount, 0),
    [expenseRecords],
  );

  const remaining = useMemo(() => monthlyIncome - totalExpense, [monthlyIncome, totalExpense]);

  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of expenseRecords) {
      const cat = r.category ?? '其他';
      map.set(cat, (map.get(cat) ?? 0) + r.amount);
    }
    return map;
  }, [expenseRecords]);

  const addExpense = useCallback((data: { amount: number; category: NonNullable<IFinanceRecord['category']>; note?: string }) => {
    const newRecord: IFinanceRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: 'expense',
      amount: data.amount,
      category: data.category,
      note: data.note,
      createdAt: Date.now(),
    };
    setRecords((prev) => [...prev, newRecord]);
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<Pick<IFinanceRecord, 'amount' | 'category' | 'note'>>) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    );
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return {
    records,
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
  };
}
