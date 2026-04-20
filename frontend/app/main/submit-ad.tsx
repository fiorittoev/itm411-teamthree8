import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, Alert, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { mainStyles as s } from '../styles/main/mainStyles';
import { api, AdOut } from '../../services/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../styles/theme';

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
        'Ad Submitted',
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
    if (status === 'approved') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    return 'Pending';
  };

  return (
    <SafeAreaView style={[s.safe, isMobile && s.safeMobile]}>
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl, gap: SPACING.md }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={[TYPOGRAPHY.h2, { color: COLORS.text }]}>Submit an Ad</Text>
        </View>

        {/* Info banner */}
        <View style={{
          backgroundColor: COLORS.backgroundLight, borderRadius: 10, padding: SPACING.md, marginBottom: SPACING.lg,
          borderLeftWidth: 4, borderLeftColor: COLORS.primary,
        }}>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.text, lineHeight: 20 }]}>
            Sponsored ads appear in community and home feeds every few posts with a clear "Sponsored" label.
            After submission, an admin at <Text style={{ fontWeight: '600' }}>fiorittoev@gmail.com</Text> will
            review and approve your ad before it goes live.
          </Text>
        </View>

        {/* Form */}
        <View style={s.postBox}>
          <Text style={[s.postTitle, { marginBottom: SPACING.md }]}>New Ad</Text>

          <Text style={s.postLabel}>Ad Type</Text>
          <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg }}>
            <TouchableOpacity 
              onPress={() => setAdType('post')}
              style={[{
                paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: 20, borderWidth: 1.5,
              }, adType === 'post' ? { backgroundColor: COLORS.primary, borderColor: COLORS.primary } : { borderColor: COLORS.borderLight }]}
            >
              <Text style={[TYPOGRAPHY.bodyStrong, { fontSize: 13, color: adType === 'post' ? 'white' : COLORS.textMuted }]}>Post Ad</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setAdType('marketplace')}
              style={[{
                paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: 20, borderWidth: 1.5,
              }, adType === 'marketplace' ? { backgroundColor: COLORS.primary, borderColor: COLORS.primary } : { borderColor: COLORS.borderLight }]}
            >
              <Text style={[TYPOGRAPHY.bodyStrong, { fontSize: 13, color: adType === 'marketplace' ? 'white' : COLORS.textMuted }]}>Listing Ad</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.postLabel}>Ad Headline *</Text>
          <TextInput
            style={s.postInput}
            placeholder="Short, eye-catching title"
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={80}
          />

          <Text style={[s.postLabel, { marginTop: SPACING.md }]}>Ad Body *</Text>
          <TextInput
            style={[s.postInput, { minHeight: 80, textAlignVertical: 'top' }]}
            placeholder="Describe your product or service..."
            placeholderTextColor={COLORS.textMuted}
            value={body}
            onChangeText={setBody}
            multiline
            maxLength={500}
          />

          <Text style={[s.postLabel, { marginTop: SPACING.md }]}>Link URL (optional)</Text>
          <TextInput
            style={s.postInput}
            placeholder="https://yourbusiness.com"
            placeholderTextColor={COLORS.textMuted}
            value={linkUrl}
            onChangeText={setLinkUrl}
            keyboardType="url"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[s.btn, s.btnBlue, { marginTop: SPACING.lg, opacity: submitting ? 0.6 : 1 }]}
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
        <Text style={[TYPOGRAPHY.h3, { color: COLORS.text, marginTop: SPACING.xl, marginBottom: SPACING.md }]}>
          My Ad Requests
        </Text>

        {loadingAds ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : myAds.length === 0 ? (
          <Text style={[TYPOGRAPHY.body, { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.md }]}>
            No ad requests yet.
          </Text>
        ) : (
          myAds.map((ad) => (
            <View key={ad.id} style={{
              backgroundColor: COLORS.surface, borderRadius: 10, padding: SPACING.md,
              marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.borderLight,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text style={[TYPOGRAPHY.bodyStrong, { flex: 1, color: COLORS.text }]}>{ad.title}</Text>
                <Text style={[TYPOGRAPHY.caption, { fontWeight: '600', color: statusColor(ad.status) }]}>
                  {statusLabel(ad.status)}
                </Text>
              </View>
              <Text style={[TYPOGRAPHY.body, { color: COLORS.textMuted, marginTop: SPACING.xs }]}>{ad.body}</Text>
              {ad.link_url ? (
                <Text style={[TYPOGRAPHY.caption, { color: COLORS.primary, marginTop: SPACING.xs }]}>{ad.link_url}</Text>
              ) : null}
              <Text style={[TYPOGRAPHY.tiny, { color: COLORS.borderDark, marginTop: SPACING.xs }]}>
                Submitted {new Date(ad.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
