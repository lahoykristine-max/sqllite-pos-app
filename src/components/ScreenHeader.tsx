import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout, space, type } from '@/constants/theme';

/**
 * Light-background screen header: eyebrow above a 24pt title, with an optional
 * trailing element. The Dashboard draws its own dark variant instead.
 */
export function ScreenHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + space.sm }]}>
      <View style={styles.block}>
        <Text style={styles.eyebrow} numberOfLines={1}>
          {eyebrow}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}

/** Shared content gutter so every screen lines up on the 390pt artboard. */
export function Gutter({
  children,
  style,
}: {
  children: ReactNode;
  style?: object;
}) {
  return <View style={[styles.gutter, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.gutter,
    paddingBottom: space.lg,
    backgroundColor: colors.bg,
  },
  block: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    ...type.eyebrow,
    color: colors.textSecondary,
  },
  title: {
    ...type.screenTitle,
    color: colors.text,
  },
  gutter: {
    paddingHorizontal: layout.gutter,
  },
});