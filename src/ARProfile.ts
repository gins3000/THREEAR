import { ARUtils } from "./ARUtils";

/**
 * ArToolkitProfile helps you build parameters for artoolkit
 * - it is fully independent of the rest of the code
 * - all the other classes are still expecting normal parameters
 * - you can use this class to understand how to tune your specific usecase
 * - it is made to help people to build parameters without understanding all the underlying details.
 */
export class ARProfile {

	private sourceParameters: any;
	private contextParameters: any;
	private defaultMarkerParameters: any;
	private parameters: any;

	constructor(parameters: any) {
		this.reset(parameters.baseURL);
		this.performance("default");
	}

	/**
	 * reset all parameters
	 */
	public reset(baseURL: string) {
		this.sourceParameters = {
			// to read from the webcam
			sourceType : "webcam",
		};

		this.contextParameters = {
			cameraParametersUrl: baseURL + "../data/camera_para.dat",
			detectionMode: "mono",
		};

		this.defaultMarkerParameters = {
			type : "pattern",
			patternUrl : baseURL + "../data/patt.hiro",
			changeMatrixMode: "modelViewMatrix",
		};

		return this;
	}

	public performance(label: string) {

		if ( label === "default" ) {
			label = this._guessPerformanceLabel();
		}

		if ( label === "desktop-fast" ) {
			this.contextParameters.canvasWidth = 640 * 3;
			this.contextParameters.canvasHeight = 480 * 3;

			this.contextParameters.maxDetectionRate = 30;
		} else if ( label === "desktop-normal" ) {
			this.contextParameters.canvasWidth = 640;
			this.contextParameters.canvasHeight = 480;

			this.contextParameters.maxDetectionRate = 60;
		} else if ( label === "phone-normal" ) {
			this.contextParameters.canvasWidth = 80 * 4;
			this.contextParameters.canvasHeight = 60 * 4;

			this.contextParameters.maxDetectionRate = 30;
		} else if ( label === "phone-slow" ) {
			this.contextParameters.canvasWidth = 80 * 3;
			this.contextParameters.canvasHeight = 60 * 3;

			this.contextParameters.maxDetectionRate = 30;
		} else {
			console.assert(false, "unknonwn label " + label);
		}
		return this;
	}

	public defaultMarker() {
		this.contextParameters.detectionMode = "mono";
		this.defaultMarkerParameters.type = "pattern";
		this.defaultMarkerParameters.patternUrl = this.parameters.baseURL + "../data/patt.hiro";

		return this;
	}

	public sourceWebcam() {
		this.sourceParameters.sourceType = "webcam";
		delete this.sourceParameters.sourceUrl;
		return this;
	}

	public sourceVideo(url: string) {
		this.sourceParameters.sourceType = "video";
		this.sourceParameters.sourceUrl = url;
		return this;
	}

	public sourceImage(url: string) {
		this.sourceParameters.sourceType = "image";
		this.sourceParameters.sourceUrl = url;
		return this;
	}

	public changeMatrixMode(changeMatrixMode) {
		this.defaultMarkerParameters.changeMatrixMode = changeMatrixMode;
		return this;
	}

	public trackingMethod(trackingMethod) {
		const data = ARUtils.parseTrackingMethod(trackingMethod);
		this.defaultMarkerParameters.markersAreaEnabled = data.markersAreaEnabled;
		return this;
	}

	private _guessPerformanceLabel() {
		const isMobile = navigator.userAgent.match(/Android/i)
				|| navigator.userAgent.match(/webOS/i)
				|| navigator.userAgent.match(/iPhone/i)
				|| navigator.userAgent.match(/iPad/i)
				|| navigator.userAgent.match(/iPod/i)
				|| navigator.userAgent.match(/BlackBerry/i)
				|| navigator.userAgent.match(/Windows Phone/i)
				? true : false;
		if ( isMobile === true ) {
			return "phone-normal";
		}
		return "desktop-normal";
	}

}

export default ARProfile;
