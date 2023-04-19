import { mount } from '@vue/test-utils'
import DeepWellPlates from '@/pages/deep_well_plates.vue'
import flushPromises from 'flush-promises'

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

    describe('after submit button is clicked', () => {
      beforeEach(() => {
        wrapper.find('#submitBarcodes').trigger('click')
      })

      it('correctly submits the barcodes to lighthouse service', () => {
        expect(lighthouseService.createPlatesFromBarcodes).toHaveBeenCalledTimes(1)
        expect(lighthouseService.createPlatesFromBarcodes).toHaveBeenNthCalledWith(1, {
          barcodes: barcodesList,
          type: 'rvi_deep_well_96',
        })
      })

      it('populates the results table with the input barcodes', () => {
        const resultsTable = wrapper.find('#resultsTable')

        // Number of rows in the table should be number of barcodes + 1 for the header row
        expect(resultsTable.findAll('tr').length).toBe(barcodesList.length + 1)

        barcodesList.forEach((barcode) => {
          expect(resultsTable.text()).toContain(barcode)
        })
      })
    })
  })

  describe('with a known barcode for input', () => {
    beforeEach(() => {
      wrapper = mount(DeepWellPlates, {
        data() {
          return { plateBarcodes: 'barcode1' }
        },
      })
    })

    describe('with a success response', () => {
      let resultRow

      beforeEach(async () => {
        lighthouseService.createPlatesFromBarcodes.mockResolvedValue([
          {
            data: {
              value: {
                plate_barcode: 'barcode1',
                centre: 'Test Centre',
                count_fit_to_pick_samples: 86,
              },
            },
            error: { value: null },
          },
        ])

        wrapper.find('#submitBarcodes').trigger('click')
        await flushPromises()
        resultRow = wrapper.find('#resultsTable').findAll('tr').slice(-1)[0]
      })

      it('specifies that the plate was imported successfully', () => {
        expect(resultRow.text()).toBe('barcode1Plate was imported successfully.Yes')
      })

      it('uses the success variant for the row', () => {
        expect(resultRow.classes()).toContain('table-success')
      })
    })

    describe('with a 500 response', () => {
      let resultRow

      beforeEach(async () => {
        lighthouseService.createPlatesFromBarcodes.mockResolvedValue([
          {
            data: { value: null },
            error: {
              value: {
                statusCode: 500,
              },
            },
          },
        ])

        wrapper.find('#submitBarcodes').trigger('click')
        await flushPromises()
        resultRow = wrapper.find('#resultsTable').findAll('tr').slice(-1)[0]
      })

      it('specifies that there was a problem with the request', () => {
        expect(resultRow.text()).toBe(
          'barcode1There was a problem processing the request; please try again.Unknown'
        )
      })

      it('uses the warning variant for the row', () => {
        expect(resultRow.classes()).toContain('table-warning')
      })
    })

    describe('with a response that the plate already exists', () => {
      let resultRow

      beforeEach(async () => {
        lighthouseService.createPlatesFromBarcodes.mockResolvedValue([
          {
            data: { value: null },
            error: {
              value: {
                data: {
                  errors: ["The barcode 'barcode1' is already in use."],
                },
              },
            },
          },
        ])

        wrapper.find('#submitBarcodes').trigger('click')
        await flushPromises()
        resultRow = wrapper.find('#resultsTable').findAll('tr').slice(-1)[0]
      })

      it('specifies that there was a problem with the request', () => {
        expect(resultRow.text()).toBe('barcode1The barcode already exists in Sequencescape.Yes')
      })

      it('uses the success variant for the row', () => {
        expect(resultRow.classes()).toContain('table-success')
      })
    })

    describe('with a response listing other errors', () => {
      let resultRow

      beforeEach(async () => {
        lighthouseService.createPlatesFromBarcodes.mockResolvedValue([
          {
            data: { value: null },
            error: {
              value: {
                data: {
                  errors: ['Some kind of error', 'Another error message'],
                },
              },
            },
          },
        ])

        wrapper.find('#submitBarcodes').trigger('click')
        await flushPromises()
        resultRow = wrapper.find('#resultsTable').findAll('tr').slice(-1)[0]
      })

      it('specifies that there was a problem with the request', () => {
        expect(resultRow.text()).toBe(
          'barcode1Errors:  Some kind of error; Another error messageNo'
        )
      })

      it('uses the danger variant for the row', () => {
        expect(resultRow.classes()).toContain('table-danger')
      })
    })

    describe('with an unknown response', () => {
      let resultRow

      beforeEach(async () => {
        lighthouseService.createPlatesFromBarcodes.mockResolvedValue([{ unknown: 0 }])

        wrapper.find('#submitBarcodes').trigger('click')
        await flushPromises()
        resultRow = wrapper.find('#resultsTable').findAll('tr').slice(-1)[0]
      })

      it('specifies that there was a problem with the request', () => {
        expect(resultRow.text()).toBe(
          'barcode1Unhandled response received; please try again.Unknown'
        )
      })

      it('uses the warning variant for the row', () => {
        expect(resultRow.classes()).toContain('table-warning')
      })
    })
  })
})
