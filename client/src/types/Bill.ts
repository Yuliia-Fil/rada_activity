export interface Bill {
  number: string;
  link: string;
  date: string;
  title: string;
  priority: string;
  status: "new" | "processed";
}
