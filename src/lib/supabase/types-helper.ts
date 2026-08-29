import { Tables } from "./types";

export type Profile = Tables<"profiles">
export type Category = Tables<"categories">
export type Expense = Tables<"expenses">
export type Income = Tables<"income">
export type Goal = Tables<"goals">
export type GoalSnapshot = Tables<"goal_snapshots">
export type MonthlyBudget = Tables<"monthly_budgets">

export type ExpenseWithCategory = Expense & {
  categories: Pick<Category, "label" | "color">
}

export type IncomeWithCategory = Income & {
  categories: Pick<Category, "label" | "color">
}

export type GoalWithSnapshot = Goal & {
  goal_snapshots: Pick<GoalSnapshot, "amount">
}