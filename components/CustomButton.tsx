import React, { useRef } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  GestureResponderEvent,
} from "react-native";

// ───────────────────────────────────────────────
// CustomButton — Child Component
// Receives PROPS DATA (label, icon, variant) and a
// PROPS FUNCTION (onAction) from the parent. It does not
// own any state itself — every tap/hold just calls back
// up to whatever function the parent handed it.
// ───────────────────────────────────────────────

export type ButtonVariant = "radiant" | "dire" | "recall";

interface CustomButtonProps {
  label: string;
  caption: string;
  glyph: string;
  variant: ButtonVariant;
  onAction: () => void;
  holdToRepeat?: boolean;
}

const VARIANT_STYLES: Record<
  ButtonVariant,
  { base: string; pressed: string; border: string; glow: string }
> = {
  radiant: {
    base: "#1f4d2c",
    pressed: "#296b3a",
    border: "#7cd98c",
    glow: "#39ff6a",
  },
  dire: {
    base: "#5a1414",
    pressed: "#7a1c1c",
    border: "#ff8a65",
    glow: "#ff3b3b",
  },
  recall: {
    base: "#2b2410",
    pressed: "#3c3318",
    border: "#c9a227",
    glow: "#ffd76a",
  },
};

const INITIAL_DELAY = 380; // ms before holding starts repeating
const REPEAT_INTERVAL = 90; // ms between repeats while held

export default function CustomButton({
  label,
  caption,
  glyph,
  variant,
  onAction,
  holdToRepeat = false,
}: CustomButtonProps) {
  const colors = VARIANT_STYLES[variant];
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [pressed, setPressed] = React.useState(false);

  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePressIn = (_e: GestureResponderEvent) => {
    setPressed(true);
    // Always fire once immediately, like a normal tap
    onAction();

    if (holdToRepeat) {
      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          onAction();
        }, REPEAT_INTERVAL);
      }, INITIAL_DELAY);
    }
  };

  const handlePressOut = () => {
    setPressed(false);
    clearTimers();
  };

  React.useEffect(() => clearTimers, []);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed: rnPressed }) => [
        styles.button,
        {
          backgroundColor:
            pressed || rnPressed ? colors.pressed : colors.base,
          borderColor: colors.border,
          shadowColor: colors.glow,
        },
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.glyph, { color: colors.border }]}>{glyph}</Text>
        <View style={styles.textCol}>
          <Text style={[styles.label, { color: "#f4e9c9" }]}>{label}</Text>
          <Text style={[styles.caption, { color: colors.border }]}>
            {caption}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginVertical: 7,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  glyph: {
    fontSize: 26,
    marginRight: 14,
    width: 30,
    textAlign: "center",
  },
  textCol: {
    flexDirection: "column",
  },
  label: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },
  caption: {
    fontSize: 11,
    letterSpacing: 1.5,
    marginTop: 2,
    textTransform: "uppercase",
    opacity: 0.85,
  },
});