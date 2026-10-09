import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, radius, space, type } from '@/constants/theme';

type Tone = 'green' | 'rose' | 'amber' | 'indigo' | 'blue';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  green: { bg: colors.greenSoft, fg: colors.greenBright },
  rose: { bg: colors.roseSoft, fg: colors.rose },
  amber: { bg: colors.amberSoft, fg: colors.amber },
  indigo: { bg: colors.indigoSoft, fg: colors.indigo },
  blue: { bg: '#E8F4FC', fg: colors.blue },
};

/** Small status pill — stock badges, growth deltas, report tiles. */
export function Pill({
  label,
  tone = 'green',
  bg,
  fg,
  height = 22,
}: {
  label: string;
  tone?: Tone;
  bg?: string;
  fg?: string;
  height?: number;
}) {
  const t = TONES[tone];
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: bg ?? t.bg, minHeight: height },
      ]}
    >
      <Text style={[styles.pillText, { color: fg ?? t.fg }]}>{label}</Text>
    </View>
  );
}

/**
 * Icon tile + title/subtitle + trailing block. Used for the Inventory rows,
 * the POS product grid, the Current Order list and the transaction feed.
 */
export function ListRow({
  icon,
  tileSize = 40,
  title,
  titleStyle,
  subtitle,
  iconColor = colors.greenBright,
  onPress,
  accessibilityLabel,
  trailing,
  children,
}: {
  icon: string;
  tileSize?: number;
  title: string;
  titleStyle?: object;
  subtitle?: string;
  iconColor?: string;
  /** Makes the whole row tappable. */
  onPress?: () => void;
  accessibilityLabel?: string;
  trailing?: ReactNode;
  children?: ReactNode;
}) {
  const body = (
    <>
      <View
        style={[
          styles.tile,
          { width: tileSize, height: tileSize, borderRadius: radius.md },
        ]}
      >
        <MaterialCommunityIcons
          name={icon as never}
          size={Math.round(tileSize * 0.45)}
          color={iconColor}
        />
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {children}
      </View>

      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </>
  );

  if (!onPress) return <View style={styles.row}>{body}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.chip,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  pressed: {
    opacity: 0.6,
  },
  tile: {
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 1,
  },
  title: {
    ...type.rowTitle,
    color: colors.text,
  },
  subtitle: {
    ...type.rowMeta,
    color: colors.textSecondary,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 3,
  },
});
