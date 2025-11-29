import React, { useEffect } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Canvas, Circle, Image, useImage } from "@shopify/react-native-skia";
import { View } from "react-native";

export const PulseIndicator = () => {
  const expo = useImage(require("../img/expo.png"));
  const heart = useImage(require("../img/heart.png"));

  const interval = 1250;

  // Shared value that animates continuously
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: interval }),
      -1, // infinite repeat
      false // don’t reverse
    );
  }, []);

  // Derived values based on progress
  const scale = useDerivedValue(() => progress.value * 130);
  const opacity = useDerivedValue(() => 0.9 - progress.value);

  const scale2 = useDerivedValue(() => ((progress.value + 0.4) % 1) * 130);
  const opacity2 = useDerivedValue(() => 0.9 - ((progress.value + 0.4) % 1));

  if (!expo || !heart) {
    return <View />;
  }

  return (
    <Canvas style={{ height: 300, width: 300 }}>
      <Circle cx={150} cy={150} r={50} opacity={1} color="#FF6060"></Circle>
      <Circle cx={150} cy={150} r={scale} opacity={opacity} color="#FF6060" />
      <Circle cx={150} cy={150} r={scale2} opacity={opacity2} color="#FF6060" />
      <Image
        image={expo}
        fit="contain"
        x={125}
        y={125}
        width={50}
        height={50}
      />
    </Canvas>
  );
};
