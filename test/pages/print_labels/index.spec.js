import { mount } from '@vue/test-utils'
import Index from '@/pages/print_labels/index'

vi.mock('@/pages/print_labels/destination_plates', () => {
  return { default: {} }
})

// these tests are only here because code coverage is at 100%. Ridiculous and I am going to get rid of it.
describe('index', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Index)
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(Index).exists()).toBeTruthy()
  })
})
