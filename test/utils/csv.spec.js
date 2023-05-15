import fs from 'fs'
import barcodes from '@/test/data/barcodes'
import { mockError } from '@/test/constants'

describe('csv', () => {
  let file

  beforeEach(() => {
    const readFile = fs.readFileSync('./test/data/barcodes.csv', 'ascii')
    file = new File([readFile], 'barcodes.csv', { type: 'text/csv' })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('#read', () => {
    it('successfully reads a valid file', async () => {
      const result = await csv.read(file)

      expect(result).toBeDefined()
      expect(result.success).toBeTruthy()
      expect(result.data).toBeDefined()
      expect(result.error).not.toBeDefined()
    })

    it('fails gracefully when the file cannot be read', async () => {
      vi.spyOn(FileReader.prototype, 'readAsText').mockImplementationOnce(() => {
        throw mockError
      })

      const result = await csv.read(file)

      expect(result).toBeDefined()
      expect(result.success).toBeFalsy()
      expect(result.data).not.toBeDefined()
      expect(result.error).toBe(mockError)
    })
  })

  describe('#parse', () => {
    it('parses a valid CSV file correctly', async () => {
      const { data } = await csv.read(file)
      const json = csv.parse(data)

      expect(json).toEqual(barcodes)
    })
  })
})
