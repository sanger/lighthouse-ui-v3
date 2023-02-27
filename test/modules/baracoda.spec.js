import Baracoda from '@/modules/baracoda'

const errorResponse = new Error('There was an error')

describe('PlateBarcode', () => {
  let barcodes

  afterEach(() => {
    vi.resetAllMocks()
    barcodes = ['HT-111116', 'HT-111117', 'HT-111118', 'HT-111119', 'HT-111120']
  })

  describe('#createBarcodes', () => {
    it('successfully', async () => {
      useFetch.mockResolvedValue({
        data: {
          value: {
            barcodes_group: {
              barcodes,
              id: 3,
            },
          },
        },
      })

      const response = await Baracoda.createBarcodes(5)

      expect(response.success).toBeTruthy()
      expect(response.barcodes).toEqual(barcodes)
    })

    it('unsuccessfully', async () => {
      useFetch.mockRejectedValue(errorResponse)

      const response = await Baracoda.createBarcodes(5)

      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(errorResponse)
    })
  })
})
