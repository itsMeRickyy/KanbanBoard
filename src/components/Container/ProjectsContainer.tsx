// import {useState} from "react";
import {useEffect, useState} from "react";
import {Column, Task, Id} from "../../type";
import ColumnContainer from "./ColumnContainer";
import {createPortal} from "react-dom";
import {DndContext, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import TaskCard from "../Card/TaskCard";
import {arrayMove} from "@dnd-kit/sortable";
import TotalCard from "../Card/TotalCard";
import ProgressBar from "../Card/ProgressBar";
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
    id: "done",
    title: "Done",
  },
];

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    content: "Let's make your first task",
  },
  // {
  //   id: "2",
  //   columnId: "todo",
  //   content: "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  // },
  // {
  //   id: "3",
  //   columnId: "doing",
  //   content: "Conduct security testing",
  // },
  // {
  //   id: "4",
  //   columnId: "doing",
  //   content: "Analyze competitors",
  // },
  // {
  //   id: "5",
  //   columnId: "done",
  //   content: "Create UI kit documentation",
  // },
  // {
  //   id: "6",
  //   columnId: "done",
  //   content: "Dev meeting",
  // },
  // {
  //   id: "7",
  //   columnId: "done",
  //   content: "Deliver dashboard prototype",
  // },
  // {
  //   id: "8",
  //   columnId: "todo",
  //   content: "Optimize application performance",
  // },
  // {
  //   id: "9",
  //   columnId: "todo",
  //   content: "Implement data validation",
  // },
  // {
  //   id: "10",
  //   columnId: "todo",
  //   content: "Design database schema",
  // },
  // {
  //   id: "11",
  //   columnId: "todo",
  //   content: "Integrate SSL web certificates into workflow",
  // },
  // {
  //   id: "12",
  //   columnId: "doing",
  //   content: "Implement error logging and monitoring",
  // },
  // {
  //   id: "13",
  //   columnId: "doing",
  //   content: "Design and implement responsive UI",
  // },
];

function ProjectsContainer() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  // const columnsId = useMemo(() => columns.map(col => col.id), [columns]);
  const savedTasks = localStorage.getItem("tasks");
  const [tasks, setTasks] = useState<Task[]>(savedTasks ? JSON.parse(savedTasks) : defaultTasks);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const time = currentTime.toLocaleTimeString();

  // console.log(`time = ${time}`);

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
    })
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `let's create your task`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map(task => {
      if (task.id !== id) return task;
      return {...task, content};
    });

    // const updatedTask = [...newTasks];

    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function onDragStart(event: DragStartEvent) {
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

  // Update the local storage whenever the columns state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <>
      <div className="flex gap-4 w-full min-h-screen justify-center items-start my-16">
        {/* Project Container */}
        <div className="bg-slate-50 w-[60%]  min-h-[85vh] rounded-3xl px-8 py-5">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold">Projects</h1>
            <div>
              <button onClick={() => createTask("todo")} className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 shadow-xl">
                Create Project
              </button>
              <button onClick={createNewColumn} className="hidden px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700">
                Create column
              </button>
            </div>
          </div>
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            // onDragEnd={onDragEnd}
            onDragOver={onDragOver}>
            <div className="flex flex-wrap gap-10 justify-between">
              {columns.map(col => (
                <ColumnContainer key={col.id} column={col} deleteTask={deleteTask} updateTask={updateTask} createTask={createTask} tasks={tasks.filter(task => task.columnId === col.id)} />
              ))}
            </div>
            {createPortal(<DragOverlay>{activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />}</DragOverlay>, document.body)}
          </DndContext>
        </div>
        {/* Total Container */}
        <div className="bg-slate-50 w-[18%]  min-h-[85vh] rounded-3xl py-5 relative px-5 flex flex-col gap-5">
          <div className="w-full h-full  gap-2 flex-wrap flex justify-center ">
            {/* total task */}
            <TotalCard fontSize="text-xl" labelTitle="Total" count={tasks.length} bgColor="bg-blue-200" barColor="bg-blue-500" />
            {/* Work In Progress */}
            <TotalCard fontSize="text-xl" labelTitle="In Progress" count={doingLength} bgColor="bg-orange-200" barColor="bg-orange-500" />
            {/* Done */}
            <TotalCard fontSize="text-xl" labelTitle="Completed" count={doneLength} bgColor="bg-purple-200" barColor="bg-purple-500" />
            {/* times */}
            <TotalCard fontSize="text-sm  mt-1" labelTitle="Times" count={time} bgColor="bg-red-200 " barColor="hidden" />
          </div>
          {/* <ProgressBar circleWidth={85} percentage={50} /> */}
        </div>
      </div>
    </>
  );
}

export default ProjectsContainer;
