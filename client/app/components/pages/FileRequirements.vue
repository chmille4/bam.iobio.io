<style>
#help header {
  font-family: Quicksand;
  font-size: 46px;
}
#help h1,
h2,
h3,
h4 {
  font-family: Muli;
}
#help h1 {
  font-size: 26px;
  font-weight: normal;
}
#help h2 {
  font-size: 24px;
}
#help h3 {
  font-size: 18px;
  margin-top: 40px;
}
#help h4 {
  margin-bottom: 5px;
}
#help body {
  margin: 20px;
  font-family: Open Sans;
  width: 900px;
  font-weight: 300;
}
a:visited {
  color: none;
}
a,
a:hover {
  text-decoration: none;
  color: #2d8fc1;
}
</style>

<template>
  <div id="help">
    <body>
      <header>
        <a href="http://bam.iobio.io"
          >bam<span style="color: rgb(200, 200, 200)">.iobio.io</span
          ><span color>&nbsp;</span></a
        >
      </header>

      <h1>The indexed BAM</h1>

      bam.iobio needs indexed bam files so that it can sample regions from the
      entire file. Follow the instructions below to index your bam file and use
      bam.iobio.

      <h3>Install Bamtools</h3>

      Download and install bamtools using the instructions
      <a
        href="https://github.com/pezmaster31/bamtools/wiki/Building-and-installing"
        >here</a
      >.

      <h3>Indexing your BAM</h3>

      Once you have successfully compiled bamtools, you can index your bam files
      with the following command:
      <pre style="border: none; background: none">
	$ /path/to/bamtools index -in mybam.bam
    </pre
      >
      This commands will create a new file, the index file (.bam.bai). Now you
      are ready to run <a href="../../../../index.html">bam.iobio</a>, selecting
      this file and your bam file when prompted.
      <p></p>
    </body>
  </div>
</template>

<script>
export default {
  name: "help",
  components: {},
  props: [],
  data() {
    return {};
  },
  methods: {},
};
</script>
