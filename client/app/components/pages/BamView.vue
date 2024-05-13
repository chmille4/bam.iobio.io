<style module lang="scss">
.bootstrap-css {
  @import url("https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css");
  @font-face {
    font-family: "Glyphicons Halflings";
  }
  .glyphicon {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: "Glyphicons Halflings";
    font-style: normal;
    font-weight: normal;
    line-height: 1;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .glyphicon-info-sign:before {
    content: "\e086";
  }
}
</style>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Quicksand:300");

body {
  font-family: Quicksand;
  font-weight: 300;
  width: 100%;
}

.panel > .title {
  font-size: 30px;
}

.file-name {
  margin-bottom: -20px;
  padding: 0px 0px 0px 22px;
  font-size: 20px;
  color: rgb(110, 110, 110);
  margin-top: -16px;
}

.panel {
  margin: 20px;
  padding: 5px;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2pt;
  text-align: center;
}

.panel#piechooser {
  -webkit-flex: 1 1 250px;
  flex: 1 1 250px;
  -webkit-order: 1;
  order: 1;
  height: 100%;
  position: relative;
  width: 250px;
}

section {
  margin: 0px;
  padding: 0px;
  display: -webkit-flex;
  display: flex;
  display: -ms-flexbox;
  -webkit-flex-flow: row;
  flex-flow: row;
}

section#top {
  min-height: 225px;
  height: 250px;
}

section#middle {
  margin-top: 25px;
  min-height: 600px;
}

svg {
  width: 100%;
}

#percents {
  margin-right: 20px;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;
  -webkit-order: 1;
  order: 1;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  flex-flow: row wrap;
  width: 40%;
}

#percents .percent {
  height: 220px;
}

#distributions {
  -webkit-flex: 2 1 auto;
  flex: 2 1 auto;
  -webkit-order: 2;
  order: 2;
  display: -webkit-flex;
  /*                display: flex;*/
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  width: 60%;
}

#distributions .distribution {
  -webkit-flex: 1 1 100%;
  flex: 1 1 100%;
  height: 220px;
  position: relative; /*padding: 0px 15px 0px 15px*/
}

/* Make clicks pass-through */
#nprogress {
  pointer-events: none;
  -webkit-pointer-events: none;
}

#nprogress .bar {
  background: red;

  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;

  width: 100%;
  height: 2px;
}

/* Fancy blur effect */
#nprogress .peg {
  display: block;
  position: absolute;
  right: 0px;
  width: 100px;
  height: 100%;
  box-shadow:
    0 0 10px #29d,
    0 0 5px #29d;
  opacity: 1;

  -webkit-transform: rotate(3deg) translate(0px, -4px);
  -moz-transform: rotate(3deg) translate(0px, -4px);
  -ms-transform: rotate(3deg) translate(0px, -4px);
  -o-transform: rotate(3deg) translate(0px, -4px);
  transform: rotate(3deg) translate(0px, -4px);
}

/* Remove these to get rid of the spinner */
#nprogress .spinner {
  display: block;
  position: fixed;
  z-index: 100;
  top: 15px;
  right: 15px;
}

#nprogress .spinner-icon {
  width: 14px;
  height: 14px;

  border: solid 2px transparent;
  border-top-color: #fff;
  border-left-color: #fff;
  border-radius: 10px;

  -webkit-animation: nprogress-spinner 400ms linear infinite;
  -moz-animation: nprogress-spinner 400ms linear infinite;
  -ms-animation: nprogress-spinner 400ms linear infinite;
  -o-animation: nprogress-spinner 400ms linear infinite;
  animation: nprogress-spinner 400ms linear infinite;
}

.iobio-multi-line.line-panel text {
  fill: black;
}
.iobio-multi-line.button-panel text {
  fill: white;
}
.iobio-multi-line #iobio-button-all {
  display: none;
}
.iobio-axis line,
.iobio-axis path {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}
.iobio-tooltip {
  position: fixed;
  top: 0;
  text-align: center;
  z-index: 20;
  color: #fff;
  padding: 4px 6px;
  font: 11px arial;
  background: #505050;
  border: 0;
  border-radius: 4px;
  pointer-events: none;
}
.iobio-brush .extent {
  stroke: #000;
  fill-opacity: 0.125;
  shape-rendering: crispEdges;
}
.iobio-gene .cds,
.iobio-gene .utr {
  fill: #2d8fc1;
  stroke: #2d8fc1;
}
.iobio-gene .reference {
  stroke: #969696;
}
.iobio-gene .name {
  font-size: 10px;
  fill: #787878;
}
.iobio-gene .arrow {
  stroke: #969696;
  fill: none;
}
.iobio-gene .iobio-axis line,
.iobio-gene .iobio-axis path {
  fill: none;
  stroke: #d2d2d2;
  stroke-width: 2px;
  shape-rendering: crispEdges;
}
.iobio-gene .iobio-axis line {
  stroke-width: 4px;
}
.iobio-gene .iobio-axis text {
  font-size: 11px;
  fill: #828282;
}
.iobio-multi-line #back-ctrl:hover,
.iobio-multi-line .button rect:hover {
  cursor: pointer;
}
.iobio-multi-line .tick text {
  font-size: 10px;
}
.iobio-multi-line .button rect {
  height: 20px;
}
.iobio-multi-line .button text {
  font-size: 10px;
  pointer-events: none;
}
.iobio-multi-line #back-ctrl {
  font-size: 15px;
  fill: #1e7db3;
}
path.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 1.5px;
}
.above-variant {
  stroke: red;
  fill: none;
}
.below-variant {
  stroke: #00f;
  fill: none;
}
.reference {
  fill: gray;
}

