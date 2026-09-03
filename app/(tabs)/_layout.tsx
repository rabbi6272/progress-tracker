import React from 'react';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTabBar';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Colors } from '@/constants/theme';
import { Text, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        headerShown: false,
        animation: 'shift',
        tabBarStyle: {
          height: 80,
          paddingTop: 10,
        },
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarLabel(props) {
          return <Text style={{ fontFamily: props.focused ? 'InterSemiBold' : 'InterMedium', fontSize: 11, color: props.color, paddingTop: 2 }}>{props.children}</Text>;
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ flex: 1, paddingHorizontal: 13, backgroundColor: focused ? Colors.card : 'transparent', borderRadius: 30, }}>
              <SvgIcon name="home" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ flex: 1, paddingHorizontal: 13, backgroundColor: focused ? Colors.card : 'transparent', borderRadius: 30, }}>
              <SvgIcon name="courses" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="routine"
        options={{
          title: 'Routine',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ flex: 1, paddingHorizontal: 13, backgroundColor: focused ? Colors.card : 'transparent', borderRadius: 30, }}>
              <SvgIcon name="calendar" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="targets"
        options={{
          title: 'Targets',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ flex: 1, paddingHorizontal: 13, backgroundColor: focused ? Colors.card : 'transparent', borderRadius: 30, }}>
              <SvgIcon name="targets" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ flex: 1, paddingHorizontal: 13, backgroundColor: focused ? Colors.card : 'transparent', borderRadius: 30, }}>
              <SvgIcon name="user" size={28} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
