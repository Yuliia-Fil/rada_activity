import type { Bill } from "../types/Bill";
import type { Columns } from "../types/Columns";

const formatBillDate = (billDate: string) => {
  const [day, month, year] = billDate.split(".");
  return `${year}-${month}-${day}`;
};

const filterBill = (bill: Bill, priority: string, date: string) => {
  const priorityMatch = priority === "all" || bill.priority === priority;
  const dateMatch = !date || formatBillDate(bill.date) === date;
  return priorityMatch && dateMatch;
};

export const applyFilters = (
  bills: Bill[],
  priority: string,
  date: string,
  setColumns: React.Dispatch<React.SetStateAction<Columns>>
) => {
  setColumns({
    new: {
      name: "Нові закони",
      items: bills.filter(
        (b) => b.status === "new" && filterBill(b, priority, date)
      ),
    },
    processed: {
      name: "Опрацьовані закони",
      items: bills.filter(
        (b) => b.status === "processed" && filterBill(b, priority, date)
      ),
    },
  });
};
