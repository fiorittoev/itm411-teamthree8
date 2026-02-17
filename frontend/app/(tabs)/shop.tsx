import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  DeviceEventEmitter,
} from "react-native";
import { useState, useEffect } from "react";


export default function Shop() {
  // Track active popup
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  useEffect(() => {
  const sub = DeviceEventEmitter.addListener("closeShopPopup", () => {
    setActivePopupId(null);
  });

  return () => sub.remove();
}, []);
  useEffect(() => {
  const sub = DeviceEventEmitter.addListener("closeShopPopup", () => {
    setActivePopupId(null);
  });

  return () => sub.remove();
}, []);

  // Popup position
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  // Real listings (later from database)
  const listings: any[] = [];

  // Show placeholders if empty
  const placeholders = Array.from({ length: 8 }).map((_, i) => ({
    id: `placeholder-${i}`,
    placeholder: true,
  }));

  const data = listings.length === 0 ? placeholders : listings;

  const renderItem = ({ item }: any) => {
    // Placeholder card
    if (item.placeholder) {
      return (
        <View style={styles.card}>
          <Pressable
            style={styles.plusBtn}
            onPress={(e) => {
  const { pageX, pageY } = e.nativeEvent;

  // Close EVERYTHING first
  DeviceEventEmitter.emit("closeBottomPopup");
  DeviceEventEmitter.emit("closeShopPopup");

  // Set new position
  setPopupPos({ x: pageX, y: pageY });

  // Open popup immediately
  setActivePopupId(item.id);
}}
          >
            <Text style={styles.plus}>+</Text>
          </Pressable>
        </View>
      );
    }

    // Real listing (future)
    return (
      <Pressable style={styles.card}>
        <Text>{item.title}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* POPUP */}
      {activePopupId && (
        <>
          {/* Overlay */}
          <Pressable
            style={styles.overlay}
            pointerEvents={activePopupId ? "auto" : "none"}
            onPress={() => setActivePopupId(null)}
          />

          {/* Popup */}
          <View
            style={[
              styles.popup,
              {
                left: popupPos.x - 70,
                top: popupPos.y - 60,
              },
            ]}
          >
            <Pressable
              style={styles.popupBtn}
              onPress={() => setActivePopupId(null)}
            >
              <Text style={styles.popupText}>Create Listing</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* GRID */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!activePopupId}
      />
    </View>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  list: {
    padding: 16,
    paddingBottom: 100,
  },

  card: {
    flex: 1,
    height: 300,

    margin: 8,

    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",
  },

  plusBtn: {
    padding: 20,
  },

  plus: {
    fontSize: 48,
    fontWeight: "600",
    color: "#555",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  popup: {
    position: "absolute",

    backgroundColor: "#4F728C",
    padding: 12,

    borderRadius: 12,
    zIndex: 10,
  },

  popupBtn: {
    backgroundColor: "#eee",

    paddingVertical: 10,
    paddingHorizontal: 24,

    borderRadius: 8,
  },

  popupText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
