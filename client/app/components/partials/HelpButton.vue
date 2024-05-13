<style type="text/css">
.glyphicon.glyphicon-info-sign {
  cursor: pointer;
  color: #828282;
}
</style>

<template>
  <span>
    <title
      class="glyphicon glyphicon-info-sign"
      aria-hidden="true"
      id="help_button"
      :title="tooltipText"
      style="vertical-align: text-top"
      @click="showModal = true"
    ></title>
    <help-modal
      v-if="showModal"
      @close="showModal = false"
      :modalTitle="modalTitle"
    >
      <template slot="body">
        <slot name="body"></slot>
      </template>
    </help-modal>
  </span>
</template>

<script>
import HelpModal from "./HelpModal.vue";

export default {
  components: {
    HelpModal,
  },
  name: "help-button",
  props: {
    modalTitle: "",
    body: "",
    tooltipText: "",
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {},
};
</script>
