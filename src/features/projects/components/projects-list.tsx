import { Spinner } from "@/components/ui/spinner";
import { useProjectsPartial } from "../hooks/use-projects";
import { Doc } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { AlertCircle, ArrowRightIcon, GlobeIcon, Loader2Icon } from "lucide-react";
import { timeStamp } from "console";
import { formatDistanceToNow } from "date-fns";
import { Span } from "next/dist/trace";
import { date } from "zod/v4";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProjectsCommandDialog } from "./projects-command-dialer";


const formatTimeStamp = (timeStamp: number) => {
    return formatDistanceToNow(new Date(timeStamp), {
        addSuffix: true
    })
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
interface ProjectsListProps {
    onViewAll: () => void;
}

const ContinueCard = ({ data }: { data: Doc<"projects"> }) => {


    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">
                Last Updated
            </span>
            <Button
                variant="outline"
                asChild
                className="h-auto items-start justify-start p-4 bg-background border rounded-none flex
            flex-col gap-2">

                <Link href={`/projects/${data._id}`} className="group">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            {getProjectIcon(data)}
                            <span className="font-medium truncate">
                                {data.name}
                            </span>
                        </div>
                        <ArrowRightIcon className="size-4 text-muted-foreground group-hover:translate-x-0.5
                transition-transform"/>
                    </div>
                    <span className="text-xs text-muted-foreground group:hover:text-foreground/60 transition-colors">
                        {formatTimeStamp(data.updatedAt)}
                    </span>
                </Link>
            </Button>

        </div>
    )

}
const ProjectItem = ({ data }: { data: Doc<"projects"> }) => {
    return (
        <Link href={`/projects/${data._id}`}
            className="text-sm text-foreground/60 font-medium hover:text-foreground
    py-1 flex items-center justify-between w-full group"
        >
            <div className="flex item-center gap-2">
                {getProjectIcon(data)}
                <span className="truncate">
                    ${data.name}
                </span>
            </div>
            {/* <ArrowRightIcon/> */}
            <span className="text-xs text-muted-foreground group:hover:text-foreground/60 transition-colors">
                {formatTimeStamp(data.updatedAt)}
            </span>

        </Link>
    )

}

export const ProjectsList = (props: ProjectsListProps) => {
    const { onViewAll } = props;
    const projects = useProjectsPartial(6);

    if (projects === undefined) {
        return <Spinner className="size-4 text-ring" />
    }
    const [mostRecent, ...rest] = projects;

    

    return (
        <>
        
            <div className="flex flex-col gap-4">
                {mostRecent ? <ContinueCard data={mostRecent} /> : null}
                {projects.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                                Recent Projects
                            </span>
                            <button 
                            onClick={onViewAll}
                            className="flex itmes-center gap-2 text-muted foreground text-xs hover:text-foreground transition-colors">
                                <span>View All</span>
                                <kbd className="bg-accent border">
                                    ctrl+k
                                </kbd>
                            </button>
                        </div>
                        <ul className="flex flex-col">
                            {projects.map((project) => (
                                <ProjectItem
                                    key={project._id}
                                    data={project} />
                            ))}
                        </ul>
                    </div>
                )}

            </div>
        </>
    )
}