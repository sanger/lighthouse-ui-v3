import fs from 'fs'
import barcodes from '@/test/data/barcodes'
import { mockError } from '@/test/constants'

describe('csv', () => {
  let validFile

  beforeEach(() => {
    const readFile = fs.readFileSync('./test/data/barcodes.csv', 'ascii')
    validFile = new File([readFile], 'barcodes.csv', { type: 'text/csv' })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('#read', () => {
    it('successfully reads a valid file', async () => {
      const result = await csv.read(validFile)

      expect(result).toBeDefined()
      expect(result.success).toBeTruthy()
      expect(result.data).toBeDefined()
      expect(result.error).not.toBeDefined()
    })

    it('fails gracefully when the file cannot be read', async () => {
      vi.spyOn(FileReader.prototype, 'readAsText').mockImplementationOnce(() => {
        throw mockError
      })

      const result = await csv.read(validFile)

      expect(result).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.data).not.toBeDefined()
      expect(result.error).toBe(mockError)
    })
  })

  describe('#parse', () => {
    it('parses a valid CSV file correctly', async () => {
      const { data } = await csv.read(validFile)
      const parsed = csv.parse(data)

      expect(parsed).toBeDefined()
      expect(parsed.success).toBeTruthy()
      expect(parsed.data).toEqual(barcodes)
      expect(parsed.error).not.toBeDefined()
    })

    it.each([
      {
        description: 'an empty CSV file',
        filename: './test/data/bad_csv_no_header.csv',
        errorMessage: 'Header in column 1 is un-named.',
      },
      {
        description: 'empty header name',
        filename: './test/data/bad_csv_empty_header.csv',
        errorMessage: 'Header in column 2 is un-named.',
      },
      {
        description: 'duplicated header names',
        filename: './test/data/bad_csv_duplicate_headers.csv',
        errorMessage: 'More than one column has the header "text".',
      },
      {
        description: 'a short line',
        filename: './test/data/bad_csv_line_3_too_short.csv',
        errorMessage: 'Line 3 has the wrong number of fields: 1 when there should be 2.',
      },
      {
        description: 'a long line',
        filename: './test/data/bad_csv_line_4_too_long.csv',
        errorMessage: 'Line 4 has the wrong number of fields: 3 when there should be 2.',
      },
      {
        description: 'blank rows',
        filename: './test/data/bad_csv_blank_rows.csv',
        errorMessage: 'Line 5 contains no data.',
      },
    ])('generates correct error for a CSV file with $description', async (inputs) => {
      const file = fs.readFileSync(inputs.filename, 'ascii')
      const invalidFile = new File([file], 'barcodes.csv', { type: 'text/csv' })
      const { data } = await csv.read(invalidFile)

      const parsed = csv.parse(data)

      expect(parsed).toBeDefined()
      expect(parsed.success).toBeFalsy()
      expect(parsed.data).not.toBeDefined()
      expect(parsed.error).toBeDefined()
      expect(parsed.error.message).toBe(inputs.errorMessage)
    })
  })
})
