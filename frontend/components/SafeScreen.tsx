import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { ReactNode } from "react";

type SafeScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function SafeScreen({ children, style }: SafeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
