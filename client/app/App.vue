<style lang="scss">
@import "~bootstrap/dist/css/bootstrap.css";
@import url("https://fonts.googleapis.com/css?family=Quicksand:300");
@import url("https://fonts.googleapis.com/css?family=Overlock+SC");
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import url("https://fonts.googleapis.com/css?family=Muli");

#main {
  margin-top: 60px;
}

.welcome-modal-body {
  font-size: 18px;
}
</style>

<template>
  <div id="app">
    <app-header></app-header>
    <!--
    <help-modal v-if='showWelcomeModal' @close='modalClosed' modalTitle="Welcome to bam.iobio 2.0!">
      <div class='welcome-modal-body' slot='body'>
        <h3>We've cooked up a bunch of new features for you:</h3>

        <ul>
          <li>Local CRAM support</li>
          <li>Overhauled read coverage chart
            <ul>
              <li>Missing chromosomes grayed out</li>
              <li>Much easier to spot 0-coverage regions</li>
              <li>Much easier to spot copy number variations</li>
              <li>Chromosomes render as the data streams in</li>
              <li>Dotted line for average coverage</li>
              <li>Rough coverage estimate added to Y-axis</li>
            </ul>
          </li>
          <li>Added a Get Help page
            <ul>
              <li>Includes a simple problem submission form</li>
              <li>Temporarily includes a link to the old bam.iobio</li>
            </ul>
          </li>
        </ul>

        <p>
          Check out our
          <a target="_blank" href="http://iobio.io/2019/05/01/bam.iobio-2.0-launch/">blog post</a>
          for more details.
        </p>
      </div>
    </help-modal>
    -->
    <div id="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import AppHeader from "./components/partials/AppHeader.vue";
import HelpModal from "./components/partials/HelpModal.vue";

export default {
  name: "app",

  components: {
    AppHeader,
    HelpModal,
  },

  data() {
    return {
      //showWelcomeModal: false,
    };
  },

  mounted: function () {
    //if (localStorage.getItem('welcomeModalAlreadyShown')) {
    //  this.showWelcomeModal = false;
    //}
    //else {
    //  this.showWelcomeModal = true;
    //}

    if (this.$route.query.reset) {
      window.location.reload(true);
    }
  },

  methods: {
    modalClosed: function () {
      //this.showWelcomeModal = false;
      localStorage.setItem("welcomeModalAlreadyShown", true);
    },
  },
};
</script>
