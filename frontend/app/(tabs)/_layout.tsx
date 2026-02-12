import { Tabs } from 'expo-router';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{headerShown: true,}}>
      <Tabs.Screen name="home"/>
      <Tabs.Screen name="explore"/>
    </Tabs>
  );
}
