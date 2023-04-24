import { mount } from '@vue/test-utils'
import PrintDestinationPlateLabels from '@/pages/print_labels/destination_plates'

const config = useRuntimeConfig()

vi.mock('@/utils/sprint_general_labels')

describe('print destination plate labels', () => {
  let wrapper, printers

  beforeEach(() => {
    printers = config.public.printers.split(',')
    wrapper = mount(PrintDestinationPlateLabels)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(PrintDestinationPlateLabels).exists()).toBeTruthy()
  })

  it('should have some printers', () => {
    expect(wrapper.vm.printers).toBeDefined()
    expect(wrapper.vm.printers).toEqual(printers)
  })

  it('should be able to select a printer', () => {
    expect(wrapper.find('#selectPrinter').findAll('option')).toHaveLength(printers.length)
  })

  it('should be able to select a number of labels', () => {
    const input = wrapper.find('#numberOfBarcodes')
    input.setValue(10)
    expect(wrapper.vm.numberOfBarcodes).toBe('10')
  })

  describe('printing labels', () => {
    beforeEach(() => {
      wrapper = mount(PrintDestinationPlateLabels, {
        data() {
          return {
            printer: 'heron-bc1',
            numberOfBarcodes: 10,
          }
        },
      })
    })

    it('successfully', async () => {
      sprintGeneralLabels.printDestinationPlateLabels.mockReturnValue({
        success: true,
        message: 'Labels successfully printed',
      })
      await wrapper.vm.printLabels()
      expect(wrapper.find('.alert').text()).toMatch('Labels successfully printed')
    })

    it('unsuccessfully', async () => {
      sprintGeneralLabels.printDestinationPlateLabels.mockReturnValue({
        success: false,
        error: 'There was an error',
      })
      await wrapper.vm.printLabels()
      expect(wrapper.find('.alert').text()).toMatch('There was an error')
    })
  })
})
