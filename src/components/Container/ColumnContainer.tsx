// import {useMemo} from "react";
import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {Column, Id, Task} from "../../type";
import TaskCard from "../Card/TaskCard";
import {useMemo} from "react";
import {CSS} from "@dnd-kit/utilities";

// import TaskCard from "../Card/TaskCard";

interface Props {
  column: Column;
  tasks: Task[];
  createTask: (columnId: Id) => void;
  copyTask: (taskId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  updateTitle: (id: Id, content: string) => void;
}

function ColumnContainer({column, tasks, deleteTask, updateTask, createTask, copyTask, updateTitle}: Props) {
  const tasksIds = useMemo(() => {
    return tasks.map(task => task.id);
  }, [tasks]);

  const {setNodeRef, transform, transition} = useSortable({
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
    <>
      <div ref={setNodeRef} style={style} className=" w-[20rem]  p-2 rounded-xl  flex flex-col max-w-[250px] mt-8 max-h-[70vh]">
        <div className="flex justify-between">
          <h1 className="my-2 font-bold">{column.title}</h1>
          <button
            onClick={() => {
              createTask(column.id);
            }}
            className="text-xl hover:bg-slate-500 hover:text-white bg-slate-300 w-8 h-8 rounded-full">
            +
          </button>
        </div>
        {/* column task container */}
        <div className="flex-col flex       max-w-full overflow-x-hidden  overflow-y-auto h-[70vh]  max-h-[70vh] px-2">
          <SortableContext items={tasksIds}>
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} copyTask={copyTask} updateTitle={updateTitle} />
            ))}
          </SortableContext>
        </div>
      </div>
    </>
  );
}

export default ColumnContainer;
