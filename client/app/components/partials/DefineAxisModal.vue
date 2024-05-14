<style type="text/css">
.modal {
	transition: all 0.3s ease;
}

.modal-header {
	text-align: left;
}

.modal-body {
	text-align: justify;
	padding: 30px;
	overflow: auto;
	font-size: 11pt;
	max-height: 500px;
}

.modal-body .row {
	margin-top: 30px;
}

.modal-mask {
	position: absolute;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.3s ease;
}
.modal-wrapper {
	vertical-align: top;
}

.modal-content {
	width: 700px;
	transition: all 0.3s ease;
}

button.close {
	-webkit-appearance: none;
	padding: 0;
	cursor: pointer;
	background: transparent;
	border: 0;
}

form label {
	width: 60px;
}
input {
	width: 75%;
}
</style>

<template>
	<transition name="modal">
		<div class="modal" style="display: block" @click="$emit('close')">
			<div class="modal-mask">
				<div class="modal-wrapper" @click.stop>
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<slot name="header">
									<button type="button" class="close" @click="$emit('close')">&times;</button>
									<h4 class="modal-title">Define custom ranges for axes:</h4>
								</slot>
							</div>

							<div class="modal-body">
								<slot name="body">
									<form>
										<div class="form-group">
											<label class="form-control-label" for="xMin">xMin</label>
											<input id="xMin" v-model="xMin" :placeholder="xMinPlaceholderText" />
										</div>
										<!-- /form-group -->
										<div class="form-group">
											<label class="form-control-label" for="xMax">xMax</label>
											<input id="xMax" v-model="xMax" :placeholder="xMaxPlaceholderText" />
										</div>
										<!-- /form-group -->
										<div class="form-group">
											<label class="form-control-label" for="yMin">yMin</label>
											<input id="yMin" v-model="yMin" :placeholder="yMinPlaceholderText" />
										</div>
										<!-- /form-group -->
										<div class="form-group">
											<label class="form-control-label" for="yMax">yMax</label>
											<input id="yMax" v-model="yMax" :placeholder="yMaxPlaceholderText" />
										</div>
										<!-- /form-group -->
									</form>
								</slot>
							</div>

							<div class="modal-footer">
								<slot name="footer">
									<button class="btn btn-default" @click.prevent="reset">Reset</button>
									<button class="btn btn-default" @click.prevent="save">Save</button>
								</slot>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'define-axis-modal',
	props: {
		xMinOrig: {},
		xMaxOrig: {},
		yMinOrig: {},
		yMaxOrig: {},
		xAxisLabel: '',
		yAxisLabel: '',
	},
	data() {
		return {
			showModal: false,
			xMin: '',
			xMax: '',
			yMin: '',
			yMax: '',
		};
	},
	methods: {
		reset: function () {
			this.xMin = '';
			this.xMax = '';
			this.yMin = '';
			this.yMax = '';
		},
		save: function () {
			this.$emit('updateAxesRanges', this.xMin, this.xMax, this.yMin, this.yMax);
		},
	},
	created: function () {
		this.xMin = this.xMinOrig;
		this.xMax = this.xMaxOrig;
		this.yMin = this.yMinOrig;
		this.yMax = this.yMinOrig;
	},
	computed: {
		xMinPlaceholderText: function () {
			return 'Enter a custom lower bound for ' + (this.xAxisLabel != undefined ? this.xAxisLabel + '.' : 'the x axis.');
		},
		xMaxPlaceholderText: function () {
			return 'Enter a custom upper bound for ' + (this.xAxisLabel != undefined ? this.xAxisLabel + '.' : 'the x axis.');
		},
		yMinPlaceholderText: function () {
			return 'Enter a custom lower bound for ' + (this.yAxisLabel != undefined ? this.yAxisLabel + '.' : 'the y axis.');
		},
		yMaxPlaceholderText: function () {
			return 'Enter a custom upper bound for ' + (this.yAxisLabel != undefined ? this.yAxisLabel + '.' : 'the y axis.');
		},
	},
};
</script>
