// components/CustomDrawer.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CustomDrawer(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: "#eff6ff",
        borderRadius: 20,
      }}
    >
      <LinearGradient
        // pointerEvents={"none"}
        style={{
          flex: 1,
          marginTop: -30,
          marginBottom: -60,
          marginHorizontal: -20,
          borderRadius: 40,
        }}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={["#fef2f2", "#eff6ff"]}
      >
        <View style={{ marginTop: 20, flex: 1, marginHorizontal: 20 }}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={["#DC2626", "#2563EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconWrapper}
            >
              <View style={styles.iconBackground}>
                <MaterialCommunityIcons
                  name="cards-spade-outline"
                  size={50}
                  color="white"
                />
              </View>
            </LinearGradient>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Hand & Foot</Text>
              <Text style={styles.subTitle}>Shuffle, Score, Repeat</Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <DrawerItemList {...props} />
          </View>
        </View>
      </LinearGradient>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: "row",
    gap: 25,
    alignItems: "center",
    paddingVertical: 24,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f4",
    marginBottom: 10,
    marginTop: 10,
  },
  iconWrapper: {
    width: 78,
    height: 78,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#b91c1c",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "semibold",
  },
});
