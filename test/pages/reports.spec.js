import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import ReportsJson from '../data/reports'
import Reports from '@/pages/reports.vue'

vi.mock('@/utils/lighthouse_service')

describe('Reports', () => {
  let wrapper

  beforeEach(() => {
    lighthouseService.getReports.mockResolvedValue({
      success: true,
      reports: ReportsJson.reports,
    })

    wrapper = mount(Reports)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(Reports).exists()).toBeTruthy()
  })

  describe('#reportsProvider', () => {
    it('when the request is successful', async () => {
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(ReportsJson.reports.length)
    })

    it('when the request fails', async () => {
      lighthouseService.getReports.mockResolvedValue({
        success: false,
        reports: 'There was an error',
      })

      wrapper = mount(Reports)

      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(0)
    })
  })

  describe('#createReport', () => {
    it('when the request is successful', async () => {
      lighthouseService.createReport.mockResolvedValue({
        success: true,
        reports: [ReportsJson.reports[0]],
      })

      const button = wrapper.find('#createReport')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(ReportsJson.reports.length)
      expect(wrapper.find('.alert').text()).toMatch('Report successfully created')
    })

    it('when the request fails', async () => {
      lighthouseService.createReport.mockReturnValue({
        success: false,
        error: 'There was an error',
      })

      const button = wrapper.find('#createReport')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('.alert').text()).toMatch('There was an error creating the report')
    })
  })
})
