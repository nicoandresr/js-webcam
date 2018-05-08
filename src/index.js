class Webcam {
  constructor(width, height) {
    this.width = width || 320;
    this.height = height || 240;

    this.stream = false;

    this.domElement = document.createElement('video');
    this.domElement.width = this.width;
    this.domElement.height = this.height;
    this.domElement.setAttribute('playsinline', '');

    // polyfill for Stream API
    navigator.getUserMedia = navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia
      || navigator.oGetUserMedia;
  }

  start(success, error, facingMode) {
    this.success = success || function emptySuccess() {};
    this.error = error || function emptyError() {};
    this.mode = facingMode || 'user';
    const { width, height } = this;
    const config = { video: { facingMode: this.mode, width, height }};
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia(config)
        .then(s => this.onSuccess(s)).catch(e => this.onError(e));
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(config, s => this.onSuccess(s), e => this.onError(e));
    } else {
      this.onError(new Error('Device unsupported'));
    }
  }

  startBackCamera(success, error) {
    this.start(success, error, 'environment');
  }

  stop() {
    if (this.stream) {
      this.domElement.pause();
      this.stream.getTracks()[0].stop();
      this.domElement.src = '';
    }
  }

  onSuccess(stream) {
    this.stream = stream;
    if ('srcObject' in this.domElement) {
      this.domElement.srcObject = this.stream;
    } else {
      this.domElement.src = (window.URL || window.webkitURL).createObjectURL(this.stream);
    }
    const promise = this.domElement.play();
    if (promise !== undefined) {
      promise.catch(error => {
        this.onError(error);
      }).then(() => {
        this.success();
      });
    } else {
      this.success();
    }
  }

  onError(e) {
    this.error(e);
  }
}

module.exports = Webcam;

