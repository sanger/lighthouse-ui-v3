<template>
  <div>
    <div>
      <b-navbar class="navbar-dark" toggleable="md" variant="primary">
        <b-navbar-brand to="/"
          >Lighthouse<br /><span class="tagline">{{ $config.appTagline }}</span></b-navbar-brand
        >

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ms-auto">
            <b-nav-item v-for="item in navItems" :key="item.path" :to="item.path">
              {{ item.title }}
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <NuxtPage />
  </div>
</template>

<script>
export default {
  computed: {
    navItems() {
      return [
        { path: '/reports', title: 'Reports' },
        { path: '/box_buster', title: 'Box Buster' },
        { path: '/sentinel_create_samples', title: 'Sentinel Sample Creation' },
        { path: '/sentinel_cherrypick', title: 'Sentinel Cherrypick' },
        { path: '/imports', title: 'Imports' },
        { path: '/print_labels', title: 'Print Labels' },
        { path: '/beckman_cherrypick', title: 'Beckman Cherrypick' },
        { path: '/biosero_plate_state', title: 'Biosero Plate State' },
        { path: '/biosero_cherrypick', title: 'Biosero Cherrypick' },
        { path: '/uat_actions/generate_test_run', title: 'UAT Actions' },
      ]
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/main.scss';
</style>

<style lang="scss" scoped>
@import './assets/scss/app-scoped.scss';
</style>
