import { mount } from '@vue/test-utils'
import StatusAlert from '@/components/StatusAlert'

describe('StatusAlert.vue', () => {
  let wrapper

  it('has an Idle status and no alert message by default', () => {
    wrapper = mount(StatusAlert, { stubs: { transition: false } })

    expect(wrapper.vm.status).toBe(Status.Idle)
    expect(wrapper.vm.alertMessage).toBe('')
  })

  it("is hidden when status is 'Idle'", () => {
    wrapper = mount(StatusAlert, {
      data() {
        return { alertMessage: 'Alert Message', status: Status.Idle }
      },
    })

    expect(wrapper.find('.alert').exists()).toBeFalsy()
    expect(wrapper.html()).not.toContain('Alert Message')
  })

  describe('setStatus()', () => {
    it.each([
      ['Idle', 'Idle Alert', Status.Idle, '', false],
      ['Busy', 'Busy Alert', Status.Busy, 'warning', true],
      ['Error', 'Error Alert', Status.Error, 'danger', true],
      ['Success', 'Success Alert', Status.Success, 'success', true],
    ])(
      "sets the status '%s' and alert message '%s'",
      (stringStatus, message, numericStatus, alertVariant, shouldShowAlert) => {
        wrapper = mount(StatusAlert)

        wrapper.vm.setStatus(stringStatus, message)

        expect(wrapper.vm.alertMessage).toBe(message)
        expect(wrapper.vm.status).toBe(numericStatus)
        expect(wrapper.vm.showAlert).toBe(shouldShowAlert)
        expect(wrapper.vm.alertVariant).toBe(alertVariant)
      }
    )
  })
})
