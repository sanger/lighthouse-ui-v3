import Mustache from 'mustache'

const TemplateRenderer = (template) => (fields) => {
  const jsonString = JSON.stringify(template)
  return JSON.parse(Mustache.render(jsonString, fields))
}

export default TemplateRenderer
