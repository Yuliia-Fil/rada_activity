import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import BillCard from "../BillCard/BillCard";
import { onDragEnd } from "../../utils/onDragEnd";
import type { Columns } from "../../types/Columns";

import style from "./DnD.module.scss";

interface Props {
  columns: Columns;
  setColumns: React.Dispatch<React.SetStateAction<Columns>>;
}

export default function DnD({ columns, setColumns }: Props) {
  return (
    <DragDropContext
      onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
    >
      <div className={style.container}>
        {Object.entries(columns).map(([id, column]) => (
          <Droppable key={id} droppableId={id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={style.column}
              >
                <h2 className={style.title}>{column.name}</h2>
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
  );
}
