import { ProjectLayout } from "@/features/projects/components/project-id-layout";
import { Id } from "../../../../convex/_generated/dataModel";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
    
  const { projectId } = await params;
    
  return (
    <ProjectLayout projectId={projectId as Id<"projects">}>
      {children}
    </ProjectLayout>
  );
}