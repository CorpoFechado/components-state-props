import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import CustomButton from "../../components/CustomButton";

// ───────────────────────────────────────────────
// index.tsx — Parent Component (refactored)
// Owns BOTH the count state AND the single "what's
// currently being held" timer. Because everything lives
// in one place, handleReset can always force-stop any
// hold in progress — no orphaned intervals possible.
// ───────────────────────────────────────────────

const STARTING_GOLD = 100;
const INITIAL_DELAY = 380; // ms before holding starts repeating
const REPEAT_INTERVAL = 90; // ms between repeats while held

type ActiveAction = "add" | "minus" | null;

export default function Index() {
  const [count, setCount] = useState(STARTING_GOLD);
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);

  // Only ONE set of timer refs for the whole screen, instead of
  // one per button. Whoever is "active" owns them.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = (delta: number) => setCount((prev) => prev + delta);

  const stopHolding = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveAction(null);
  };

  const startHolding = (action: ActiveAction, delta: number) => {
    // Safety: if something else was already running, kill it first.
    // This means only ONE button can ever be auto-repeating at a time,
    // no matter how many fingers are on the screen.
    stopHolding();

    setActiveAction(action);
    step(delta); // fire once immediately, like a normal tap

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        step(delta);
      }, REPEAT_INTERVAL);
    }, INITIAL_DELAY);
  };

  const handleAddIn = () => startHolding("add", 1);
  const handleMinusIn = () => startHolding("minus", -1);
  const handleReleaseOut = () => stopHolding();

  const handleReset = () => {
    stopHolding(); // <-- the actual bug fix: kill ANY running hold first
    setCount(STARTING_GOLD);
  };

  React.useEffect(() => stopHolding, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bg}>
        <Text style={styles.eyebrow}>SHOPKEEPER'S LEDGER</Text>
        <Text style={styles.title}>Ako ang Parent Screen</Text>

        {/* ── Aegis-style gold readout (state, owned by parent) ── */}
        <View style={styles.aegisOuter}>
          <View style={styles.aegisRing}>
            <Text style={styles.goldIcon}>⛁</Text>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.goldLabel}>GOLD</Text>
          </View>
        </View>

        {/* ── Child components: dumb CustomButtons ── */}
        <View style={styles.panel}>
          <Text style={styles.panelHeader}>ITO ANG CHILD COMPONENT</Text>
          <Text style={styles.panelSub}>(CustomButton.tsx)</Text>

          <CustomButton
            label="Add Count"
            caption="Pick up gold"
            glyph="⚔"
            variant="radiant"
            onPressIn={handleAddIn}
            onPressOut={handleReleaseOut}
          />
          <CustomButton
            label="Minus Count"
            caption="Spend gold"
            glyph="🗡"
            variant="dire"
            onPressIn={handleMinusIn}
            onPressOut={handleReleaseOut}
          />
          <CustomButton
            label="Reset Count"
            caption="Recall to base"
            glyph="⌂"
            variant="recall"
            onPressIn={handleReset}
            onPressOut={() => {}}
          />
        </View>

        <Text style={styles.footnote}>
          Hold a button to channel — gold ticks continuously. Reset always
          interrupts any channel in progress, just like a forced recall.
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