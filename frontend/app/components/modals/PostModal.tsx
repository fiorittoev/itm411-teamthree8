import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { mainStyles as s } from '../../styles/main/mainStyles';
import { api, PostOut } from '../../../services/api';

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  onPosted: () => void;
  communityId?: string;
}

export function PostModal({
  visible,
  onClose,
  onPosted,
  communityId,
}: PostModalProps) {
  const [postContent, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [currentAuthorId, setCurrentAuthorId] = useState<string | null>(null);

  const submitPost = async () => {
    const content = postContent.trim();
    if (!content) {
      return;
    }
    setPosting(true);
    try {
      const newPost = await api.post<PostOut>('/posts', {
        title: content.slice(0, 80),
        content,
        post_type: 'general',
        community_id: communityId,
      });
      if (!currentAuthorId) {
        setCurrentAuthorId(newPost.author_id);
      }
      setContent('');
      onPosted();
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        style={s.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.modalBox}>
          <Text style={s.modalTitle}>Create Post</Text>
          <TextInput
            style={s.postInput}
            placeholder="What's happening at the lake?"
            multiline
            numberOfLines={4}
            value={postContent}
            onChangeText={setContent}
            autoFocus
          />
          <View style={s.modalActions}>
            <TouchableOpacity
              style={[s.btn, s.btnCancel]}
              onPress={() => {
                setContent('');
                onClose();
              }}
            >
              <Text style={s.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.btn, s.btnBlue]}
              onPress={submitPost}
              disabled={posting}
            >
              {posting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={s.btnText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
