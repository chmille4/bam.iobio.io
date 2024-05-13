<style type="text/css">
#marth-lab-footer {
  position: relative;
  margin-top: 100px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  font-size: 18px;
  text-align: center;
}
.logos {
  margin: 0px auto 10px auto;
  width: 1200px;
  text-align: center;
  position: relative;
  height: 60px;
  color: rgb(80, 80, 80);
}
a {
  color: rgb(110, 110, 110);
  color: #2d8fc1;
}
#marthlabtext {
  position: absolute;
  left: 100px;
  top: 4px;
  font-size: 50px;
  font-family: "Overlock SC", cursive;
}
</style>

<template>
  <div id="marth-lab-footer">
    <div class="logos">
      <div id="marthlabtext">Marthlab</div>
      <img src="../../../images/ustar-ucgd-logo.jpg" style="height: 60px" />
      <a href="http://www.genetics.utah.edu/">
        <img
          src="../../../images/genetics_mainlogo3_lrg.png"
          style="height: 50px; position: absolute; right: 0px; top: 7px"
        />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "marth-lab-footer",
  data() {
    return {};
  },
  methods: {},
};
</script>
