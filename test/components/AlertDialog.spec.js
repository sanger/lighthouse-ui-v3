import { mount } from '@vue/test-utils'
import AlertDialog from '@/components/AlertDialog'

describe('AlertDialog.vue', () => {
  let wrapper

  it('has a message', () => {
    wrapper = mount(AlertDialog, {
      data() {
        return { message: 'bar' }
      },
    })
    expect(wrapper.vm.message).toBe('bar')
  })

  it('has a type', () => {
    wrapper = mount(AlertDialog, {
      data() {
        return { type: 'primary' }
      },
    })
    expect(wrapper.vm.type).toBe('primary')
  })

  it('has a showDismissibleAlert', () => {
    wrapper = mount(AlertDialog, {
      data() {
        return { showDismissibleAlert: true }
      },
    })
    expect(wrapper.vm.showDismissibleAlert).toBe(true)
  })

  it('is hidden as default', () => {
    wrapper = mount(AlertDialog)
    expect(wrapper.vm.showDismissibleAlert).toBe(false)
    expect(wrapper.find('#alertDialog').exists()).toBeFalsy()
  })

  it('displays the message', () => {
    wrapper = mount(AlertDialog, {
      data() {
        return { message: 'bar', showDismissibleAlert: true }
      },
    })
    expect(wrapper.find('#alertDialog').exists()).toBeTruthy()
    expect(wrapper.html()).toContain('bar')
  })

  it('displays the type', () => {
    wrapper = mount(AlertDialog, {
      data() {
        return { type: 'success', showDismissibleAlert: true }
      },
    })
    expect(wrapper.find('.alert-success').exists()).toBeTruthy()
  })

  it('#show sets the data', () => {
    const alert = mount(AlertDialog).vm
    alert.show('msg')
    expect(alert.message).toBe('msg')
    expect(alert.type).toBe('primary')
    expect(alert.showDismissibleAlert).toBe(true)
  })
})
