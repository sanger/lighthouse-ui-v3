import fs from 'fs'
import { mount } from '@vue/test-utils'
import SourcePlates from '@/pages/print_labels/source_plates'
import barcodes from '@/test/data/barcodes'
import { mockError } from '@/test/constants'

const config = useRuntimeConfig()

vi.mock('@/utils/csv')

describe('print destination plate labels', () => {
  let wrapper, printers

  beforeEach(() => {
    printers = config.public.printers.split(',')
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
      let readFile, file, sprintMock

      beforeEach(() => {
        wrapper = mount(SourcePlates, {
          data() {
            return {
              printer: 'heron-bc1',
              filename: 'barcodes.csv',
            }
          },
        })
        sprintMock = vi.spyOn(sprintGeneralLabels, 'printLabels')
        readFile = fs.readFileSync('./test/data/barcodes.csv', 'ascii')
        file = new File([readFile], 'barcodes.csv', { type: 'text/csv' })
        wrapper.vm.getFile = vi.fn()
        wrapper.vm.getFile.mockReturnValue(file)
      })

      describe('the file can be read', () => {
        beforeEach(() => {
          csv.read.mockResolvedValue({ success: true, data: '' })
        })

        describe('csv parsing succeeds', () => {
          beforeEach(() => {
            csv.parse.mockReturnValue({ success: true, data: barcodes })
          })

          it('successfully prints the labels', async () => {
            sprintMock.mockResolvedValue({
              success: true,
              message: 'successfully printed 5 labels to heron-bc3',
            })
            await wrapper.vm.printLabels()
            expect(wrapper.find('.alert').text()).toMatch(
              'successfully printed 5 labels to heron-bc3'
            )
          })

          it('fails to print the labels', async () => {
            sprintMock.mockReturnValue({
              success: false,
              error: 'There was an error',
            })
            await wrapper.vm.printLabels()
            expect(wrapper.find('.alert').text()).toMatch('There was an error')
          })
        })

        describe('csv parsing fails', () => {
          beforeEach(() => {
            csv.parse.mockReturnValue({
              success: false,
              error: mockError,
            })
          })

          it('reports the error as an alert', async () => {
            await wrapper.vm.printLabels()
            expect(wrapper.find('.alert').text()).toMatch(mockError.message)
          })
        })
      })

      describe('the file fails to be read', () => {
        beforeEach(() => {
          csv.read.mockResolvedValue({ success: false, error: mockError })
        })

        it('fails to print the labels', async () => {
          await wrapper.vm.printLabels()

          expect(wrapper.find('.alert').text()).toMatch(mockError.message)
        })
      })
    })
  })
})
