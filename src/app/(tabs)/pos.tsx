import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, Divider } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, layout, radius, space, type } from '@/constants/theme';
import { ORDER_REF, type Product } from '@/data/seed';
import { useProducts } from '@/store/products';
import { useCart } from '@/store/cart';

/** 108x106 product tile with an indigo add button. */
function ProductTile({
  product,
  inCart,
  onAdd,
}: {
  product: Product;
  inCart: boolean;
  onAdd: () => void;
}) {
  return (
    <View style={[styles.tile, inCart && styles.tileActive]}>
      <View style={styles.tileTop}>
        <View style={styles.tileIcon}>
          <MaterialCommunityIcons
            name={product.icon as never}
            size={17}
            color={colors.greenBright}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.name}`}
          onPress={onAdd}
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="plus" size={16} color={colors.onBrand} />
        </Pressable>
      </View>

      <View style={styles.tileRule} />

      <Text style={styles.tileName} numberOfLines={1}>
        {product.tileName}
      </Text>
      <Text style={styles.tilePrice}>
        ₱{product.price.toLocaleString('en-PH')}
      </Text>
    </View>
  );
}

export default function PosScreen() {
  const router = useRouter();
  const { lines, total, units, add } = useCart();
  const { products } = useProducts();

  return (
    <View style={styles.root}>
      <ScreenHeader
        eyebrow={`Order ${ORDER_REF}`}
        title="Point of Sale"
        right={
          <View style={styles.cartBubble}>
            <MaterialCommunityIcons name="cart-outline" size={20} color={colors.greenBright} />
            {units > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{units}</Text>
              </View>
            ) : null}
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Products</Text>

        <View style={styles.grid}>
          {products.map((product) => (
            <ProductTile
              key={product.id}
              product={product}
              inCart={lines.some((l) => l.product.id === product.id)}
              onAdd={() => add(product)}
            />
          ))}
        </View>

        {products.length === 0 ? (
          <Text style={styles.emptyGrid}>
            No products available. Add stock from the Inventory tab.
          </Text>
        ) : null}

        {/* Current order panel */}
        <Card rounded={radius.panel}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>Current Order</Text>
            <Text style={styles.cartCount}>
              {lines.length} {lines.length === 1 ? 'item' : 'items'}
            </Text>
          </View>

          <Divider />

          {lines.length === 0 ? (
            <Text style={styles.emptyOrder}>
              No items yet. Tap + on a product to start an order.
            </Text>
          ) : (
            lines.map((line, i) => (
              <View key={line.product.id}>
                {i > 0 ? <Divider /> : null}
                <View style={styles.cartRow}>
                  <View style={styles.cartIcon}>
                    <MaterialCommunityIcons
                      name={line.product.icon as never}
                      size={15}
                      color={colors.greenBright}
                    />
                  </View>
                  <View style={styles.cartBody}>
                    <Text style={styles.cartName} numberOfLines={1}>
                      {line.product.name}
                    </Text>
                    <Text style={styles.cartQty}>Qty {line.qty}</Text>
                  </View>
                  <Text style={styles.cartPrice}>
                    ₱{(line.qty * line.product.price).toLocaleString('en-PH')}
                  </Text>
                </View>
              </View>
            ))
          )}

          <View style={styles.dashed} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₱{total.toLocaleString('en-PH')}</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Checkout"
          icon="cart-outline"
          onPress={() => router.push('/payment')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  cartBubble: {
    width: 48,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '700',
    color: colors.onBrand,
  },
  content: {
    paddingHorizontal: layout.gutter,
    gap: space.md,
    paddingBottom: space.xxl,
  },
  sectionTitle: {
    ...type.section,
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.md,
    marginBottom: space.sm,
  },
  emptyGrid: {
    ...type.rowMeta,
    textAlign: 'center',
    paddingVertical: space.xl,
  },
  tile: {
    width: 108,
    height: 106,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.sm,
  },
  tileActive: {
    borderWidth: 2,
    borderColor: colors.indigo,
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  tileRule: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 6,
  },
  tileName: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 6,
  },
  tilePrice: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '700',
    color: colors.indigo,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.md,
  },
  cartTitle: {
    ...type.section,
    color: colors.text,
  },
  cartCount: {
    ...type.rowMeta,
    color: colors.textSecondary,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
  },
  cartIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBody: {
    flex: 1,
    gap: 1,
  },
  cartName: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: colors.text,
  },
  cartQty: {
    fontSize: 11,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  cartPrice: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptyOrder: {
    ...type.rowMeta,
    textAlign: 'center',
    paddingVertical: space.lg,
  },
  dashed: {
    height: 0,
    borderTopWidth: 2,
    borderTopColor: '#A8A9C4',
    borderStyle: 'dashed',
    marginVertical: space.sm,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '700',
    color: colors.indigo,
  },
  footer: {
    paddingHorizontal: layout.gutter,
    paddingTop: space.sm,
    paddingBottom: space.md,
    backgroundColor: colors.bg,
  },
});