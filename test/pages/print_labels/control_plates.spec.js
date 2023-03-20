import { mount } from '@vue/test-utils'
import ControlPlates from '@/pages/print_labels/control_plates'

const config = useRuntimeConfig()

vi.mock('@/utils/sprint_general_labels')

describe('print control plate labels', () => {
  let wrapper, printers

  beforeEach(() => {
    printers = config.printers.split(',')
    wrapper = mount(ControlPlates)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(ControlPlates).exists()).toBeTruthy()
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

  it('should be able to select a number of labels', () => {
    const input = wrapper.find('#numberOfBarcodes')
    input.setValue(10)
    expect(wrapper.vm.numberOfBarcodes).toBe('10')
  })

  it('#multiplyBarcodes', () => {
    wrapper = mount(ControlPlates, {
      data() {
        return {
          printer: 'heron-bc1',
          numberOfBarcodes: '5',
          barcode: 'DN111111',
        }
      },
    })

    expect(wrapper.vm.multiplyBarcodes()).toEqual([
      'DN111111',
      'DN111111',
      'DN111111',
      'DN111111',
      'DN111111',
    ])
  })

  describe('printing labels', () => {
    beforeEach(() => {
      wrapper = mount(ControlPlates, {
        data() {
          return {
            printer: 'heron-bc1',
            numberOfBarcodes: '10',
            barcode: 'DN111111',
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
      expect(sprintGeneralLabels.createLabelFields).toHaveBeenCalledWith({
        barcodes: wrapper.vm.multiplyBarcodes(),
        text: 'Control',
      })
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
