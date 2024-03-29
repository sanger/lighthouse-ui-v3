<template>
  <b-container>
    <h1 class="mt-3">Biosero Cherrypick</h1>
    <AlertDialog ref="alert"></AlertDialog>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Create">
          <b-card
            title="Create Destination Plate"
            subtitle="Generate destination plate from CherryTrack data so it can continue in pipeline partially filled."
          >
            <BioseroCherrypickForm v-slot="{ form, formInvalid }" :action="'create'">
              <b-button variant="primary" :disabled="formInvalid" @click="create(form)"
                >Create Destination Plate</b-button
              >
            </BioseroCherrypickForm>
          </b-card>
        </b-tab>

        <b-tab title="Fail">
          <b-card title="Fail Destination Plate" subtitle="Fail destination plate with a reason.">
            <BioseroCherrypickForm
              v-slot="{ form, formInvalid }"
              :action="'fail'"
              :failure-types="failureTypes"
            >
              <b-button variant="danger" :disabled="formInvalid" @click="fail(form)"
                >Fail Destination Plate</b-button
              >
            </BioseroCherrypickForm>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script>
// https://ssg-confluence.internal.sanger.ac.uk/display/PSDPUB/%5BBiosero%5D+Cherrypicking+Events

import BioseroCherrypickForm from '@/components/BioseroCherrypickForm'
import AlertDialog from '@/components/AlertDialog'

export default {
  components: {
    BioseroCherrypickForm,
    AlertDialog,
  },
  data() {
    return {
      failureTypes: [],
    }
  },
  async mounted() {
    await this.getFailureTypes()
  },
  methods: {
    async getDataFromLighthouse(lighthouseFunction, dataAttribute) {
      const response = await lighthouseFunction

      if (response.success) {
        this[dataAttribute] = response[dataAttribute]
      } else {
        this[dataAttribute] = []
        const message = response.errors.join(', ')
        const type = 'danger'
        this.showAlert(message, type)
      }
    },
    getFailureTypes() {
      this.getDataFromLighthouse(lighthouseService.getFailureTypes(), 'failureTypes')
    },
    async create(form) {
      const response = await lighthouseServiceBiosero.createDestinationPlateBiosero(form)
      this.handleResponse(response)
    },
    async fail(form) {
      const response = await lighthouseServiceBiosero.failDestinationPlateBiosero(form)
      this.handleResponse(response)
    },
    handleResponse(response) {
      let message, type
      if (response.success) {
        message = response.response
        type = 'success'
      } else {
        message = response.error.message
        type = 'danger'
      }
      this.showAlert(message, type)
    },
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
  },
}
</script>

<style scoped lang="scss"></style>
