import { mount } from '@vue/test-utils'
import TestRuns from '@/pages/uat_actions/test_runs'
import { mockError } from '@/test/constants'

vi.mock('@/utils/lighthouse_service')

describe('TestRuns.vue', () => {
  let wrapper

  beforeEach(() => {
    lighthouseService.getTestRuns.mockResolvedValue({ success: true, response: [], total: 0 })
    wrapper = mount(TestRuns)
    wrapper.vm.$refs.alert.show = vi.fn()
  })

  // data
  describe('data', () => {
    it('will have fields', () => {
      const expected = [
        {
          key: '_created',
          class: 'align-middle',
        },
        {
          key: 'status',
          class: 'align-middle',
        },
        {
          key: 'total_plates',
          class: 'align-middle',
        },
        'actions',
      ]
      expect(wrapper.vm.fields).toEqual(expected)
    })
  })

  describe('table', () => {
    beforeEach(() => {
      const testRunsData = {
        success: true,
        response: [
          {
            _id: 1,
            status: 'completed',
            _created_at: '2020-05-13 11:00:00 UTC',
          },
          {
            _id: 2,
            status: 'completed',
            _created_at: '2020-05-13 11:00:00 UTC',
          },
        ],
        total: 23,
      }
      lighthouseService.getTestRuns.mockResolvedValue(testRunsData)

      wrapper.vm.refresh()
    })

    it('will have a table', () => {
      expect(wrapper.find('table').exists()).toBeTruthy()
    })

    it('contains a view run button for each row', () => {
      expect(wrapper.find('#viewTestRun-1').text()).toBe('View')
      expect(wrapper.find('#viewTestRun-2').text()).toBe('View')
    })
  })

  describe('#getTestRuns successful', () => {
    let testRunsData

    beforeEach(() => {
      testRunsData = {
        success: true,
        response: [
          {
            _id: 111111,
            status: 'completed',
            _created_at: '2020-05-13 11:00:00 UTC',
          },
          {
            _id: 211111,
            status: 'completed',
            _created_at: '2020-05-10 10:00:00 UTC',
          },
          {
            _id: 311111,
            status: 'completed',
            _created_at: '2020-05-10 10:00:00 UTC',
          },
        ],
        total: 23,
      }
      lighthouseService.getTestRuns.mockResolvedValue(testRunsData)

      wrapper.vm.refresh()
    })

    it('has a table with runs', () => {
      expect(wrapper.vm.totalRows).toBe(23)
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(testRunsData.response.length)
    })
  })

  describe('#getTestRuns unsuccessful', () => {
    let testRunsData

    beforeEach(() => {
      testRunsData = {
        success: false,
        total: 0,
        error: 'An error',
      }
      lighthouseService.getTestRuns.mockResolvedValue(testRunsData)
      wrapper.vm.$refs.alert.show = vi.fn()

      wrapper.vm.refresh()
    })

    it('has a table with no runs', () => {
      expect(wrapper.vm.totalRows).toBe(0)
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(0)
      expect(wrapper.vm.$refs.alert.show).toHaveBeenCalledWith('An error', 'danger')
    })
  })

  describe('#getTestRuns failure', () => {
    beforeEach(() => {
      lighthouseService.getTestRuns.mockRejectedValue(new Error('There was an error'))

      wrapper.vm.refresh()
    })

    it('shows the error in an alert', () => {
      expect(wrapper.vm.totalRows).toBe(0)
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(0)
      expect(wrapper.vm.$refs.alert.show).toHaveBeenCalledWith(
        'An unknown error has occurred',
        'danger'
      )
    })
  })
})
