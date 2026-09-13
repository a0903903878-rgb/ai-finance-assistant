// EXPORTS: IFinanceRecord, EXPENSE_CATEGORIES, MOCK_FINANCE_RECORDS
export interface IFinanceRecord {
  id: string
  type: 'income' | 'expense'
  amount: number
  category?: '餐飲' | '交通' | '購物' | '娛樂' | '水電瓦斯' | '訂閱服務' | '其他'
  note?: string
  createdAt: number
}

export const EXPENSE_CATEGORIES: IFinanceRecord['category'][] = [
  '餐飲',
  '交通',
  '購物',
  '娛樂',
  '水電瓦斯',
  '訂閱服務',
  '其他',
]

export const MOCK_FINANCE_RECORDS: IFinanceRecord[] = [
  {
    id: '1',
    type: 'expense',
    amount: 1280,
    category: '餐飲',
    note: '週末聚餐',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: '2',
    type: 'expense',
    amount: 450,
    category: '交通',
    note: '高鐵票',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: '3',
    type: 'expense',
    amount: 3200,
    category: '購物',
    note: '衣服',
    createdAt: Date.now() - 86400000,
  },
]
