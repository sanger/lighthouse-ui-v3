import api from '@/modules/api'
import labwhere from '@/modules/labwhere'
import lighthouse from '@/modules/lighthouse_service'

describe('api', () => {
  describe('#createSamples', () => {
    beforeEach(() => {
      boxBarcode = 'aBoxBarcode'
      labwhereResponse = {
        success: true,
        barcodes: ['aBarcode1', 'aBarcode2'],
      }
    })

    let boxBarcode, labwhereResponse

    it('both getPlatesFromBoxBarcodes and createPlatesFromBarcodes are successful', async () => {
      labwhere.getPlatesFromBoxBarcodes = vi.fn().mockReturnValue(labwhereResponse)

      const expected = [
        {
          data: {
            plate_barcode: 'aBarcode1',
            centre: 'tst1',
            count_fit_to_pick_samples: 3,
          },
        },
        {
          data: {
            plate_barcode: 'aBarcode2',
            centre: 'tst1',
            count_fit_to_pick_samples: 1,
          },
        },
      ]

      lighthouse.createPlatesFromBarcodes = vi.fn().mockReturnValue(expected)

      const result = await api.createSamples(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwhere.getPlatesFromBoxBarcodes).toHaveBeenCalledWith(boxBarcode)
      expect(lighthouse.createPlatesFromBarcodes).toHaveBeenCalledWith(labwhereResponse)
    })

    it('getPlatesFromBoxBarcodes is successful, createPlatesFromBarcodes all fail', async () => {
      labwhere.getPlatesFromBoxBarcodes = vi.fn().mockReturnValue(labwhereResponse)

      const expected = [
        {
          errors: ['No samples for this barcode'],
        },
        {
          errors: ['No samples for this barcode'],
        },
      ]

      lighthouse.createPlatesFromBarcodes = vi.fn().mockReturnValue(expected)

      const result = await api.createSamples(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwhere.getPlatesFromBoxBarcodes).toHaveBeenCalledWith(boxBarcode)
      expect(lighthouse.createPlatesFromBarcodes).toHaveBeenCalledWith(labwhereResponse)
    })

    it('getPlatesFromBoxBarcodes is successful, createPlatesFromBarcodes partially fail', async () => {
      labwhere.getPlatesFromBoxBarcodes = vi.fn().mockReturnValue(labwhereResponse)

      const expected = [
        {
          errors: ['No samples for this barcode'],
        },
        {
          data: {
            plate_barcode: 'aBarcode2',
            centre: 'tst1',
            count_fit_to_pick_samples: 1,
          },
        },
      ]

      lighthouse.createPlatesFromBarcodes = vi.fn().mockReturnValue(expected)

      const result = await api.createSamples(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwhere.getPlatesFromBoxBarcodes).toHaveBeenCalledWith(boxBarcode)
      expect(lighthouse.createPlatesFromBarcodes).toHaveBeenCalledWith(labwhereResponse)
    })

    it('getPlatesFromBoxBarcodes fails', async () => {
      labwhere.getPlatesFromBoxBarcodes = vi.fn().mockReturnValue([])
      lighthouse.createPlatesFromBarcodes = vi.fn()

      const expected = [
        {
          errors: [`Failed to get plate barcodes for box barcode: ${boxBarcode}`],
        },
      ]
      const result = await api.createSamples(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwhere.getPlatesFromBoxBarcodes).toHaveBeenCalledWith(boxBarcode)
      expect(lighthouse.createPlatesFromBarcodes).not.toHaveBeenCalled()
    })
  })
})
