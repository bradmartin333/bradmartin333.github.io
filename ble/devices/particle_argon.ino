#include "Particle.h"

const size_t UART_TX_BUF_SIZE = 20;

void onDataReceived(const uint8_t* data, size_t len, const BlePeerDevice& peer, void* context);

// These UUIDs were defined by Nordic Semiconductor and are now the defacto standard for
// UART-like services over BLE. Many apps support the UUIDs now, like the Adafruit Bluefruit app.
const BleUuid serviceUuid("6E400001-B5A3-F393-E0A9-E50E24DCCA9E");
const BleUuid rxUuid("6E400002-B5A3-F393-E0A9-E50E24DCCA9E");
const BleUuid txUuid("6E400003-B5A3-F393-E0A9-E50E24DCCA9E");

BleCharacteristic txCharacteristic("tx", BleCharacteristicProperty::NOTIFY, txUuid, serviceUuid);
BleCharacteristic rxCharacteristic("rx", BleCharacteristicProperty::WRITE_WO_RSP, rxUuid, serviceUuid, onDataReceived, NULL);

void onDataReceived(const uint8_t* data, size_t len, const BlePeerDevice& peer, void* context) {
    for (size_t i = 0; i < len; i++) {
        Serial.write(data[i]);
    }
}

void setup() {
    Serial.begin();

	BLE.on();

    BLE.addCharacteristic(txCharacteristic);
    BLE.addCharacteristic(rxCharacteristic);

    BleAdvertisingData data;
    data.appendServiceUUID(serviceUuid);
    data.appendLocalName("BLE_UART");
    BLE.advertise(&data);
}

void loop() {
    if (BLE.connected()) {
    	uint8_t txBuf[UART_TX_BUF_SIZE];
    	size_t txLen = 0;

        while(Serial.available() && txLen < UART_TX_BUF_SIZE) {
            txBuf[txLen++] = Serial.read();
        }
    	
        if (txLen > 0) {
            txCharacteristic.setValue(txBuf, txLen);
            Serial.println();
        }
    }
}
