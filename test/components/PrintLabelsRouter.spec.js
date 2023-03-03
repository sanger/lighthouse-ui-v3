import { mount } from '@vue/test-utils'
import PrintLabelsRouter from '@/components/PrintLabelsRouter'

const links = [
  'Destination Plates',
  'Source Plates',
  'Control Plates',
  'Ad Hoc Plates',
  'Reagent Aliquots',
]

describe('PrintLabelsRouter.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PrintLabelsRouter, {
      stubs: ['nuxt-link'],
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(PrintLabelsRouter).exists()).toBeTruthy()
  })

  it.each(links)('will have a link to %s', (link) => {
    expect(wrapper.text()).toMatch(link)
  })
})
