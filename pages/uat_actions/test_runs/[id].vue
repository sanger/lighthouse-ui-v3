<template>
  <b-container>
    <UATActionsRouter />

    <h1 class="mt-3">UAT Actions</h1>

    <AlertDialog id="alert" ref="alert"></AlertDialog>
    <b-card v-if="run.status == 'completed'" title="Test Run">
      <b-row align-v="end">
        <b-col>
          <label for="selectPrinter">Which printer would you like to use?</label>
        </b-col>
        <b-col>
          <b-form-select
            id="selectPrinter"
            v-model="printerSelected"
            :options="printerOptions"
          ></b-form-select>
        </b-col>
        <b-col>
          <b-button
            id="printBarcodesButton"
            variant="primary"
            class="float-right ml-2"
            :disabled="!printerSelected"
            @click="print(barcodesWithText, printerSelected)"
            >Print ALL labels</b-button
          >
        </b-col>
      </b-row>
      <br />

      <b-table striped hover :fields="fields" :items="barcodesWithText" sticky-header="800px">
        <template #cell(actions)="row">
          <b-button
            :id="'print-' + row.item.barcode"
            variant="primary"
            :disabled="!printerSelected"
            @click="print([row.item], printerSelected)"
            >Print</b-button
          >
        </template>
      </b-table>
    </b-card>

    <b-card v-else-if="run.status == 'failed'" title="Test Run">
      <span style="color: red" class="fw-bold">Failure:</span>
      {{ run.failure_reason }}
    </b-card>
  </b-container>
</template>

<script>
import AlertDialog from '@/components/AlertDialog'
import UATActionsRouter from '@/components/UATActionsRouter'

const config = useRuntimeConfig()

export default {
  name: 'TestRun',
  components: {
    AlertDialog,
    UATActionsRouter,
  },
  data() {
    return {
      fields: ['barcode', { key: 'text', label: 'Description' }, 'actions'],
      run: {},
      printerSelected: null,
      printerOptions: [
        { value: null, text: 'Please select a printer' },
        ...config.public.printers.split(','),
      ],
    }
  },
  computed: {
    barcodesWithText() {
      const list = JSON.parse(this.run.barcodes)
      return list.map((item) => {
        return { barcode: item[0], text: item[1] }
      })
    },
  },
  async created() {
    const response = await lighthouseService.getTestRun(this.$route.params.id)
    if (response.success) {
      this.run = response.response
    } else {
      this.showAlert(response.error, 'danger')
    }
  },
  methods: {
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
    async print(labelFields, printer) {
      const response = await sprintGeneralLabels.printLabels({
        labelFields,
        printer,
      })

      if (response.success) {
        this.showAlert(response.message, 'success')
      } else {
        this.showAlert(response.error, 'danger')
      }
    },
  },
}
</script>

<script setup>
definePageMeta({ middleware: 'uat-actions' })
</script>

<style scoped lang="scss"></style>
