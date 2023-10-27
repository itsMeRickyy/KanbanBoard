import {useSortable} from "@dnd-kit/sortable";
import {Id, Task} from "../../type";
import {CSS} from "@dnd-kit/utilities";
import {useEffect, useState, MouseEvent} from "react";
import EditIcon from "../../icons/EditIcon";
import TrashIcon from "../../icons/TrashIcon";
import "./style.css";
import XIcon from "../../icons/XIcon";
import PencilIcon from "../../icons/PencilIcon";
import CopyIcon from "../../icons/CopyIcon";
import LabelCard from "../Label/LabelCard";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  copyTask: (taskId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  updateTitle: (id: Id, content: string) => void;
}

function TaskCard({task, deleteTask, updateTask, copyTask, updateTitle}: Props) {
  // const [mouseisover, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey) {
        setShiftKeyPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.shiftKey) {
        setShiftKeyPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // if (shiftKeyPressed) {
  //   {
  //     copyTask(task.id);
  //   }
  // }

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

  const toggleEditTitle = () => {
    setEditTitle(prev => !prev);
    console.log("edit title mode");
  };

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.shiftKey) {
      const taskId = task.id;
      copyTask(taskId); // Call the copyTask function
    }
  };

  let labelColor = "bg-purple-300";

  if (task.columnId === "todo") {
    labelColor = "bg-blue-300";
  } else if (task.columnId === "doing") {
    labelColor = "bg-green-300";
  } else if (task.columnId === "review") {
    labelColor = "bg-yellow-200";
  } else if (task.columnId === "done") {
    labelColor = "bg-purple-300";
  }

  if (isDragging) {
    if (shiftKeyPressed) {
      return (
        <div ref={setNodeRef} style={style} className=" min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px]   my-3 rounded-xl border-slate-900  border-2 border-dashed ">
          <div className="bg-white w-full h-full opacity-80 rounded-xl flex items-center flex-col justify-center">
            <CopyIcon size={40} />
            <h1>Make a copy</h1>
          </div>
        </div>
      );
    } else {
      return (
        <div ref={setNodeRef} style={style} className=" min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px]   my-3 rounded-xl border-slate-900  border-2 border-dashed ">
          <div className="bg-white w-full h-full opacity-80 rounded-xl "></div>
        </div>
      );
    }
  }

  if (editTitle) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px]  py-3 px-2 my-3 rounded-3xl text-sm shadow-xl flex flex-col  justify-between relative hover:ring-1 ">
        <div className="flex justify-between ">
          <div className={`px-2 h-8 ${labelColor} rounded-2xl flex justify-center items-center w-[50%]`}>
            <input
              value={task.title}
              autoFocus
              placeholder="Task"
              onBlur={toggleEditTitle}
              onKeyDown={e => {
                if (e.key === "Enter" && e.shiftKey) {
                  toggleEditTitle();
                }
              }}
              onChange={e => updateTitle(task.id, e.target.value)}
              className="h-8 w-20 font-bold py-2 outline-none resize-none  bg-transparent rounded"></input>
          </div>
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

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px]  py-3 px-2 my-3 rounded-3xl text-sm shadow-xl flex flex-col  justify-between relative">
        <div>
          <div className={`px-2 h-8 ${labelColor} rounded-2xl flex  items-center w-[50%]`}>
            <h1 className="font-bold  text-purple-900 ml-2">{task.title}</h1>
          </div>
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

  // console.log(labelColor);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      // onMouseEnter={() => {
      //   setMouseIsOver(true);
      // }}
      // onMouseLeave={() => {
      //   setMouseIsOver(false);
      // }}
      className="bg-white min-h-[170px] max-h-[170px] h-[170px] min-w-[170px] max-w-[250px] w-[220px]  py-3 px-2 my-3 rounded-3xl text-sm shadow-xl flex flex-col  justify-between relative hover:ring-1 ">
      <div className="flex justify-between ">
        <LabelCard label={task.title} colorVariant={labelColor} />

        <div>
          <button
            onClick={() => {
              deleteTask(task.id);
            }}
            className="px-1 py-1 opacity-50 hover:opacity-100 hover:bg-slate-200 rounded-full">
            <XIcon />
          </button>
          <button onClick={toggleEditTitle} className="px-1 py-1 opacity-50 hover:opacity-100 hover:bg-slate-200 rounded-full">
            <PencilIcon />
          </button>
        </div>
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
