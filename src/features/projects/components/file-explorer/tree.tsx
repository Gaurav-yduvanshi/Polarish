import { ChevronRight, ChevronRightIcon, Folder } from "lucide-react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils"
import { TreeItemWrapper } from "./tree-item-wrapper";

import { cn } from "@/lib/utils";

import {
    useCreateFile,
    useCreateFolder,
    useFolderContents,
    useDeleteFile,
    useRenameFile
} from "@/features/projects/hooks/use-files"

import { getItemPadding } from "./constant";
import { LoadingRow } from "./loading-row";
import { CreateInput } from "./create-input";

import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";

export const Tree = ({
    item,
    level = 0,
    projectId,
}: {
    item: Doc<"files">;
    level?: number,
    projectId: Id<"projects">;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [creating, setCreating] = useState<"file" | "folder" | null>(null);

    const renameFile = useRenameFile();
    const deleteFile = useDeleteFile();
    const createFile = useCreateFile();
    const createFolder = useCreateFolder();


    const folderContents = useFolderContents({
        projectId,
        parentId: item._id,
        enabled: item.type == "folder" && isOpen
    })

    const startCreating = (type: "file" | "folder") => {
        setIsOpen(true);
        setCreating(type);
    }

    if (item.type === 'file') {
        const fileName = item.name;
        return (
            <TreeItemWrapper
                item={item}
                level={level}
                isActive={false}
                onClick={() => { }}
                onDoubleClick={() => { }}
                onRename={() => setIsRenaming(true)}
                onDelete={() => {
                    deleteFile({ id: item._id })
                }}
            >
                <FileIcon fileName={fileName} autoAssign className="size-4" />
                <span className="truncate text-sm">
                    {fileName}
                </span>
            </TreeItemWrapper>
        )
    }

    const handleCreate = (name: string) => {
        setCreating(null);
        if (creating === 'file') {
            createFile({
                projectId,
                name,
                content: "",
                parentId: item._id
            }).catch((err) => toast.error(err.message ?? "Failed to create file"));
        } else {
            createFolder({
                projectId,
                name,
                parentId: item._id,
            }).catch((err) => toast.error(err.message ?? "Failed to create folder"));
        }
    }
    const folderName = item.name;
    const folderContent = (
        <>
            <div className="flex items-center gap-0.5">
                <ChevronRightIcon
                    className={cn(
                        "size-4 shrink-0 text-muted-foreground",
                        isOpen && "rotate-90"
                    )}
                />
                <FolderIcon folderName={folderName} className="size-4" />
            </div>
            <span className="truncate text-sm">{folderName}</span>
        </>
    )
    if (creating) {
        return (
            <>
                <button
                    onClick={() => setIsOpen((value) => !value)}
                    className="group flex items-center gap-1 h-5.5 hover:bg-accent/30 w-full"
                >
                    {folderContent}
                </button>
                {isOpen && (
                    <>
                        {folderContents === undefined && <LoadingRow level={level + 1} />}
                        <CreateInput
                            type={creating}
                            level={level + 1}
                            onSubmit={handleCreate}
                            onCancel={() => setCreating(null)}
                        />

                        {folderContents?.map((subItem) => (
                            <Tree
                                key={subItem._id}
                                item={subItem}
                                level={level + 1}
                                projectId={projectId}
                            />
                        ))}


                    </>
                )}
            </>
        )
    }

    return (
        <>
            <TreeItemWrapper
                item={item}
                level={level}
                onClick={() => setIsOpen((value) => !value)}
                onDoubleClick={() => { }}
                onRename={() => setIsRenaming(true)}
                onDelete={() => {
                    // Tood close tab
                    deleteFile({ id: item._id })
                }}
                onCreateFile={() => startCreating("file")}
                onCreateFolder={() => startCreating("folder")}
            >
                {folderContent}


            </TreeItemWrapper>

            {isOpen && (
                <>
                    {folderContents === undefined && <LoadingRow level={level + 1} />}
                    {folderContents?.map((subItem) => (
                        <Tree
                            key={subItem._id}
                            item={subItem}
                            level={level + 1}
                            projectId={projectId}
                        />
                    ))}
                </>
            )}
        </>
    )


}