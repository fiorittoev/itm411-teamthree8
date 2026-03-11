import {Stack } from 'expo-router';
import {View, Text, TouchableOpacity} from 'react-native';
import { mainStyles as s } from '../styles/main/mainStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function TabLayout() {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      {/* NAV */}
      <View style={s.navbar}>
        <Text style={s.logo}>MyMichiganLake</Text>
        <View style={s.navIcons}>
          <TouchableOpacity onPress={() => router.push('/main')}>
            <Ionicons name="home-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/main/communities')}>
            <Ionicons name="water-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/main/marketplace')}>
            <Ionicons name="cart-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/main/search')}>
            <Ionicons name="search" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push('/main/profile')}>
          <View style={s.profileCircle}>
            <Ionicons name="person-outline" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="marketplace" />
        <Stack.Screen name="search" />
        <Stack.Screen name="communities" />
        <Stack.Screen name="profile" />
      </Stack>
    </View>
  );
}
