import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, Divider, SectionHeader } from '@/components/Card';
import { ListRow, Pill } from '@/components/ListRow';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, layout, radius, space, type } from '@/constants/theme';
import { heroStats, quickActions, sparkBars, transactions } from '@/data/seed';
import { useProducts } from '@/store/products';

const SPARK_TONES: Record<string, string> = {
  indigoSoft: colors.indigoSoft,
  greenSoft: colors.greenSoft,
};

const ACTION_TONES: Record<string, { bg: string; fg: string }> = {
  indigo: { bg: colors.greenSoft, fg: colors.indigo },
  greenBright: { bg: colors.greenSoft, fg: colors.greenBright },
  blue: { bg: colors.greenSoft, fg: colors.blue },
  amber: { bg: colors.amberSoft, fg: colors.amber },
};

const STAT_TONES: Record<string, { bg: string; fg: string }> = {
  rose: { bg: colors.roseSoft, fg: colors.rose },
  blue: { bg: colors.greenSoft, fg: colors.blue },
  amber: { bg: colors.amberSoft, fg: colors.amber },
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lowStockCount } = useProducts();

  return (
    <View style={styles.root}>
      {/* Dark green hero header with decorative shapes */}
      <View style={[styles.header, { paddingTop: insets.top + space.lg }]}>
        <View style={styles.decoLarge} />
        <View style={styles.decoRing} />
        <View style={styles.decoDot} />

        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good day, Kristine! 👋</Text>
            <Text style={styles.title}>Suppliers Dashboard</Text>
          </View>
          <View style={styles.bell}>
            <MaterialCommunityIcons name="bell-outline" size={20} color={colors.greenDeep} />
            <View style={styles.bellDot} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's sales — overlaps the header, as in the design */}
        <Card rounded={radius.hero} style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>Today&apos;s Sales</Text>
              <Text style={styles.heroValue}>₱12,450</Text>
              <Pill label="▲ 12.4% vs yesterday" tone="green" height={20} />
            </View>

            <View style={styles.spark}>
              {sparkBars.map((bar, i) => (
                <View
                  key={i}
                  style={[
                    styles.sparkBar,
                    { height: bar.h, backgroundColor: SPARK_TONES[bar.tone] },
                  ]}
                />
              ))}
            </View>
          </View>

          <Divider />

          {/* Stat strip with hairline dividers */}
          <View style={styles.statStrip}>
            {heroStats.map((stat, i) => {
              const tone = STAT_TONES[stat.tone];
              const isLow = i === 0;
              return (
                <View key={stat.label} style={styles.statCell}>
                  {i > 0 ? <View style={styles.statDivider} /> : null}
                  <View style={styles.statInner}>
                    <View style={[styles.statTile, { backgroundColor: tone.bg }]}>
                      <MaterialCommunityIcons
                        name={stat.icon as never}
                        size={15}
                        color={tone.fg}
                      />
                    </View>
                    <View style={styles.statText}>
                      <Text style={styles.statValue}>
                        {isLow ? `${lowStockCount} items` : stat.value}
                      </Text>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Quick actions — single row of four */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            {quickActions.map((action) => {
              const tone = ACTION_TONES[action.tone];
              return (
                <Pressable
                  key={action.label}
                  accessibilityRole="button"
                  onPress={() => router.push(action.route)}
                  style={({ pressed }) => [
                    styles.actionTile,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={[styles.actionIcon, { backgroundColor: tone.bg }]}>
                    <MaterialCommunityIcons
                      name={action.icon as never}
                      size={20}
                      color={tone.fg}
                    />
                  </View>
                  <Text style={styles.actionLabel} numberOfLines={1}>
                    {action.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Recent transactions */}
        <View style={styles.block}>
          <SectionHeader
            title="Recent Transactions"
            action="See all"
            onAction={() => router.push('/reports')}
          />
          <Card>
            {transactions.map((tx, i) => (
              <View key={tx.id}>
                {i > 0 ? <Divider inset={54} /> : null}
                <ListRow
                  icon={tx.icon}
                  iconColor={
                    tx.icon === 'cash'
                      ? colors.greenBright
                      : tx.icon === 'target'
                        ? colors.indigo
                        : colors.blue
                  }
                  title={tx.id}
                  subtitle={tx.meta}
                  trailing={<Text style={styles.amount}>₱{tx.amount.toLocaleString('en-PH')}</Text>}
                />
              </View>
            ))}
          </Card>
        </View>

        <PrimaryButton
          label="New Sale"
          icon="plus"
          onPress={() => router.push('/pos')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    height: 190,
    backgroundColor: colors.greenDeep,
    borderBottomLeftRadius: radius.panel,
    borderBottomRightRadius: radius.panel,
    paddingHorizontal: layout.gutter,
    justifyContent: 'flex-end',
    paddingBottom: space.xl,
    overflow: 'hidden',
  },
  decoLarge: {
    position: 'absolute',
    top: -70,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  decoRing: {
    position: 'absolute',
    top: 20,
    right: 8,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  decoDot: {
    position: 'absolute',
    top: -40,
    left: 60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    ...type.eyebrow,
    color: colors.indigoLine,
  },
  title: {
    ...type.screenTitle,
    color: colors.onBrand,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.amber,
    borderWidth: 1.5,
    borderColor: colors.onBrand,
  },
  content: {
    paddingHorizontal: layout.gutter,
    paddingTop: 0,
    gap: space.xl,
    paddingBottom: space.xxl,
  },
  heroCard: {
    marginTop: -space.lg - 34,
    paddingVertical: space.lg,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.md,
  },
  heroLeft: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 6,
  },
  heroLabel: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  heroValue: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '700',
    color: colors.ink,
  },
  spark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 44,
  },
  sparkBar: {
    width: 10,
    borderRadius: 5,
  },
  statStrip: {
    flexDirection: 'row',
    marginTop: space.lg,
  },
  statCell: {
    flex: 1,
  },
  statDivider: {
    position: 'absolute',
    left: 0,
    top: 2,
    width: 1,
    height: 26,
    backgroundColor: colors.border,
  },
  statInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statTile: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 12.5,
    lineHeight: 15,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 10.5,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  block: {
    gap: space.md,
  },
  sectionTitle: {
    ...type.section,
    color: colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionTile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: space.sm,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 6,
  },
  pressed: {
    opacity: 0.75,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
    color: colors.text,
  },
  amount: {
    ...type.rowPrice,
    color: colors.text,
  },
});