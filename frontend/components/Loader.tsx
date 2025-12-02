import {
  View,
  ActivityIndicator,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import COLORS from "../constants/colors";

type LoaderProps = {
  size?: number | "small" | "large";
  color?: string;
  message?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Loader({
  size = "large",
  color = COLORS.primary,
  message = "Loading...",
  style,
  textStyle,
}: LoaderProps) {
  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        },
        style,
      ]}
    >
      <ActivityIndicator size={size} color={color} />
      <Text style={[{ marginTop: 10, color }, textStyle]}>{message}</Text>
    </View>
  );
}
