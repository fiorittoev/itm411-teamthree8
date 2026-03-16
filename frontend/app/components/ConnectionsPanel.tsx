import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  FlatList, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api, ConnectionProfile } from '../../services/api';
import { mainStyles as s } from '../styles/main/mainStyles';
import { UserListItem } from './ui/UserListItem';
import { PanelHeader } from './ui/PanelHeader';

interface ConnectionsPanelProps {
  onClose: () => void;
  onMessage?: (userId: string, username: string) => void;
}

export function ConnectionsPanel({ onClose, onMessage }: ConnectionsPanelProps) {
  const router = useRouter();
  const [tab, setTab] = useState<'connections' | 'requests'>('connections');
  const [connections, setConnections] = useState<ConnectionProfile[]>([]);
  const [requests, setRequests] = useState<ConnectionProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  // Debounced search re-fetches with query
  useEffect(() => {
    if (tab !== 'connections') return;
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => fetchConnections(searchQuery), 350);
    return () => { if (searchRef.current) clearTimeout(searchRef.current); };
  }, [searchQuery, tab]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [conns, reqs] = await Promise.all([
        api.connections.list(),
        api.connections.requests(),
      ]);
      setConnections(conns);
      setRequests(reqs);
    } catch {
      Alert.alert('Error', 'Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async (q: string) => {
    try {
      const conns = await api.connections.list(q);
      setConnections(conns);
    } catch {}
  };

  const respond = async (userId: string, action: 'accept' | 'decline') => {
    try {
      await api.connections.respond(userId, action);
      // Optimistically update UI
      setRequests(prev => prev.filter(r => r.id !== userId));
      if (action === 'accept') {
        const accepted = requests.find(r => r.id === userId);
        if (accepted) setConnections(prev => [accepted, ...prev]);
      }
    } catch {
      Alert.alert('Error', 'Failed to respond to request');
    }
  };

  const removeConnection = async (userId: string) => {
    try {
      await api.connections.remove(userId);
      setConnections(prev => prev.filter(c => c.id !== userId));
    } catch {
      Alert.alert('Error', 'Failed to remove connection');
    }
  };

  const goToProfile = (id: string) => {
    onClose();
    router.push(`/main/profile/${id}`);
  };

  const renderConnection = ({ item }: { item: ConnectionProfile }) => (
    <UserListItem
      avatarUrl={item.profile_image_url}
      title={item.username}
      subtitle={item.address}
      onPress={() => goToProfile(item.id)}
      actionSlot={
        <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
          {onMessage && (
            <TouchableOpacity
              onPress={() => onMessage(item.id, item.username)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#4F728C" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => removeConnection(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="person-remove-outline" size={18} color="#aaa" />
          </TouchableOpacity>
        </View>
      }
    />
  );

  const renderRequest = ({ item }: { item: ConnectionProfile }) => (
    <UserListItem
      avatarUrl={item.profile_image_url}
      title={item.username}
      subtitle={item.bio}
      actionSlot={
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity
            style={s.connectionAcceptBtn}
            onPress={() => respond(item.id, 'accept')}
          >
            <Ionicons name="checkmark" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.connectionDeclineBtn}
            onPress={() => respond(item.id, 'decline')}
          >
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>
        </View>
      }
    />
  );

  return (
    <View style={s.connectionsPanel}>
      <PanelHeader title="Connections" onClose={onClose} />

      {/* Tabs */}
      <View style={s.filterOptions}>
        <TouchableOpacity
          style={[s.filterOption, tab === 'connections' && s.filterOptionActive]}
          onPress={() => setTab('connections')}
        >
          <Text style={[s.filterOptionText, tab === 'connections' && s.filterOptionTextActive]}>
            Connected ({connections.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.filterOption, tab === 'requests' && s.filterOptionActive]}
          onPress={() => setTab('requests')}
        >
          <Text style={[s.filterOptionText, tab === 'requests' && s.filterOptionTextActive]}>
            Requests {requests.length > 0 ? `(${requests.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search — only on connections tab */}
      {tab === 'connections' && (
        <View style={s.searchInputContainer}>
          <Ionicons name="search" size={14} color="#999" />
          <TextInput
            style={s.searchInput}
            placeholder="Search connections..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* List */}
      {loading ? (
        <ActivityIndicator color="#4F728C" style={{ marginTop: 20 }} />
      ) : tab === 'connections' ? (
        <FlatList
          data={connections}
          keyExtractor={(c) => c.id}
          renderItem={renderConnection}
          ListEmptyComponent={
            <Text style={s.connectionEmpty}>
              {searchQuery.trim() ? 'No connections match your search' : 'No connections yet'}
            </Text>
          }
        />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(r) => r.id}
          renderItem={renderRequest}
          ListEmptyComponent={
            <Text style={s.connectionEmpty}>No pending requests</Text>
          }
        />
      )}
    </View>
  );
}