import SprintLabelLayout from '@/utils/sprint_label_layout'

const template = {
  key1: [
    {
      x: 20,
      y: 1,
      title: '{{title}}',
    },
  ],
  key2: [
    {
      x: 3,
      y: 3,
      value: '{{value}}',
    },
    {
      x: 70,
      y: 3,
      value: '{{value}}',
    },
  ],
}

const data = {
  title: 'My title',
  value: 'My value',
}

const layout = {
  key1: [
    {
      x: 20,
      y: 1,
      title: 'My title',
    },
  ],
  key2: [
    {
      x: 3,
      y: 3,
      value: 'My value',
    },
    {
      x: 70,
      y: 3,
      value: 'My value',
    },
  ],
}

describe('SprintLabelLayout', () => {
  let subject

  beforeEach(() => {
    subject = new SprintLabelLayout(template)
  })

  describe('#create', () => {
    it('generates the expected layout', () => {
      expect(subject.create(data)).toEqual(layout)
    })
  })
})
