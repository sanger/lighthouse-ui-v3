<template>
  <b-container>
    <h1 class="mt-3">Beckman Cherrypick</h1>
    <AlertDialog ref="alert"></AlertDialog>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Create">
          <b-card
            title="Create Destination Plate"
            subtitle="Generate destination plate from DART data so it can continue in pipeline partially filled."
          >
            <BeckmanCherrypickForm
              v-slot="{ form, formInvalid }"
              :action="'create'"
              :robots="robots"
            >
              <b-button variant="primary" :disabled="formInvalid" @click="create(form)"
                >Create Destination Plate</b-button
              >
            </BeckmanCherrypickForm>
          </b-card>
        </b-tab>

        <b-tab title="Fail">
          <b-card title="Fail Destination Plate" subtitle="Fail destination plate with a reason.">
            <BeckmanCherrypickForm
              v-slot="{ form, formInvalid }"
              :action="'fail'"
              :robots="robots"
              :failure-types="failureTypes"
            >
              <b-button variant="danger" :disabled="formInvalid" @click="fail(form)"
                >Fail Destination Plate</b-button
              >
            </BeckmanCherrypickForm>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script>
// https://ssg-confluence.internal.sanger.ac.uk/display/PSDPUB/%5BBeckman%5D+Cherrypicking+Events

import BeckmanCherrypickForm from '@/components/BeckmanCherrypickForm'
import AlertDialog from '@/components/AlertDialog'

export default {
  components: {
    BeckmanCherrypickForm,
    AlertDialog,
  },
  data() {
    return {
      robots: [],
      failureTypes: [],
    }
  },
  async mounted() {
    await this.getRobots()
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
    getRobots() {
      this.getDataFromLighthouse(lighthouseService.getRobots(), 'robots')
    },
    getFailureTypes() {
      this.getDataFromLighthouse(lighthouseService.getFailureTypes(), 'failureTypes')
    },
    async create(form) {
      const response = await lighthouseService.createDestinationPlateBeckman(form)
      this.handleResponse(response)
    },
    async fail(form) {
      const response = await lighthouseService.failDestinationPlateBeckman(form)
      this.handleResponse(response)
    },
    handleResponse(response) {
      let message, type
      if (response.success) {
        if (response.errors) {
          message = response.errors.join(', ')
          type = 'warning'
        } else {
          message = response.response
          type = 'success'
        }
      } else {
        message = response.errors.join(', ')
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
