<style lang="scss" scoped>
$header-color: #2d8fc1;
$header-height: 42px;

body {
	font-family: Quicksand;
	font-weight: 300;
	width: 100%;
}

header {
	height: $header-height;
	font-size: 26px;
	color: #ffffff;
	text-align: left;
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 1;
	background-color: $header-color;
	/*padding-left: 10px;*/
}

a:visited {
	color: none;
}
a {
	color: inherit;
	text-decoration: none;
	height: $header-height;
	line-height: $header-height;
}

.home-page-link {
	margin-left: 20px;
}
.home-page-link:hover {
	color: #ffffff;
}

.help {
	color: #ffffff;
	float: right;
	font-size: 24px;
	font-weight: bold;
	margin-right: 33px;
	text-align: center;
	height: $header-height;
	line-height: $header-height;
}
.help:hover {
	color: $header-color;
	background-color: #ffffff;
	cursor: pointer;
}
</style>

<template>
	<div>
		<body>
			<header>
				<a class="home-page-link" href="https://bam.iobio.io">bam.iobio</a>
				<div @click="helpClicked" class="help">Get Help</div>
			</header>
		</body>
	</div>
</template>

<script>
export default {
	name: 'app-header',
	data() {
		return {};
	},
	methods: {
		helpClicked: function () {
			this.$router.push('help');
		},
	},
};
</script>
