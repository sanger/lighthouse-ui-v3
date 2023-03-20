import { mount } from '@vue/test-utils'
import BeckmanCherrypick from '@/pages/beckman_cherrypick.vue'
import AlertDialog from '@/components/AlertDialog'

vi.mock('@/utils/lighthouse_service')

describe('Beckman Cherrypick', () => {
  let wrapper, robots, failureTypes

  beforeEach(() => {
    robots = [
      { name: 'robot 1', serial_number: 'B00000001' },
      { name: 'robot 2', serial_number: 'B00000002' },
    ]

    failureTypes = [
      { type: 'Type 1', description: 'Description of error 1' },
      { type: 'Type 2', description: 'Description of error 2' },
    ]

    lighthouseService.getRobots.mockReturnValue({
      success: true,
      robots,
    })

    lighthouseService.getFailureTypes.mockReturnValue({
      success: true,
      failureTypes,
    })

    wrapper = mount(BeckmanCherrypick)
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(BeckmanCherrypick).exists()).toBeTruthy()
  })

  describe('mounted', () => {
    it('calls lighthouse initialiser methods', () => {
      expect(lighthouseService.getRobots).toHaveBeenCalled()
      expect(lighthouseService.getFailureTypes).toHaveBeenCalled()
    })
  })

  describe('data', () => {
    it('has robots data', () => {
      expect(wrapper.vm.robots).toEqual(robots)
    })

    it('has failure types data', () => {
      expect(wrapper.vm.failureTypes).toEqual(failureTypes)
    })
  })

  describe('#getRobots', () => {
    it('on success it sets the robots data', async () => {
      await wrapper.vm.getRobots()
      expect(wrapper.vm.robots).toHaveLength(2)
    })

    it('on failure calls showAlert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseService.getRobots.mockReturnValue({
        errors: ['No information exists for any Beckman robots'],
        robots: [],
      })

      await wrapper.vm.getRobots()
      expect(wrapper.vm.robots).toHaveLength(0)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith(
        'No information exists for any Beckman robots',
        'danger'
      )
    })
  })

  describe('#getFailureTypes', () => {
    it('sets the failure types data', async () => {
      await wrapper.vm.getFailureTypes()
      expect(wrapper.vm.failureTypes).toHaveLength(2)
    })

    it('on failure calls showAlert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseService.getFailureTypes.mockReturnValue({
        errors: ['No information exists for any Beckman failure types'],
        failureTypes: [],
      })

      await wrapper.vm.getFailureTypes()
      expect(wrapper.vm.failureTypes).toHaveLength(0)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith(
        'No information exists for any Beckman failure types',
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
        robotSerialNumber: 'robotSerialNumber',
      }
    })

    it('on success it shows an alert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseService.createDestinationPlateBeckman.mockReturnValue({
        success: true,
        response: 'A successful response message',
      })

      await wrapper.vm.create(form)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith('A successful response message', 'success')
    })

    it('on failure calls showAlert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseService.createDestinationPlateBeckman.mockReturnValue({
        success: false,
        errors: ['an error'],
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
        robotSerialNumber: 'robotSerialNumber',
        failureType: 'failureType',
      }
    })

    it('on success it shows an alert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseService.failDestinationPlateBeckman.mockReturnValue({
        success: true,
        response: 'A successful response message',
      })

      await wrapper.vm.fail(form)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith('A successful response message', 'success')
    })

    it('on partial success it shows an alert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseService.failDestinationPlateBeckman.mockReturnValue({
        success: true,
        errors: ['A error message'],
      })

      await wrapper.vm.fail(form)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith('A error message', 'warning')
    })

    it('on failure calls showAlert', async () => {
      wrapper.vm.showAlert = vi.fn()
      lighthouseService.failDestinationPlateBeckman.mockReturnValue({
        success: false,
        errors: ['an error'],
      })

      await wrapper.vm.fail(form)
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith('an error', 'danger')
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
