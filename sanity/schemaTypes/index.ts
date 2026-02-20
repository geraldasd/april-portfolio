import { type SchemaTypeDefinition } from 'sanity'
import { information } from './information'
import { project } from './project'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [information, project, siteSettings],
}
