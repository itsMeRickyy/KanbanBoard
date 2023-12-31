// import {useState} from "react";
import {useEffect, useRef, useState} from "react";
import {Column, Task, Id} from "../../type";
import ColumnContainer from "./ColumnContainer";
import {createPortal} from "react-dom";
import {DndContext, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, DragEndEvent, TouchSensor} from "@dnd-kit/core";
import TaskCard from "../Card/TaskCard";
import {arrayMove} from "@dnd-kit/sortable";
import TotalCard from "../Card/TotalCard";
// import ProgressBar from "../Card/ProgressBar";
// import ColumnContainerV2 from "./ColumnContainerV2";
// import {SortableContext} from "@dnd-kit/sortable";

const defaultCols: Column[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Work in progress",
  },
  {
    id: "review",
    title: "On Review",
  },
  {
    id: "done",
    title: "Done",
  },
];

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    title: "Task 1",
    content: "Let's make your first task",
  },
];

function ProjectsContainer() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  // const columnsId = useMemo(() => columns.map(col => col.id), [columns]);
  const savedTasks = localStorage.getItem("tasks");
  const [tasks, setTasks] = useState<Task[]>(savedTasks ? JSON.parse(savedTasks) : defaultTasks);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const doingLength = tasks.filter(task => task.columnId === "doing").length;
  const doneLength = tasks.filter(task => task.columnId === "done").length;

  function generateId() {
    /* Generate a random number between 0 and 10000 */
    return Math.floor(Math.random() * 10001);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 5,
      },
    })
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      title: `Task ${tasks.length + 1}`,
      content: `let's create your task`,
    };

    setTasks([...tasks, newTask]);
  }

  function copyTask(taskId: Id) {
    // Find the task with the specified taskId
    const taskToCopy = tasks.find(task => task.id === taskId);

    if (taskToCopy) {
      // Create a new task object with a new ID
      const newTask: Task = {
        id: generateId(),
        columnId: taskToCopy.columnId,
        title: `${taskToCopy.title}`,
        content: taskToCopy.content,
      };

      // Add the new task to the tasks array
      setTasks([...tasks, newTask]);
    }
  }

  // function handleCopyTask(taskId: Id, event: React.MouseEvent<HTMLButtonElement>) {
  //   if (event.shiftKey) {
  //     copyTask(taskId);
  //   }
  // }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    console.log("deleting");
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map(task => {
      if (task.id !== id) return task;
      return {...task, content};
    });
    setTasks(newTasks);
  }

  function updateTitle(id: Id, title: string) {
    const newTitle = tasks.map(task => {
      if (task.id !== id) return task;
      return {...task, title};
    });
    // const updatedTask = [...newTasks];
    setTasks(newTitle);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function onDragStart(event: DragStartEvent) {
    console.log("STARTED DRAG, holding shift? Answer", holdingShift.current);

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const {active, over} = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const overIndex = tasks.findIndex(t => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          console.log("DROPPING TASK OVER TASK", {activeIndex});

          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", {activeIndex});
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function handleCopyTask(taskId: Id) {
    if (holdingShift.current) {
      copyTask(taskId);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onDragEnd(event: DragEndEvent) {
    if (holdingShift.current) {
      handleCopyTask(activeTask!.id);
      console.log("task copied");
    }
    console.log(event);
  }

  const holdingShift = useRef(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      console.log(e.key);
      // e.key -> keycode
      if (e.shiftKey) holdingShift.current = true;
    }

    function handleKeyUp() {
      holdingShift.current = false;
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Update the local storage whenever the columns state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <>
      <div className="flex flex-col xl:flex-row my-10 gap-4 w-full   justify-center items-center xl:items-start ">
        {/* Project Container */}
        <div className="bg-slate-50  xl:w-[70%] 2xl:w-[60%] min-h-[85vh] rounded-3xl px-8 2xl:px-10 py-5">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold">Projects</h1>
            <div className="flex gap-2  ">
              <div className="flex gap-2">
                {/* total task */}
                <TotalCard fontSize="text-xl" labelTitle="Total" count={tasks.length} bgColor="bg-blue-300" barColor="bg-blue-500" />
                {/* Work In Progress */}
                <TotalCard fontSize="text-xl" labelTitle="In Progress" count={doingLength} bgColor="bg-green-300" barColor="bg-orange-500" />
                {/* Done */}
                <TotalCard fontSize="text-xl" labelTitle="Completed" count={doneLength} bgColor="bg-purple-300" barColor="bg-purple-500" />
              </div>
              <button onClick={() => createTask("todo")} className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 shadow-xl">
                Create Project
              </button>
              <button onClick={createNewColumn} className="hidden px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700">
                Create column
              </button>
            </div>
          </div>
          <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
            <div className="flex flex-wrap gap-10 justify-between">
              {columns.map(col => (
                <ColumnContainer key={col.id} column={col} deleteTask={deleteTask} updateTask={updateTask} copyTask={copyTask} updateTitle={updateTitle} createTask={createTask} tasks={tasks.filter(task => task.columnId === col.id)} />
              ))}
            </div>
            {createPortal(
              <DragOverlay
                dropAnimation={{
                  duration: 350,
                  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                }}
                style={{
                  rotate: "3deg",
                }}>
                {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} copyTask={copyTask} updateTitle={updateTitle} />}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
        {/* right side bar*/}
        <div className="bg-slate-50 w-[56rem] min-w-[20rem] hidden px-8 xl:w-[18%]  xl:min-h-[85vh] rounded-3xl py-5 relative  flex-col gap-5">
          <h1 className="text-xl font-bold">Projects</h1>

          <div className="w-full h-full  gap-2 flex-wrap flex flex-col justify-center ">
            {/* total task */}
            <TotalCard fontSize="text-xl" labelTitle="Total" count={tasks.length} bgColor="bg-blue-300" barColor="bg-blue-500" />
            {/* Work In Progress */}
            <TotalCard fontSize="text-xl" labelTitle="In Progress" count={doingLength} bgColor="bg-green-300" barColor="bg-orange-500" />
            {/* Done */}
            <TotalCard fontSize="text-xl" labelTitle="Completed" count={doneLength} bgColor="bg-purple-300" barColor="bg-purple-500" />
          </div>
          {/* <ProgressBar circleWidth={85} percentage={50} /> */}
        </div>
      </div>
    </>
  );
}

export default ProjectsContainer;
