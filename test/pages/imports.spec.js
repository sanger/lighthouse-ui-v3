import { mount } from '@vue/test-utils'
import Imports from '@/pages/imports'
import StatusAlert from '@/components/StatusAlert'

vi.mock('@/utils/lighthouse_service')

lighthouseService.getImports.mockResolvedValue({ success: false })

describe('Imports', () => {
  let wrapper, setAlertStatus

  beforeEach(() => {
    setAlertStatus = vi.spyOn(StatusAlert.methods, 'setStatus')
    wrapper = mount(Imports, {
      data() {
        return {
          items: [],
        }
      },
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(Imports).exists()).toBeTruthy()
  })

  describe('#getItemsProvider', () => {
    it('calls the correct functions', async () => {
      const items = [{ test: 1 }]
      const expectedResponse = { success: true, data: { _items: items } }

      wrapper.vm.handleItemsResponse = vi.fn()

      lighthouseService.getImports.mockResolvedValue(expectedResponse)

      await wrapper.vm.getItemsProvider()

      expect(lighthouseService.getImports).toHaveBeenCalled()
      expect(wrapper.vm.handleItemsResponse).toHaveBeenCalledWith(expectedResponse)
    })
  })

  describe('#handleItemsResponse', () => {
    let response, errorMsg

    it('handles success', () => {
      const items = [{ test: 1 }]
      response = { success: true, data: { _items: items } }

      const resp = wrapper.vm.handleItemsResponse(response)
      expect(resp).toEqual(items)
    })

    it('handles failure', () => {
      errorMsg = 'an error message'
      response = { success: false, error: errorMsg }
      const resp = wrapper.vm.handleItemsResponse(response)

      expect(setAlertStatus).toHaveBeenCalledWith('Error', errorMsg)
      expect(resp).toEqual([])
    })
  })

  describe('table filtering', () => {
    it('filters based on entered search term', async () => {
      wrapper.vm.items = [
        {
          date: 'something',
          centre_name: 'I should be hidden',
          csv_file_used: 'test_file',
          number_of_records: '2',
          errors: ['nothing'],
        },
        {
          date: 'something 2',
          centre_name: 'pick me!',
          csv_file_used: 'test_file_2',
          number_of_records: '2',
          errors: ['nothing'],
        },
      ]
      wrapper.vm.filter = 'me!'

      await wrapper.vm.$nextTick()

      expect(wrapper.find('#imports-table').html()).toMatch(/pick me!/)
      expect(wrapper.find('#imports-table').html()).not.toMatch(/I should be hidden/)
    })
  })
})
