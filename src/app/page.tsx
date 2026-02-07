'use client'
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const x = () => {
  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);

  const handleCreateProject = async () => {
    await createProject({ name: "New Project" });
  };
  return (
    <div >
      <Button onClick={handleCreateProject}>
        Create New Project
      </Button>
      <h1>Polaris</h1>
      <p>Welcome to the Polaris app!</p>
      <main className="flex flex-col gap-2 p-4" >
        {projects?.map(({ _id, name }) => <div className="border rounded p-2 flex flex-col p-4" key={_id}>
          <p>Project Name: {name}</p>
          <p>project id : {_id}</p>
          </div>)}
      </main>
    </div>
  );
}

export default x;