.samplingLoader {
  font-size: 14px;
  color: #2687be;
  position: absolute;
  width: 100%;
  margin-top: 70px;
  margin-left: -6px;
  display: none;
}
.samplingLoader img {
  height: 9px;
}

.chart-chooser {
  /*                font-size: 16px;*/
  color: rgb(180, 180, 180);
  font-weight: 400;
  /*                text-align: right;*/
}

.chart-chooser .selected {
  color: #2d8fc1;
  border-bottom: 1px solid #2d8fc1;
}
.chart-chooser span {
  margin: 0px 5px 0px 5px;
  padding-bottom: 1px;
  cursor: pointer;
}

.checkbox {
  cursor: pointer;
  padding-left: 18px;
}
.checkbox:checked,
.checkbox.checked .icons {
  color: #267fad;
}

@-webkit-keyframes nprogress-spinner {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-moz-keyframes nprogress-spinner {
  0% {
    -moz-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -moz-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-o-keyframes nprogress-spinner {
  0% {
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-ms-keyframes nprogress-spinner {
  0% {
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes nprogress-spinner {
  0% {
    transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div class="$style.bootstrap-css">
    <div class="file-name">
      <span v-show="selectedBamURL != undefined" v-html="pathToFilename">
      </span>
    </div>

    <section id="top">
      <div id="piechooser" class="panel" style="padding-top: 12px">
        <select @change="seqSelected" id="reference-select">
          <option value="all">all</option>
        </select>
        <pie-chooser-chart
          :data="references"
          :selectedId="selectedSeqId"
          @setSelectedId="setSelectedSeq"
        />
      </div>

      <read-coverage-box
        @removeBedFile="removeBedFile"
        @processBedFile="openBedFile"
        @addH37BedFile="addH37BedFile"
        @addH38BedFile="addH38BedFile"
        @setSelectedSeq="setSelectedSeq"
        :selectedSeqId="selectedSeqId"
        :draw="draw"
        :chartData="readDepthChartData"
        :conversionRatio="readDepthConversionRatio"
        :averageCoverage="coverageMean"
        :brushRange="coverageBrushRange"
        v-tooltip.top-center="{
          content: clinTooltip.genome_wide_coverage.content,
          show: clinTooltip.genome_wide_coverage.show,
          trigger: 'manual',
        }"
      >
      </read-coverage-box>

      <reads-sampled-box
        @sampleMore="sampleMore"
        :totalReads="totalReads"
      ></reads-sampled-box>
    </section>

    <section id="middle">
      <div id="percents">
        <percent-chart-box
          id="mapped_reads"
          title="Mapped Reads"
          modal-title="Mapped reads"
          help-tooltip="Expect a value >90%"
          :chart-data="mappedReadsData"
          index-footnote="* full data available in index"
          v-tooltip.top-center="{
            content: clinTooltip.mapped_reads.content,
            show: clinTooltip.mapped_reads.show,
            trigger: 'manual',
          }"
        >
          <div slot="body">
            <div>
              The mapped reads chart shows how many of the reads in the sample
              were successfully mapped to the reference genome. Genetic
              variation, in particular structural variants, ensure that every
              sequenced sample is genetically different to the reference genome
              it was aligned to. If the sample differs only in a small number of
              single base pair changes (e.g. SNVs), the read will still likely
              map to the reference, but, for more significant variation, the
              read can fail to be placed. Therefore, it is not expected that the
              mapped reads rate will hit 100%, but it is expected to be high
              (usually >90%).
            </div>
            <div class="row vertical-align">
              <div class="col-xs-4">
                <img
                  title="Acceptable mapped reads rate"
                  style="width: 100%"
                  src="../../../images/mapped_reads_high.png"
                />
              </div>
              <div class="col-xs-8">
                This is an example of a human, whole exome. In this case, 99.7%
                of the sampled reads map to the reference, corresponding to
                93,385 actual reads. It is important to note that when the wheel
                is blue, only reads that have been assigned to a reference
                sequence are included. This means that the 0.3% of reads that
                are unmapped have a mate pair that successfully maps to the
                reference genome.
              </div>
            </div>

            <div class="row vertical-align">
              <div class="col-xs-4">
                <img
                  title="Acceptable mapped reads rate"
                  style="width: 100%"
                  src="../../../images/mapped_reads_high_green.png"
                />
              </div>
              <div class="col-xs-8">
                For the case that both mates from paired end sequencing are
                unmapped, they appear at the end of the BAM file. Usually, the
                number of such unmapped reads can be obtained from the index
                file. When this is possible, the wheel will appear in green, as
                shown for this whole genome sample.
              </div>
            </div>

            <div class="row vertical-align">
              <div class="col-xs-4">
                <img
                  title="Acceptable mapped reads rate"
                  style="width: 100%"
                  src="../../../images/mapped_reads_low.png"
                />
              </div>
              <div class="col-xs-8">
                If the rate of mapped reads is low (usually below 90%),
                questions need to be asked about the sample to understand why so
                many reads are unmapped. The last example only has 71.5% of
                reads mapping to the reference genome for a whole genome sample.
                This was caused as the sample was contaminated with a
                significant amount of bacterial DNA; the DNA sample was obtained
                from a saliva sample, rather than a blood draw.
              </div>
            </div>
          </div>
        </percent-chart-box>

        <percent-chart-box
          id="forward_strands"
          title="Forward Strand"
          modal-title="Forward strand"
          help-tooltip="Expect a value ~50%"
          :chart-data="forwardStrandsData"
        >
          <div slot="body">
            <div>
              The forward strand chart shows the fraction of reads that map to
              the forward DNA strand. The general expectation is that the DNA
              library preparation step will generate DNA from the forward and
              reverse strands in equal amounts. After mapping the reads to the
              reference genome, approximately 50% of the reads will consequently
              map to the forward strand. If the observed rate is significantly
              different to 50%, this may be indicative of problems with the
              library preparation step.
            </div>
          </div>
        </percent-chart-box>

        <percent-chart-box
          id="proper_pairs"
          title="Proper Pairs"
          modal-title="Proper pairs"
          help-tooltip="Expect a value >90%"
          :chart-data="properPairsData"
        >
          <div slot="body">
            <div>
              A fragment consisting of two <i>mates</i> is called a proper pair
              if both <i>mates</i> map to the reference genome in a manner
              consistent with expectations. In particular, if the DNA library
              consists of fragments ~500 base pairs in length, and 100 base pair
              reads are sequenced from either end, the expectation would be that
              the two reads map to the reference genome separated by ~300 base
              pairs. If the sequenced sample contains large structural variants,
              e.g. a large insertion, reads mapping with a large separation
              would be a signal for this variant, and the reads would not be
              proper pairs. Based on the sequencing technology, there is also an
              expectation on the orientation of each read in the fragment.
            </div>
            <br />
            <div>
              <i
                ><strong
                  >When calculating the proper pair rate, pairs where both mates
                  are unmapped are not included in the analysis.</strong
                ></i
              >
              As a consequence, the rate of proper pairs is expected to be well
              over 90%; even if the mapping rate itself is low as a result of
              bacterial contamination, for example.
            </div>
          </div>
        </percent-chart-box>

        <percent-chart-box
          id="singletons"
          title="Singletons"
          modal-title="Singletons"
          help-tooltip="Expect a value <1%"
          :chart-data="singletonsData"
        >
          <div slot="body">
            <div>
              When working with paired-end sequencing, each DNA fragment is
              sequenced from both ends, creating two <i>mates</i> for each pair.
              If one <i>mate</i> in the pair successfully maps to the reference
              genome, but the other is unmapped, the mapped mate is a
              <i>singleton</i>. One way in which a singleton could occur would
              be if the sample has a large insertion compared with the reference
              genome; one <i>mate</i> can fall in sequence flanking the
              insertion and will be mapped, but the other falls in the inserted
              sequence and so cannot map to the reference genome. There are
              unlikely to many such structural variants in the sample, or
              sequencing errors that would could cause a read to not be able to
              map. Consequently, the singleton rate is expected to be very low
              (<1%).
            </div>
          </div>
        </percent-chart-box>

        <percent-chart-box
          id="both_mates_mapped"
          title="Both Mates Mapped"
          modal-title="Both mates mapped"
          help-tooltip="Expect a value >90%"
          :chart-data="bothMatesData"
        >
          <div slot="body">
            <div>
              When working with paired-end sequencing, each DNA fragment is
              sequenced from both ends, creating two <i>mates</i> for each pair.
              This chart shows the fraction of reads in pairs where both of the
              <i>mates</i> successfully map to the reference genome.
              <i
                ><strong
                  >When calculating this metric, pairs where both mates are
                  unmapped are not included.</strong
                ></i
              >.
            </div>
          </div>
        </percent-chart-box>

        <percent-chart-box
          id="duplicates"
          title="Duplicates"
          modal-title="Duplicates"
          help-tooltip="Value depends on depth"
          :chart-data="duplicatesData"
          v-tooltip.top-center="{
            content: clinTooltip.duplicate_rate.content,
            show: clinTooltip.duplicate_rate.show,
            trigger: 'manual',
          }"
        >
          <div slot="body">
            <div>
              PCR duplicates are two (or more) reads that originate from the
              same DNA fragment. When sequencing data is analysed, it is assumed
              that each observation (i.e. each read) is independent; an
              assumption that fails in the presence of duplicate reads.
              Typically, algorithms look for reads that map to the same genomic
              coordinate, and whose mates also map to identical genomic
              coordinates. It is important to note that as the sequencing depth
              increases, more reads are sampled from the DNA library, and
              consequently it is increasingly likely that duplicate reads will
              be sampled. As a result, the true duplicate rate is not
              independent of the depth, and they should both be considered when
              looking at the duplicate rate. Additionally, as the sequencing
              depth in increases, it is also increasingly likely that reads will
              map to the same location and be marked as duplicates, even when
              they are not. As such, as the sequencing depth approaches and
              surpasses the read length, the duplicate rate starts to become
              less indicative of problems.
            </div>
            <div class="row vertical-align">
              <div class="col-xs-4">
                <img
                  title="Acceptable duplicate rate"
                  style="width: 100%; padding-bottom: 15px"
                  src="../../../images/dup_good.png"
                />
              </div>
              <div class="col-xs-8">
                This is an example of the duplicate rate for a ~80X human whole
                genome. The expectation is that the duplicate rate is low (well
                below 10%), and consequently, this sample would be considered
                good.
              </div>
            </div>

            <div class="row vertical-align">
              <div class="col-xs-4">
                <img
                  title="Acceptable duplicate rate"
                  style="width: 100%; padding-bottom: 15px"
                  src="../../../images/dup_good_low_cov.png"
                />
              </div>
              <div class="col-xs-8">
                If the median coverage drops to ~50X, the duplicate rate should
                be even lower.
              </div>
            </div>

            <div class="row vertical-align">
              <div class="col-xs-4">
                <img
                  title="Potentially problematic duplicate rate"
                  style="width: 100%"
                  src="../../../images/dup_bad.png"
                />
              </div>
              <div class="col-xs-8">
                This is a different sample with ~50X coverage, but now the
                duplicate rate is much higher. This sample could well have
                problems at the library prep stage and should potentially be
                resequenced.
              </div>
            </div>
          </div>
        </percent-chart-box>
      </div>

      <div id="distributions">
        <div
          id="read-coverage-distribution"
          class="distribution panel"
          v-tooltip.top-center="{
            content: clinTooltip.median_coverage.content,
            show: clinTooltip.median_coverage.show,
            trigger: 'manual',
          }"
        >
          Read Coverage Distribution
          <help-button
            modalTitle="Read Coverage Distribution"
            tooltipText="Expect a Poisson distribution centered on the expected mean coverage"
          >
            <div slot="body">
              <div>
                This chart shows how read coverage is distributed, and the
                expected distribution is dependent on the type of sequencing
                data being visualized.
              </div>
              <br />
              <div>
                <strong><i>Whole genome sequencing</i></strong>
              </div>
              <div>
                In a whole genome sequencing experiment, the expectation is that
                the read coverage follows a Poisson distribution centred about
                the requested sequencing depth. The following example shows a
                high quality read coverage distribution for a sample sequenced
                to ~50X coverage. The distribution shows a nice Poisson
                distribution, and is centred around ~53X. (Note that the second
                scale at the bottom of the chart can be used to zoom in on
                desired parts of the distribution).
                <img
                  title="A good read coverage distribution"
                  style="width: 100%; padding-top: 15px; padding-bottom: 20px"
                  src="../../../images/read_coverage_dist_zoomed.png"
                />
                Alternatively, if the distribution shows multiple peaks, isn't
                Poisson distributed, or is not centred around the expected
                coverage, it may be necessary to consider resequencing the
                sample, or at least, being aware that problems may arise in
                analysing the data. While the following distribution shows a
                median coverage around that expected (~80X), but with a
                significant portion of the genome at zero coverage and the
                multiple peaks, this would not be considered a good sample.
                <img
                  title="A bad read coverage distribution"
                  style="width: 100%; padding-top: 15px; padding-bottom: 20px"
                  src="../../../images/read_coverage_dist_bad.png"
                />
              </div>
              <br />
              <div>
                <strong><i>Whole exome sequencing</i></strong>
              </div>
              <div>
                Exome sequencing relies on the targetted capture of DNA from the
                exome, followed by DNA amplification. This leads to large
                variation in the sequencing depth across exons, and
                consequently, the read coverage distribution is no longer
                expected to be Poisson distributed. When sampling across the
                entire genome, the majority of genomic regions will contain no
                sequencing reads as will are not exonic regions. This leads to a
                read coverage distribution overwhelmingly weighted to zero
                coverage as shown below.
                <img
                  title="Exome sequencing"
                  style="width: 100%; padding-top: 15px; padding-bottom: 20px"
                  src="../../../images/read_coverage_dist_exome.png"
                />
                To restrict sampling to exonic regions, select the default bed
                file in the top 'Read Coverage' chart. It is also possible to
                select a custom bed file, if available. After selecting the
                default bed, the distribution above is updated to as shown
                below.
                <img
                  title="Exome sequencing using default bed"
                  style="width: 100%; padding-top: 15px; padding-bottom: 20px"
                  src="../../../images/read_coverage_dist_exome_bed.png"
                />
                This does not have a Poisson distribution and shows the wide
                distribution of coverage in the exonic regions. The sequenced
                depth appears to be centred around ~50X, so if this is
                consistent with the requested depth, this sample would be
                considered good.
              </div>
            </div>
          </help-button>
          <div class="samplingLoader">
            Sampling <img src="../../../images/loading_dots.gif" />
          </div>
          <stacked-histogram
            :data="readCoverageData"
            :y-tick-formatter="
              function (d) {
                return d * 100 + '%';
              }
            "
            :x-tick-formatter="
              function (d) {
                return d + 'X';
              }
            "
            :tooltip-formatter="readCoverageTooltipFormatter"
            x-axis-label="Read Coverage"
            y-axis-label="% Total Reads"
          >
          </stacked-histogram>
        </div>

        <div id="length-distribution" class="distribution panel">
          <div>
            <help-button
              modalTitle="Fragment length distribution"
              tooltipText="Expect a normal distribution"
            >
              <div slot="body">
                <div>
                  For paired end sequencing, DNA fragments are typically size
                  selected to a uniform length and then sequenced from either
                  end. Once the two mates are aligned back to the reference
                  genome, the fragment length can be inferred from how far apart
                  these two mates map. If the sequenced sample has a deletion or
                  insertion relative to the reference, this will result in the
                  two mates mapping closer together, or further apart than
                  expected. Under the assumption that the sequenced sample has a
                  relatively small number of insertions and deletions, we expect
                  to see the fragment length follow a normal distribution.
                </div>
                <br />
                <div>
                  <strong><i>Whole genome sequencing</i></strong>
                </div>
                <div>
                  This is an example of the fragment length distribution for a
                  high coverage (~80X) whole genome. The read lengths in this
                  sample are 150bp, so a fragment can not be shorter than this
                  value, consequently, we see a sharp cutoff at a fragment
                  length of 150bp.
                </div>
                <div>
                  <img
                    title="WGS sequencing"
                    style="width: 100%; padding-top: 15px; padding-bottom: 20px"
                    src="../../../images/fragment_wgs.png"
                  />
                </div>
                <br />
                <div>
                  <strong><i>Whole exome sequencing</i></strong>
                </div>
                <div>
                  Similarly, this is the fragment length distribution for a high
                  coverage exome.
                </div>
                <div>
                  <img
                    title="Exome sequencing"
                    style="width: 100%; padding-top: 15px; padding-bottom: 20px"
                    src="../../../images/fragment_exome.png"
                  />
                </div>
              </div>
            </help-button>
            <span class="chart-chooser">
              <span
                class="selected"
                @click="toggleChart('lengthData')"
                :datafield="lengthData"
                data-outlier="false"
                data-id="frag_hist"
                x-axis-label="Fragment Length"
                >Fragment Length</span
              >
              |
              <span
                @click="toggleChart('lengthData')"
                :datafield="lengthData"
                data-id="length_hist"
                x-axis-label="Read Length"
                data-outlier="true"
                >Read Length</span
              >
            </span>
            <help-button
              modalTitle="Read length distribution"
              tooltipText="Expect an extremely narrow distribution"
            >
              <div slot="body">
                <div>
                  The read length is usually a very simple distribution. In most
                  cases, the read length is fixed at a uniform length, e.g. 100
                  base pairs, or 150 base pairs etc. The read length
                  distribution, therefore, tends to be a single spike at this
                  read length. Depending on the sequencing technology used, this
                  may not always be the case.
                </div>
              </div>
            </help-button>
          </div>
          <label
            class="checkbox"
            style="position: absolute; right: 10px; top: 24px; font-weight: 300"
          >
            <input type="checkbox" v-model="readOutliers" class="outlier" />
            Outliers
          </label>
          <div class="samplingLoader">
            Sampling <img src="../../../images/loading_dots.gif" />
          </div>
          <stacked-histogram
            :data="lengthData"
            :x-axis-label="lengthXAxisLabel"
            y-axis-label="Reads"
          >
          </stacked-histogram>
        </div>

        <div id="mapping-quality-distribution" class="distribution panel">
          <div>
            <help-button
              modalTitle="Mapping quality distribution"
              tooltipText="Expect distribution weighted to high values (~60)"
            >
              <div slot="body">
                <div>
                  The mapping quality distribution shows the Phred quality
                  scores describing the probability that a read
                  <i>does not</i> map to the location that it has been assigned
                  to (specifically, Q=-log<sub>10</sub>(P), where Q is the Phred
                  score and P is the probability the read is in the wrong
                  location). So the larger the score, the higher the quality of
                  the mapping. Some scores have specific meaning, e.g. a score
                  of 0 means that the read could map equally to multiple places
                  in the reference genome. The majority of reads should be well
                  mapped and so we expect to see this distribution heavily
                  skewed to large value (typically around 60). It is not unusual
                  to see some scores around zero. Reads originating from
                  repetitive elements in the genome will plausibly map to
                  multiple locations.
                </div>
              </div>
            </help-button>
            <span class="chart-chooser">
              <span
                @click="toggleChart('qualityData')"
                data-id="mapq_hist"
                x-axis-label="Mapping Quality"
                class="selected"
                >Mapping Quality</span
              >
              |
              <span
                data-id="baseq_hist"
                @click="toggleChart('qualityData')"
                x-axis-label="Base Quality"
                >Base Quality</span
              >
            </span>
            <help-button
              modalTitle="Base quality distribution"
              tooltipText="Expect most values >40"
            >
              <div slot="body">
                <div>
                  Similar to the mapping quality distribution, the base quality
                  distribution shows the Phred quality scores describing the
                  probability that a nucleotide has been
                  <i>incorrectly</i> assigned; e.g. an error in the sequencing.
                  Specifically, Q=-log<sub>10</sub>(P), where Q is the Phred
                  score and P is the probability the nucleotide is wrong. The
                  larger the score, the more confident we are in the base call.
                  Depending on the sequencing technology, we can expect to see
                  different distributions, but we expect to see a distribution
                  skewed towards larger (more confident) scores; typically
                  around 40.
                </div>
              </div>
            </help-button>
          </div>
          <div class="samplingLoader">
            Sampling <img src="../../../images/loading_dots.gif" />
          </div>
          <stacked-histogram
            :data="qualityData"
            :x-axis-label="qualityXAxisLabel"
            y-axis-label="Frequency"
          >
          </stacked-histogram>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ReadsSampledBox from "../partials/ReadsSampledBox.vue";
import HelpButton from "../partials/HelpButton.vue";
import ReadCoverageBox from "../partials/ReadCoverageBox.vue";

import PieChooserChart from "../viz/PieChooserChart.vue";

import DonutChart from "../viz/DonutChart.vue";
import PercentChartBox from "../partials/PercentChartBox.vue";
import StackedHistogram from "../viz/StackedHistogram.vue";

import Vue from "vue";

import { Bam } from "../../../js/bam.iobio.js/bam.iobio.js";

export default {
  name: "bam-view",

  components: {
    StackedHistogram,
    PercentChartBox,
    DonutChart,
    PieChooserChart,
    ReadCoverageBox,
    HelpButton,
    ReadsSampledBox,
  },

  props: {
    selectedBamURL: "",
    selectedBaiURL: "",
    region: null,
    sampling: "",
    backendUrl: String,
  },

  data() {
    return {
      showFullURL: false,

      // default sampling values
      binNumber: 20,
      binSize: 40000,
      sampleMultiplier: 1,
      sampleMultiplierLimit: 4,
      totalReads: 0,

      exomeSampling: false,
      draw: false,

      sampleStats: {},

      readDepthConversionRatio: 0,

      bam: {},
      bed: {},

      readDepthChartData: [],
      references: [],

      selectedSeqId: "all",
      coverageBrushRange: {},

      // Percent Chart Data
      mappedReadsData: [],
      forwardStrandsData: [],
      properPairsData: [],
      singletonsData: [],
      bothMatesData: [],
      duplicatesData: [],

      // Histogram Chart Data
      readOutliers: false,
      readCoverageData: [],
      lengthData: [],
      qualityData: [],

      lengthXAxisLabel: "Fragment Length",
      qualityXAxisLabel: "Mapping Quality",

      clinIobioUrls: ["http://localhost:4030", "http://clin.iobio.io"],
      clinIobioUrl: null,

      clinTooltip: {
        genome_wide_coverage: { show: false, content: "" },
        median_coverage: { show: false, content: "" },
        mapped_reads: { show: false, content: "" },
        duplicate_rate: { show: false, content: "" },
      },

      // this is used to achieve a "natural sort". see
      // https://stackoverflow.com/a/38641281/943814
      sorter: new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      }),

      coverageMean: 0,
    };
  },

  methods: {
    goSampling: function (options) {
      // add default options
      options = $.extend(
        {
          exomeSampling: this.exomeSampling, //'checked' == $("#depth-distribution input").attr("checked"),
          bed: this.bed,
          onEnd: function () {
            NProgress.done();
          },
        },
        options,
      );

      // turn on sampling message and off svg
      $("section#middle svg").css("display", "none");
      $(".iobio-bar-1.iobio-barViewer").css("display", "none");
      $(".samplingLoader").css("display", "block");

      this.totalReads = 0;

      NProgress.start();
      NProgress.set(0);

      // update selected stats
      this.bam.sampleStats(
        function (data, error) {
          // turn off sampling message
          $(".samplingLoader").css("display", "none");
          $(".iobio-bar-1").css("display", "block");
          $("section#middle svg").css("display", "block");

          if (error != undefined && error != "") {
            alert(error);
            NProgress.done();
          } else {
            this.sampleStats = data;
            let freqs = 0;
            let coverageMean = 0;
            for (const coverage in data.coverage_hist) {
              const freq = data.coverage_hist[coverage];
              coverageMean += coverage * freq;
            }
            this.coverageMean = Math.floor(coverageMean);

            // update progress bar
            if (options.start != null && options.end != null) {
              var length = options.end - options.start;
              var percentDone = Math.max(
                Math.round(
                  ((this.sampleStats.last_read_position - options.start) /
                    length) *
                    100,
                ) / 100,
                0,
              );
            } else {
              var length = this.bam.header.sq.reduce(function (prev, curr) {
                if (prev) return prev;
                if (curr.name == options.sequenceNames[0]) return curr;
              }, false).end;
              var percentDone =
                Math.round(
                  (this.sampleStats.last_read_position / length) * 100,
                ) / 100;
            }

            if (NProgress.status < percentDone) NProgress.set(percentDone);

            // update charts
            this.updatePercentCharts();
            this.totalReads = this.sampleStats.total_reads;
            this.updateHistogramCharts(undefined, "sampleBar");
          }
        }.bind(this),
        options,
      );
    },

    updatePercentCharts: function () {
      var unmappedReads, mappedReads;
      var stats = this.sampleStats;

      if (this.selectedSeqId == "all") {
        if (
          this.bam.readDepth[Object.keys(this.bam.readDepth)[0]].depths
            .mapped != undefined
        ) {
          mappedReads = unmappedReads = 0;
          for (var id in this.bam.readDepth) {
            mappedReads += this.bam.readDepth[id].depths.mapped;
            unmappedReads += this.bam.readDepth[id].depths.unmapped;
          }
          unmappedReads = this.bam.n_no_coor;
        }
      } else {
        if (this.bam.readDepth[this.selectedSeqId] === undefined) {
          return;
        }
        mappedReads = this.bam.readDepth[this.selectedSeqId].depths.mapped;
        unmappedReads = this.bam.readDepth[this.selectedSeqId].depths.unmapped;
      }

      var showMappedDataFromIndex = false;
      // TODO: Deal with brush
      var brushRange = undefined; // window.readDepthChart.brush().extent();
      if (
        (brushRange == undefined || brushRange.toString() == "0,0") &&
        mappedReads != undefined &&
        unmappedReads != undefined
      ) {
        showMappedDataFromIndex = true;
        d3.select("#mapped_reads")
          .selectAll("path")
          .attr("fill", function (d, i) {
            return i == 0 ? "rgb(9,176,135)" : "rgba(9,176,135,0.5)";
          });
        d3.select(".percent .from-index").style("visibility", "visible");
      } else {
        d3.select(".percent .from-index").style("visibility", "hidden");
      }

      //update percent charts
      var keys = [
        "mapped_reads",
        "proper_pairs",
        "forward_strands",
        "singletons",
        "both_mates_mapped",
        "duplicates",
      ];

      keys.forEach(
        function (key, i) {
          var stat = stats[key];
          if (key == "mapped_reads" && showMappedDataFromIndex) {
            var data = [mappedReads, unmappedReads];
          } else {
            if (stats["total_reads"] == 0) var data = [0, 100];
            else var data = [stat, stats["total_reads"] - stat];
          }
          if (key == "mapped_reads") {
            this.mappedReadsData = data;
          } else if (key == "forward_strands") {
            this.forwardStrandsData = data;
          } else if (key == "proper_pairs") {
            this.properPairsData = data;
          } else if (key == "singletons") {
            this.singletonsData = data;
          } else if (key == "both_mates_mapped") {
            this.bothMatesData = data;
          } else if (key == "duplicates") {
            this.duplicatesData = data;
          }
        }.bind(this),
      );
    },

    updateHistogramCharts: function (otherMinMax, klass) {
      var histograms = this.sampleStats;

      // check if coverage is zero
      if (Object.keys(histograms.coverage_hist).length == 0)
        histograms.coverage_hist[0] = "1.0";

      // update read coverage histogram
      var d = Object.keys(histograms.coverage_hist)
        .filter(function (i) {
          return histograms.coverage_hist[i] != "0";
        })
        .map(function (k) {
          return [+k, +histograms.coverage_hist[k]];
        });
      this.readCoverageData = d;

      // update length histograms
      this.updateLengthHistograms();

      // update map quality distribution
      if (
        $("#mapping-quality-distribution .selected").attr("data-id") ==
        "mapq_hist"
      )
        var d = Object.keys(histograms.mapq_hist).map(function (k) {
          return [+k, +histograms.mapq_hist[k]];
        });
      else
        var d = Object.keys(histograms.baseq_hist).map(function (k) {
          return [+k, +histograms.baseq_hist[k]];
        });
      this.qualityData = d;
    },

    toggleChart: function (chartData) {
      var elem = event.target;

      if ($(elem).hasClass("selected")) return;

      // toggle selected
      var pair = [elem, $(elem).siblings()[0]];
      $(pair).toggleClass("selected");

      // redraw chart
      var dataId = elem.getAttribute("data-id");

      var h = this.sampleStats[dataId];
      var d = Object.keys(h).map(function (k) {
        return [+k, +h[k]];
      });
      var chartDiv = $(elem).parent().parent().parent();

      if (chartDiv.find(".selected").attr("data-id") == "frag_hist") {
        if (!this.readOutliers) d = iobio.viz.layout.outlier()(d);
      }

      var axisTitle = elem.getAttribute("x-axis-label");
      if (chartData == "lengthData") {
        this.lengthXAxisLabel = axisTitle;
      } else if (chartData == "qualityData") {
        this.qualityXAxisLabel = axisTitle;
      }

      this[chartData] = d;
    },

    updateLengthHistograms: function () {
      var histograms = this.sampleStats;

      if ($("#length-distribution .selected").attr("data-id") == "frag_hist")
        var d = Object.keys(histograms.frag_hist)
          .filter(function (i) {
            return histograms.frag_hist[i] != "0";
          })
          .map(function (k) {
            return [+k, +histograms.frag_hist[k]];
          });
      else
        var d = Object.keys(histograms.length_hist).map(function (k) {
          return [+k, +histograms.length_hist[k]];
        });

      // remove outliers if outliers checkbox isn't explicity checked
      if (!this.readOutliers) d = iobio.viz.layout.outlier()(d);
      this.lengthData = d;
    },

    sampleMore: function () {
      if (this.sampleMultiplier >= this.sampleMultiplierLimit) {
        alert("You've reached the sampling limit");
        return;
      }
      this.sampleMultiplier += 1;
      var options = {
        sampling: this.sampling,
        sequenceNames: this.getSelectedSeqIds(),
        binNumber:
          this.binNumber +
          parseInt((this.binNumber / 4) * this.sampleMultiplier),
        binSize:
          this.binSize + parseInt((this.binSize / 4) * this.sampleMultiplier),
      };
      if (
        this.coverageBrushRange &&
        !(
          this.coverageBrushRange.start == 0 && this.coverageBrushRange.end == 0
        )
      ) {
        options.start = this.coverageBrushRange.start;
        options.end = this.coverageBrushRange.end;
      }
      this.goSampling(options);
    },

    getSelectedSeqIds: function () {
      if (this.selectedSeqId == "all") {
        return Object.keys(this.bam.readDepth).filter(
          function (key) {
            const validRef =
              -1 < this.references.findIndex((r) => key === r.id);

            if (validRef && this.bam.readDepth[key].depths.length > 0) {
              return true;
            }

            return false;
          }.bind(this),
        );
      } else return [this.selectedSeqId];
    },

    seqSelected: function (event) {
      this.setSelectedSeq(event.target.value);
    },

    setSelectedSeq: function (selected, start, end) {
      this.selectedSeqId = selected;

      var seqDataIds = this.getSelectedSeqIds();

      $("#reference-select").val(this.selectedSeqId);

      // reset brush
      this.resetBrush();
      this.$emit("region-change", { chr: selected, start, end });

      // start sampling
      if (start != undefined && end != undefined) {
        this.goSampling({
          sampling: this.sampling,
          sequenceNames: seqDataIds,
          start: start,
          end: end,
        });
        this.draw = false; // force re-draw so brush region is set correctly
        setTimeout(
          function () {
            this.setBrush(start, end);
            this.draw = true;
          }.bind(this),
          200,
        );
      } else {
        this.goSampling({ sampling: this.sampling, sequenceNames: seqDataIds });
      }
    },

    removeBedFile: function () {
      this.bed = undefined;
      this.goSampling({
        sampling: this.sampling,
        sequenceNames: this.getSelectedSeqIds(),
      });
    },

    addH37BedFile: function () {
      this.addDefaultBedFile("/data/20130108.exome.targets.bed");
    },

    addH38BedFile: function () {
      this.addDefaultBedFile("/data/20130108.exome.targets.grch38.bed");
    },

    addDefaultBedFile: function (bedPath) {
      // clear brush on read coverage chart
      this.resetBrush();

      // turn on sampling message and off svg
      // turn it on here b\c the bed file is so big it takes a while to download
      $("section#middle svg").css("display", "none");
      $(".iobio-bar-1").css("display", "none");
      $(".samplingLoader").css("display", "block");

      fetch(bedPath)
        .then((response) => response.text())
        .then((bed) => {
          const defaultBed = bed.replace(/chr/g, "");
          this.bed = defaultBed;
          this.goSampling({
            sampling: this.sampling,
            sequenceNames: this.getSelectedSeqIds(),
          });
        });
    },

    openBedFile: function (file) {
      // clear brush on read coverage chart
      this.resetBrush();

      // read bed file and store
      var reader = new FileReader();
      reader.onload = function (e) {
        let bedText = e.target.result;
        bedText = bedText.replace(/chr/g, "");
        this.bed = bedText;
        this.goSampling({
          sampling: this.sampling,
          sequenceNames: this.getSelectedSeqIds(),
        });
      }.bind(this);
      reader.readAsText(file);
    },

    goBam: function (region) {
      $("#selectData").css("display", "none");
      $("#showData").css("visibility", "visible");

      let refIndex = 0;

      // get read depth
      this.bam.estimateBaiReadDepth(
        (name, index, ref) => {
          // turn off read depth loading msg
          $("#readDepthLoadingMsg").css("display", "none");

          if (ref.depths.length > 1000) {
            // Have to use Object.freeze here to prevent Vue from
            // recursively setting up data listeners, which causes huge
            // performance issues with data this big.
            this.readDepthChartData.push({
              refName: name,
              sqLength: ref.sqLength,
              depths: Object.freeze(ref.depths),
            });

            this.readDepthChartData.sort((a, b) => {
              return this.sorter.compare(a.refName, b.refName);
            });

            this.references = this.readDepthChartData.map((d) => ({
              id: d.refName,
              length: d.sqLength,
            }));

            if (!this.draw) {
              this.draw = true;
            }
          }
        },
        function doneCallback() {
          const keys = Object.keys(this.bam.readDepth);

          if (keys.length == 1) {
            // turn on sampling message
            $(".samplingLoader").css("display", "block");
          }

          keys.forEach(function (id) {
            $("#reference-select").append(
              $("<option></option>").attr("value", id).text(id),
            );
          });

          var start = region ? region.start : undefined;
          var end = region ? region.end : undefined;

          this.bam.getHeader().then(() => {
            // Set selected seq & region
            if (!region || (region && region.chr == "all"))
              this.setSelectedSeq("all", start, end);
            else this.setSelectedSeq(region.chr, start, end);
          });
        }.bind(this),
        (err) => {
          this.$emit("error");
        },
      );
    },

    sortReferenceSelect: function () {
      var options = $("#reference-select option")
        .filter(function (_, o) {
          return o.value != "all";
        })
        .detach();
      var values = options
        .map(function (_, o) {
          return o.value;
        })
        .get();
      values.sort(this.sorter.compare);
      values.forEach((value) => {
        $("#reference-select").append(
          $("<option></option>").attr("value", value).text(value),
        );
      });
    },

    setBrush: function (start, end) {
      this.coverageBrushRange.start = start;
      this.coverageBrushRange.end = end;
    },

    resetBrush: function () {
      this.setBrush(0, 0);
    },

    load: function () {
      this.bed = undefined;

      if (this.selectedBamURL && this.selectedBamURL != "") {
        // Props should be set by query params
        this.bam = new Bam(this.backendUrl, this.selectedBamURL, {
          bai: this.selectedBaiURL,
        });

        this.goBam(this.region);
      }
    },

    readCoverageTooltipFormatter: function (d) {
      return d[0] + "," + precisionRound(d[1] * 100, 2) + "%";
    },

    receiveClinMessage: function (event) {
      let self = this;
      // Do we trust the sender of this message?
      if (this.clinIobioUrls.indexOf(event.origin) == -1) {
        return;
      }
      this.clinIobioUrl = event.origin;

      var clinObject = JSON.parse(event.data);

      if (clinObject.type == "show-tooltip") {
        self.clinTooltip[clinObject.task.key].show = true;
        self.clinTooltip[clinObject.task.key].content = clinObject.task.tooltip;
      } else if (clinObject.type == "hide-tooltip") {
        self.clinTooltip[clinObject.task.key].show = false;
      }
    },
  },

  created: function () {
    this.load();
  },

  mounted: function () {
    let self = this;
    window.addEventListener("message", self.receiveClinMessage, false);
  },

  watch: {
    readOutliers: function () {
      this.updateLengthHistograms();
    },
  },

  computed: {
    pathToFilename: function (path) {
      if (this.selectedBamURL !== undefined) {
        const pathParts = this.selectedBamURL.split("/");
        const filename = pathParts[pathParts.length - 1];
        return filename;
      }

      return "";
    },
    // TODO: Determine if this is needed
    //shortenedBamFileURL: function() {
    //  if (this.selectedBamURL !== undefined) {
    //    const protocolDiv = this.selectedBamURL.split('//');

    //    const protocol = protocolDiv[0];
    //    const withoutProtocol = protocolDiv[1];

    //    let pathDivision = withoutProtocol.split('/');

    //    // Edge case for '/' ending causing empty item
    //    if (pathDivision[pathDivision.length - 1] === '') {
    //      pathDivision.splice(pathDivision.length - 1, 1);
    //    }

    //    const host = pathDivision.shift();
    //    const fileName = pathDivision.pop();
    //    const middlePart = pathDivision.join("/");

    //    const fontSize = 25;
    //    const sizingStr = `<span style="font-size: ${fontSize}pt"></span>`;

    //    if (middlePart.length === 0) {
    //      return sizingStr + this.selectedBamURL;
    //    }
    //    else if (this.showFullURL) {
    //      return protocol + "//" + host +
    //        sizingStr + "/" + middlePart + "/" +
    //        (fileName !== undefined ? fileName : "")
    //    }
    //    else {
    //      return protocol + "//" + host +
    //        `/<span style="font-size: ${fontSize}pt;color:#2687BE;" >...</span> /` +
    //        (fileName !== undefined ? fileName : "")
    //    }
    //  }
    //  return '';
    //},
  },
};

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
</script>
