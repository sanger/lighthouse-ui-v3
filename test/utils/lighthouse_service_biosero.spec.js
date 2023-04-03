import { sourcePlate, destinationPlate } from '../data/biosero_plates'

const config = useRuntimeConfig()

describe('lighthouse_service_biosero api', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('#createDestinationPlateBiosero', () => {
    let username, barcode, form

    beforeEach(() => {
      username = 'username'
      barcode = 'aBarcode'
      form = {
        username,
        barcode,
      }
    })

    it('on success', async () => {
      const response = {
        status: 201,
      }
      useFetch.mockResolvedValue(response)

      const result = await lighthouseServiceBiosero.createDestinationPlateBiosero(form)
      const expected = {
        success: true,
        response: `Successfully created destination plate with barcode: ${barcode}`,
      }
      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
      expect(useFetch).toHaveBeenCalledWith(
        `${config.lighthouseBaseURL}/events`,
        {
          body: {
            barcode,
            user_id: username,
            event_type: 'lh_biosero_cp_destination_plate_partial_completed',
          },
          headers: {
            Authorization: config.lighthouseApiKey,
          },
          method: 'POST',
        },
        expect.any(String)
      )
    })

    it('on failure with unexpected status code', async () => {
      const response = {
        data: {
          value: {
            _status: 'ERR',
            _error: {
              code: 422,
              message: 'There was an error',
            },
          },
        },
      }
      useFetch.mockResolvedValue(response)

      const result = await lighthouseServiceBiosero.createDestinationPlateBiosero(form)

      const expected = {
        success: false,
        error: {
          code: 422,
          message: 'There was an error',
        },
      }

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    })

    it('on failure with exception', async () => {
      const errorResponse = new Error('There was an error')

      useFetch.mockRejectedValue(errorResponse)

      const result = await lighthouseServiceBiosero.createDestinationPlateBiosero(form)

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result.success).toBe(false)
      expect(result.error).toEqual(errorResponse)
    })
  })

  describe('#failDestinationPlateBiosero', () => {
    let username, barcode, form, failureType

    beforeEach(() => {
      username = 'username'
      barcode = 'aBarcode'
      failureType = 'aType'
      form = {
        username,
        barcode,
        failureType,
      }
    })

    it('on success', async () => {
      const response = {
        data: {
          value: {
            _status: 'OK',
          },
        },
      }
      useFetch.mockResolvedValue(response)

      const result = await lighthouseServiceBiosero.failDestinationPlateBiosero(form)
      const expected = {
        success: true,
        response: `Successfully failed destination plate with barcode: ${barcode}`,
      }

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
      expect(useFetch).toHaveBeenCalledWith(
        `${config.lighthouseBaseURL}/events`,
        {
          body: {
            barcode,
            user_id: username,
            event_type: 'lh_biosero_cp_destination_plate_failed',
            failure_type: failureType,
          },
          headers: {
            Authorization: config.lighthouseApiKey,
          },
          method: 'POST',
        },
        expect.any(String)
      )
    })

    it('on failure with unexpected status code', async () => {
      const response = {
        data: {
          value: {
            _status: 'ERR',
            _error: {
              code: 422,
              message: 'some error message',
            },
          },
        },
      }
      useFetch.mockResolvedValue(response)

      const result = await lighthouseServiceBiosero.failDestinationPlateBiosero(form)
      const expected = {
        success: false,
        error: { message: 'some error message' },
      }

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    })

    it('on failure with standard exception', async () => {
      const errorResponse = new Error('some error message')

      useFetch.mockRejectedValue(errorResponse)

      const result = await lighthouseServiceBiosero.failDestinationPlateBiosero(form)
      const expected = {
        success: false,
        error: { message: 'some error message' },
      }

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result.success).toBe(false)

      expect(result).toEqual(expected)
    })

    it('on failure with exception from cherrytrack', async () => {
      const errorResponse = {
        response: {
          data: {
            value: {
              _status: 'ERR',
              _error: {
                code: 422,
                message: 'some primary error message',
              },
              _issues: {
                wells: ['some secondary error message'],
              },
            },
          },
        },
      }

      useFetch.mockRejectedValue(errorResponse)

      const result = await lighthouseServiceBiosero.failDestinationPlateBiosero(form)

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result.success).toBe(false)
      const expected = {
        success: false,
        error: { message: 'some primary error message some secondary error message' },
      }
      expect(result).toEqual(expected)
    })
  })

  describe('#getBioseroPlate', () => {
    let destinationPlateBarcode, sourcePlateBarcode

    beforeEach(() => {
      destinationPlateBarcode = 'DN1'
      sourcePlateBarcode = '12345'
    })

    afterEach(() => {
      useFetch.mockRestore()
    })

    it('successfully gets source plates', async () => {
      const mockResponse = { data: { value: { plate: { data: sourcePlate } } } }
      useFetch.mockResolvedValue(mockResponse)

      const result = await lighthouseServiceBiosero.getBioseroPlate(sourcePlateBarcode, 'source')

      expect(result.success).toBeTruthy()
      expect(result.source).toBeTruthy()
      expect(result.barcode).toEqual(sourcePlate.barcode)
      expect(result.samples).toEqual(sourcePlate.samples)
    })

    it('successfully gets destination plates', async () => {
      const mockResponse = { data: { value: { plate: { data: destinationPlate } } } }
      useFetch.mockResolvedValue(mockResponse)

      const result = await lighthouseServiceBiosero.getBioseroPlate(
        destinationPlateBarcode,
        'destination'
      )

      expect(result.success).toBeTruthy()
      expect(result.destination).toBeTruthy()
      expect(result.barcode).toEqual(destinationPlate.barcode)
      expect(result.samples).toEqual(destinationPlate.samples)
    })

    it('when there is an error', async () => {
      useFetch.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))

      const result = await lighthouseServiceBiosero.getBioseroPlate(
        destinationPlateBarcode,
        'destination'
      )

      expect(result.success).toBeFalsy()
      expect(result.barcode).toBeUndefined()
      expect(result.samples).toBeUndefined()
    })
  })
})
