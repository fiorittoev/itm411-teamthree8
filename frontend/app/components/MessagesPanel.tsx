import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  FlatList, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, ConversationOut, MessageOut } from '../../services/api';
import { mainStyles as s } from '../styles/main/mainStyles';
import { UserListItem } from './ui/UserListItem';
import { PanelHeader } from './ui/PanelHeader';

export function MessagesPanel({ 
  onClose, 
  currentUserId,
  initialChatId = null,
  initialChatName = ''
}: { 
  onClose: () => void, 
  currentUserId: string | null,
  initialChatId?: string | null,
  initialChatName?: string
}) {
  const [conversations, setConversations] = useState<ConversationOut[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId);
  const [activeChatName, setActiveChatName] = useState<string>(initialChatName);
  const [messages, setMessages] = useState<MessageOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  
  const messagesEndRef = useRef<FlatList>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    }
  }, [activeChatId]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const convos = await api.messages.list();
      setConversations(convos);
    } catch {
      Alert.alert('Error', 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId: string) => {
    setLoading(true);
    try {
      const msgs = await api.messages.get(userId);
      setMessages(msgs);
    } catch {
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !activeChatId) return;
    try {
      const newMsg = await api.messages.send(activeChatId, inputText.trim());
      setMessages(prev => [...prev, newMsg]);
      setInputText('');
      setTimeout(() => messagesEndRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const openChat = (userId: string, username: string) => {
    setActiveChatId(userId);
    setActiveChatName(username);
  };

  const formatMessageTime = (iso: string) => {
      const date = new Date(iso);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderConversation = ({ item }: { item: ConversationOut }) => {
    const isUnread = !item.latest_message.is_read && item.latest_message.sender_id !== currentUserId;
    const prefix = item.latest_message.sender_id === currentUserId ? 'You: ' : '';
    
    return (
      <UserListItem
        onPress={() => openChat(item.other_user_id, item.other_username)}
        avatarUrl={item.profile_image_url}
        title={item.other_username}
        subtitle={`${prefix}${item.latest_message.content}`}
        subtitleBold={isUnread}
      />
    );
  };

  const renderMessage = ({ item }: { item: MessageOut }) => {
    const isMe = item.sender_id === currentUserId;
    return (
      <View style={{
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        backgroundColor: isMe ? '#4F728C' : '#e0e0e0',
        padding: 10,
        borderRadius: 16,
        maxWidth: '80%',
        marginVertical: 4,
        marginHorizontal: 10
      }}>
        <Text style={{ color: isMe ? 'white' : 'black' }}>{item.content}</Text>
        <Text style={{ fontSize: 10, color: isMe ? '#cde' : '#888', alignSelf: 'flex-end', marginTop: 4 }}>
            {formatMessageTime(item.created_at)}
        </Text>
      </View>
    );
  };

  if (activeChatId) {
    return (
      <KeyboardAvoidingView style={[s.connectionsPanel, { paddingBottom: 10 }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <PanelHeader 
          title={activeChatName} 
          onClose={onClose} 
          onBack={() => { setActiveChatId(null); loadConversations(); }} 
        />

        {/* Message List */}
        {loading ? (
             <ActivityIndicator color="#4F728C" style={{ marginTop: 20, flex: 1 }} />
        ) : (
            <FlatList
                ref={messagesEndRef}
                data={messages}
                keyExtractor={m => m.id}
                renderItem={renderMessage}
                contentContainerStyle={{ paddingVertical: 10 }}
                onContentSizeChange={() => messagesEndRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => messagesEndRef.current?.scrollToEnd({ animated: true })}
            />
        )}
        
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10, borderTopWidth: 1, borderColor: '#eee' }}>
            <TextInput
                 style={s.postInput}
                 placeholder="Type a message..."
                 value={inputText}
                 onChangeText={setInputText}
                 multiline
            />
            <TouchableOpacity onPress={sendMessage} style={{ padding: 10, marginLeft: 5 }}>
                 <Ionicons name="send" size={24} color="#4F728C" />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={s.connectionsPanel}>
      <PanelHeader title="Messages" onClose={onClose} />

      {/* List */}
      {loading ? (
        <ActivityIndicator color="#4F728C" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => c.other_user_id}
          renderItem={renderConversation}
          ListEmptyComponent={
            <Text style={s.connectionEmpty}>
              No conversations yet. Connect with someone to chat!
            </Text>
          }
        />
      )}
    </View>
  );
}
