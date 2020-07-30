import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Project Title'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
