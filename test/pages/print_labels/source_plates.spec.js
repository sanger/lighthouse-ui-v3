import fs from 'fs'
import { mount } from '@vue/test-utils'
import SourcePlates from '@/pages/print_labels/source_plates'
import barcodes from '@/test/data/barcodes'

const config = useRuntimeConfig()

vi.mock('@/utils/csv')

describe('print destination plate labels', () => {
  let wrapper, printers

  beforeEach(() => {
    printers = config.printers.split(',')
    wrapper = mount(SourcePlates)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(SourcePlates).exists()).toBeTruthy()
  })

  it('should have some printers', () => {
    expect(wrapper.vm.printers).toBeDefined()
    expect(wrapper.vm.printers).toEqual(printers)
  })

  it('should be able to select a printer', () => {
    expect(wrapper.find('#selectPrinter').findAll('option')).toHaveLength(printers.length)
  })

  // Note: Not worthwhile testing the file picking actions since they
  // trigger browser operations outside our control.

  describe('printing labels', () => {
    let mock

    describe('when the filename has not been entered', () => {
      beforeEach(() => {
        wrapper = mount(SourcePlates, {
          data() {
            return {
              printer: 'heron-bc1',
              filename: null,
            }
          },
        })
      })

      it('should show an error message', async () => {
        await wrapper.vm.printLabels()
        expect(wrapper.find('.alert').text()).toMatch('Please upload a file')
      })
    })

    describe('when the filename has been entered', () => {
      let readFile, file

      afterEach(() => {
        vi.resetAllMocks()
      })

      beforeEach(() => {
        wrapper = mount(SourcePlates, {
          data() {
            return {
              printer: 'heron-bc1',
              filename: 'barcodes.csv',
            }
          },
        })
        mock = vi.spyOn(sprintGeneralLabels, 'printLabels')
        readFile = fs.readFileSync('./test/data/barcodes.csv', 'ascii')
        file = new File([readFile], 'barcodes.csv', { type: 'text/csv' })
        csv.parse.mockResolvedValue(barcodes)
        wrapper.vm.getFile = vi.fn()
        wrapper.vm.getFile.mockReturnValue(file)
      })

      it('successfully', async () => {
        mock.mockResolvedValue({
          success: true,
          message: 'successfully printed 5 labels to heron-bc3',
        })
        await wrapper.vm.printLabels()
        expect(wrapper.find('.alert').text()).toMatch('successfully printed 5 labels to heron-bc3')
      })

      it('unsuccessfully', async () => {
        mock.mockReturnValue({
          success: false,
          error: 'There was an error',
        })
        await wrapper.vm.printLabels()
        expect(wrapper.find('.alert').text()).toMatch('There was an error')
      })
    })
  })
})
