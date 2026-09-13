import { useState, useMemo } from 'react';
import { DollarSign, Plus, Trash2, Edit2, Check, X, Receipt, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { EXPENSE_CATEGORIES, type IFinanceRecord } from '@/data/finance-record';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface FinanceInputSectionProps {
  monthlyIncome: number;
  totalExpense: number;
  remaining: number;
  expenseRecords: IFinanceRecord[];
  categoryTotals: Map<string, number>;
  onIncomeChange: (income: number) => void;
  onAddExpense: (data: { amount: number; category: NonNullable<IFinanceRecord['category']>; note?: string }) => void;
  onUpdateRecord: (id: string, updates: Partial<Pick<IFinanceRecord, 'amount' | 'category' | 'note'>>) => void;
  onDeleteRecord: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  '餐飲': 'bg-orange-100 text-orange-700 border-orange-200',
  '交通': 'bg-blue-100 text-blue-700 border-blue-200',
  '購物': 'bg-pink-100 text-pink-700 border-pink-200',
  '娛樂': 'bg-purple-100 text-purple-700 border-purple-200',
  '水電瓦斯': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  '訂閱服務': 'bg-teal-100 text-teal-700 border-teal-200',
  '其他': 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function FinanceInputSection({
  monthlyIncome,
  totalExpense,
  remaining,
  expenseRecords,
  categoryTotals,
  onIncomeChange,
  onAddExpense,
  onUpdateRecord,
  onDeleteRecord,
}: FinanceInputSectionProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<NonNullable<IFinanceRecord['category']>>('餐飲');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState<NonNullable<IFinanceRecord['category']>>('餐飲');
  const [editNote, setEditNote] = useState('');

  const handleAdd = () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('請輸入有效的金額');
      return;
    }
    onAddExpense({ amount: numAmount, category, note: note.trim() || undefined });
    setAmount('');
    setNote('');
    toast.success('已新增支出紀錄');
  };

  const startEdit = (record: IFinanceRecord) => {
    setEditingId(record.id);
    setEditAmount(String(record.amount));
    setEditCategory(record.category ?? '其他');
    setEditNote(record.note ?? '');
  };

  const saveEdit = (id: string) => {
    const numAmount = Number(editAmount);
    if (!numAmount || numAmount <= 0) {
      toast.error('請輸入有效的金額');
      return;
    }
    onUpdateRecord(id, { amount: numAmount, category: editCategory, note: editNote.trim() || undefined });
    setEditingId(null);
    toast.success('已更新紀錄');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onDeleteRecord(id);
    toast.success('已刪除紀錄');
  };

  const savingsRate = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    return Math.max(0, Math.round((remaining / monthlyIncome) * 100));
  }, [monthlyIncome, remaining]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <DollarSign className="size-4" />
            </div>
            <CardTitle className="text-base">每月收入</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">NT$</span>
            <Input
              type="number"
              value={monthlyIncome || ''}
              onChange={(e) => onIncomeChange(Number(e.target.value) || 0)}
              placeholder="輸入每月收入金額"
              className="pl-14 text-lg font-medium tabular-nums"
              min="0"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-card border border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Wallet className="size-3" />
            <span>月收入</span>
          </div>
          <div className="text-lg font-semibold tabular-nums text-foreground">
            {monthlyIncome.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <TrendingDown className="size-3 text-destructive" />
            <span>總支出</span>
          </div>
          <div className="text-lg font-semibold tabular-nums text-destructive">
            {totalExpense.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <PiggyBank className="size-3 text-success" />
            <span>結餘</span>
          </div>
          <div className={`text-lg font-semibold tabular-nums ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
            {remaining.toLocaleString()}
          </div>
        </div>
      </div>

      {monthlyIncome > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>儲蓄率</span>
            <span className="font-medium tabular-nums">{savingsRate}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, savingsRate)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${savingsRate >= 20 ? 'bg-success' : savingsRate >= 0 ? 'bg-warning' : 'bg-destructive'}`}
            />
          </div>
        </div>
      )}

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
              <Plus className="size-4" />
            </div>
            <CardTitle className="text-base">新增支出</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">NT$</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="金額"
                className="pl-12 tabular-nums"
                min="0"
              />
            </div>
            <Select value={category} onValueChange={(v) => setCategory(v as NonNullable<IFinanceRecord['category']>)}>
              <SelectTrigger>
                <SelectValue placeholder="選擇類別" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="備註（選填）"
            className="text-sm"
          />
          <Button onClick={handleAdd} className="w-full">
            <Plus className="size-4 mr-1.5" />
            新增支出紀錄
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                <Receipt className="size-4" />
              </div>
              <CardTitle className="text-base">支出紀錄</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {expenseRecords.length} 筆
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AnimatePresence mode="popLayout">
            {expenseRecords.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center text-sm text-muted-foreground"
              >
                還沒有支出紀錄，開始記錄你的第一筆消費吧
              </motion.div>
            ) : (
              <div className="divide-y divide-border/40">
                {expenseRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="px-4 py-3"
                  >
                    {editingId === record.id ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">NT$</span>
                            <Input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="pl-10 text-sm tabular-nums h-9"
                              min="0"
                            />
                          </div>
                          <Select value={editCategory} onValueChange={(v) => setEditCategory(v as NonNullable<IFinanceRecord['category']>)}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {EXPENSE_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          placeholder="備註"
                          className="text-sm h-9"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-8">
                            <X className="size-3.5 mr-1" />
                            取消
                          </Button>
                          <Button size="sm" onClick={() => saveEdit(record.id)} className="h-8">
                            <Check className="size-3.5 mr-1" />
                            儲存
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-xs ${categoryColors[record.category ?? '其他'] ?? categoryColors['其他']}`}
                        >
                          {record.category ?? '其他'}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-destructive tabular-nums">
                            NT$ {record.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {record.note || '無備註'}
                            <span className="mx-1.5 text-muted-foreground/50">·</span>
                            {format(record.createdAt, 'MM/dd HH:mm', { locale: zhTW })}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => startEdit(record)}
                            aria-label="編輯"
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleDelete(record.id)}
                            aria-label="刪除"
                          >
                            <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
