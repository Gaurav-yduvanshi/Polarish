import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { AlertCircle, GlobeIcon, Loader2Icon } from "lucide-react";


import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import { useProjects } from "../hooks/use-projects";
import { boolean } from "zod/v4";
import { Doc } from "../../../../convex/_generated/dataModel";

interface ProjectsCommandDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
const getProjectIcon = (project: Doc<"projects">) => {
    if (project.importStatus == "completed") {
        return <FaGithub className="size-3.5 text-muted-foreground" />
    }
    if (project.importStatus == "failed") {
        return <AlertCircle className="size-3.5 text-muted-foreground" />
    }
    if (project.importStatus == "importing") {
        return <Loader2Icon className="size-3.5 text-muted-foreground animate-spin" />
    }

    return <GlobeIcon className="size-3.5 text-muted-foreground" />
}

export const ProjectsCommandDialog = ({
    open,
    onOpenChange,
}: ProjectsCommandDialogProps) => {
    const router = useRouter();
    const projects = useProjects();

    const handleSelect = (projectId: string) => {
        router.push(`/projects/${projectId}`);
        onOpenChange(false);
    };
    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Search Project"
            description="Search and Navigate to your Project"
        >
            <CommandInput placeholder="Search your project"/>
                <CommandList>
                    <CommandEmpty>No Projects Found.</CommandEmpty>
                    <CommandGroup heading="Projects">
                        {projects?.map((project) => (
                            <CommandItem
                                key={project._id}
                                value={`${project.name}-${project._id}`}
                                onSelect={() => handleSelect(project._id)}
                            >
                                {getProjectIcon(project)}
                                <span>{project.name}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
           
        </CommandDialog>
    )
}