/* eslint-disable no-bitwise */
import { useEffect, useMemo, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  Subscription,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

const HEART_RATE_UUID = "0000180d-0000-1000-8000-00805f9b34fb";
const HEART_RATE_CHARACTERISTIC = "00002a37-0000-1000-8000-00805f9b34fb";

// Replace with your device’s service/characteristic UUIDs
const CUSTOM_SERVICE_UUID = "000018f0-0000-1000-8000-00805f9b34fb";
const CUSTOM_CHARACTERISTIC_UUID = "00002af0-0000-1000-8000-00805f9b34fb";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  heartRate: number;
  systolic: number;
  diastolic: number;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);
  const [systolic, setSystolic] = useState<number>(0);
  const [diastolic, setDiastolic] = useState<number>(0);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    return () => {
      bleManager.destroy();
    };
  }, []);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      console.log("Scanning for devices...");
      if (error) {
        console.log(error);
      }
      // if (device && device.name?.includes("CorSense")) {
      if (device && device.name) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            console.log("Found device:", allDevices);
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    try {
      bleManager.stopDeviceScan();

      const deviceConnection = await bleManager.connectToDevice(device.id, {
        autoConnect: true,
      });
      const isConnected = await deviceConnection.isConnected();
      if (!isConnected) throw new Error("Device failed to connect");

      setConnectedDevice(deviceConnection);

      // Discover services and characteristics
      await deviceConnection.discoverAllServicesAndCharacteristics();

      // 🔍 Add this block to inspect what the device exposes
      const services = await deviceConnection.services();
      console.log("Services:", services);

      for (const service of services) {
        const characteristics =
          await deviceConnection.characteristicsForService(service.uuid);
        console.log(
          `Characteristics for service ${service.uuid}:`,
          characteristics
        );
      }

      // ✅ Pass correct UUIDs into your streaming function
      // Once you know the correct UUIDs, then start streaming
      startStreamingData(deviceConnection);

      console.log("CONNECTED TO DEVICE:", deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      // Remove subscription first
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;

      const isConnected = await bleManager.isDeviceConnected(
        connectedDevice.id
      );

      if (isConnected) {
        try {
          await bleManager.cancelDeviceConnection(connectedDevice.id);
        } catch (error) {
          console.warn("Error disconnecting:", error);
        }
      }
      setConnectedDevice(null);
      setSystolic(0);
      setDiastolic(0);
      setHeartRate(0);
    }
  };

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log("Monitor error:", error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }
    console.log("Raw value (base64):", characteristic.value);

    // Decode base64 into bytes
    const raw = base64.decode(characteristic.value);
    const buffer = Uint8Array.from(raw, (c) => c.charCodeAt(0));
    console.log("Decoded bytes:", buffer);
    console.log(
      "Decoded number:",
      "SYS" + " " + buffer[6],
      "DIA" + " " + buffer[8],
      "PULSE" + " " + buffer[10]
    );

    // Decode base64 into bytes
    const rawData = base64.decode(characteristic.value);
    let innerHeartRate: number = -1;

    const firstBitValue: number = Number(rawData) & 0x01;

    if (firstBitValue === 0) {
      innerHeartRate = rawData[1].charCodeAt(0);
    } else {
      innerHeartRate =
        Number(rawData[1].charCodeAt(0) << 8) +
        Number(rawData[2].charCodeAt(2));
    }
    if (buffer.length > 9) {
      setHeartRate(buffer[10]);
      setSystolic(buffer[6]);
      setDiastolic(buffer[8]);
    } else {
      setHeartRate(0);
      setSystolic(0);
      setDiastolic(0);
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      const subscription = device.monitorCharacteristicForService(
        // HEART_RATE_UUID,
        // HEART_RATE_CHARACTERISTIC,
        CUSTOM_SERVICE_UUID,
        CUSTOM_CHARACTERISTIC_UUID,

        onHeartRateUpdate
      );

      // Keep subscription so you can remove it later
      subscriptionRef.current = subscription; // store it
    } else {
      console.log("No Device Connected");
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate,
    systolic,
    diastolic,
  };
}

export default useBLE;
