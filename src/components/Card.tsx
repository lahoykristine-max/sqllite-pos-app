import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, layout, radius, space, type } from '@/constants/theme';

type Props = {
  children: ReactNode;
  /** Card corner radius. The design uses 16 for lists and 20-22 for panels. */
  rounded?: number;
  bordered?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** White rounded surface used for every grouped block in the design. */
export function Card({
  children,
  rounded = radius.card,
  bordered = true,
  padded = true,
  style,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        { borderRadius: rounded },
        bordered && styles.bordered,
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Section heading row with an optional trailing action. */
export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {action ? (
        <Text style={styles.headerAction} onPress={onAction}>
          {action}
        </Text>
      ) : null}
    </View>
  );
}

/** 1px hairline divider inset past the leading icon, as in the design. */
export function Divider({ inset = 0 }: { inset?: number }) {
  return <View style={[styles.divider, { marginLeft: inset }]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    width: '100%',
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  padded: {
    padding: layout.cardPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    ...type.section,
    color: colors.text,
  },
  headerAction: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: type.button.fontFamily,
    color: colors.indigo,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});

export { space };