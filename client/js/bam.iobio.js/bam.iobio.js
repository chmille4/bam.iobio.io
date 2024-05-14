// extending Thomas Down's original BAM js work

import { Client } from 'iobio-api-client';
import EventEmitter from 'events';


class LineReader extends EventEmitter {
  constructor(cmd) {
    super();

    let remainder = "";
    let prev = "";

    cmd.on('data', (data) => {

      const lines = data.split('\n');

      if (remainder.length > 0) {
        lines[0] = remainder + lines[0];
        remainder = "";
      }

      if (!lines[lines.length - 1].endsWith('\n')) {
        remainder = lines.pop();
      }

      for (const line of lines) {
        prev = line;
        this.emit('line', line);
      }
    });

    cmd.on('end', () => {
      if (remainder.length > 0) {
        this.emit('line', remainder);
      }
      this.emit('end');
    });

    cmd.on('error', (e) => {
      this.emit('error', e);
    });

    this._cmd = cmd;
  }

  run() {
    this._cmd.run();
  }
}


var Bam = Class.extend({

   init: function(backendUrl, bamUri, options) {
      this.bamUri = bamUri;
      this.ssl = true;
      this.options = options; // *** add options mapper ***
      if (this.options && this.options.bai)
         this.baiUri = this.options.bai;

      this.api = new Client(backendUrl);

      // set iobio servers
      this.iobio = {}

      this.hadError = false;

      this._startFetchingHeader();

      return this;
   },

   _getBamCmd: function(regions) {

      const cmd = this.api.streamCommand('alignmentStatsStream', {
        url: this.bamUri,
        indexUrl: this.baiUri,
        regions,
      });

      if (window.lastCmd) {
        //window.lastCmd.closeClient();
        window.lastCmd.cancel();
      }
      window.lastCmd = cmd;
      return cmd;
   },

   _mapToBedCoordinates: function(regions, bed) {

      var bedRegions = [];
      var currRef;

      var me = this;

      var a,
          a_i;

      regions.forEach(function(reg){
        if (currRef != reg.name) {
          currRef = reg.name;
          a = me._bedToCoordinateArray(reg.name, bed);
          a_i = 0;
          if (a.length == 0) {
            alert("Bed file doesn't have coordinates for reference: " + reg.name + ". Ignoring it");
            return null;
          }
        }

         for (a_i; a_i < a.length; a_i++) {
            if (a[a_i].end > reg.end)
               break;

            if (a[a_i].start >= reg.start)
               bedRegions.push( {name:reg.name, start:a[a_i].start, end:a[a_i].end})
         }
      })
      return bedRegions
   },

   _bedToCoordinateArray: function(ref, bed) {
      var me = this;
      var a = [];
      bed.split("\n").forEach(function(line){
        if (line[0] == '#' || line == "") return;

        var fields = line.split("\t");
        if (me._referenceMatchesBed(ref, fields[0])) {
           a.push({ chr:ref, start:parseInt(fields[1]), end:parseInt(fields[2]) });
        }
      });
      return a;
   },

   _referenceMatchesBed: function(ref, bedRef) {
      if (ref == bedRef) {
        return true;
      }
      // Try stripping chr from reference names and then comparing
      const ref1 = ref.replace(/^chr?/,'');
      const bedRef1 = bedRef.replace(/^chr?/,'');

      return (ref1 == bedRef1);
   },


   // *** bamtools functionality ***

   estimateBaiReadDepth: function(refCallback, doneCallback, baiErrCb) {
      var me = this, readDepth = {};
      me.readDepth = {};
      var numRefSamples = 12;

      // This needs to be in a function like this in order to capture the
      // value of refId. Otherwise it was a race condition since read depth
      // data sometimes starts coming in before the header arrives. This is
      // especially true when handling local files.
      function submitRef(refId) {
        me.getHeader().then(() => {
          const sqIndex = parseInt(refId);
          if (sqIndex < me.header.sq.length && me.header.sq[sqIndex]) {
            const name = me.header.sq[sqIndex].name;
            const sqLength = me.header.sq[sqIndex].end;
            me.header.sq[sqIndex].hasRecords = true;

            if ( me.readDepth[ name ] == undefined){
              me.readDepth[ name ] = {
                depths: readDepth[refId],
                sqLength,
              }

              refCallback(name, sqIndex, me.readDepth[name]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        })
      }

      let currentSequence;
      const indexUrl = this.baiUri || this.getIndexUrl(this.bamUri);
      //var cmd = new iobio.cmd(this.iobio.bamReadDepther, [ '-i', '"' + indexUrl + '"'], {ssl:this.ssl,})

      let cmd;

      const indexPath = indexUrl.split('?')[0];

      if (indexPath.endsWith('.bai')) {
        cmd = this.api.streamCommand('baiReadDepth', { url: indexUrl });
      }
      else {
        cmd = this.api.streamCommand('craiReadDepth', { url: indexUrl });
      }

      const lineReader = new LineReader(cmd);

      lineReader.on('error', (e) => {
        if (!this.hadError) {
          alert("Error accessing the BAM index file. Please provide an " +
                "index file URL or ensure that " +
                `${indexUrl} exists`);
          baiErrCb(e);
        }
        console.log(e);
      });
      lineReader.on('line', function(line, options) {

         if ( line[0] == '#' ) {

            if (currentSequence) {
              submitRef(currentSequence); 
            }

            var fields = line.substr(1).split("\t");
            currentSequence = fields[0]
            readDepth[currentSequence] = [];
            if (fields[1]) {
              readDepth[currentSequence].mapped = +fields[1];
              readDepth[currentSequence].unmapped = +fields[2];
            }
         }
         else if (line[0] == '*') {
           me.n_no_coor = +line.split("\t")[2];
         }
         else {
            if (line != "") {
               var d = line.split("\t");
               readDepth[currentSequence].push({ pos:parseInt(d[0]), depth:parseInt(d[1]) });
            }
        }

      }.bind(me));
      lineReader.on('end', function() {

        submitRef(currentSequence); 
        doneCallback();

      }.bind(me));
      lineReader.run();

   },

   getIndexUrl: function(alignmentUrl) {
    var supported_filetypes = {
      'bam' : 'bai',
      'cram' : 'crai'
    }
    var filetype = alignmentUrl.split('.').slice(-1);
    return alignmentUrl + "." + supported_filetypes[filetype];
   },

   _startFetchingHeader: function() {
     this._headerPromise = new Promise((resolve, reject) => {

       var me = this;
       var rawHeader = "";

       const cmd = this.api.streamCommand('alignmentHeader', {
         url: this.bamUri,
       });

       cmd.on('error', (error) => {
         // only show the alert on the first error
         if (!this.hadError) {
           this.hadError = true;
           alert("Error downloading file. Please check the URL.")
           reject(error);
         }
         console.error(error);
       })
       cmd.on('data', function(data, options) {
          rawHeader += data;
       });
       cmd.on('end', function() {
          me.setHeader(rawHeader);
          resolve(me.header);
       });

       cmd.run();

       // need to make this work for URL bams
       // need to incorporate real promise framework throughout
     });
   },

   getHeader: function() {
     return this._headerPromise; 
   },

   setHeader: function(headerStr) {
      var header = { sq:[], toStr : headerStr };
      var lines = headerStr.split("\n");
      for ( var i=0; i<lines.length > 0; i++) {
         var fields = lines[i].split("\t");
         if (fields[0] == "@SQ") {
            var fHash = {};
            fields.forEach(function(field) {
              var values = field.split(':');
              fHash[ values[0] ] = values[1]
            })
            header.sq.push({
              name:fHash["SN"],
              end:1+parseInt(fHash["LN"]),
              hasRecords: false,
            });
         }
      }
      this.header = header;
   },

   sampleStats: function(callback, options) {
      var binSize = 10000;
      var binNumber = 20;
      if (options.sampling == 'low') {
        binSize = 5000;
        binNumber = 20;
      }
      if (options.sampling == 'verylow') {
        binSize = 2500;
        binNumber = 10;
      }
      // Prints some basic statistics from sampled input BAM file(s)
      options = $.extend({
         'binSize' : binSize, // defaults
         'binNumber' : binNumber,
         start : 1,
      },options);
      var me = this;

      function goSampling(SQs) {
        if (SQs.length == 0) {
          callback(undefined, "Make sure index file exists and is valid.")
        } else {
          var regions = [];
          var bedRegions;
          //for (var j=0; j < SQs.length; j++) {
          var sqStart = options.start;
          var length = SQs.length == 1 ? SQs[0].end - sqStart : null;
          if (length && length < options.binSize * options.binNumber) {
            SQs[0].start = sqStart;
            regions.push(SQs[0])
          } else {
            // create random reference coordinates
            var regions = [];
            for (var i = 0; i < options.binNumber; i++) {
              var seq = SQs[Math.floor(Math.random() * SQs.length)]; // randomly grab one seq
              length = seq.end - sqStart;
              var s = sqStart + parseInt(Math.random() * length);
              regions.push({
                'name': seq.name,
                'start': s,
                'end': s + options.binSize
              });
            }
            // sort by start value
            regions = regions.sort(function (a, b) {
              if (a.name == b.name)
                return ((a.start < b.start) ? -1 : ((a.start > b.start) ? 1 : 0));
              else
                return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
            });

            // map random region coordinates to bed coordinates
            if (options.bed != undefined)
              bedRegions = me._mapToBedCoordinates(regions, options.bed)
          }

          var r = bedRegions || regions;
          var cmd = me._getBamCmd(r)
          var buffer = "";

          cmd.on('error', function (err) {
            console.error(err);
          })


          cmd.on('queue', function (q) {
            console.log('queue = ' + q);
          })

          cmd.on('data', function (datas, options) {
            datas.split(';').forEach(function (data) {
              if (data == undefined || data == "\n") return;
              var success = true;
              try {
                var obj = JSON.parse(buffer + data)
              } catch (e) {
                success = false;
                buffer += data;
              }
              if (success) {
                buffer = "";
                callback(obj);
              }
            });
          });

          cmd.on('end', function () {
            if (options.onEnd != undefined)
              options.onEnd();
          });

          cmd.on('exit', function (code) {
          })

          cmd.run();

        }
      }

      if ( options.sequenceNames != undefined && options.sequenceNames.length == 1 && options.end != undefined) {
         goSampling([{name:options.sequenceNames[0], end:options.end}]);
      } else  if (options.sequenceNames != undefined){
         this.getHeader().then(function(header){
            var seqs = options.sequenceNames.map(function(sq) {
              return header.sq.find( function(d) { return (d.name == sq) })
            })

            goSampling( seqs );
         });
      } else {
         this.getHeader().then(function(header){
            goSampling(header.sq);
         });
      }
   },
});

export { Bam };
