import { headers as SprintHeaders } from '@/utils/sprint_constants'
import { mockError } from '@/test/constants'

const config = useRuntimeConfig()

vi.mock('@/utils/baracoda', () => {
  return {
    default: {
      createBarcodes: vi.fn(),
    },
  }
})

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
      value: 'TEST',
      font: 'proportional',
      fontSize: 1.7,
    },
  ],
}

const barcodes = ['DN111111', 'DN222222', 'DN333333']

const labelFields = [
  { barcode: 'DN111111', text: 'TEST' },
  { barcode: 'DN222222', text: 'TEST' },
  { barcode: 'DN333333', text: 'TEST' },
]

describe('Sprint', () => {
  it('#createLayout', () => {
    expect(sprintGeneralLabels.createLayout(labelFields[0])).toEqual(layout)
  })

  describe('#createPrintRequestBody', () => {
    it('should produce the correct json if there is a single barcode', () => {
      const body = sprintGeneralLabels.createPrintRequestBody({
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
        sprintGeneralLabels.createPrintRequestBody({
          labelFields,
        }).variables.printRequest.layouts
      ).toHaveLength(3)
    })
  })

  it('#createLabelFields', () => {
    expect(sprintGeneralLabels.createLabelFields({ barcodes, text: 'TEST' })).toEqual(labelFields)
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

      const response = await sprintGeneralLabels.printLabels(args)

      expect(useFetch).toHaveBeenCalledWith(
        config.public.sprintBaseURL,
        {
          body: sprintGeneralLabels.createPrintRequestBody(args),
          headers: SprintHeaders,
          method: 'POST',
        },
        expect.any(String)
      )
      expect(response.success).toBeTruthy()
      expect(response.message).toBe('Successfully printed 3 labels to heron-bc3')
    })

    it('when sprint fails', async () => {
      useFetch.mockRejectedValue(mockError)

      const response = await sprintGeneralLabels.printLabels(args)

      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(mockError)
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

      const response = await sprintGeneralLabels.printLabels(args)

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
      mock = vi.spyOn(sprintGeneralLabels, 'printLabels')
    })

    describe('#printDestinationPlateLabels', () => {
      let barcodes

      beforeEach(() => {
        args = { numberOfBarcodes: '5', printer: 'heron-bc3' }
        barcodes = ['HT-111116', 'HT-111117', 'HT-111118', 'HT-111119', 'HT-111120']
      })

      it('successfully', async () => {
        baracoda.createBarcodes.mockResolvedValue({ success: true, barcodes })
        mock.mockResolvedValue({
          success: true,
          message: 'Successfully printed 5 labels to heron-bc3',
        })

        const response = await sprintGeneralLabels.printDestinationPlateLabels(args)
        expect(mock).toHaveBeenCalledWith({
          printer: 'heron-bc3',
          labelFields: sprintGeneralLabels.createLabelFields({ barcodes, text: 'TEST' }),
        })
        expect(response.success).toBeTruthy()
        expect(response.message).toBe('Successfully printed 5 labels to heron-bc3')
      })

      it('when baracoda fails', async () => {
        baracoda.createBarcodes.mockResolvedValue({
          success: false,
          error: mockError,
        })
        const response = await sprintGeneralLabels.printDestinationPlateLabels(args)
        expect(response.success).toBeFalsy()
        expect(response.error).toEqual(mockError)
      })

      it('unsuccessfully', async () => {
        baracoda.createBarcodes.mockResolvedValue({ success: true, barcodes })
        mock.mockRejectedValue(mockError)
        const response = await sprintGeneralLabels.printDestinationPlateLabels(args)
        expect(response.success).toBeFalsy()
        expect(response.error).toEqual(mockError)
      })
    })
  })
})
