import PlatesJson from '../data/labwhere_plates'
import { mockError } from '@/test/constants'

describe('Labwhere', () => {
  describe('#getPlatesFromBoxBarcodes', () => {
    let boxBarcodes

    beforeEach(() => {
      boxBarcodes = ['lw-ogilvie-4', 'lw-ogilvie-5']
    })

    afterEach(() => {
      useFetch.mockClear()
    })

    it('successfully', async () => {
      const mockResponse = { data: { value: PlatesJson } }

      useFetch.mockResolvedValue(mockResponse)

      const response = await labwhere.getPlatesFromBoxBarcodes(boxBarcodes)
      expect(response.success).toBeTruthy()
      expect(response.barcodes).toEqual(['AB123', 'CD456'])
    })

    it('when there is an error', async () => {
      useFetch.mockRejectedValue(mockError)

      const response = await labwhere.getPlatesFromBoxBarcodes(boxBarcodes)

      expect(response.success).toBeFalsy()
      expect(response.barcodes).toBeUndefined()
    })

    // This is the same as the above but worth adding for consistency
    it('when the box does not exist', async () => {
      useFetch.mockRejectedValue(mockError)

      const response = await labwhere.getPlatesFromBoxBarcodes(['dodgybarcode'])

      expect(response.success).toBeFalsy()
      expect(response.barcodes).toBeUndefined()
      expect(response.error).toEqual(mockError)
    })

    it('when the box has no plates', async () => {
      useFetch.mockResolvedValue({ data: { value: [] } })

      const response = await labwhere.getPlatesFromBoxBarcodes(boxBarcodes)

      expect(response.success).toBeFalsy()
      expect(response.error).toBe('The box has no plates')
    })
  })
})
