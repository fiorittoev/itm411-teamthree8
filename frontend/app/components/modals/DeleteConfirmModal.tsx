import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { mainStyles as s } from '../../styles/main/mainStyles';
import { api } from '../../../services/api';

interface DeleteConfirmModalProps {
  visible: boolean;
  id: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteConfirmModal({
  visible,
  id,
  onClose,
  onDeleted,
}: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!id) {
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to delete');
    } finally {
      setDeleting(false);
      onDeleted();
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.modalBox}>
          <Text style={s.modalTitle}>Delete this post?</Text>
          <View style={s.modalActions}>
            <TouchableOpacity style={[s.btn, s.btnCancel]} onPress={onClose}>
              <Text style={s.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.btn, s.btnRed]}
              onPress={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={s.btnText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
