const config = useRuntimeConfig()

describe('Sequencescape', () => {
  let barcodes

  beforeEach(() => {
    barcodes = ['123', '456']
  })

  describe('#createPayloadForCherrypickBatch', () => {
    let payload, payloadAttributes

    beforeEach(() => {
      payload = sequencescape.createPayloadForCherrypickBatch(barcodes, config)
      payloadAttributes = payload.data.attributes
    })

    it('should have correct value for asynchronous', () => {
      expect(payloadAttributes.asynchronous).toBe('false')
    })

    it('should have the correct number of labware_pick_attributes', () => {
      expect(payloadAttributes.labware_pick_attributes).toHaveLength(2)
    })

    it('should have a study id, project id and barcode', () => {
      const labwarePickAttribute = payloadAttributes.labware_pick_attributes[0]
      expect(labwarePickAttribute.source_labware_barcode).toEqual(barcodes[0])
      expect(labwarePickAttribute.study_id).toBeGreaterThanOrEqual(1)
      expect(labwarePickAttribute.project_id).toBeGreaterThanOrEqual(1)
    })
  })

  describe('#createCherrypickBatch', () => {
    let response, expected

    afterEach(() => {
      useFetch.mockRestore()
    })

    it('successfully', async () => {
      expected = { data: { value: { data: 'testURL' } } }
      useFetch.mockResolvedValue(expected)
      response = await sequencescape.createCherrypickBatch(barcodes)
      expect(response.data).toEqual(expected.data.value.data)
    })

    it('when there is an error', async () => {
      useFetch.mockRejectedValue(new Error('There was an error'))
      response = await sequencescape.createCherrypickBatch(barcodes)
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })
})
