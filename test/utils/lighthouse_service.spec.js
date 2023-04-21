import ReportsJson from '../data/reports'
import RobotsJson from '../data/robots'
import FailureTypesJson from '../data/failures_types.json'

const config = useRuntimeConfig()

describe('lighthouse_service api', () => {
  afterEach(() => {
    useFetch.mockClear()
  })

  describe('#createPlatesFromBarcodes', () => {
    it('for a single barcode on failure', async () => {
      const barcodes = ['aBarcode1']

      const response = {
        errors: ['foreign barcode is already in use.'],
      }

      useFetch.mockResolvedValue(response)

      const result = await lighthouseService.createPlatesFromBarcodes({
        barcodes,
      })

      expect(result).toEqual([response])
      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(useFetch).toHaveBeenNthCalledWith(
        1,
        `${config.public.lighthouseBaseURL}/plates/new`,
        {
          method: 'POST',
          body: { barcode: barcodes[0] },
        },
        expect.any(String)
      )
    })

    it('for a single barcode on success', async () => {
      const barcodes = ['aBarcode1']

      const response = {
        data: {
          value: {
            plate_barcode: 'aBarcode1',
            centre: 'tst1',
            count_fit_to_pick_samples: 3,
          },
        },
      }

      useFetch.mockResolvedValue(response)

      const result = await lighthouseService.createPlatesFromBarcodes({
        barcodes,
      })

      expect(result).toEqual([response])
      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(useFetch).toHaveBeenNthCalledWith(
        1,
        `${config.public.lighthouseBaseURL}/plates/new`,
        {
          method: 'POST',
          body: { barcode: barcodes[0] },
        },
        expect.any(String)
      )
    })

    it('#for multiple barcodes on failure', async () => {
      const barcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        errors: ['foreign barcode is already in use.'],
      }

      const response2 = {
        errors: ['No samples for this barcode'],
      }

      useFetch.mockImplementationOnce(() => response1)
      useFetch.mockImplementationOnce(() => response2)

      const result = await lighthouseService.createPlatesFromBarcodes({
        barcodes,
      })

      expect(result).toEqual([response1, response2])
      expect(useFetch).toHaveBeenCalledTimes(2)
      expect(useFetch).toHaveBeenNthCalledWith(
        1,
        `${config.public.lighthouseBaseURL}/plates/new`,
        {
          method: 'POST',
          body: { barcode: barcodes[0] },
        },
        expect.any(String)
      )
      expect(useFetch).toHaveBeenNthCalledWith(
        2,
        `${config.public.lighthouseBaseURL}/plates/new`,
        {
          method: 'POST',
          body: { barcode: barcodes[1] },
        },
        expect.any(String)
      )
    })

    it('#for multiple barcodes on success', async () => {
      const barcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        data: {
          value: {
            plate_barcode: 'aBarcode1',
            centre: 'tst1',
            count_fit_to_pick_samples: 3,
          },
        },
      }

      const response2 = {
        data: {
          value: {
            plate_barcode: 'aBarcode2',
            centre: 'tst1',
            count_fit_to_pick_samples: 2,
          },
        },
      }

      useFetch.mockImplementationOnce(() => response1)
      useFetch.mockImplementationOnce(() => response2)

      const result = await lighthouseService.createPlatesFromBarcodes({
        barcodes,
      })

      expect(result).toEqual([response1, response2])
      expect(useFetch).toHaveBeenCalledTimes(2)
      expect(useFetch).toHaveBeenNthCalledWith(
        1,
        `${config.public.lighthouseBaseURL}/plates/new`,
        {
          method: 'POST',
          body: { barcode: barcodes[0] },
        },
        expect.any(String)
      )
      expect(useFetch).toHaveBeenNthCalledWith(
        2,
        `${config.public.lighthouseBaseURL}/plates/new`,
        {
          method: 'POST',
          body: { barcode: barcodes[1] },
        },
        expect.any(String)
      )
    })

    it('#for multiple barcodes on partial success/ failure', async () => {
      const barcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        errors: ['No samples for this barcode'],
      }

      const response2 = {
        data: {
          plate_barcode: 'aBarcode2',
          centre: 'tst1',
          count_fit_to_pick_samples: 2,
        },
      }

      useFetch.mockImplementationOnce(() => response1)
      useFetch.mockImplementationOnce(() => response2)

      const result = await lighthouseService.createPlatesFromBarcodes({
        barcodes,
      })

      expect(result).toEqual([response1, response2])
      expect(useFetch).toHaveBeenCalledTimes(2)
      expect(useFetch).toHaveBeenNthCalledWith(
        1,
        `${config.public.lighthouseBaseURL}/plates/new`,
        {
          method: 'POST',
          body: { barcode: barcodes[0] },
        },
        expect.any(String)
      )
      expect(useFetch).toHaveBeenNthCalledWith(
        2,
        `${config.public.lighthouseBaseURL}/plates/new`,
        {
          method: 'POST',
          body: { barcode: barcodes[1] },
        },
        expect.any(String)
      )
    })
  })

  describe('#findPlatesFromBarcodes', () => {
    it('for a single barcode on success', async () => {
      const barcodes = ['aBarcode1']
      const plates = [
        {
          plate_barcode: 'aBarcode1',
          centre: 'tst1',
          count_fit_to_pick_samples: 3,
        },
      ]

      const response = { data: { value: { plates } } }

      useFetch.mockResolvedValue(response)

      const result = await lighthouseService.findPlatesFromBarcodes({
        barcodes,
      })
      const expected = { success: true, plates }

      expect(result).toEqual(expected)
      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(useFetch).toHaveBeenNthCalledWith(
        1,
        `${config.public.lighthouseBaseURL}/plates`,
        {
          params: {
            barcodes: barcodes[0],
            _exclude: 'pickable_samples',
          },
        },
        expect.any(String)
      )
    })

    it('#for multiple barcodes on success', async () => {
      const barcodes = ['aBarcode1', 'aBarcode2']
      const plates = [
        {
          plate_barcode: 'aBarcode1',
          centre: 'tst1',
          count_fit_to_pick_samples: 3,
        },
        {
          plate_barcode: 'aBarcode2',
          centre: 'tst1',
          count_fit_to_pick_samples: 2,
        },
      ]
      const response = { data: { value: { plates } } }

      useFetch.mockImplementationOnce(() => response)

      const result = await lighthouseService.findPlatesFromBarcodes({
        barcodes,
      })
      const expected = { success: true, plates }

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(useFetch).toHaveBeenNthCalledWith(
        1,
        `${config.public.lighthouseBaseURL}/plates`,
        {
          params: {
            barcodes: barcodes[0] + ',' + barcodes[1],
            _exclude: 'pickable_samples',
          },
        },
        expect.any(String)
      )
      expect(result).toEqual(expected)
    })
  })

  describe('#getImports', () => {
    it('submits the correct lighthouse query string to fetch', async () => {
      await lighthouseService.getImports()

      expect(useFetch.mock.calls).toHaveLength(1)
      expect(useFetch).toHaveBeenNthCalledWith(
        1,
        `${config.public.lighthouseBaseURL}/imports`,
        {
          params: {
            max_results: '10000',
            sort: '-date',
            where: expect.stringMatching(
              /\{"date": \{"\$gt": "\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}"\}\}/
            ),
          },
        },
        expect.any(String)
      )
    })

    it('returns data successfully', async () => {
      const expected = { data: { value: { items: [] } } }
      useFetch.mockResolvedValue(expected)
      const response = await lighthouseService.getImports()
      expect(response.data).toEqual(expected.data.value)
    })

    it('when there is an error', async () => {
      useFetch.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))
      const response = await lighthouseService.getImports()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })

  describe('#deleteReports', () => {
    let filenames

    beforeEach(() => {
      filenames = [
        '200716_1345_positives_with_locations.xlsx',
        '200716_1618_positives_with_locations.xlsx',
        '200716_1640_positives_with_locations.xlsx',
        '200716_1641_positives_with_locations.xlsx',
        '200716_1642_positives_with_locations.xlsx',
      ]
    })

    it('when it is successful', async () => {
      useFetch.mockResolvedValue({ data: { value: {} } })

      const response = await lighthouseService.deleteReports(filenames)

      expect(useFetch).toHaveBeenCalledWith(
        expect.stringMatching('^' + config.public.lighthouseBaseURL),
        {
          body: {
            data: {
              filenames: filenames,
            },
          },
          method: 'POST',
        },
        expect.any(String)
      )
      expect(response.success).toBeTruthy()
    })

    it('when there is an error', async () => {
      useFetch.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))

      const response = await lighthouseService.deleteReports()

      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })

  describe('#getReports', () => {
    it('when the request is successful', async () => {
      useFetch.mockResolvedValue({ data: { value: ReportsJson } })

      const response = await lighthouseService.getReports()

      expect(useFetch).toHaveBeenCalledWith(
        expect.stringMatching('^' + config.public.lighthouseBaseURL),
        expect.any(String)
      )
      expect(response.success).toBeTruthy()
      expect(response.reports).toEqual(ReportsJson.reports)
    })

    it('when the request fails', async () => {
      useFetch.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))

      const response = await lighthouseService.getReports()
      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })

  describe('#createReport', () => {
    it('when the request is successful', async () => {
      useFetch.mockResolvedValue({
        data: { value: { reports: [ReportsJson.reports[0]] } },
      })

      const response = await lighthouseService.createReport()

      expect(useFetch).toHaveBeenCalledWith(
        expect.stringMatching('^' + config.public.lighthouseBaseURL),
        { method: 'POST' },
        expect.any(String)
      )
      expect(response.success).toBeTruthy()
      expect(response.reports).toEqual([ReportsJson.reports[0]])
    })

    it('when the request fails', async () => {
      useFetch.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))

      const response = await lighthouseService.createReport()

      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })

  describe('#getRobots', () => {
    it('on success', async () => {
      const response = { data: { value: { errors: [], robots: RobotsJson.robots } } }

      useFetch.mockResolvedValue(response)

      const result = await lighthouseService.getRobots()
      const expected = { success: true, robots: RobotsJson.robots }

      expect(result).toEqual(expected)
    })

    it('on failure', async () => {
      const response = {
        response: { data: { value: { errors: ['There was an error'], robots: [] } } },
      }

      useFetch.mockRejectedValue(response)

      const result = await lighthouseService.getRobots()
      const expected = {
        success: false,
        errors: ['There was an error'],
      }

      expect(result).toEqual(expected)
    })

    it('on unknown failure', async () => {
      const response = { message: 'Network Error' }

      useFetch.mockRejectedValue(response)

      const result = await lighthouseService.getRobots()
      const expected = {
        success: false,
        errors: ['Network Error: Failed to get Robots from Lighthouse Service'],
      }

      expect(result).toEqual(expected)
    })
  })

  describe('#getFailureTypes', () => {
    it('when the request is successful', async () => {
      const response = {
        data: { value: { failure_types: FailureTypesJson.failure_types, errors: [] } },
      }

      useFetch.mockResolvedValue(response)

      const result = await lighthouseService.getFailureTypes()
      const expected = {
        success: true,
        failureTypes: FailureTypesJson.failure_types,
      }

      expect(result).toEqual(expected)
    })

    it('on failure', async () => {
      const response = {
        response: {
          data: { value: { errors: ['There was an error'], failure_types: [] } },
        },
      }

      useFetch.mockRejectedValue(response)

      const result = await lighthouseService.getFailureTypes()
      const expected = {
        success: false,
        errors: ['There was an error'],
      }

      expect(result).toEqual(expected)
    })

    it('on unknown failure', async () => {
      const response = { message: 'Network Error' }

      useFetch.mockRejectedValue(response)

      const result = await lighthouseService.getFailureTypes()
      const expected = {
        success: false,
        errors: ['Network Error: Failed to get Failure Types from Lighthouse Service'],
      }

      expect(result).toEqual(expected)
    })
  })

  describe('#createDestinationPlateBeckman', () => {
    let username, barcode, robotSerialNumber, form

    beforeEach(() => {
      username = 'username'
      barcode = 'aBarcode'
      robotSerialNumber = 'robot_123'
      form = {
        username,
        barcode,
        robotSerialNumber,
      }
    })

    it('on success', async () => {
      const response = {
        data: {
          value: {
            data: {
              plate_barcode: 'barcode',
              centre: 'centre_prefix',
              count_fit_to_pick_samples: 'len(samples)',
            },
          },
        },
      }

      useFetch.mockResolvedValue(response)

      const responseData = response.data.value.data
      const result = await lighthouseService.createDestinationPlateBeckman(form)
      const expected = {
        success: true,
        response: `Successfully created destination plate, with barcode: ${responseData.plate_barcode}, and ${responseData.count_fit_to_pick_samples} fit to pick sample(s)`,
      }
      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
      expect(useFetch).toHaveBeenCalledWith(
        `${config.public.lighthouseBaseURL}/cherrypicked-plates/create?barcode=${barcode}&robot=${robotSerialNumber}&user_id=${username}`,
        expect.any(String)
      )
    })

    it('on failure', async () => {
      const response = {
        response: { data: { value: { errors: ['There was an error'] } } },
      }
      useFetch.mockRejectedValue(response)

      const result = await lighthouseService.createDestinationPlateBeckman(form)

      const expected = { success: false, errors: ['There was an error'] }

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    })
  })

  describe('#failDestinationPlateBeckman', () => {
    let username, barcode, robotSerialNumber, form, failureType

    beforeEach(() => {
      username = 'username'
      barcode = 'aBarcode'
      robotSerialNumber = 'robot_123'
      failureType = 'aType'
      form = {
        username,
        barcode,
        robotSerialNumber,
        failureType,
      }
    })

    it('on success', async () => {
      const response = { data: { value: { errors: [] } } }

      useFetch.mockResolvedValue(response)

      const result = await lighthouseService.failDestinationPlateBeckman(form)
      const expected = {
        success: true,
        response: `Successfully failed destination plate with barcode: ${barcode}`,
      }

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
      expect(useFetch).toHaveBeenCalledWith(
        `${config.public.lighthouseBaseURL}/cherrypicked-plates/fail?barcode=${barcode}&robot=${robotSerialNumber}&user_id=${username}&failure_type=${failureType}`,
        expect.any(String)
      )
    })

    it('on partial success', async () => {
      const response = { data: { value: { errors: ['some partial error message'] } } }

      useFetch.mockResolvedValue(response)

      const result = await lighthouseService.failDestinationPlateBeckman(form)
      const expected = { success: true, errors: ['some partial error message'] }

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    })

    it('on failure', async () => {
      const response = { response: { data: { value: { errors: ['There was an error'] } } } }

      useFetch.mockRejectedValue(response)

      const result = await lighthouseService.failDestinationPlateBeckman(form)

      const expected = { success: false, errors: ['There was an error'] }

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    })
  })

  describe('#generateTestRun', () => {
    let runId, plateSpecs

    beforeEach(() => {
      runId = 'aRunId'
      plateSpecs = [
        { numberOfPlates: 1, numberOfPositives: 2 },
        { numberOfPlates: 3, numberOfPositives: 4 },
      ]
    })

    it('when the request is successful', async () => {
      const response = { _id: runId, _status: 'OK' }

      useFetch.mockResolvedValue({ data: { value: response } })

      const result = await lighthouseService.generateTestRun(plateSpecs)

      const headers = { Authorization: config.public.lighthouseApiKey }

      const expectedPath = /\/cherrypick-test-data$/
      const expectedBody = {
        plate_specs: [
          [1, 2],
          [3, 4],
        ],
      }

      expect(useFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedPath),
        {
          body: expectedBody,
          headers,
          method: 'POST',
        },
        expect.any(String)
      )
      expect(result.success).toBeTruthy()
      expect(result.runId).toEqual(runId)
    })

    it('when the request errors', async () => {
      const response = {
        _status: 'ERR',
        _issues: { plate_specs: 'must be of list type', another: 'error message' },
        _error: { code: 422, message: 'Insertion failure: 1 document(s) contain(s) error(s)' },
      }
      const error = { response: { data: { value: response } } }

      useFetch.mockRejectedValue(error)

      const result = await lighthouseService.generateTestRun(plateSpecs)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe(
        'Insertion failure: 1 document(s) contain(s) error(s): plate_specs: must be of list type; another: error message; '
      )
    })

    it('when the request fails', async () => {
      const error = {}
      useFetch.mockRejectedValue(error)

      const result = await lighthouseService.generateTestRun(plateSpecs)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('An unexpected error has occurred')
    })

    it('when the request errors, from crawler, with no _issues', async () => {
      const response = { _status: 'ERR', _error: { code: 422, message: 'Insertion failure' } }
      const error = { response: { data: { value: response } } }

      useFetch.mockRejectedValue(error)
      const result = await lighthouseService.generateTestRun(plateSpecs)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('Insertion failure')
    })
  })

  describe('#getTestRuns', () => {
    let currentPage, maxResults

    beforeEach(() => {
      currentPage = 1
      maxResults = 5
    })

    it('when the request is successful', async () => {
      const response = {
        _items: [
          {
            _id: '1',
            plate_specs: [
              [1, 0],
              [1, 0],
              [1, 1],
            ],
            barcodes:
              '[["TEST-111", "number of positives: 0"], ["TEST-222", "number of positives: 0"], ["TEST-333", "number of positives: 2"]]',
          },
          {
            _id: '2',
            plate_specs: [
              [1, 0],
              [1, 2],
            ],
            barcodes:
              '[["TEST-444", "number of positives: 0"], ["TEST-555", "number of positives: 2"]]',
          },
          { _id: '3', plate_specs: [] },
        ],
        _meta: { total: 32 },
      }

      useFetch.mockResolvedValue({ data: { value: response } })

      const result = await lighthouseService.getTestRuns(currentPage, maxResults)
      const headers = { Authorization: config.public.lighthouseApiKey }

      expect(useFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/cherrypick-test-data$/),
        {
          headers,
          params: {
            max_results: 5,
            page: 1,
            sort: '_created',
          },
        },
        expect.any(String)
      )
      expect(result.success).toBeTruthy()
      expect(result.response).toEqual(response._items)
      expect(result.response[0].total_plates).toBe(3)
      expect(result.response[1].total_plates).toBe(2)
      expect(result.response[2].total_plates).toBe(0)
      expect(result.total).toEqual(response._meta.total)
    })

    it('when the request errors', async () => {
      const response = {
        _status: 'ERR',
        _error: { code: 405, message: 'The method is not allowed for the requested URL.' },
      }
      const error = {
        response: {
          data: { value: response },
        },
      }

      useFetch.mockRejectedValue(error)

      const result = await lighthouseService.getTestRuns(currentPage, maxResults)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('The method is not allowed for the requested URL.')
    })

    it('when the request fails', async () => {
      const error = {}

      useFetch.mockRejectedValue(error)

      const result = await lighthouseService.getTestRuns(currentPage, maxResults)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('An unexpected error has occurred')
    })
  })

  describe('#getTestRun', () => {
    let id

    beforeEach(() => {
      id = 123
    })

    it('when the request is successful', async () => {
      const response = { _id: '123', barcodes: '[["TEST-112426", "number of positives: 0"]]' }

      useFetch.mockResolvedValue({
        data: { value: response },
      })

      const result = await lighthouseService.getTestRun(id)

      const headers = { Authorization: config.public.lighthouseApiKey }

      const expectedPath = /cherrypick-test-data\/123/

      expect(useFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedPath),
        { headers },
        expect.any(String)
      )

      expect(result.success).toBeTruthy()
      expect(result.response).toEqual(response)
    })

    it('when the request errors', async () => {
      const response = {
        _status: 'ERR',
        _error: { code: 405, message: 'The method is not allowed for the requested URL.' },
      }
      const error = {
        response: {
          data: { value: response },
        },
      }

      useFetch.mockRejectedValue(error)

      const result = await lighthouseService.getTestRun(id)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('The method is not allowed for the requested URL.')
    })

    it('when the request fails', async () => {
      const error = {}

      useFetch.mockRejectedValue(error)

      const result = await lighthouseService.getTestRun(id)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('An unexpected error has occurred')
    })
  })

  describe('#formatPlateSpecs', () => {
    it('returns the correct format', () => {
      const result = lighthouseService.formatPlateSpecs([
        { numberOfPlates: 1, numberOfPositives: 2 },
        { numberOfPlates: 3, numberOfPositives: 4 },
      ])
      expect(result).toEqual([
        [1, 2],
        [3, 4],
      ])
    })
  })
})
