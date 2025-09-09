import { Tabs } from 'expo-router';
import React from 'react';
import CustomTabBar from '@/components/ui/custom/nav/CustomTabBar'

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
        }}
      />

      <Tabs.Screen
        name="translate"
        options={{
          title: 'Translate',
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}