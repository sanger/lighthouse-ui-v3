import { mount } from '@vue/test-utils'
import App from '@/app.vue'

describe('App', () => {
  let wrapper, $config

  beforeEach(() => {
    $config = {
      uatActions: true,
      bioseroCherrypick: true,
    }

    wrapper = mount(App, {
      global: {
        stubs: {
          NuxtPage: true,
        },
        mocks: {
          $config,
        },
      },
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(App).exists()).toBeTruthy()
  })

  it('has a navbar', () => {
    expect(wrapper.find('nav').text()).toMatch(
      /LighthouseReportsBox BusterSentinel Sample CreationSentinel CherrypickImportsPrint LabelsBeckman CherrypickBiosero Plate StateBiosero CherrypickUAT Actions/
    )
  })
})
