import { useEffect, useState } from "react";
import axios from "axios";
import BillCard from "./BillCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function BillBoard() {
  const [allBills, setAllBills] = useState([]);
  const [columns, setColumns] = useState({
    new: { name: "Нові закони", items: [] },
    processed: { name: "Опрацьовані закони", items: [] },
  });
  const [loading, setLoading] = useState(true);

  // Фільтри
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Завантажуємо закони з сервера
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get("http://localhost:3000/bills");
        setAllBills(res.data);
        applyFilters(res.data, priorityFilter, dateFilter);
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [dateFilter, priorityFilter]);

  // Фільтрація
  const applyFilters = (bills, priority, date) => {
    const formatBillDate = (billDate: string) => {
      const [day, month, year] = billDate.split(".");
      return `${year}-${month}-${day}`;
    };

    const filterBill = (bill) => {
      const priorityMatch = priority === "all" || bill.priority === priority;
      const dateMatch = !date || formatBillDate(bill.date) === date;
      return priorityMatch && dateMatch;
    };

    setColumns({
      new: {
        name: "Нові закони",
        items: bills.filter((b) => b.status === "new" && filterBill(b)),
      },
      processed: {
        name: "Опрацьовані закони",
        items: bills.filter((b) => b.status === "processed" && filterBill(b)),
      },
    });
  };

  // Оновлення фільтрів
  useEffect(() => {
    applyFilters(allBills, priorityFilter, dateFilter);
  }, [priorityFilter, dateFilter, allBills]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceItems = Array.from(columns[source.droppableId].items);
    const destItems = Array.from(columns[destination.droppableId].items);

    const [moved] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, moved);

    setColumns((prev) => ({
      ...prev,
      [source.droppableId]: { ...prev[source.droppableId], items: sourceItems },
      [destination.droppableId]: {
        ...prev[destination.droppableId],
        items: destItems,
      },
    }));

    // Оновлюємо статус на сервері
    try {
      await axios.patch(`http://localhost:3000/bills/${moved.number}/status`, {
        status: destination.droppableId === "processed" ? "processed" : "new",
      });
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }
  };

  if (loading) return <p>Loading bills...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Канбан-дошка законів</h1>

      {/* Фільтри */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
        <div>
          <label>Пріорітет:</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">Всі</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label>Дата:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Канбан дошка */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "16px" }}>
          {Object.entries(columns).map(([id, column]) => (
            <Droppable key={id} droppableId={id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: "#f4f4f5",
                    padding: "10px",
                    borderRadius: "8px",
                    width: "50%",
                    minHeight: "400px",
                  }}
                >
                  <h2>{column.name}</h2>
                  {column.items.map((bill, index) => (
                    <Draggable
                      key={bill.number}
                      draggableId={bill.number}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <BillCard bill={bill} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
