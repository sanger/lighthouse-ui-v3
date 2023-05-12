import { mount } from '@vue/test-utils'
import SentinelCreateSamples from '@/pages/sentinel_create_samples'

describe('lighthouse sentinel cherrypick', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SentinelCreateSamples, {
      data() {
        return {
          boxBarcode: 'lw-ogilvie-4',
          items: [],
        }
      },
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(SentinelCreateSamples).exists()).toBeTruthy()
  })

  it('has a barcode', () => {
    expect(wrapper.vm.boxBarcode).toBe('lw-ogilvie-4')
  })

  it('has items', () => {
    expect(wrapper.vm.items).toEqual([])
  })

  describe('#cancelSearch', () => {
    it('clears boxBarcode', () => {
      wrapper.vm.cancelSearch()
      expect(wrapper.vm.boxBarcode).toBe('')
    })
  })

  describe('#handleSentinelSampleCreation', () => {
    it('calls createSamples', async () => {
      api.createSamples = vi.fn().mockReturnValue([])
      wrapper.vm.handleSentinelSampleCreationResponse = vi.fn()
      await wrapper.vm.handleSentinelSampleCreation()
      expect(api.createSamples).toHaveBeenCalled()
    })

    describe('response handling', () => {
      it('on success it populates the table', async () => {
        const response = [
          {
            data: {
              data: {
                plate_barcode: 'aBarcode1',
                centre: 'tst1',
                count_fit_to_pick_samples: 3,
              },
            },
          },
          {
            data: {
              data: {
                plate_barcode: 'aBarcode2',
                centre: 'tst1',
                count_fit_to_pick_samples: 1,
              },
            },
          },
        ]
        api.createSamples = vi.fn().mockReturnValue(response)

        await wrapper.vm.handleSentinelSampleCreation()
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
          /Sentinel samples successfully created in sequencescape/
        )
        expect(wrapper.vm.items).toEqual(response.map((r) => r.data.data))
      })

      it('on failure it shows an error message', async () => {
        const response = [
          {
            errors: ['an error 1'],
          },
          {
            errors: ['an error 2', 'an error 3'],
          },
        ]
        api.createSamples = vi.fn().mockReturnValue(response)

        await wrapper.vm.handleSentinelSampleCreation()
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
          /an error 1, an error 2, an error 3/
        )
        expect(wrapper.vm.items).toEqual([])
      })

      it('on partial success/failure, last request successful', async () => {
        const response = [
          {
            errors: ['an error 1'],
          },
          {
            errors: ['an error 2'],
          },
          {
            data: {
              data: {
                plate_barcode: 'aBarcode1',
                centre: 'tst1',
                count_fit_to_pick_samples: 1,
              },
            },
          },
          {
            data: {
              data: {
                plate_barcode: 'aBarcode2',
                centre: 'tst1',
                count_fit_to_pick_samples: 1,
              },
            },
          },
        ]
        api.createSamples = vi.fn().mockReturnValue(response)

        await wrapper.vm.handleSentinelSampleCreation()
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(/an error 1, an error 2/)
        expect(wrapper.vm.items).toEqual(
          response
            .slice(2)
            .map((r) => r.data)
            .map((r) => r.data)
        )
      })

      it('on partial success/failure, last request failed', async () => {
        const response = [
          {
            errors: ['an error 2'],
          },
          {
            data: {
              data: {
                plate_barcode: 'aBarcode1',
                centre: 'tst1',
                count_fit_to_pick_samples: 1,
              },
            },
          },
          {
            data: {
              data: {
                plate_barcode: 'aBarcode2',
                centre: 'tst1',
                count_fit_to_pick_samples: 1,
              },
            },
          },
          {
            errors: ['an error 1'],
          },
        ]
        api.createSamples = vi.fn().mockReturnValue(response)

        await wrapper.vm.handleSentinelSampleCreation()
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
          /Some samples were successfully created however: an error 2, an error 1/
        )
        expect(wrapper.vm.items).toEqual(
          response
            .slice(1, 3)
            .map((r) => r.data)
            .map((r) => r.data)
        )
      })
    })
  })
})
