import React from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { mainStyles as s } from '../styles/main/mainStyles';

export function Loading() {
  return (
    <SafeAreaView style={[s.safe, s.centered]}>
      <ActivityIndicator size="large" color="#4F728C" />
    </SafeAreaView>   
  );
}
