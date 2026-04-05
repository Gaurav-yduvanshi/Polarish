import { ChevronRightIcon, CopyMinusIcon, FilePlusCorner, FolderPlusIcon } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useState } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useProject } from "../../hooks/use-projects";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useCreateFile, useCreateFolder, useFolderContents } from "../../hooks/use-files";
import { CreateInput } from "./create-input";
import { LoadingRow } from "./loading-row";
import { Tree } from "./tree";
import { toast } from "sonner";

export const FileExplorer = ({
  projectId,
}: {
  projectId: Id<"projects">;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [collapseKey, setCollapseKey] = useState(0);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const project = useProject(projectId)
  const rootFiles = useFolderContents({
    projectId,
    enabled: isOpen,
  });

  const createFile = useCreateFile();
  const createFolder = useCreateFolder();

  const handleCreate = (name: string) => {
    if (creating === "file") {
      createFile({
        projectId,
        name,
        content: "",
        parentId: undefined,
      }).catch((err: Error) => toast.error(err.message ?? "Failed to create file"));
    } else {
      createFolder({
        projectId,
        name,
        parentId: undefined,
      }).catch((err: Error) => toast.error(err.message ?? "Failed to create folder"));
    }

    setCreating(null);
  };



  return (
    <div className="h-full bg-sidebar">
      <ScrollArea.Root className="h-full">
        <ScrollArea.Viewport>
          <div
            role="button"
            onClick={() => setIsOpen((value) => !value)}
            className="group/project cursor-pointer w-full text-left flex items-center gap-0.5 h-5.5 bg-accent font-bold"
          >
            <ChevronRightIcon
              className={cn(
                "size-4 shrink-0 text-muted-foreground",
                isOpen && "rotate-90"
              )}
            />

            <p className="text-xs uppercase line-clamp-1">
              {project?.name ?? "Loading..."}
            </p>

            <div
              className="opacity-0 group-hover/project:opacity-100
              transition-none duration-0 flex items-center gap-0.5 ml-auto"
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(true);
                  setCreating("file");
                }}
                variant="highlight"
                size="icon-xs"
              >
                <FilePlusCorner className="size-3.5" />
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(true);
                  setCreating("folder");
                }}
                variant="highlight"
                size="icon-xs"
              >
                <FolderPlusIcon className="size-3.5" />
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setCollapseKey((prev) => prev + 1);
                }}
                variant="highlight"
                size="icon-xs"
              >
                <CopyMinusIcon className="size-3.5" />
              </Button>
            </div>
          </div>

          {isOpen && (

            <>
              {rootFiles === undefined && <LoadingRow level={0} />}
              {creating && (
                <CreateInput
                  type={creating}
                  level={0}
                  onSubmit={handleCreate}
                  onCancel={() => setCreating(null)}
                />
              )}
              {rootFiles?.map((item) => (
                <Tree
                  key={`${item._id}-${collapseKey}`}
                  item={item}
                  level={0}
                  projectId={projectId}
                />
              ))}
            </>
          )}
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </div>
  );
};