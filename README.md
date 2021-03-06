# js-webcam
A simple core polyfill for access to user media camera

# Using from react
First install the package
```js
npm i js-webcam
```
Then you can use it from any component:

```js
import React, { Component } from 'react';
import Webcam from 'js-webcam';

const WIDTH = 620;
const HEIGHT = 440;

class Selfie extends Component {
  componentDidMount() {
    this.trackerContext = this.trackerCanvas.getContext('2d');
    this.webcam = new Webcam(WIDTH, HEIGHT);
    this.webcam.start();
    this.startLoop();
  }

  componentWillUnmount() {
    this.stopLoop();
  }

  webcam;
  trackerContext;
  frameId;

  startLoop() {
    if (!this.frameId) {
      this.frameId = window.requestAnimationFrame(() => this.loop());
    }
  }

  loop() {
    this.update();
    this.frameId = window.requestAnimationFrame(() => this.loop());
  }

  stopLoop() {
    window.cancelAnimationFrame(this.frameId);
  }

  update() {
    this.trackerContext.clearRect(0, 0, WIDTH, HEIGHT);
    this.trackerContext.drawImage(this.webcam.domElement, 0, 0, WIDTH, HEIGHT);
  }

  render() {
    return (
      <div>
        <canvas ref={(c) => { this.trackerCanvas = c; }} width={WIDTH} height={HEIGHT} />
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default Selfie;
```

The start function activate the frontal camera, if you need the back camera you can use startBackCamera instead.

```js
    this.webcam.startBackCamera();
```

Or you can use the start function passing the facing mode parameter, on error and on success functions:

```js
    const onError = (e) => {}; // call when the camera can not activate.
    const onSuccess = () => {}; // call when the camera can activate successfully
    const facingMode = 'user'; // or 'environment' for back camera.
    this.webcam.start(onSuccess, onError, facingMode);
```
