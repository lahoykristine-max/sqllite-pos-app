import { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, Divider } from '@/components/Card';
import { ListRow, Pill } from '@/components/ListRow';
import { Fab } from '@/components/PrimaryButton';
import { ProductFormModal } from '@/components/ProductFormModal';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useProducts } from '@/store/products';
import { LOW_STOCK_THRESHOLD } from '@/services/db';
import type { InventoryFilter } from '@/store/products';
import { colors, layout, radius, space, type } from '@/constants/theme';
import { inventoryFilters } from '@/data/seed';

export default function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const {
    products,
    loading,
    error,
    search,
    filter,
    setSearch,
    setFilter,
    addProduct,
    deleteProduct,
    changeStock,
  } = useProducts();

  const [formOpen, setFormOpen] = useState(false);

  const isLow = (stock: number) => stock <= LOW_STOCK_THRESHOLD;

  /** Native confirmation before a destructive statement. */
  function confirmDelete(id: string, name: string) {
    Alert.alert('Delete Confirmation', `Remove ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteProduct(id),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader eyebrow="Manage your stock" title="Inventory" />

      {/* Search */}
      <View style={styles.gutter}>
        <View style={styles.search}>
          <MaterialCommunityIcons name="magnify" size={18} color={colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search products or suppliers"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            returnKeyType="search"
            autoCorrect={false}
          />
          {search.length > 0 ? (
            <Pressable
              onPress={() => setSearch('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Filter chips — filtering happens in SQL via the provider. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {inventoryFilters.map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setFilter(f as InventoryFilter)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // Rows are a fixed height, so skip re-measuring on every render.
        removeClippedSubviews
        ListHeaderComponent={
          error ? (
            <View style={styles.errorBanner}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={16}
                color={colors.rose}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <Card>
            <Text style={styles.empty}>
              {loading
                ? 'Loading products…'
                : search.length > 0 || filter !== 'All'
                  ? 'No products match this search.'
                  : 'No products yet. Tap + to add one.'}
            </Text>
          </Card>
        }
        renderItem={({ item, index }) => (
          <View>
            {index > 0 ? <View style={styles.gap} /> : null}
            <Card>
              {index > 0 ? <Divider inset={58} /> : null}
              <ListRow
                icon={item.icon}
                tileSize={44}
                title={item.name}
                subtitle={item.supplier}
                onPress={() => confirmDelete(item.id, item.name)}
                accessibilityLabel={`${item.name}, tap to delete`}
                trailing={
                  <>
                    <Text style={styles.price}>
                      ₱{item.price.toLocaleString('en-PH')}
                    </Text>
                    <Pill
                      label={isLow(item.stock) ? `Low: ${item.stock}` : `Stock ${item.stock}`}
                      tone={isLow(item.stock) ? 'rose' : 'green'}
                    />
                    <View style={styles.stepper}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Decrease stock of ${item.name}`}
                        onPress={() => changeStock(item.id, -1)}
                        disabled={item.stock === 0}
                        style={({ pressed }) => [
                          styles.stepBtn,
                          item.stock === 0 && styles.stepBtnDisabled,
                          pressed && styles.pressed,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="minus"
                          size={14}
                          color={colors.greenBright}
                        />
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Increase stock of ${item.name}`}
                        onPress={() => changeStock(item.id, 1)}
                        style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={14}
                          color={colors.greenBright}
                        />
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${item.name}`}
                        onPress={() => confirmDelete(item.id, item.name)}
                        hitSlop={6}
                        style={({ pressed }) => [pressed && styles.pressed]}
                      >
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={16}
                          color={colors.rose}
                        />
                      </Pressable>
                    </View>
                  </>
                }
              />
            </Card>
          </View>
        )}
      />

      <Fab
        onPress={() => setFormOpen(true)}
        style={{ bottom: insets.bottom + space.xl + space.lg }}
      />

      <ProductFormModal
        visible={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={addProduct}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  gutter: {
    paddingHorizontal: layout.gutter,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.card,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    height: 46,
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 17,
    color: colors.text,
  },
  filterScroll: {
    marginTop: space.lg,
    flexGrow: 0,
  },
  filterContent: {
    paddingHorizontal: layout.gutter,
    gap: space.sm,
  },
  chip: {
    paddingHorizontal: space.lg,
    height: 32,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  chipText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.onBrand,
  },
  list: {
    paddingHorizontal: layout.gutter,
    paddingTop: space.lg,
    paddingBottom: 120,
  },
  gap: {
    height: space.md,
  },
  price: {
    ...type.rowPrice,
    color: colors.ink,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: 2,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.6,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.roseSoft,
    borderRadius: radius.button,
    padding: space.md,
    marginBottom: space.md,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: colors.rose,
  },
  empty: {
    ...type.rowMeta,
    textAlign: 'center',
    paddingVertical: space.xl,
  },
});
