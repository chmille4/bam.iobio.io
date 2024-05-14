import { LaunchConfigManager } from 'iobio-launch';

export function createIntegration(query) {
	if (query.source && query.project_id && query.sample_id) {
		return new MosaicIntegration(query);
	} else {
		return new StandardIntegration(query);
	}
}

class Integration {
	constructor(query) {
		this.query = query;

		let configOpts = {};

		if (BUILD_ENV_LOCAL_BACKEND) {
			this.backend = window.location.origin + '/gru';
			configOpts = {
				configLocation: '/config/config.json',
			};
		}

		this.configMan = new LaunchConfigManager(configOpts);
	}
}

class StandardIntegration extends Integration {
	init() {
		return this.configMan.getConfig().then((launchConfig) => {
			this.config = launchConfig;
		});
	}

	buildParams() {
		return Object.assign(
			{
				backendUrl: this.backend ? this.backend : this.config.backendUrl,
			},
			this.config.params
		);
	}

	buildQuery() {
		return Object.assign({}, this.query);
	}
}

class MosaicIntegration extends Integration {
	init() {
		return this.configMan.getConfig().then((launchConfig) => {
			this.config = launchConfig;

			return new Promise((resolve, reject) => {
				const projectId = this.config.params.project_id;

				if (projectId) {
					this.getMosaicIobioUrls((alignmentURL, alignmentIndexURL) => {
						this.alignmentURL = alignmentURL;
						this.alignmentIndexURL = alignmentIndexURL;
						resolve(alignmentURL, alignmentIndexURL);
					});
				}
			});
		});
	}

	buildParams() {
		return {
			bam: this.alignmentURL,
			bai: this.alignmentIndexURL,
			backendUrl: this.config.backendUrl,
			region: this.config.params.region,
		};
	}

	buildQuery() {
		return {
			source: this.config.params.source,
			sample_id: this.config.params.sample_id,
			project_id: this.config.params.project_id,
			sampling: this.config.params.sampling,
			region: this.config.params.region,
			backend: this.config.params.backend,
			experiment_id: this.config.params.experiment_id,
		};
	}

	getMosaicIobioUrls(callback) {
		let api = decodeURIComponent(this.config.params.source) + '/api/v1';

		let project_id = this.config.params.project_id;
		let access_token = this.config.params.access_token;
		let sample_id = this.config.params.sample_id;
		let token_type = this.config.params.token_type;
		let experiment_id = this.config.params.experiment_id;

		if (access_token !== undefined) {
			localStorage.setItem('hub-iobio-tkn', token_type + ' ' + access_token);
		}

		if (localStorage.getItem('hub-iobio-tkn')) {
			// Get VCF File
			getFilesForSample(sample_id, project_id).done((files) => {
				var data = files.data.filter((file) => {
					if (experiment_id) {
						return file.experiment_ids.includes(Number(experiment_id));
					} else {
						return file;
					}
				});
				const bam = data.filter((f) => f.type == 'bam' || f.type == 'cram')[0];
				const bai = data.filter((f) => f.type == 'bai' || f.type == 'crai')[0];

				// Get Signed Url
				getSignedUrlForFile(project_id, bam).done((bamUrlData) => {
					const bamUrl = bamUrlData.url;
					getSignedUrlForFile(project_id, bai).done((baiUrlData) => {
						const baiUrl = baiUrlData.url;
						callback(bamUrl, baiUrl);
					});
				});
			});
		} else {
			window.location.href = buildOauthLink();
		}

		function getFilesForSample(sample_id, project_id) {
			return $.ajax({
				url: api + '/projects/' + project_id + '/samples/' + sample_id + '/files',
				type: 'GET',
				contentType: 'application/json',
				headers: {
					Authorization: localStorage.getItem('hub-iobio-tkn'),
				},
			}).fail(function (xhr, status, error) {
				let link = buildOauthLink();
				$('#warning-authorize')
					.append(
						'Your access to hub.iobio has expired. Please click <a href=' + link + '>here</a> to renew your access.'
					)
					.css('display', 'block');
			});
		}

		function getSignedUrlForFile(project_id, file) {
			return $.ajax({
				// url: api + '/files/' + file.id + '/url',
				url: api + '/projects/' + project_id + '/files/' + file.id + '/url',
				type: 'GET',
				contentType: 'application/json',
				headers: {
					Authorization: localStorage.getItem('hub-iobio-tkn'),
				},
			});
		}
	}
}
