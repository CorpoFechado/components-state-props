import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";

// ───────────────────────────────────────────────
// CustomButton — Child Component (refactored, "dumb")
// No timers, no setInterval, no logic of its own anymore.
// It only forwards raw press events up to the parent via
// PROPS FUNCTIONS (onPressIn / onPressOut). The PARENT
// decides what holding/releasing actually means.
// ───────────────────────────────────────────────

export type ButtonVariant = "radiant" | "dire" | "recall";

interface CustomButtonProps {
  label: string;
  caption: string;
  glyph: string;
  variant: ButtonVariant;
  onPressIn: () => void;
  onPressOut: () => void;
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

export default function CustomButton({
  label,
  caption,
  glyph,
  variant,
  onPressIn,
  onPressOut,
}: CustomButtonProps) {
  const colors = VARIANT_STYLES[variant];

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? colors.pressed : colors.base,
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