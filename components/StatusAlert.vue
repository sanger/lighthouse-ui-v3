<template>
  <p>
    <b-alert v-model="showAlert" dismissible :variant="alertVariant">
      {{ alertMessage }}
    </b-alert>
  </p>
</template>

<script>
export default {
  data() {
    return {
      status: statuses.Idle,
      alertMessage: '',
      showAlert: false,
    }
  },
  computed: {
    isIdle() {
      return this.status === statuses.Idle
    },
    isBusy() {
      return this.status === statuses.Busy
    },
    isSuccess() {
      return this.status === statuses.Success
    },
    isError() {
      return this.status === statuses.Error
    },
    shouldShowAlert() {
      return this.isBusy || this.isError || this.isSuccess
    },
    alertVariant() {
      switch (this.status) {
        case statuses.Error:
          return 'danger'
        case statuses.Success:
          return 'success'
        case statuses.Busy:
          return 'warning'
        default:
          return ''
      }
    },
  },
  methods: {
    setStatus(status, message) {
      this.status = statuses[status]
      this.alertMessage = message
      this.showAlert = this.shouldShowAlert
    },
  },
}
</script>
