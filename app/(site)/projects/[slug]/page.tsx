import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProjectSlugs,
  getInformation,
} from "../../../../sanity/lib/queries";
import ProjectViewer from "./ProjectViewer";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 10;

export async function generateStaticParams() {
  return getProjectSlugs();
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, info] = await Promise.all([
    getProjectBySlug(slug),
    getInformation(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <ProjectViewer
      project={project}
      siteName={info?.name ?? "April Li"}
    />
  );
}
