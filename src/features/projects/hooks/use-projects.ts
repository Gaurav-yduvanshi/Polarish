/*eslint-disable react-hooks/purity */
import {useQuery, useMutation} from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
// import { useAuth } from "@clerk/nextjs";

export const useProjects = () =>{
    return useQuery(api.projects.get);
}

export const useProjectsPartial = (limit:number)=>{
    return useQuery(api.projects.getPartial,{
        limit
    })
}

export const useCreateProject = () => {
    return useMutation(api.projects.create).withOptimisticUpdate(
        (localstore, args) => {
            const existingProjects = localstore.getQuery(api.projects.get);
            if (existingProjects !== undefined) {
                const now = Date.now();
                const newProject = {
                    _id: crypto.randomUUID() as Id<"projects">,
                    _creationTime: now,
                    name: args.name,
                    ownerId: "anonymous",
                    updatedAt: now,
                };
                localstore.setQuery(api.projects.get, {}, [
                    newProject,
                    ...existingProjects, // ✅ existingProjects is narrowed here
                ]);
            }
        }
    );
}