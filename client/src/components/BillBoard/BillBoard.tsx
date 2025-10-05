import { useEffect, useState } from "react";
import axios from "axios";
import type { Bill } from "../../types/Bill";
import PriorityFilter from "../filters/PriorityFilter";
import DateFilter from "../filters/DateFilter";
import { applyFilters } from "../../utils/applyFilters";
import type { Columns } from "../../types/Columns";
import DnD from "../DnD/DnD";
import { initialColumns } from "../../constants/initialColumns";

import style from "./BillBoard.module.scss";

export default function BillBoard() {
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [columns, setColumns] = useState<Columns>(initialColumns);
  const [loading, setLoading] = useState(true);

  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get("http://localhost:3000/bills");
        setAllBills(res.data);
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  useEffect(() => {
    applyFilters(allBills, priorityFilter, dateFilter, setColumns);
  }, [priorityFilter, dateFilter, allBills]);

  if (loading)
    return <p className={style.grayText}>Завантажуємо останні закони...</p>;

  return (
    <div>
      <h1 className={style.grayText}>Закони за поточний тиждень</h1>

      <div className={style.filterContainer}>
        <PriorityFilter filter={priorityFilter} setFilter={setPriorityFilter} />
        <DateFilter filter={dateFilter} setFilter={setDateFilter} />
      </div>
      <DnD columns={columns} setColumns={setColumns} />
    </div>
  );
}
