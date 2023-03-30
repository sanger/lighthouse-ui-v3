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
      status: Status.Idle,
      alertMessage: '',
      showAlert: false,
    }
  },
  computed: {
    isIdle() {
      return this.status === Status.Idle
    },
    isBusy() {
      return this.status === Status.Busy
    },
    isSuccess() {
      return this.status === Status.Success
    },
    isError() {
      return this.status === Status.Error
    },
    shouldShowAlert() {
      return this.isBusy || this.isError || this.isSuccess
    },
    alertVariant() {
      switch (this.status) {
        case Status.Error:
          return 'danger'
        case Status.Success:
          return 'success'
        case Status.Busy:
          return 'warning'
        default:
          return ''
      }
    },
  },
  methods: {
    setStatus(status, message) {
      this.status = Status[status]
      this.alertMessage = message
      this.showAlert = this.shouldShowAlert
    },
  },
}
</script>
