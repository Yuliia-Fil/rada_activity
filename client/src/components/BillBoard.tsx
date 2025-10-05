import { useEffect, useState } from "react";
import axios from "axios";
import BillCard from "./BillCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { Bill } from "../types/Bill";

export default function BillBoard() {
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [columns, setColumns] = useState({
    new: { name: "Нові закони", items: [] },
    processed: { name: "Опрацьовані закони", items: [] },
  });
  const [loading, setLoading] = useState(true);

  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

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

  const applyFilters = (bills, priority, date) => {
    const formatBillDate = (billDate: string) => {
      const [day, month, year] = billDate.split(".");
      return `${year}-${month}-${day}`;
    };

    const filterBill = (bill: Bill) => {
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

  if (loading)
    return <p style={{ color: "#111827" }}>Завантажуємо останні закони...</p>;

  return (
    <div>
      <h1 style={{ color: "#111827" }}>Закони за поточний тиждень</h1>

      <div
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "24px",
          width: "100%",
        }}
      >
        {/* Фільтр по пріоритету */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "200px",
          }}
        >
          <label style={{ fontWeight: 600, color: "#374151" }}>
            Пріорітет:
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              backgroundColor: "#f9fafb",
              cursor: "pointer",
              flex: 1,
            }}
          >
            <option value="all">Всі</option>
            <option value="high">Високий</option>
            <option value="medium">Середній</option>
            <option value="low">Низький</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "200px",
          }}
        >
          <label style={{ fontWeight: 600, color: "#374151" }}>Дата:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              backgroundColor: "#f9fafb",
              cursor: "pointer",
              flex: 1,
            }}
          />
        </div>
      </div>

      {/* Канбан дошка */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            gap: "24px",
          }}
        >
          {Object.entries(columns).map(([id, column]) => (
            <Droppable key={id} droppableId={id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    padding: "16px",
                    borderRadius: "12px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.2rem",
                      marginBottom: "32px",
                      borderRadius: "12px",
                      padding: "8px",
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                      fontWeight: 600,
                      color: "#111827",
                      textAlign: "center",
                    }}
                  >
                    {column.name}
                  </h2>
                  <div style={{ flexGrow: 1 }}>
                    {column.items.length === 0 && (
                      <p style={{ color: "gray" }}>Немає відповідних законів</p>
                    )}
                    {column.items.map((bill, index) => {
                      return (
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
                              style={{
                                marginBottom: "12px",
                                ...provided.draggableProps.style,
                              }}
                            >
                              <BillCard bill={bill} />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
