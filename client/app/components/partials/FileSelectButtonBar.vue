<style type="text/css">
.file {
	width: 300px;
	text-align: center;
}
.file-button {
	border-radius: 4px;
	width: 315px;
	float: right;
	background: #2d8fc1;
	padding: 20px 30px;
	color: #fff;
	font-size: 24px;
	cursor: pointer;
	font-weight: 300;
}
.inverted-file-button {
	border: 0;
	outline: none;
	width: 365px;
	background: none;
	padding: 20px 30px;
	color: #2d8fc1;
	font-size: 24px;
	text-decoration: underline;
	cursor: pointer;
	font-weight: 300;
}
.inverted-file-button:active,
.inverted-file-button:focus {
	outline: none;
	border: 0;
}
.file label {
	float: left;
}
.file input {
	position: absolute;
	display: inline-block;
	left: 0;
	top: 0;
	opacity: 0.01;
	visibility: hidden;
	cursor: pointer;
}
.arrow_box {
	position: relative;
	background: #ffffff;
	border: 2px solid #2d8fc1;
	border-radius: 4px;
}
.arrow_box:after,
.arrow_box:before {
	bottom: 100%;
	border: solid transparent;
	content: ' ';
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
}
.arrow_box:after {
	border-color: rgba(255, 255, 255, 0);
	border-bottom-color: #ffffff;
	border-width: 20px;
	left: 78%;
	margin-left: -20px;
}
.arrow_box:before {
	border-color: rgba(45, 143, 193, 0);
	border-bottom-color: #2d8fc1;
	border-width: 23px;
	left: 78%;
	margin-left: -23px;
}
.arrow_box input {
	width: 610px;
	margin: 8px;
	color: #2d8fc1;
	font: 300 30px quicksand;
}
.arrow_box button {
	font: 300 28px quicksand;
}
</style>

<template>
	<div>
		<div class="file" @click="showUrl = false">
			<input type="file" name="files[]" id="file" multiple @change="processBamFile" />
			<label class="file-button" for="file">local bam/cram file</label>
		</div>
		<div class="file-button" style="text-align: center" @click="displayBamUrlBox()">remote bam/cram url</div>
		<div style="clear: both"></div>
		<div
			v-if="showUrl"
			id="bam-url"
			style="margin-top: 18px; width: 700px; margin-left: auto; margin-right: auto"
			class="arrow_box"
		>
			<input id="url-input" placeholder="BAM/CRAM URL" v-model="selectedBamURL" />
			<input id="bai-url-input" placeholder="BAI/CRAI URL (optional)" v-model="selectedBaiURL" />
			<button id="bam-url-go-button" @click="openBamURL">Go</button>
		</div>
		<div style="text-align: center">
			<button class="inverted-file-button" @click="launchDemoData">launch with demo data</button>
		</div>
	</div>
</template>

<script>
import { createHoster } from 'fibridge-host';

export default {
	name: 'file-select-button-bar',
	data() {
		return {
			selectedBamURL: '',
			selectedBaiURL: '',
			showUrl: false,
			demoFileURL: 'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam',
		};
	},
	methods: {
		displayBamUrlBox: function () {
			this.showUrl = true;
			$('#bam-url').children('input').focus();
		},

		launchDemoData: function () {
			this.$emit('files-selected', { bamUrl: this.demoFileURL });
		},

		openBamURL: function () {
			if (!validURL(this.selectedBamURL)) {
				alert('Please enter a valid bam/cram url, including http:// or https:// in front');
				return;
			}

			this.$emit('files-selected', {
				bamUrl: this.selectedBamURL,
				baiUrl: this.selectedBaiURL,
			});
		},

		processBamFile: function (event) {
			let self = this;

			if (event.target.files.length != 2) {
				alert('Must select both a .bam and .bai file.');
				// return;
			}

			const file0 = event.target.files[0];
			const file1 = event.target.files[1];

			let bamFile;
			let baiFile;

			if (validBam(file0.name) && validIndex(file1.name)) {
				bamFile = file0;
				baiFile = file1;
			} else if (validBam(file1.name) && validIndex(file0.name)) {
				bamFile = file1;
				baiFile = file0;
			} else {
				alert('Must select both a .bam/.cram and .bai/.crai file.');
				return;
			}

			const proxyAddress = 'lf-proxy.iobio.io';
			const port = 443;
			const secure = true;

			const protocol = secure ? 'https:' : 'http:';

			// TODO: shouldn't this be going out of scope and eventually garbage
			// collected, which could lead to race conditions?
			createHoster({ proxyAddress, port, secure }).then((hoster) => {
				const bamPath = '/' + bamFile.name;
				hoster.hostFile({ path: bamPath, file: bamFile });
				const baiPath = '/' + baiFile.name;
				hoster.hostFile({ path: baiPath, file: baiFile });

				const portStr = hoster.getPortStr();
				const baseUrl = `${protocol}//${proxyAddress}${portStr}`;
				this.selectedBamURL = `${baseUrl}${hoster.getHostedPath(bamPath)}`;
				this.selectedBaiURL = `${baseUrl}${hoster.getHostedPath(baiPath)}`;

				this.$emit('files-selected', {
					bamUrl: this.selectedBamURL,
					baiUrl: this.selectedBaiURL,
				});
			});
		},
	},
};

function validBam(filename) {
	const extension = /[^.]+$/.exec(filename)[0];
	return extension === 'bam' || extension === 'cram';
}

function validIndex(filename) {
	const extension = /[^.]+$/.exec(filename)[0];
	return extension === 'bai' || extension === 'crai';
}

// TODO: If we want to get serious about validating URLS we should probably use
// a library. It's notoriously difficult to get right. This just
// verifies the string has the necessary bits so our UI doesn't choke.
function validURL(url) {
	const regex = /(http|https):\/\/.+\/.+/;
	return regex.test(url);
}
</script>
