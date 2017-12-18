class Webcam {
  constructor(width, height) {
    this.width = width || 320;
    this.height = height || 240;

    this.stream = false;

    this.domElement = document.createElement('video');
    this.domElement.width = this.width;
    this.domElement.height = this.height;

    // polyfill for Stream API
    navigator.getUserMedia = navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia
      || navigator.oGetUserMedia;
  }

  start(success, error) {
    this.success = success || function emptySuccess() {};
    this.error = error || function emptyError() {};
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => this.onSuccess(s)).catch(this.onError);
    } else {
      navigator.getUserMedia({ video: true }, s => this.onSuccess(s), this.onError);
    }
  }

  stop() {
    if (this.stream) {
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
    this.domElement.play();
    this.success();
  }

  static onError(e) {
    this.error(e);
  }
}

module.exports = Webcam;

