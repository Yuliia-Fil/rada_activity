import type { DropResult } from "@hello-pangea/dnd";
import axios from "axios";
import type { Columns } from "../types/Columns";
import { API_URL } from "../constants/apiUrl";

export const onDragEnd = async (
  result: DropResult,
  columns: Columns,
  setColumns: React.Dispatch<React.SetStateAction<Columns>>
) => {
  if (!result.destination) return;

  const { source, destination } = result;

  const sourceItems = Array.from(columns[source.droppableId].items);
  const destItems = Array.from(columns[destination.droppableId].items);

  const [moved] = sourceItems.splice(source.index, 1);
  destItems.splice(destination.index, 0, moved);

  setColumns((prev: Columns) => ({
    ...prev,
    [source.droppableId]: { ...prev[source.droppableId], items: sourceItems },
    [destination.droppableId]: {
      ...prev[destination.droppableId],
      items: destItems,
    },
  }));

  try {
    await axios.patch(`${API_URL}/bills/${moved.number}/status`, {
      status: destination.droppableId as "new" | "processed",
    });
  } catch (err) {
    console.error("Failed to update status on server:", err);
  }
};
