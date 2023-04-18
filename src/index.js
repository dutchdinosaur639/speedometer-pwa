'use strict';

/** @enum {number} */
const readoutUnits = {
  mps: 1,
  kmh: 3.6
};

<<<<<<< HEAD
let n = 8
let a = 34.82
let b = 4.01



=======
>>>>>>> parent of 77a9130 (Probeersel CW Waarde Anckertje)
/** @const */
const appOpts = {
  dom: {
    body: document.querySelector('body'),
    start: document.querySelector('#start'),
    readout: document.querySelector('#readout'),
    showMps: document.querySelector('#show-mps'),
    showKmh: document.querySelector('#show-kmh'),
  },
  readoutUnit: readoutUnits.mps,
  watchId: null,
  wakeLock: null
};

document.querySelector('#show-mps').addEventListener('click', (event) => {
  appOpts.readoutUnit = readoutUnits.mps;
  if (!appOpts.dom.showMps.classList.contains('selected')) {
    toggleReadoutButtons();
  }
});

document.querySelector('#show-kmh').addEventListener('click', (event) => {
  appOpts.readoutUnit = readoutUnits.kmh;
  if (!appOpts.dom.showKmh.classList.contains('selected')) {
    toggleReadoutButtons();
  }
});

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

const toggleReadoutButtons = () => {
  appOpts.dom.showKmh.classList.toggle('selected');
  appOpts.dom.showMps.classList.toggle('selected');
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

const parsePosition = (position) => {
<<<<<<< HEAD
  appOpts.dom.readout.textContent = (Math.pow(
    position.coords.speed * appOpts.readoutUnit),2);
=======
  appOpts.dom.readout.textContent = Math.round(
    position.coords.speed * appOpts.readoutUnit);
>>>>>>> parent of 77a9130 (Probeersel CW Waarde Anckertje)
};

const startServiceWorker = () => {
  navigator.serviceWorker.register('service-worker.js', {
    scope: './'
  });
}

startAmbientSensor();
startServiceWorker();