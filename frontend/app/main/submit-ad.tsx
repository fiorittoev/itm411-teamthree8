import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, Alert, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { mainStyles as s } from '../styles/main/mainStyles';
import { api, AdOut } from '../../services/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SubmitAdScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [adType, setAdType] = useState<'post' | 'marketplace'>('post');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myAds, setMyAds] = useState<AdOut[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const ads = await api.ads.listMine();
        setMyAds(ads);
      } catch {
        // ignore
      } finally {
        setLoadingAds(false);
      }
    })();
  }, [submitted]);

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Required', 'Please enter an ad title and body text.');
      return;
    }
    setSubmitting(true);
    try {
      await api.ads.submit({
        title: title.trim(),
        body: body.trim(),
        ad_type: adType,
        link_url: linkUrl.trim() || undefined,
      });
      setTitle('');
      setBody('');
      setLinkUrl('');
      setSubmitted((prev) => !prev); // trigger reload
      Alert.alert(
        '✅ Ad Submitted',
        'Your ad request has been sent for approval. You\'ll be notified when it goes live.',
        [{ text: 'OK' }],
      );
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to submit ad');
    } finally {
      setSubmitting(false);
    }
  }

  const statusColor = (status: string) => {
    if (status === 'approved') return '#2e7d32';
    if (status === 'rejected') return '#c62828';
    return '#e65100';
  };

  const statusLabel = (status: string) => {
    if (status === 'approved') return '✅ Approved';
    if (status === 'rejected') return '❌ Rejected';
    return '⏳ Pending';
  };

  return (
    <SafeAreaView style={[s.safe, isMobile && s.safeMobile]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#4F728C" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#222' }}>Submit an Ad</Text>
        </View>

        {/* Info banner */}
        <View style={{
          backgroundColor: '#e8f4f8', borderRadius: 10, padding: 14, marginBottom: 20,
          borderLeftWidth: 4, borderLeftColor: '#4F728C',
        }}>
          <Text style={{ fontSize: 13, color: '#333', lineHeight: 20 }}>
            Sponsored ads appear in community and home feeds every few posts with a clear "Sponsored" label.
            After submission, an admin at <Text style={{ fontWeight: '600' }}>fiorittoev@gmail.com</Text> will
            review and approve your ad before it goes live.
          </Text>
        </View>

        {/* Form */}
        <View style={s.postBox}>
          <Text style={[s.postTitle, { marginBottom: 14 }]}>New Ad</Text>

          <Text style={s.postLabel}>Ad Type</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
            <TouchableOpacity 
              onPress={() => setAdType('post')}
              style={[{
                paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
              }, adType === 'post' ? { backgroundColor: '#4F728C', borderColor: '#4F728C' } : { borderColor: '#ccc' }]}
            >
              <Text style={{ fontWeight: '600', fontSize: 13, color: adType === 'post' ? 'white' : '#666' }}>Post Ad</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setAdType('marketplace')}
              style={[{
                paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
              }, adType === 'marketplace' ? { backgroundColor: '#4F728C', borderColor: '#4F728C' } : { borderColor: '#ccc' }]}
            >
              <Text style={{ fontWeight: '600', fontSize: 13, color: adType === 'marketplace' ? 'white' : '#666' }}>Listing Ad</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.postLabel}>Ad Headline *</Text>
          <TextInput
            style={s.postInput}
            placeholder="Short, eye-catching title"
            value={title}
            onChangeText={setTitle}
            maxLength={80}
          />

          <Text style={[s.postLabel, { marginTop: 12 }]}>Ad Body *</Text>
          <TextInput
            style={[s.postInput, { minHeight: 80, textAlignVertical: 'top' }]}
            placeholder="Describe your product or service..."
            value={body}
            onChangeText={setBody}
            multiline
            maxLength={500}
          />

          <Text style={[s.postLabel, { marginTop: 12 }]}>Link URL (optional)</Text>
          <TextInput
            style={s.postInput}
            placeholder="https://yourbusiness.com"
            value={linkUrl}
            onChangeText={setLinkUrl}
            keyboardType="url"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[s.btn, s.btnBlue, { marginTop: 16, opacity: submitting ? 0.6 : 1 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color="white" size="small" />
              : <Text style={s.btnText}>Submit for Approval</Text>
            }
          </TouchableOpacity>
        </View>

        {/* My ads */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#222', marginTop: 24, marginBottom: 10 }}>
          My Ad Requests
        </Text>

        {loadingAds ? (
          <ActivityIndicator color="#4F728C" />
        ) : myAds.length === 0 ? (
          <Text style={{ color: '#888', textAlign: 'center', marginTop: 8 }}>
            No ad requests yet.
          </Text>
        ) : (
          myAds.map((ad) => (
            <View key={ad.id} style={{
              backgroundColor: 'white', borderRadius: 10, padding: 14,
              marginBottom: 10, borderWidth: 1, borderColor: '#eee',
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text style={{ fontWeight: '700', fontSize: 15, flex: 1, color: '#222' }}>{ad.title}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: statusColor(ad.status) }}>
                  {statusLabel(ad.status)}
                </Text>
              </View>
              <Text style={{ color: '#555', marginTop: 4, fontSize: 13 }}>{ad.body}</Text>
              {ad.link_url ? (
                <Text style={{ color: '#4F728C', fontSize: 12, marginTop: 4 }}>{ad.link_url}</Text>
              ) : null}
              <Text style={{ color: '#aaa', fontSize: 11, marginTop: 6 }}>
                Submitted {new Date(ad.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
