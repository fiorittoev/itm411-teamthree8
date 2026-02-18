import { View, Text, StyleSheet, FlatList, DeviceEventEmitter, Pressable, Modal, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

type Post = {
  id: string;
  name: string;
  text: string;
};

export default function Home() {
  // Local posts (temporary)
  const [posts, setPosts] = useState<any[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postText, setPostText] = useState("");
    // Starts empty
useEffect(() => {
  const sub = DeviceEventEmitter.addListener("createPost", () => {
    setShowPostModal(true);
  });

  return () => sub.remove();
}, []);
  const renderItem = ({ item }: any) => {
  return (
    <View style={styles.card}>
      {/* Post content */}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.text}>{item.text}</Text>

      {/* Delete button */}
      <Pressable
        style={styles.deleteBtn}
        onPress={() => {
          setPosts((prev) => prev.filter((p) => p.id !== item.id));
        }}
      >
        <Ionicons name="trash-outline" size={18} color="#f2f2f2" />
      </Pressable>
    </View>
  );
};

  return (
    <View style={styles.container}>
      <Modal
  visible={showPostModal}
  transparent
  animationType="fade"
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>New Post</Text>

      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        multiline
        value={postText}
        onChangeText={setPostText}
      />

      <View style={styles.modalActions}>
        <Pressable
          onPress={() => {
            setShowPostModal(false);
            setPostText("");
          }}
        >
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            if (!postText.trim()) return;

            const newPost = {
              id: Date.now().toString(),
              name: "You",
              text: postText,
            };

            setPosts((prev) => [newPost, ...prev]);

            setPostText("");
            setShowPostModal(false);
          }}
        >
          <Text style={styles.submit}>Post</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>

      {posts.length === 0 ? (
        <Text style={styles.empty}>No posts yet</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},

modalBox: {
  width: "85%",
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 16,
},

modalTitle: {
  fontSize: 18,
  fontWeight: "600",
  marginBottom: 10,
},

input: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 10,
  minHeight: 80,
  textAlignVertical: "top",
},

modalActions: {
  flexDirection: "row",
  justifyContent: "flex-end",
  marginTop: 12,
},

cancel: {
  marginRight: 20,
  color: "#777",
  fontSize: 16,
},

submit: {
  color: "#4F728C",
  fontSize: 16,
  fontWeight: "600",
},

  deleteBtn: {
  position: "absolute",
  bottom: 8,
  right: 8,
  padding: 4,
},
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },

  card: {
    backgroundColor: "#bfc3c6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  name: {
    fontWeight: "600",
    marginBottom: 6,
  },

  text: {
    fontSize: 15,
    lineHeight: 20,
  },
});
