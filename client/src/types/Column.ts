import type { Bill } from "./Bill";

export interface Column {
  name: string;
  items: Bill[];
}
