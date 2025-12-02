import { Text, TouchableOpacity, Alert } from "react-native";
import styles from "../assets/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { useAppStore } from "@/store/Store";

export default function LogoutButton() {
  const logout = useAppStore((state) => state.logout);

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => await logout(),
        style: "destructive",
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}
