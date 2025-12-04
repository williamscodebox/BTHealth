import { useEffect, useState } from "react";
import {
  View,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "../../constants/api";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { sleep } from ".";
import { useAppStore } from "@/store/Store";
import { BPStat } from "@/utils/types/types";
import Loader from "../../components/Loader";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function Profile() {
  const [bpStats, setBPStats] = useState<BPStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBPStatId, setDeleteBPStatId] = useState<string | null>(null);
  const { token } = useAppStore();

  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/bpStat/getStats`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch user books");

      setBPStats(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert(
        "Error",
        "Failed to load profile data. Pull down to refresh."
      );
    } finally {
      setIsLoading(false);
      console.log(bpStats);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBPStat = async (bpStatId: string) => {
    try {
      setDeleteBPStatId(bpStatId);

      const response = await fetch(`${API_URL}/bpStat/${bpStatId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete book");

      setBPStats(bpStats.filter((bpStat) => bpStat._id !== bpStatId));
      Alert.alert("Success", "Blood pressure record deleted successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to delete record");
    } finally {
      setDeleteBPStatId(null);
    }
  };

  const confirmDelete = (bpStatId: string) => {
    Alert.alert(
      "Delete Blood Pressure Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteBPStat(bpStatId),
        },
      ]
    );
  };

  const createAndSharePDF = async () => {
    try {
      // Step 1: Generate PDF from HTML
      const { uri } = await Print.printToFileAsync({
        html: `<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1><div class="confirmationBox_content">
        ${bpStats
          .map(
            (el) =>
              `<div
                  class="list"
                  key=${el._id}

                >
                  <p class="key">${el.Systolic}</p>
                  <p class="key">${el.Diastolic}</p>
                  <p class="key">${el.HeartRate}</p>
                  <p class="key">${el.Category}</p>
                  <p class="key">${el.createdAt}</p>
                </div>`
          )
          .join("")}
    </div>
  </body>
</html>
`,
      });

      console.log("Generated PDF at:", uri);

      // Step 2: Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        console.log("Sharing not available on this device");
      }
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  const renderBPItem = ({ item }: { item: BPStat }) => (
    <View style={styles.bookItem}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.Systolic?.toString() ?? ""}</Text>
        <Text style={styles.bookTitle}>{item.Diastolic?.toString() ?? ""}</Text>
        <Text style={styles.bookTitle}>{item.HeartRate?.toString() ?? ""}</Text>
        <Text style={styles.bookTitle}>{item.Category ?? ""}</Text>
        <Text style={styles.bookDate}>
          {new Date(item.createdAt)?.toLocaleDateString() ?? ""}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id)}
      >
        {deleteBPStatId === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500);
    await fetchData();
    setRefreshing(false);
    console.log(bpStats);
  };

  if (isLoading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
      <TouchableOpacity style={styles.addButton} onPress={createPDF}>
        <Text style={styles.addButtonText}>Save as PDF</Text>
      </TouchableOpacity>

      {/* YOUR RECOMMENDATIONS */}
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your blood pressure stats 📚</Text>
        <Text style={styles.booksCount}>{bpStats.length} records</Text>
      </View>

      <FlatList
        data={bpStats}
        renderItem={renderBPItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No records yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push({ pathname: "/(tabs)" })}
            >
              <Text style={styles.addButtonText}>
                Add Your First Blood Pressure Reading
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
