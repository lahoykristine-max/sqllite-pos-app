import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, layout, radius, space, type } from '@/constants/theme';
import { ORDER_REF, paymentMethods } from '@/data/seed';
import { useCart } from '@/store/cart';

export default function PaymentScreen() {
  const router = useRouter();
  const { total, lines, clear } = useCart();
  const [method, setMethod] = useState<string>('cash');
  const [received, setReceived] = useState('');

  const receivedValue = Number(received.replace(/[^0-9.]/g, '')) || 0;
  const change = useMemo(() => Math.max(receivedValue - total, 0), [receivedValue, total]);
  const canConfirm = total > 0 && (method !== 'cash' || receivedValue >= total);

  function handleConfirm() {
    clear();
    setReceived('');
    router.replace('/pos');
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader eyebrow={`Order ${ORDER_REF}`} title="Payment" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Amount due — ticket style with a dashed rule */}
        <View style={styles.dueCard}>
          <Text style={styles.dueLabel}>AMOUNT DUE</Text>
          <Text style={styles.dueValue}>
            ₱{total.toLocaleString('en-PH', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <View style={styles.dueDashed} />
          <Text style={styles.dueMeta}>
            {lines.length} {lines.length === 1 ? 'item' : 'items'} • Walk-in customer
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>

        <View style={styles.methods}>
          {paymentMethods.map((m) => {
            const active = m.id === method;
            return (
              <Pressable
                key={m.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                onPress={() => setMethod(m.id)}
                style={[styles.method, active && styles.methodActive]}
              >
                <View
                  style={[
                    styles.methodIcon,
                    { backgroundColor: active ? colors.indigo : colors.greenSoft },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={m.icon as never}
                    size={19}
                    color={active ? colors.onBrand : colors.greenBright}
                  />
                </View>

                <View style={styles.methodBody}>
                  <Text style={styles.methodLabel}>{m.label}</Text>
                  <Text style={styles.methodHint}>{m.hint}</Text>
                </View>

                <View style={[styles.radio, active && styles.radioActive]}>
                  {active ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={14}
                      color={colors.onBrand}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {method === 'cash' ? (
          <>
            <View style={styles.cashCard}>
              <Text style={styles.cashLabel}>Cash received</Text>
              <TextInput
                value={received}
                onChangeText={setReceived}
                keyboardType="numeric"
                placeholder={`₱${Math.ceil(total).toLocaleString('en-PH')}.00`}
                placeholderTextColor={colors.textSecondary}
                style={styles.cashInput}
              />
            </View>

            <View style={styles.changeBox}>
              <Text style={styles.changeLabel}>Change</Text>
              <Text style={styles.changeValue}>
                ₱{change.toLocaleString('en-PH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Confirm Payment"
          icon="check"
          tone="bright"
          disabled={!canConfirm}
          onPress={canConfirm ? handleConfirm : undefined}
        />
        {!canConfirm ? (
          <Text style={styles.hint}>
            {total === 0
              ? 'Add items in POS first.'
              : 'Enter the cash received to continue.'}
          </Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: layout.gutter,
    gap: space.md,
    paddingBottom: space.xl,
  },
  dueCard: {
    backgroundColor: colors.green,
    borderRadius: radius.panel,
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
  },
  dueLabel: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    color: colors.indigoLine,
  },
  dueValue: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    color: colors.onBrand,
    marginTop: 2,
  },
  dueDashed: {
    height: 0,
    borderTopWidth: 2,
    borderTopColor: colors.onBrand,
    borderStyle: 'dashed',
    marginTop: space.sm,
    marginBottom: 6,
  },
  dueMeta: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.indigoSoft,
  },
  sectionTitle: {
    ...type.section,
    color: colors.text,
    marginTop: space.sm,
  },
  methods: {
    gap: space.sm,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    height: 62,
    paddingHorizontal: space.md,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodActive: {
    borderWidth: 2,
    borderColor: colors.indigo,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodBody: {
    flex: 1,
    gap: 1,
  },
  methodLabel: {
    ...type.rowTitle,
    color: colors.text,
  },
  methodHint: {
    ...type.rowMeta,
    color: colors.textSecondary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.radioBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.greenSoft,
  },
  cashCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    gap: 2,
  },
  cashLabel: {
    ...type.tiny,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  cashInput: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: 2,
  },
  changeBox: {
    height: 52,
    backgroundColor: colors.greenSoft,
    borderRadius: radius.button,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changeLabel: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: colors.greenBright,
  },
  changeValue: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.greenBright,
  },
  footer: {
    paddingHorizontal: layout.gutter,
    paddingTop: space.sm,
    paddingBottom: space.md,
    gap: space.sm,
    backgroundColor: colors.bg,
  },
  hint: {
    ...type.rowMeta,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});