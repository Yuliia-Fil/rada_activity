import type { Priority } from "./priority";

export interface Bill {
  number: string;
  link: string;
  date: string;
  title: string;
  priority: Priority;
  status: "new" | "processed";
}
