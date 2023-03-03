<template>
  <div>
    <div>
      <b-navbar class="navbar-dark" toggleable="md" variant="primary">
        <b-navbar-brand to="/">Lighthouse</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ms-auto">
            <b-nav-item to="/reports">Reports</b-nav-item>
            <b-nav-item to="/box_buster">Box Buster</b-nav-item>
            <b-nav-item to="/sentinel_create_samples">Sentinel Sample Creation</b-nav-item>
            <b-nav-item to="/sentinel_cherrypick">Sentinel Cherrypick</b-nav-item>
            <b-nav-item to="/imports">Imports</b-nav-item>
            <b-nav-item to="/print_labels">Print Labels</b-nav-item>
            <b-nav-item to="/beckman_cherrypick">Beckman Cherrypick</b-nav-item>
            <b-nav-item to="/biosero_plate_state">Biosero Plate State</b-nav-item>
            <b-nav-item v-if="featureFlagBioseroCherrypick" to="/biosero_cherrypick"
              >Biosero Cherrypick</b-nav-item
            >
            <b-nav-item v-if="featureFlagUatActions" to="/uat_actions/generate_test_run"
              >UAT Actions</b-nav-item
            >
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <NuxtPage />
  </div>
</template>

<script>
export default {
  data() {
    return {
      featureFlagUatActions: this.$config.uatActions,
      featureFlagBioseroCherrypick: this.$config.bioseroCherrypick,
    }
  },
}
</script>

<style lang="scss">
@import './assets/scss/main.scss';
</style>

<style lang="scss" scoped>
@import './assets/scss/app-scoped.scss';
</style>
