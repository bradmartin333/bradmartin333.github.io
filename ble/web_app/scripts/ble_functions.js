var bluetoothDevice;
var bluetoothDeviceWriteChar;
var bluetoothDeviceNotifyChar;

function connect() {
    exponentialBackoff(5 /* max retries */, 2 /* seconds delay */,
        function toTry() {
            time('Connecting to Bluetooth Device... ');
            return bluetoothDevice.gatt.connect();
        },
        function success() {
            console.log('> Bluetooth Device connected.');
        },
        function fail() {
            time('Failed to reconnect.');
        });
}

function onDisconnected() {
    console.log('> Bluetooth Device disconnected');
    connect();
}

function bleConnect() {
    let serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    let characteristicWriteUuid = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
    let characteristicNotifyUuid = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
    let name = document.getElementById('deviceName').value;

    console.log('Requesting Bluetooth Device...');

    function resolve() {
        if (bluetoothDevice) {
            return bluetoothDevice;
        }
    }

    let promise = new Promise(
        function (resolve, reject) {
            if (bluetoothDevice) {
                connect();
                // TODO fix return values and reconnect ...
                console.log(bluetoothDevice);
                resolve(bluetoothDevice.gatt);
            } else {
                resolve(
                    navigator.bluetooth.requestDevice({ filters: [{ name: name }], optionalServices: [serviceUuid] }).then(device => {
                        console.log('Connecting to GATT Server...');
                        bluetoothDevice = device;
                        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
                        return device.gatt.connect();
                    })
                );
            }
        }
    )

    promise.then(server => {
        console.log('Getting Service...');
        return server.getPrimaryService(serviceUuid);
    })
        .then(service => {
            console.log('Getting Characteristics...');
            if (characteristicWriteUuid) {
                // Get all characteristics that match this UUID.
                console.log(service);
                // this requires both characteristics...
                return Promise.all([service.getCharacteristics(characteristicWriteUuid), service.getCharacteristics(characteristicNotifyUuid)]);
            }
            // Get all characteristics.
            return service.getCharacteristics();
        })
        .then(characteristics => {
            console.log('> Characteristics: ' +
                characteristics.map(c => c[0].uuid + " (" + (c[0].properties.write === true ? "WRITE" : (c[0].properties.notify === true ? "NOTIFY" : "?")) + ")").join('\n' + ' '.repeat(19)));
            console.log(characteristics);
            bluetoothDeviceWriteChar = characteristics[0][0];
            bluetoothDeviceNotifyChar = characteristics[1][0];

            bluetoothDeviceNotifyChar.addEventListener("characteristicvaluechanged", async function (ev) {
                var received = ab2str(ev.currentTarget.value.buffer);
                if (received == -1) { return; }
                document.getElementById('message').value += received + '\n';
            });
            bluetoothDeviceNotifyChar.startNotifications();
        })
        .catch(error => {
            console.log('Argh! ' + error);
        });
}

// This function keeps calling "toTry" until promise resolves or has
// retried "max" number of times. First retry has a delay of "delay" seconds.
// "success" is called upon success.
function exponentialBackoff(max, delay, toTry, success, fail) {
    toTry().then(result => success(result))
        .catch(_ => {
            if (max === 0) {
                return fail();
            }
            time('Retrying in ' + delay + 's... (' + max + ' tries left)');
            setTimeout(function () {
                exponentialBackoff(--max, delay * 2, toTry, success, fail);
            }, delay * 1000);
        });
}

function time(text) {
    console.log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function sendValue() {
    if (bluetoothDeviceWriteChar) {
        var toSend = document.getElementById('toSend').value;
        var toSendAB = str2ab(toSend);
        bluetoothDeviceWriteChar.writeValue(toSendAB);
    }
}