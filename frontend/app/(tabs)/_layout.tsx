import { Tabs } from "expo-router";
import { Text, StyleSheet, View, Pressable, DeviceEventEmitter } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSegments } from "expo-router";

export default function TabLayout() {
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
  const sub = DeviceEventEmitter.addListener(
    "closeBottomPopup",
    () => {
      setShowMenu(false);
    }
  );

  return () => sub.remove();
}, []);
  const segments = useSegments();
const route = { name: segments[segments.length - 1] };

  return (
    <View style={{ flex: 1 }}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MyMichiganLake</Text>

        <View style={styles.profile}>
           <Ionicons name="person-outline" size={22} color="#f2f2f2" />
        </View>
      </View>

      {/* POPUP */}
      {showMenu && (
  <>
    {/* Overlay */}
    <Pressable
      style={styles.overlay}
      pointerEvents={showMenu ? "auto" : "none"}
      onPress={() => setShowMenu(false)}
    />

    {/* Popup */}
    <View style={styles.menu}>
      <Pressable
  style={styles.menuBtn}
  onPress={() => {
    DeviceEventEmitter.emit("createPost");
    setShowMenu(false);
  }}
>
  <Text>New Post</Text>
</Pressable>

      <Pressable style={styles.menuBtn}>
        <Text>New Listing</Text>
      </Pressable>
    </View>
  </>
)}

      {/* TABS */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.nav,
        }}
      >

        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: () => (
              <View style={styles.iconBox}>
                <Ionicons name="home-outline" size={24} color="#f2f2f2" />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="shop"
          options={{
            tabBarIcon: () => (
              <View style={styles.iconBox}>
                <Ionicons name="cart-outline" size={24} color="#f2f2f2" />
              </View>
            ),
          }}
        />

        {/* CENTER BUTTON (CONNECTED TO add.tsx) */}
        <Tabs.Screen
          name="add"
          options={{
            tabBarButton: () => (
              <Pressable
                onPress={() => {
                    DeviceEventEmitter.emit("closeShopPopup");
                    setShowMenu((p) => !p);
                    }}
                style={styles.plusWrapper}
              >
                <View style={styles.plusBox}>
                  <Text style={styles.plus}>+</Text>
                </View>
              </Pressable>
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: () => (
              <View style={styles.iconBox}>
                <Ionicons name="search-outline" size={24} color="#f2f2f2" />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: () => (
              <View style={styles.iconBox}>
                <Ionicons name="settings-outline" size={24} color="#f2f2f2" />
              </View>
            ),
          }}
        />

      </Tabs>
    </View>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
},
  header: {
    height: 70,
    backgroundColor: "#4F728C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontSize: 22,
    color: "#f2f2f2",
    fontWeight: "600",
  },

  profile: {
    width: 38,
    height: 38,
    borderWidth: 2,
    borderColor: "#f2f2f2",
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  nav: {
    backgroundColor: "#4F728C",
    height: 75,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 22,
  },

  plusWrapper: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -28 }],
    top: 7,
  },

  plusBox: {
    width: 56,
    height: 56,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  plus: {
    fontSize: 28,
    fontWeight: "600",
  },

  menu: {
    position: "absolute",
    bottom: 95,
    alignSelf: "center",
    backgroundColor: "#4F728C",
    padding: 12,
    borderRadius: 12,
    zIndex: 10,
  },

  menuBtn: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: "center",
  },
});
