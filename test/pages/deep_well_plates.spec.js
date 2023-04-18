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
    expect(wrapper.findComponent(DeepWellPlates).exists()).toBeTruthy()
  })

  describe('initial state', () => {
    it('is correct', () => {
      expect(wrapper.vm.status).toBe(statuses.Idle)
      expect(wrapper.vm.plateBarcodes).toBe('')
      expect(wrapper.vm.results).toEqual([])
    })

    it('disables the submit button', () => {
      const submitButton = wrapper.find('#submitBarcodes')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('hides the activity spinner', () => {
      const spinner = wrapper.find('#busySpinner')
      expect(spinner.isVisible()).toBeFalsy()
    })
  })

  describe.each([
    ['a single barcode', 'barcode1', ['barcode1']],
    ['two barcodes on separate lines', 'barcode1\nbarcode2', ['barcode1', 'barcode2']],
    [
      'two barcodes with a mix of whitespace',
      '  barcode1\t \n  \n \n  barcode2   \t',
      ['barcode1', 'barcode2'],
    ],
    [
      'two barcodes with duplication',
      'barcode1\nbarcode2 barcode2\tbarcode1',
      ['barcode1', 'barcode2'],
    ],
  ])('given an input of %s', (_, inputBarcodes, barcodesList) => {
    beforeEach(() => {
      wrapper = mount(DeepWellPlates, {
        data() {
          return { plateBarcodes: inputBarcodes }
        },
      })

      const mockedResponses = barcodesList.map(() => {
        return { data: {}, error: {} }
      })
      lighthouseService.createPlatesFromBarcodes.mockResolvedValue(mockedResponses)
    })

    it('activates the submit button', () => {
      const submitButton = wrapper.find('#submitBarcodes')
      expect(submitButton.attributes('disabled')).not.toBeDefined()
    })

    it('clears the values when the clear button is clicked', () => {
      // Sanity check
      expect(wrapper.vm.plateBarcodes).toBe(inputBarcodes)

      // Action
      const clearButton = wrapper.find('#clearBarcodes')
      clearButton.trigger('click')

      // Assertion
      expect(wrapper.vm.plateBarcodes).toBe('')
    })

    describe('when submit button is clicked', () => {
      beforeEach(() => {
        const submitButton = wrapper.find('#submitBarcodes')
        submitButton.trigger('click')
      })

      it('correctly submits the barcodes to lighthouse service', () => {
        expect(lighthouseService.createPlatesFromBarcodes).toHaveBeenCalledTimes(1)
        expect(lighthouseService.createPlatesFromBarcodes).toHaveBeenNthCalledWith(1, {
          barcodes: barcodesList,
          type: 'rvi_deep_well_96',
        })
      })
    })
  })
})
