import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from "react-native";
import CustomButton from "../../components/CustomButton";

// ───────────────────────────────────────────────
// index.tsx — Parent Component
// Owns the ONE source of truth: `count` (React state).
// CustomButton is a dumb child — it never touches state
// directly. The parent hands it:
//   • PROPS DATA    → not needed by the buttons here,
//                      only CounterDisplay-style readout below
//   • PROPS FUNCTION → handleAdd / handleMinus / handleReset
// Whenever a child calls its prop function, the parent's
// setCount runs, state updates, and React re-renders the
// whole tree downward — that's the one-way data flow.
// ───────────────────────────────────────────────

const STARTING_GOLD = 100;

export default function Index() {
  const [count, setCount] = useState(STARTING_GOLD);

  const handleAdd = () => setCount((prev) => prev + 1);
  const handleMinus = () => setCount((prev) => prev - 1);
  const handleReset = () => setCount(STARTING_GOLD);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bg}>
        <Text style={styles.eyebrow}>SECRET SHOP</Text>
        <Text style={styles.title}>Ako ang Parent Screen</Text>

        {/* ── Aegis-style gold readout (state, owned by parent) ── */}
        <View style={styles.aegisOuter}>
          <View style={styles.aegisRing}>
            <Text style={styles.goldIcon}>⛁</Text>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.goldLabel}>GOLD</Text>
          </View>
        </View>

        {/* ── Child component: CounterDisplay-equivalent buttons ── */}
        <View style={styles.panel}>
          <Text style={styles.panelHeader}>ITO ANG CHILD COMPONENT</Text>
          <Text style={styles.panelSub}>(CustomButton.tsx)</Text>

          <CustomButton
            label="Add Count"
            caption="Pick up gold"
            glyph="⚔"
            variant="radiant"
            onAction={handleAdd}
            holdToRepeat
          />
          <CustomButton
            label="Minus Count"
            caption="Spend gold"
            glyph="🗡"
            variant="dire"
            onAction={handleMinus}
            holdToRepeat
          />
          <CustomButton
            label="Reset Count"
            caption="Recall to base"
            glyph="⌂"
            variant="recall"
            onAction={handleReset}
          />
        </View>

        <Text style={styles.footnote}>
          Hold a button to channel — gold ticks continuously, just like
          holding right-click on a creep.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0d0a07",
  },
  bg: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    alignItems: "center",
  },
  eyebrow: {
    color: "#c9a227",
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: "700",
    marginBottom: 4,
  },
  title: {
    color: "#f4e9c9",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 22,
    textAlign: "center",
  },
  aegisOuter: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#1a140c",
    borderWidth: 3,
    borderColor: "#6b4f1d",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
    shadowColor: "#ffd76a",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  aegisRing: {
    width: 162,
    height: 162,
    borderRadius: 81,
    borderWidth: 2,
    borderColor: "#c9a227",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#241a0e",
  },
  goldIcon: {
    fontSize: 20,
    color: "#ffd76a",
    marginBottom: 2,
  },
  countText: {
    fontSize: 46,
    fontWeight: "900",
    color: "#ffd76a",
    letterSpacing: 1,
  },
  goldLabel: {
    fontSize: 11,
    letterSpacing: 4,
    color: "#c9a227",
    marginTop: 2,
  },
  panel: {
    width: "100%",
    backgroundColor: "#15110b",
    borderWidth: 2,
    borderColor: "#3c3318",
    borderRadius: 14,
    padding: 16,
  },
  panelHeader: {
    color: "#f4e9c9",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  panelSub: {
    color: "#8a7d5e",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 12,
  },
  footnote: {
    color: "#8a7d5e",
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 10,
    lineHeight: 16,
  },
});