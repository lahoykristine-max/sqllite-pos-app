import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, radius, space } from '@/constants/theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: string;
  /** The design uses #389C76 for primary CTAs and #16A34A for Confirm Payment. */
  tone?: 'green' | 'bright' | 'indigo' | 'soft';
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const TONES = {
  green: colors.green,
  bright: colors.greenBright,
  indigo: colors.indigo,
  soft: colors.greenSoft,
} as const;

/** Full-width rounded CTA. */
export function PrimaryButton({
  label,
  onPress,
  icon,
  tone = 'green',
  height = 54,
  radius: r = radius.button,
  style,
  disabled,
}: ButtonProps) {
  const bg = TONES[tone];
  const fg = tone === 'soft' ? colors.greenBright : colors.onBrand;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { height, borderRadius: r, backgroundColor: bg },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {icon ? (
          <MaterialCommunityIcons name={icon as never} size={20} color={fg} />
        ) : null}
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

/** Circular FAB used on Inventory. */
export function Fab({
  icon = 'plus',
  onPress,
  size = 56,
  style,
}: {
  icon?: string;
  onPress?: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          shadowColor: colors.indigo,
          shadowOpacity: 0.3,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <MaterialCommunityIcons name={icon as never} size={28} color={colors.onBrand} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.45,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  label: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});