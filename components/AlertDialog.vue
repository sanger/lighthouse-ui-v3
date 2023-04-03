<template>
  <div>
    <b-alert
      id="alertDialog"
      v-model="showDismissibleAlert"
      :variant="type"
      dismissible
      @dismissed="showDismissibleAlert = false"
    >
      {{ message }}
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'AlertDialog',
  data() {
    return {
      message: '',
      type: '',
      showDismissibleAlert: false,
    }
  },
  methods: {
    /**
     * Toggle the alert (of type provided) on the page with the provided message
     * @param {*} message the message to show in the alert box
     * @param {string} type the variant (colour) of the alert
     */
    show(message, type = 'primary') {
      this.message = message
      this.type = type
      this.showDismissibleAlert = true
    },
  },
}
</script>
