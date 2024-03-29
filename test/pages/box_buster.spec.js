import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import BoxBuster from '@/pages/box_buster.vue'
import { plateA, plateB, plateC, plateD, plateE, plateF } from '@/test/data/lighthouse_plates'
import { mockError } from '@/test/constants'

vi.mock('@/utils/labwhere')
vi.mock('@/utils/lighthouse_service')

// When rendering HTML browsers compress whitespace
// When writing tests, we are more concerned with what the users sees, and don't really care about
// additional whitespace introduced due to the layout of our templates. This compresses all
// whitespace down.
const squish = (text) => text.replace(/\s+/g, ' ')

describe('BoxBuster', () => {
  let wrapper
  const MSG_NO_RECORDS = 'There are no records to show'

  const examplePlates = [plateA, plateB, plateC, plateD, plateE, plateF]
  const BARCODES_PLATES = examplePlates.map((plate) => plate.plate_barcode)
  const BARCODE_BOX = '12345'

  beforeEach(() => {
    wrapper = mount(BoxBuster, {
      data() {
        return {
          barcode: BARCODE_BOX,
        }
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('is a Vue instance', () => {
    wrapper = mount(BoxBuster)
    expect(wrapper.findComponent(BoxBuster).exists()).toBeTruthy()
  })

  it('shows a table with the expected headers', () => {
    const header = wrapper.find('table').findAll('th')
    expect(header.at(0).text()).toContain('Plate barcode')
    expect(header.at(1).text()).toContain('Plate map')
    expect(header.at(2).text()).toContain('Fit to pick samples')
    expect(header.at(3).text()).toContain('Must sequence')
    expect(header.at(4).text()).toContain('Preferentially sequence')
    expect(header.at(5).text()).toContain('Filtered positive')
  })

  it('is empty on start', () => {
    expect(wrapper.find('tbody').findAll('tr')).toHaveLength(1)
    expect(wrapper.find('tbody').text()).toContain(MSG_NO_RECORDS)
  })

  it('sorts the list of plates by count_must_sequence', async () => {
    const sortedExamplePlates = wrapper.vm.sortedPlates(examplePlates)
    const data = { plates: sortedExamplePlates }
    await wrapper.setData(data)
    const rows = wrapper.find('table').findAll('tr')
    expect(rows.at(1).text()).toMatch(/AP-rna-2-0-10-8/)
    expect(rows.at(2).text()).toMatch(/AP-rna-1-1-5-5/)
    expect(rows.at(3).text()).toMatch(/AP-rna-0-2-8-6/)
    expect(rows.at(4).text()).toMatch(/AP-rna-0-1-2-1/)
    expect(rows.at(5).text()).toMatch(/AP-rna-0-0-0-0/)
    expect(rows.at(6).text()).toMatch(/AP-rna-no_map/)
  })

  it('renders a summary of plates', async () => {
    await wrapper.setData({ plates: examplePlates })

    const caption = squish(wrapper.find('caption').text())

    expect(caption).toContain('Box summary:')
    expect(caption).toContain('Total of 6 plates in the box')
    expect(caption).toContain('5 plates with maps')
    expect(caption).toContain('1 plate without a map')
  })

  it('renders a summary of samples', async () => {
    await wrapper.setData({ plates: examplePlates })

    const caption = squish(wrapper.find('caption').text())

    expect(caption).toContain('Sample summary:')
    expect(caption).toContain('Total of 25 fit to pick samples')
    expect(caption).toContain('2 plates with samples that must be sequenced')
    expect(caption).toContain('3 plates with samples that should preferentially be sequenced')
  })

  it('renders the box barcodes scanned', async () => {
    await wrapper.setData({ barcode: '' })

    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
      success: false,
      error: 'The box has no plates',
    })

    lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: [],
    })

    const barcodeField = wrapper.find('#box-barcode-field')
    barcodeField.setValue(BARCODE_BOX)
    await barcodeField.trigger('keydown.enter')
    await flushPromises()

    const caption = squish(wrapper.find('caption').text())

    expect(caption).toContain('Box barcodes scanned:')
    expect(caption).toContain(BARCODE_BOX)
  })

  it('makes it easy to see when plates have a plate map', async () => {
    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({ success: false })
    lighthouseService.findPlatesFromBarcodes.mockResolvedValue({ success: true, plates: [plateA] })
    await wrapper.vm.refreshResults()

    const row = wrapper.find('table').findAll('tr').at(1)

    expect(row.text()).toContain(plateA.plate_barcode)
    expect(row.text()).toContain('Yes')
    expect(row.classes()).toContain('table-success')
  })

  it('makes it easy to see when plates have plate map data but no fit to pick samples', async () => {
    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({ success: false })
    lighthouseService.findPlatesFromBarcodes.mockResolvedValue({ success: true, plates: [plateE] })
    await wrapper.vm.refreshResults()

    const row = wrapper.find('table').findAll('tr').at(1)

    expect(row.text()).toContain(plateE.plate_barcode)
    expect(row.findAll('td').at(1).text()).toContain('Yes')
    expect(row.findAll('td').at(2).text()).toContain('0')
    expect(row.findAll('td').at(3).text()).toContain('No')
    expect(row.findAll('td').at(4).text()).toContain('No')
    expect(row.classes()).toContain('table-warning')
  })

  it('makes it easy to see when plates do not have a plate map nor fit to pick samples', async () => {
    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({ success: false })
    lighthouseService.findPlatesFromBarcodes.mockResolvedValue({ success: true, plates: [plateC] })
    await wrapper.vm.refreshResults()

    const row = wrapper.find('table').findAll('tr').at(1)

    expect(row.text()).toContain(plateC.plate_barcode)
    expect(row.findAll('td').at(1).text()).toContain('No')
    expect(row.findAll('td').at(2).text()).toContain('N/A')
    expect(row.findAll('td').at(3).text()).toContain('No')
    expect(row.findAll('td').at(4).text()).toContain('No')
    expect(row.classes()).toContain('table-danger')
  })

  it('lets the user know if the box is empty', async () => {
    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
      success: false,
      error: 'The box has no plates',
    })

    lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: [],
    })

    await wrapper.vm.provider()
    await flushPromises()

    expect(wrapper.text()).toContain('The box has no plates')
  })

  it('lets the user know if there are labwhere errors', async () => {
    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
      success: false,
      error: mockError,
    })

    lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: [],
    })

    await wrapper.vm.provider()
    await flushPromises()

    expect(wrapper.find('#box-barcode').text()).toContain(mockError.message)
  })

  describe('#platesProvider', () => {
    it('will not look up empty barcodes', async () => {
      const barcodeField = wrapper.find('#box-barcode-field')
      barcodeField.setValue('')

      await barcodeField.trigger('keydown.enter')
      await flushPromises()

      expect(labwhere.getPlatesFromBoxBarcodes).not.toHaveBeenCalled()
    })

    it('looks up barcodes in labwhere', async () => {
      labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
        success: true,
        barcodes: [],
      })
      lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
        success: true,
        plates: [],
      })
      await wrapper.vm.provider()

      await flushPromises()
      expect(wrapper.find('#box-barcode').text()).toContain('Box found')
      expect(labwhere.getPlatesFromBoxBarcodes).toHaveBeenCalledWith(BARCODE_BOX)
    })

    it('looks up plates in lighthouse', async () => {
      labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
        success: true,
        barcodes: [plateA.plate_barcode],
      })
      lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
        success: true,
        plates: [],
      })
      await wrapper.vm.provider()
      await flushPromises()
      expect(lighthouseService.findPlatesFromBarcodes).toHaveBeenCalledWith({
        success: true,
        barcodes: [plateA.plate_barcode],
      })
    })

    it('falls back to a plate lookup if there appears to be no box', async () => {
      labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
        success: false,
        error: mockError,
      })
      lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
        success: true,
        plates: [],
      })
      await wrapper.vm.provider()
      await flushPromises()
      expect(lighthouseService.findPlatesFromBarcodes).toHaveBeenCalledWith({
        barcodes: [BARCODE_BOX],
      })
    })
  })

  describe('#findPlates', () => {
    it('populates plates from lighthouse', async () => {
      labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
        success: true,
        barcodes: BARCODES_PLATES,
      })
      lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
        success: true,
        plates: examplePlates,
      })
      const expectedSortedPlates = wrapper.vm.sortedPlates(examplePlates)
      wrapper.vm.sortedPlates = vi.fn()
      wrapper.vm.sortedPlates.mockReturnValue(expectedSortedPlates)
      await wrapper.vm.provider()
      await flushPromises()
      expect(lighthouseService.findPlatesFromBarcodes).toHaveBeenCalledWith({
        success: true,
        barcodes: BARCODES_PLATES,
      })
      expect(wrapper.vm.sortedPlates).toHaveBeenCalledWith(examplePlates)

      const platesWithRowVariants = expectedSortedPlates.map((plate) => {
        return {
          ...plate,
          _rowVariant: wrapper.vm.rowClass(plate),
        }
      })
      expect(wrapper.vm.plates).toEqual(platesWithRowVariants)
    })

    it('findPlatesFromBarcodes can be successful and return no plates', async () => {
      const barcodes = [plateA.plate_barcode]
      lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
        success: true,
        plates: [],
      })
      wrapper.vm.findPlatesInLighthouse({ success: true, barcodes })
      await flushPromises()
      expect(lighthouseService.findPlatesFromBarcodes).toHaveBeenCalledWith({
        success: true,
        barcodes,
      })
      expect(wrapper.vm.plates).toEqual([])
    })

    it('displays lighthouse errors', async () => {
      labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
        success: true,
        barcodes: [],
      })
      lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
        success: false,
        error: mockError,
      })
      wrapper.vm.sortedPlates = vi.fn()
      await wrapper.vm.provider()

      await flushPromises()
      expect(lighthouseService.findPlatesFromBarcodes).toHaveBeenCalledWith({
        success: true,
        barcodes: [],
      })
      expect(wrapper.vm.sortedPlates).not.toHaveBeenCalled()
      expect(wrapper.vm.plates).toEqual([])
      expect(wrapper.find('#alert').text()).toContain(mockError.message)
    })
  })

  describe('sortedPlates()', () => {
    it('returns an empty list if no plates are provided', () => {
      const plates = []
      expect(wrapper.vm.sortedPlates(plates)).toEqual([])
    })

    it('sorts by count_must_sequence, then count_preferentially_sequence, then count_fit_to_pick_samples, then has_plate_map', () => {
      const result = wrapper.vm.sortedPlates(examplePlates)
      expect(result[0].plate_barcode).toBe('AP-rna-2-0-10-8')
      expect(result[1].plate_barcode).toBe('AP-rna-1-1-5-5')
      expect(result[2].plate_barcode).toBe('AP-rna-0-2-8-6')
      expect(result[3].plate_barcode).toBe('AP-rna-0-1-2-1')
      expect(result[4].plate_barcode).toBe('AP-rna-0-0-0-0')
      expect(result[5].plate_barcode).toBe('AP-rna-no_map')
    })
  })

  it('populates the table when the labwhere and lighthouse request is successful', async () => {
    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
      success: false,
      barcodes: [],
    })
    lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: examplePlates,
    })

    await wrapper.vm.provider()
    await flushPromises()
    expect(labwhere.getPlatesFromBoxBarcodes).toHaveBeenCalled()
    expect(lighthouseService.findPlatesFromBarcodes).toHaveBeenCalled()
    expect(wrapper.find('tbody').findAll('tr')).toHaveLength(6)
    const tableBodyText = wrapper.find('tbody').text()
    expect(tableBodyText).toContain('AP-rna-2-0-10-8')
    expect(tableBodyText).toContain('AP-rna-1-1-5-5')
    expect(tableBodyText).toContain('AP-rna-0-2-8-6')
    expect(tableBodyText).toContain('AP-rna-0-1-2-1')
    expect(tableBodyText).toContain('AP-rna-0-0-0-0')
    expect(tableBodyText).toContain('AP-rna-no_map')
  })

  it('does not populate the table when the labwhere request fails', async () => {
    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
      success: false,
    })
    wrapper.vm.findPlates = vi.fn()
    wrapper.vm.findPlates.mockReturnValue([])
    await wrapper.vm.provider()
    await flushPromises()
    expect(wrapper.find('tbody').findAll('tr')).toHaveLength(1)
    expect(wrapper.find('tbody').text()).toContain(MSG_NO_RECORDS)
  })

  it('does not populate the table when the lighthouse request fails', async () => {
    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
      success: true,
      barcodes: [],
    })
    lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
      success: false,
    })
    await wrapper.vm.provider()
    await flushPromises()
    expect(wrapper.find('tbody').findAll('tr')).toHaveLength(1)
    expect(wrapper.find('tbody').text()).toContain(MSG_NO_RECORDS)
  })

  it('will clear the barcode field after a barcode is entered', async () => {
    lighthouseService.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: examplePlates,
    })
    const barcodeField = wrapper.find('#box-barcode-field')
    barcodeField.setValue('12345')
    await barcodeField.trigger('keydown.enter')
    await flushPromises()

    expect(wrapper.vm.scanned_barcodes).toEqual(['12345'])
    expect(wrapper.vm.barcode).toBe('')
    expect(barcodeField.element.value).toBe('')
    expect(wrapper.find('caption').text()).toContain('12345')
  })

  it('checks if the scanned barcodes are duplicates', () => {
    wrapper.vm.scanned_barcodes = ['12345', '12345', 'barcode']
    expect(wrapper.vm.isBarcodeDuplicate('12345')).toEqual({ 'text-danger': true })
    expect(wrapper.vm.isBarcodeDuplicate('barcode')).toEqual({ 'text-danger': false })
  })
})
