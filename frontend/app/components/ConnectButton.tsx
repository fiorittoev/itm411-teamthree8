import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { mainStyles as s } from '../styles/main/mainStyles';
import { api, ConnectionStatus } from '../../services/api';

interface ConnectButtonProps {
  userId: string;
}

export function ConnectButton({ userId }: ConnectButtonProps) {
  const [status, setStatus] = useState<ConnectionStatus>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.connections
      .status(userId)
      .then((r) => setStatus(r.status))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handlePress = async () => {
    try {
      setLoading(true);
      if (status === 'none') {
        await api.connections.send(userId);
        setStatus('pending_sent');
      } else if (status === 'pending_sent') {
        await api.connections.remove(userId);
        setStatus('none');
      } else if (status === 'pending_received') {
        await api.connections.respond(userId, 'accept');
        setStatus('accepted');
      } else if (status === 'accepted') {
        await api.connections.remove(userId);
        setStatus('none');
      }
    } catch (e: any) {
      Alert.alert(
        'Connection Error',
        e.message ?? 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator color="#4F728C" />;

  const label = {
    none: 'Connect',
    pending_sent: 'Cancel Request',
    pending_received: 'Accept Request',
    accepted: 'Connected',
  }[status];

  const btnStyle = {
    none: s.btnBlue,
    pending_sent: s.btnCancel,
    pending_received: s.btnBlue,
    accepted: s.btnCancel,
  }[status];

  const textStyle = {
    none: s.btnText,
    pending_sent: s.btnCancelText,
    pending_received: s.btnText,
    accepted: s.btnCancelText,
  }[status];

  return (
    <TouchableOpacity style={[s.btn, btnStyle]} onPress={handlePress}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}
