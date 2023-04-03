import { mount } from '@vue/test-utils'
import StatusAlert from '@/components/StatusAlert'

describe('StatusAlert.vue', () => {
  let wrapper

  it('has an Idle status and no alert message by default', () => {
    wrapper = mount(StatusAlert, { stubs: { transition: false } })

    expect(wrapper.vm.status).toBe(statuses.Idle)
    expect(wrapper.vm.alertMessage).toBe('')
  })

  it("is hidden when status is 'Idle'", () => {
    wrapper = mount(StatusAlert, {
      data() {
        return { alertMessage: 'Alert Message', status: statuses.Idle }
      },
    })

    expect(wrapper.find('.alert').exists()).toBeFalsy()
    expect(wrapper.html()).not.toContain('Alert Message')
  })

  describe('setStatus()', () => {
    it.each([
      ['Idle', 'Idle Alert', statuses.Idle, '', false],
      ['Busy', 'Busy Alert', statuses.Busy, 'warning', true],
      ['Error', 'Error Alert', statuses.Error, 'danger', true],
      ['Success', 'Success Alert', statuses.Success, 'success', true],
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
