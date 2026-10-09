import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, layout, radius, space } from '@/constants/theme';

/**
 * Tab definitions matching the Figma bottom bar: five 78pt columns, a 52x30
 * light-green pill behind the active icon, an indigo 20x3 indicator pinned to
 * the top edge, and indigo icon/label for the active tab.
 */
const TABS = [
  { name: 'index', label: 'Dashboard', icon: 'home-outline', activeIcon: 'home' },
  { name: 'inventory', label: 'Inventory', icon: 'package-variant-closed', activeIcon: 'package-variant-closed' },
  { name: 'pos', label: 'POS', icon: 'cart-outline', activeIcon: 'cart' },
  { name: 'payment', label: 'Payment', icon: 'credit-card-outline', activeIcon: 'credit-card-outline' },
  { name: 'reports', label: 'Reports', icon: 'chart-bar', activeIcon: 'chart-bar' },
] as const;

function TabItem({ tab, focused }: { tab: (typeof TABS)[number]; focused: boolean }) {
  return (
    <View style={styles.item}>
      {focused ? <View style={styles.indicator} /> : null}
      <View style={[styles.pill, focused && styles.pillActive]}>
        <MaterialCommunityIcons
          name={(focused ? tab.activeIcon : tab.icon) as never}
          size={22}
          color={focused ? colors.indigo : colors.textSecondary}
        />
      </View>
      <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
        {tab.label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const tab = TABS.find((t) => t.name === route.name) ?? TABS[0];

        return {
          headerShown: false,
          tabBarShowLabel: false,
          sceneStyle: { backgroundColor: colors.bg },
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabItem,
          tabBarIcon: ({ focused }) => <TabItem tab={tab} focused={focused} />,
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="inventory" options={{ title: 'Inventory' }} />
      <Tabs.Screen name="pos" options={{ title: 'POS' }} />
      <Tabs.Screen name="payment" options={{ title: 'Payment' }} />
      <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: layout.tabBarHeight,
    paddingTop: space.sm,
    paddingBottom: space.md,
    backgroundColor: colors.card,
    borderTopWidth: 2,
    borderTopColor: colors.divider,
  },
  tabItem: {
    paddingVertical: 0,
  },
  item: {
    width: 78,
    alignItems: 'center',
    gap: 2,
  },
  indicator: {
    position: 'absolute',
    top: -space.sm,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.indigo,
  },
  pill: {
    width: 52,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.greenSoft,
  },
  label: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActive: {
    fontWeight: '600',
    color: colors.indigo,
  },
});