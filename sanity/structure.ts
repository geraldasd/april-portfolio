import type { StructureResolver } from 'sanity/structure'
import { CogIcon, ProjectsIcon, EarthGlobeIcon } from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Information — singleton (fixed document ID)
      S.listItem()
        .title('Information')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('information')
            .documentId('information')
            .title('Site Information')
        ),
      S.divider(),
      // Projects — standard document list
      S.listItem()
        .title('Projects')
        .icon(ProjectsIcon)
        .child(
          S.documentTypeList('project')
            .title('Projects')
        ),
      S.divider(),
      // SEO & Social Sharing — singleton
      S.listItem()
        .title('SEO & Social Sharing')
        .icon(EarthGlobeIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('SEO & Social Sharing')
        ),
    ])
