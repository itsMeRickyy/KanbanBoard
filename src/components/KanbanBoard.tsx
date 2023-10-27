import ProjectsContainer from "./Container/ProjectsContainer";

function KanbanBoard() {
  return (
    <>
      <div className="bg-slate-600 h-full min-h-screen   w-full flex justify-center items-center">
        <ProjectsContainer />
      </div>
    </>
  );
}

export default KanbanBoard;
