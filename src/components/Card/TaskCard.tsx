import {useSortable} from "@dnd-kit/sortable";
import {Id, Task} from "../../type";
import {CSS} from "@dnd-kit/utilities";
import {useState} from "react";
import EditIcon from "../../icons/EditIcon";
import TrashIcon from "../../icons/TrashIcon";
import "./style.css";
import XIcon from "../../icons/XIcon";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({task, deleteTask, updateTask}: Props) {
  // const [mouseisover, setMouseIsOver] = useState(false);
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
    // setMouseIsOver(false);
    // console.log("edit mode");
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className=" min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px]   my-3 rounded-xl border-slate-900  border-2 border-dashed ">
        <div className="bg-white w-full h-full opacity-80 rounded-xl "></div>
      </div>
    );
  }

  if (editMode) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px] py-3 px-2  my-3 rounded-3xl text-sm shadow-xl relative">
        <div className="px-2 py-1.5 bg-purple-300 rounded-2xl flex justify-center w-[50%]">
          <h1 className="font-bold text-xs  text-purple-900">Web Design</h1>
        </div>
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
          className="mt-2 w-full h-[110px]  resize-none   outline-none pl-1.5"></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // onMouseEnter={() => {
      //   setMouseIsOver(true);
      // }}
      // onMouseLeave={() => {
      //   setMouseIsOver(false);
      // }}
      className="bg-white min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px]  py-3 px-2 my-3 rounded-3xl text-sm shadow-xl flex flex-col  justify-between relative hover:ring-1 focus:rotate-3">
      <div className="flex justify-between ">
        <div className="px-2 py-1.5 bg-purple-300 rounded-2xl flex justify-center items-center w-[50%]">
          <h1 className="font-bold text-xs  text-purple-900">Web Design</h1>
        </div>
        <button className="px-1 py-1 opacity-50 hover:opacity-100 hover:bg-slate-200 rounded-full">
          <XIcon />
        </button>
      </div>
      <div onClick={toggleEditMode} className=" h-full w-full overflow-y-scroll my-1 flex pl-1.5 mt-2">
        <p>{task.content}</p>
      </div>
      <div className="w-full  justify-end gap-2 hidden">
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
    </div>
  );
}

export default TaskCard;