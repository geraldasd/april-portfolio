import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProjectSlugs,
  getInformation,
} from "../../../../sanity/lib/queries";
import ProjectViewer from "./ProjectViewer";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 10;

export async function generateStaticParams() {
  return getProjectSlugs();
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const initialImage = sp.image ? parseInt(sp.image as string, 10) : 0;

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
      initialIndex={initialImage}
    />
  );
}
