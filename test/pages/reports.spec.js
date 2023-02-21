import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import ReportsJson from '../data/reports'
import Reports from '@/pages/reports.vue'
import statuses from '@/modules/statuses'
import lighthouse from '@/modules/lighthouse_service'

vi.mock('@/modules/lighthouse_service', () => {
  return {
    default: {
      createReport: vi.fn(),
      getReports: vi.fn(),
    },
  }
})

describe('Reports', () => {
  let wrapper

  beforeEach(() => {
    lighthouse.getReports.mockResolvedValue({
      success: true,
      reports: ReportsJson.reports,
    })

    wrapper = mount(Reports, {})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(Reports).exists()).toBeTruthy()
  })

  describe('setting the status', () => {
    it('default should be idle', () => {
      expect(wrapper.vm.isIdle).toBeTruthy()
    })

    it('when success', () => {
      wrapper = mount(Reports, {
        data() {
          return {
            status: statuses.Success,
            alertMessage: 'I am a success',
          }
        },
      })
      expect(wrapper.vm.isSuccess).toBeTruthy()
      expect(wrapper.find('.alert').text()).toMatch('I am a success')
    })

    it('when error', () => {
      wrapper = mount(Reports, {
        data() {
          return {
            status: statuses.Error,
            alertMessage: 'I am a failure',
          }
        },
      })
      expect(wrapper.vm.isError).toBeTruthy()
      expect(wrapper.find('.alert').text()).toMatch('I am a failure')
    })

    it('when busy', () => {
      wrapper = mount(Reports, {
        data() {
          return {
            status: statuses.Busy,
            alertMessage: 'I am busy',
          }
        },
      })
      expect(wrapper.vm.isBusy).toBeTruthy()
      expect(wrapper.find('.alert').text()).toMatch('I am busy')
    })
  })

  describe('#reportsProvider', () => {
    it('when the request is successful', async () => {
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(ReportsJson.reports.length)
    })

    it('when the request fails', async () => {
      lighthouse.getReports.mockResolvedValue({
        success: false,
        reports: 'There was an error',
      })

      wrapper = mount(Reports, {})
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(0)
    })
  })

  describe('#createReport', () => {
    it('when the request is successful', async () => {
      lighthouse.createReport.mockResolvedValue({
        success: true,
        reports: [ReportsJson.reports[0]],
      })
      lighthouse.getReports.mockResolvedValue({
        success: true,
        reports: ReportsJson.reports,
      })
      const button = wrapper.find('#createReport')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(ReportsJson.reports.length)
      expect(wrapper.find('.alert').text()).toMatch('Report successfully created')
    })

    it('when the request fails', async () => {
      lighthouse.createReport.mockReturnValue({
        success: false,
        error: 'There was an error',
      })
      const button = wrapper.find('#createReport')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('.alert').text()).toMatch('There was an error creating the report')
    })
  })

  // // TODO: DPL-561 - Again would be better with an integration test
  // // I also think this the complexity of this test is a bit of a code smell. Defo needs a refactor
  // describe('#deleteReports', () => {
  //   let rows, reportFilenames, lessReportsJson

  //   beforeEach(() => {
  //     reportFilenames = ReportsJson.reports.map((report) => report.filename).slice(0, 3)
  //     lessReportsJson = { reports: ReportsJson.reports.slice(3, 5) }
  //     lighthouse.getReports.mockResolvedValue({
  //       success: true,
  //       reports: ReportsJson.reports,
  //     })
  //   })

  //   it('when the request is successful', async () => {
  //     lighthouse.deleteReports.mockResolvedValue({ success: true })
  //     await flushPromises()
  //     rows = wrapper.find('tbody').findAll('tr')
  //     const arr = [0, 1, 2]
  //     arr.forEach((i) => {
  //       rows.at(i).find('.selected input[type="checkbox"]').setChecked(true)
  //     })
  //     expect(wrapper.vm.reportsToDelete).toEqual(reportFilenames)
  //     lighthouse.getReports.mockResolvedValue({
  //       success: true,
  //       reports: lessReportsJson.reports,
  //     })
  //     const button = wrapper.find('#deleteReports')
  //     await button.trigger('click')
  //     await flushPromises()
  //     expect(wrapper.text()).toMatch(/Reports successfully deleted/)
  //     expect(wrapper.find('tbody').findAll('tr')).toHaveLength(2)
  //   })

  //   it('when the request fails', async () => {
  //     lighthouse.deleteReports.mockResolvedValue({
  //       success: false,
  //       error: 'There was an error',
  //     })
  //     await flushPromises()
  //     rows = wrapper.find('tbody').findAll('tr')
  //     rows.at(0).find('.selected input[type="checkbox"]').setChecked(true)
  //     expect(wrapper.vm.reportsToDelete).toHaveLength(1)
  //     const button = wrapper.find('#deleteReports')
  //     await button.trigger('click')
  //     await flushPromises()
  //     expect(wrapper.find('.alert').text()).toMatch('There was an error')
  //   })
  // })
})
