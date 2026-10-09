import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, layout, radius, space, type } from '@/constants/theme';
import type { NewProduct } from '@/services/db';

const CATEGORIES = ['Grocery', 'Canned', 'Drinks', 'Beverages', 'Other'];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (draft: NewProduct) => void;
};

type Errors = Partial<Record<'name' | 'category' | 'price' | 'stock', string>>;

/**
 * Validates before touching the database, so bad input never reaches SQL.
 * Mirrors the Inventory screen's own styling.
 */
export function validateDraft(draft: NewProduct): Errors {
  const errors: Errors = {};

  const name = String(draft.name).trim();
  if (name.length === 0) {
    errors.name = 'Name is required';
  } else if (name.length > 60) {
    errors.name = 'Keep the name under 60 characters';
  }

  if (String(draft.category).trim().length === 0) {
    errors.category = 'Category is required';
  }

  const price = parseFloat(String(draft.price));
  if (String(draft.price).trim().length === 0 || Number.isNaN(price)) {
    errors.price = 'Enter a valid price';
  } else if (price <= 0) {
    errors.price = 'Price must be greater than 0';
  } else if (price > 1_000_000) {
    errors.price = 'Price looks too large';
  }

  const stock = parseInt(String(draft.stock), 10);
  if (String(draft.stock).trim().length === 0 || Number.isNaN(stock)) {
    errors.stock = 'Enter a whole number';
  } else if (stock < 0) {
    errors.stock = 'Stock cannot be negative';
  } else if (stock > 1_000_000) {
    errors.stock = 'Stock looks too large';
  }

  return errors;
}

export function ProductFormModal({ visible, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  /**
   * Clears the draft. Invoked from the close/save handlers rather than an
   * effect — setting state synchronously in an effect body risks a cascading
   * render. Since the only ways out of this modal are these handlers, the form
   * is always clean when it reopens.
   */
  function resetForm() {
    setName('');
    setPrice('');
    setStock('');
    setCategory(CATEGORIES[0]);
    setErrors({});
    setSaving(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit() {
    // Raw strings are validated with trim()/isNaN so empty input is caught
    // before it can reach the INSERT.
    const draft: NewProduct = {
      name: name.trim(),
      category: category.trim(),
      price,
      stock,
    };

    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      onSubmit(draft);
      resetForm();
      onClose();
    } catch (err) {
      setErrors({ name: err instanceof Error ? err.message : 'Could not save product' });
      setSaving(false);
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Text style={styles.title}>Add Product</Text>
            <Pressable
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={10}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={24}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Field
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Rice 25kg"
              error={errors.name}
            />

            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {CATEGORIES.map((c) => {
                const active = c === category;
                return (
                  <Pressable
                    key={c}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => setCategory(c)}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        active && styles.categoryTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Field
              label="Price"
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.price}
              prefix="₱"
            />

            <Field
              label="Stock"
              value={stock}
              onChangeText={setStock}
              placeholder="0"
              keyboardType="number-pad"
              error={errors.stock}
            />
          </ScrollView>

          <View style={styles.footer}>
            {hasErrors ? (
              <Text style={styles.footerError}>Fix the highlighted fields.</Text>
            ) : null}
            <PrimaryButton
              label={saving ? 'Saving…' : 'Save Product'}
              icon="check"
              disabled={saving}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({
  label,
  error,
  prefix,
  ...input
}: {
  label: string;
  error?: string;
  prefix?: string;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          {...input}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(30,27,58,0.35)',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.panel,
    borderTopRightRadius: radius.panel,
    paddingHorizontal: layout.gutter,
    paddingTop: space.sm,
    paddingBottom: space.xl,
    maxHeight: '88%',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: space.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.lg,
  },
  title: {
    ...type.screenTitle,
    fontSize: 20,
    lineHeight: 25,
    color: colors.text,
  },
  field: {
    marginBottom: space.lg,
  },
  label: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bg,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    height: 46,
  },
  inputWrapError: {
    borderColor: colors.rose,
    backgroundColor: colors.roseSoft,
  },
  prefix: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  error: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.rose,
    marginTop: 4,
  },
  categoryRow: {
    gap: space.sm,
    paddingBottom: space.lg,
  },
  categoryChip: {
    paddingHorizontal: space.lg,
    height: 34,
    borderRadius: radius.card,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.green,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.greenBright,
  },
  footer: {
    paddingTop: space.lg,
    gap: space.sm,
  },
  footerError: {
    fontSize: 12,
    color: colors.rose,
    textAlign: 'center',
  },
});
