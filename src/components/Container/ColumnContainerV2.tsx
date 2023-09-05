import {Column, Id, Task} from "../../type";
import TaskCard from "../Card/TaskCard";
import {useMemo, useState} from "react";
import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

function ColumnContainerV2({column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask}: Props) {
  const tasksIds = useMemo(() => {
    return tasks.map(task => task.id);
  }, [tasks]);

  const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    // disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} className=" w-[20rem]  flex flex-col max-w-[250px] mt-8 max-h-[70vh]">
      <h1 className="my-2">{column.title}</h1>
      {/* column task container */}
      <div className="flex-col flex   bg-blue-400    max-w-full overflow-x-hidden  overflow-y-auto h-[70vh]  max-h-[70vh] ">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
        ))}
      </div>
    </div>
  );
}

export default ColumnContainerV2;
