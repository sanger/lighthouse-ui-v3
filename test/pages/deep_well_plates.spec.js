import { mount } from '@vue/test-utils'
import DeepWellPlates from '@/pages/deep_well_plates.vue'

vi.mock('@/utils/lighthouse_service')

describe('Deep Well Plates', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(DeepWellPlates)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('is a Vue instance', () => {
    wrapper = mount(DeepWellPlates)
    expect(wrapper.findComponent(DeepWellPlates).exists()).toBeTruthy()
  })
})
