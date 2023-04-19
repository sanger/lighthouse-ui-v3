<template>
  <div>
    <div>
      <b-navbar class="navbar-dark" toggleable="md" variant="primary">
        <b-navbar-brand to="/"
          >Lighthouse<br /><span class="tagline">{{
            $config.public.appTagline
          }}</span></b-navbar-brand
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
      return selectNavItems(this.$config.public.enabledNavItems)
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
