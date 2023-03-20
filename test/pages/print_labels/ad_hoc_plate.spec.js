import { mount } from '@vue/test-utils'
import AdHocPlate from '@/pages/print_labels/ad_hoc_plate'

const config = useRuntimeConfig()

vi.mock('@/utils/sprint_general_labels')

describe('Print ad-hoc plate labels', () => {
  let wrapper, printers

  beforeEach(() => {
    printers = config.printers.split(',')
    wrapper = mount(AdHocPlate, {
      data() {
        return {}
      },
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(AdHocPlate).exists()).toBeTruthy()
  })

  it('should have some printers', () => {
    expect(wrapper.vm.printers).toBeDefined()
    expect(wrapper.vm.printers).toEqual(printers)
  })

  it('should be able to select a printer', () => {
    expect(wrapper.find('#selectPrinter').findAll('option')).toHaveLength(printers.length)
  })

  it('should be able to add a barcode', () => {
    const input = wrapper.find('#barcode')
    input.setValue('DN111111')
    expect(wrapper.vm.barcode).toBe('DN111111')
  })

  it('should be able to add some text', () => {
    const input = wrapper.find('#text')
    input.setValue('some text')
    expect(wrapper.vm.text).toBe('some text')
  })

  describe('printing labels', () => {
    beforeEach(() => {
      wrapper = mount(AdHocPlate, {
        data() {
          return {
            printer: 'heron-bc1',
            barcode: 'DN111111',
            text: 'some text',
          }
        },
      })
    })

    it('successfully', async () => {
      sprintGeneralLabels.printLabels.mockReturnValue({
        success: true,
        message: 'Labels successfully printed',
      })
      await wrapper.vm.printLabels()
      expect(sprintGeneralLabels.printLabels).toHaveBeenCalled()
      expect(wrapper.find('.alert').text()).toMatch('Labels successfully printed')
    })

    it('unsuccessfully', async () => {
      sprintGeneralLabels.printLabels.mockReturnValue({
        success: false,
        error: 'There was an error',
      })
      await wrapper.vm.printLabels()
      expect(wrapper.find('.alert').text()).toMatch('There was an error')
    })
  })
})
