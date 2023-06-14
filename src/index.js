'use strict';

const A = 34.82;
const B = 4.01;
const n = 8;

const appOpts = {
  dom: {
    body: document.querySelector('body'),
    start: document.querySelector('#start'),
    readoutSpeed: document.querySelector('#readout-speed'),
    readoutWatt: document.querySelector('#readout-watt'),
  },
  watchId: null,
  wakeLock: null,
  speedHistory: Array(10).fill(0),
  powerHistory: Array(10).fill(0),
};

document.querySelector('#start').addEventListener('click', (event) => {
  if (appOpts.watchId) {
    navigator.geolocation.clearWatch(appOpts.watchId);

    if (appOpts.wakeLock) {
      appOpts.wakeLock.cancel();
    }

    appOpts.watchId = null;
    appOpts.dom.start.textContent = '🔑 Start';
    appOpts.dom.start.classList.toggle('selected');
  } else {
    const options = {
      enableHighAccuracy: true
    };
    appOpts.watchId = navigator.geolocation.watchPosition(parsePosition,
      null, options);
    startWakeLock();

    appOpts.dom.start.textContent = '🛑 Stop';
    appOpts.dom.start.classList.toggle('selected');
  }
});

const calculateP = (v) => {
  const Cw = A / (1 - Math.pow((v / B), 2));
  const P = Math.pow(v, 3) * Cw / n;
  return P;
};

const parsePosition = (position) => {
  const speed = position.coords.speed * 3.6; // speed in km/h
  const power = calculateP(position.coords.speed); // power in watts

  appOpts.speedHistory.shift();
  appOpts.speedHistory.push(speed);

  appOpts.powerHistory.shift();
  appOpts.powerHistory.push(power);

  const averageSpeed = appOpts.speedHistory.reduce((a, b) => a + b, 0) / 10;
  const averagePower = appOpts.powerHistory.reduce((a, b) => a + b, 0) / 10;

 appOpts.dom.readoutSpeed.textContent = speed.toFixed(2);
appOpts.dom.readoutWatt.textContent = power.toFixed(1);
};

const startAmbientSensor = () => {
  if ('AmbientLightSensor' in window) {
    navigator.permissions.query({ name: 'ambient-light-sensor' })
      .then(result => {
        if (result.state === 'denied') {
          return;
        }
        const sensor = new AmbientLightSensor({frequency: 0.25});
        sensor.addEventListener('reading', () => {
          if (sensor['illuminance'] < 3 && !appOpts.dom.body.classList.contains('dark')) {
            appOpts.dom.body.classList.toggle('dark');
          } else if (sensor['illuminance'] > 3 && appOpts.dom.body.classList.contains('dark')) {
            appOpts.dom.body.classList.toggle('dark');
          };
        });
        sensor.start();
    });
  }
}

const startWakeLock = () => {
  try {
    navigator.getWakeLock("screen").then((wakeLock) => {
      appOpts.wakeLock = wakeLock.createRequest();
    });
  } catch(error) {
    // no experimental wake lock api build
  }
}

startAmbientSensor();
