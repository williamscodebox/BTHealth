import { View, Text } from "react-native";
import { Image } from "expo-image";
import styles from "../assets/styles/profile.styles";
import { formatMemberSince } from "../lib/utils";
import { useAppStore } from "@/store/Store";

export default function ProfileHeader() {
  const { user } = useAppStore();

  if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} />

      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>
          🗓️ Joined {formatMemberSince(user.createdAt)}
        </Text>
      </View>
    </View>
  );
}
