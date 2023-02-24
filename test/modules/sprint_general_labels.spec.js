import Sprint from '@/modules/sprint_general_labels'
import Baracoda from '@/modules/baracoda'
import { headers as SprintHeaders } from '@/modules/sprint_constants'

const config = useRuntimeConfig()

vi.mock('#app', () => {
  return {
    useFetch: vi.fn(),
    useRuntimeConfig: vi.fn().mockReturnValue({
      sprintBaseURL: 'http://sprintBaseURL',
    }),
  }
})

vi.mock('@/modules/baracoda', () => {
  return {
    default: {
      createBarcodes: vi.fn(),
    },
  }
})

// TODO: DPL-561 - move out into helper
const errorResponse = new Error('There was an error')

const layout = {
  barcodeFields: [
    {
      x: 20,
      y: 1,
      cellWidth: 0.2,
      barcodeType: 'code39',
      value: 'DN111111',
      height: 5,
    },
  ],
  textFields: [
    {
      x: 3,
      y: 3,
      value: 'DN111111',
      font: 'proportional',
      fontSize: 1.7,
    },
    {
      x: 70,
      y: 3,
      value: 'LHTR',
      font: 'proportional',
      fontSize: 1.7,
    },
  ],
}

const barcodes = ['DN111111', 'DN222222', 'DN333333']

const labelFields = [
  { barcode: 'DN111111', text: 'LHTR' },
  { barcode: 'DN222222', text: 'LHTR' },
  { barcode: 'DN333333', text: 'LHTR' },
]

describe('Sprint', () => {
  it('#createLayout', () => {
    expect(Sprint.createLayout(labelFields[0])).toEqual(layout)
  })

  describe('#createPrintRequestBody', () => {
    it('should produce the correct json if there is a single barcode', () => {
      const body = Sprint.createPrintRequestBody({
        labelFields: [labelFields[0]],
        printer: 'heron-bc3',
      })
      expect(body.query).toBeDefined()
      const variables = body.variables
      expect(variables).toBeDefined()
      expect(variables.printer).toBe('heron-bc3')
      expect(variables.printRequest).toBeDefined()
      expect(variables.printRequest.layouts[0]).toEqual(layout)
    })

    it('should produce the correct json if there are multiple barcodes', () => {
      expect(
        Sprint.createPrintRequestBody({
          labelFields,
        }).variables.printRequest.layouts
      ).toHaveLength(3)
    })
  })

  it('#createLabelFields', () => {
    expect(Sprint.createLabelFields({ barcodes, text: 'LHTR' })).toEqual(labelFields)
  })

  describe('#printLabels', () => {
    let args

    beforeEach(() => {
      args = { labelFields, printer: 'heron-bc3' }
    })

    afterEach(() => {
      vi.resetAllMocks()
    })

    it('successfully', async () => {
      useFetch.mockResolvedValue({
        data: {
          value: {
            print: {
              jobId: 'heron-bc1:eb5a7d75-2510-4355-a3c1-33c1ce8742ba',
            },
          },
        },
      })

      const response = await Sprint.printLabels(args)

      expect(useFetch).toHaveBeenCalledWith(
        config.sprintBaseURL,
        {
          body: Sprint.createPrintRequestBody(args),
          headers: SprintHeaders,
          method: 'POST',
        },
        expect.any(String)
      )
      expect(response.success).toBeTruthy()
      expect(response.message).toBe('Successfully printed 3 labels to heron-bc3')
    })

    it('when sprint fails', async () => {
      useFetch.mockRejectedValue(errorResponse)

      const response = await Sprint.printLabels(args)

      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(errorResponse)
    })

    it('when sprint returns an error', async () => {
      useFetch.mockResolvedValue({
        data: {
          value: {
            errors: [
              {
                message:
                  'Exception while fetching data (/print) : Unknown printer without explicit printer type: bug',
              },
            ],
          },
        },
      })

      const response = await Sprint.printLabels(args)

      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(
        new Error(
          'Exception while fetching data (/print) : Unknown printer without explicit printer type: bug'
        )
      )
    })
  })

  describe('print different types of labels', () => {
    let mock, args

    afterEach(() => {
      vi.resetAllMocks()
    })

    beforeEach(() => {
      mock = vi.spyOn(Sprint, 'printLabels')
    })

    describe('#printDestinationPlateLabels', () => {
      let barcodes

      beforeEach(() => {
        args = { numberOfBarcodes: '5', printer: 'heron-bc3' }
        barcodes = ['HT-111116', 'HT-111117', 'HT-111118', 'HT-111119', 'HT-111120']
      })

      it('successfully', async () => {
        Baracoda.createBarcodes.mockResolvedValue({ success: true, barcodes })
        mock.mockResolvedValue({
          success: true,
          message: 'Successfully printed 5 labels to heron-bc3',
        })

        const response = await Sprint.printDestinationPlateLabels(args)
        expect(mock).toHaveBeenCalledWith({
          printer: 'heron-bc3',
          labelFields: Sprint.createLabelFields({ barcodes, text: 'LHTR' }),
        })
        expect(response.success).toBeTruthy()
        expect(response.message).toBe('Successfully printed 5 labels to heron-bc3')
      })

      it('when baracoda fails', async () => {
        Baracoda.createBarcodes.mockResolvedValue({
          success: false,
          error: errorResponse,
        })
        const response = await Sprint.printDestinationPlateLabels(args)
        expect(response.success).toBeFalsy()
        expect(response.error).toEqual(errorResponse)
      })

      it('unsuccessfully', async () => {
        Baracoda.createBarcodes.mockResolvedValue({ success: true, barcodes })
        mock.mockRejectedValue(errorResponse)
        const response = await Sprint.printDestinationPlateLabels(args)
        expect(response.success).toBeFalsy()
        expect(response.error).toEqual(errorResponse)
      })
    })
  })
})
