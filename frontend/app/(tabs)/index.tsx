import DeviceModal from "@/components/DeviceConnectionModal";
import { PulseIndicator } from "@/components/PulseIndicator";
import useBLE from "@/utils/hooks/useBLE";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    systolic,
    diastolic,
    disconnectFromDevice,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            {heartRate === undefined ? (
              <View>
                <Text>Calculating...</Text>
              </View>
            ) : (
              <View></View>
            )}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.heartRateTitleText}>
                Your Systolic Pressure Is:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.heartRateTitleText}>{systolic}</Text>
                <Text style={styles.abbrText}>mmHg</Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.heartRateTitleText}>
                Your Diastolic Pressure Is:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.heartRateTitleText}>{diastolic}</Text>
                <Text style={styles.abbrText}>mmHg</Text>
              </View>
            </View>
            <View style={{ marginTop: 20, marginBottom: 40 }}>
              <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.heartRateTitleText}>{heartRate}</Text>
                <Text style={styles.abbrText}>bpm</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a Heart Rate Monitor
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 10,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  abbrText: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: "bold",
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
