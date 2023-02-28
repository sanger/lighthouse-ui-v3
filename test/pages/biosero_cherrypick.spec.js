import { mount } from '@vue/test-utils'
import AlertDialog from '@/components/AlertDialog'
import lighthouse from '@/modules/lighthouse_service'
import lighthouseBiosero from '@/modules/lighthouse_service_biosero'
import BioseroCherrypick from '@/pages/biosero_cherrypick.vue'

vi.mock('@/modules/lighthouse_service')
vi.mock('@/modules/lighthouse_service_biosero')

describe('Biosero Cherrypick', () => {
  let wrapper, failureTypes

  beforeEach(() => {
    failureTypes = [
      { type: 'Type 1', description: 'Description of error 1' },
      { type: 'Type 2', description: 'Description of error 2' },
    ]

    lighthouse.getFailureTypes.mockReturnValue({
      success: true,
      failureTypes,
    })

    wrapper = mount(BioseroCherrypick)
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(BioseroCherrypick).exists()).toBeTruthy()
  })

  describe('mounted', () => {
    it('calls lighthouse initialiser methods', () => {
      expect(lighthouse.getFailureTypes).toHaveBeenCalled()
    })
  })

  describe('data', () => {
    it('has failure types data', () => {
      expect(wrapper.vm.failureTypes).toEqual(failureTypes)
    })
  })

  describe('#getFailureTypes', () => {
    it('sets the failure types data', async () => {
      await wrapper.vm.getFailureTypes()
      expect(wrapper.vm.failureTypes).toHaveLength(2)
    })

    it('on failure calls showAlert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouse.getFailureTypes.mockReturnValue({
        errors: ['No information exists for any Biosero failure types'],
        failureTypes: [],
      })

      await wrapper.vm.getFailureTypes()
      expect(wrapper.vm.failureTypes).toHaveLength(0)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith(
        'No information exists for any Biosero failure types',
        'danger'
      )
    })
  })

  describe('#create', () => {
    let form

    beforeEach(() => {
      form = {
        username: 'username',
        barcode: 'barcode',
      }
    })

    it('on success it shows an alert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseBiosero.createDestinationPlateBiosero.mockReturnValue({
        success: true,
        response: 'A successful response message',
      })

      await wrapper.vm.create(form)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith('A successful response message', 'success')
    })

    it('on failure calls showAlert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseBiosero.createDestinationPlateBiosero.mockReturnValue({
        success: false,
        error: {
          message: 'an error',
        },
      })

      await wrapper.vm.create(form)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith('an error', 'danger')
    })
  })

  describe('#fail', () => {
    let form

    beforeEach(() => {
      form = {
        username: 'username',
        barcode: 'barcode',
        failureType: 'failureType',
      }
    })

    it('on success it shows an alert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseBiosero.failDestinationPlateBiosero.mockReturnValue({
        success: true,
        response: 'A successful response message',
      })

      await wrapper.vm.fail(form)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith('A successful response message', 'success')
    })

    it('on failure calls showAlert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseBiosero.failDestinationPlateBiosero.mockReturnValue({
        success: false,
        error: { message: 'An error message' },
      })

      await wrapper.vm.fail(form)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith('An error message', 'danger')
    })
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.findComponent(AlertDialog).exists()).toBeTruthy()
    })
  })

  describe('#showAlert', () => {
    it('calls alert show', () => {
      wrapper.vm.$refs.alert.show = vi.fn()
      wrapper.vm.showAlert('message', 'success')
      expect(wrapper.vm.$refs.alert.show).toHaveBeenCalled()
    })
  })
})
