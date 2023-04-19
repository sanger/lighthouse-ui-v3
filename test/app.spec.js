import { mount } from '@vue/test-utils'
import App from '@/app.vue'

describe('App', () => {
  let wrapper, $config

  beforeEach(() => {
    $config = {
      public: {
        appTagline: 'Test Tagline',
        enabledNavItems: 'box_buster,imports,print_labels',
      },
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
    expect(wrapper.find('nav').text()).toBe('LighthouseTest TaglineBox BusterImportsPrint Labels')
  })
})
