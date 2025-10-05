import { useEffect, useState } from "react";
import axios from "axios";
import BillCard from "./BillCard/BillCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { Bill } from "../types/Bill";
import PriorityFilter from "./filters/PriorityFilter";
import DateFilter from "./filters/DateFilter";
import { applyFilters } from "../utils/applyFilters";
import { onDragEnd } from "../utils/onDragEnd";
import type { Columns } from "../types/Columns";

export default function BillBoard() {
  const initialColumns: Columns = {
    new: { name: "Нові закони", items: [] },
    processed: { name: "Опрацьовані закони", items: [] },
  };
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
        <PriorityFilter filter={priorityFilter} setFilter={setPriorityFilter} />
        <DateFilter filter={dateFilter} setFilter={setDateFilter} />
      </div>

      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
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
