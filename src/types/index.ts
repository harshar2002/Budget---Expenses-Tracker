export type Category = string;

export interface Expense {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  category: Category;
  amount: number;
  description: string;
}

export interface Budget {
  amount: number;
}
