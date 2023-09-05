import {useSortable} from "@dnd-kit/sortable";
import {Id, Task} from "../../type";
import {CSS} from "@dnd-kit/utilities";
import {useState} from "react";
import EditIcon from "../../icons/EditIcon";
import TrashIcon from "../../icons/TrashIcon";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({task, deleteTask, updateTask}: Props) {
  const [mouseisover, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    // test,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
    setMouseIsOver(false);
    // console.log("edit mode");
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className=" min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px]   my-3 rounded-xl  border-2 border-dashed ">
        <div className="bg-white w-full h-full opacity-20 rounded-xl"></div>
      </div>
    );
  }

  if (editMode) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px] py-3 px-2  my-3 rounded-xl text-sm shadow-xl">
        <textarea
          name=""
          value={task.content}
          autoFocus
          placeholder="Add your task!"
          onBlur={toggleEditMode}
          onKeyDown={e => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={e => updateTask(task.id, e.target.value)}
          className="w-full h-full resize-none rounded-xl"></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px]  py-3 px-2 my-3 rounded-xl text-sm shadow-xl flex flex-col justify-between relative"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}>
      <p>{task.content}</p>
      {mouseisover && (
        <div className="w-full flex justify-end gap-2 ">
          <button onClick={toggleEditMode} className="opacity-50 hover:opacity-100">
            <EditIcon />
          </button>
          <button
            onClick={() => {
              deleteTask(task.id);
            }}
            className="opacity-50 hover:opacity-100">
            <TrashIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
