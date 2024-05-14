<style type="text/css">
.modal-header {
	text-align: left;
}

.modal-body {
	text-align: justify;
	padding: 30px;
	overflow: auto;
	font-size: 11pt;
	max-height: 75vh;
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
}
.modal-wrapper {
	vertical-align: top;
}

.modal-content {
	width: 700px;
}

button.close {
	-webkit-appearance: none;
	padding: 0;
	cursor: pointer;
	background: transparent;
	border: 0;
}
</style>

<template>
	<div class="modal" style="display: block">
		<div class="modal-mask" @click="$emit('close')">
			<div class="modal-wrapper">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<slot name="header">
								<button type="button" class="close" @click="$emit('close')" data-dismiss="modal">&times;</button>
								<h4 class="modal-title">{{ modalTitle }}</h4>
							</slot>
						</div>

						<div class="modal-body">
							<slot name="body"> </slot>
						</div>

						<div class="modal-footer">
							<slot name="footer">
								<button class="btn btn-default" @click.prevent="$emit('close')">Close</button>
							</slot>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'help-modal',
	props: {
		modalTitle: '',
	},
	data() {
		return {};
	},
	methods: {},
};
</script>
