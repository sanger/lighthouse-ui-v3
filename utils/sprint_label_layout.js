import Mustache from 'mustache'

class SprintLabelLayout {
  constructor(template) {
    this.template = template
  }

  create = (fields) => {
    const jsonString = JSON.stringify(this.template)
    return JSON.parse(Mustache.render(jsonString, fields))
  }
}

export default SprintLabelLayout
