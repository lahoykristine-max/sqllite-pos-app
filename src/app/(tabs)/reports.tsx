import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card } from '@/components/Card';
import { Pill } from '@/components/ListRow';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, layout, radius, space, type } from '@/constants/theme';
import { reportRanges, summaryTiles, weeklySales } from '@/data/seed';

const BAR_COLORS: Record<string, string> = {
  greenMid: colors.greenMid,
  greenPale: colors.greenPale,
  greenFaint: colors.greenFaint,
  greenPeak: colors.greenPeak,
};

const MAX_BAR = 120;
const PLOT_HEIGHT = 120;
/** Bar heights come straight from the Figma render. */
const BAR_WIDTH = 28;

export default function ReportsScreen() {
  const [range, setRange] = useState<string>(reportRanges[1]);

  return (
    <View style={styles.root}>
      <ScreenHeader eyebrow="Sales overview" title="Reports" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Range selector */}
        <View style={styles.segment}>
          {reportRanges.map((r) => {
            const active = r === range;
            return (
              <Pressable
                key={r}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setRange(r)}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {r}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Weekly sales chart */}
        <Card rounded={radius.panel}>
          <View style={styles.chartHeader}>
            <View style={styles.chartLeft}>
              <Text style={styles.chartTitle}>Weekly Sales</Text>
              <Text style={styles.chartSub}>Oct 27 – Nov 2</Text>
            </View>
            <View style={styles.chartRight}>
              <Text style={styles.chartTotal}>₱58,320</Text>
              <Pill label="▲ 12.4%" tone="green" height={18} />
            </View>
          </View>

          <View style={styles.plot}>
            {/* Gridlines */}
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[styles.gridline, { bottom: (PLOT_HEIGHT / 4) * i }]}
              />
            ))}

            <View style={styles.bars}>
              {weeklySales.map((bar) => {
                const peak = bar.day === 'Sat';
                return (
                  <View key={bar.day} style={styles.barCol}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: (bar.h / MAX_BAR) * PLOT_HEIGHT,
                          backgroundColor: BAR_COLORS[bar.color],
                        },
                      ]}
                    />
                    <Text style={[styles.barLabel, peak && styles.barLabelPeak]}>
                      {bar.day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Card>

        {/* Summary tiles */}
        <View style={styles.tiles}>
          {summaryTiles.map((tile) => (
            <View key={tile.label} style={styles.tile}>
              <View style={styles.tileTop}>
                <View
                  style={[styles.tileIcon, { backgroundColor: tile.iconTint }]}
                >
                  <MaterialCommunityIcons
                    name={tile.icon as never}
                    size={17}
                    color={tile.iconColor}
                  />
                </View>
                <Pill
                  label={tile.delta}
                  bg={tile.pillTint}
                  fg={tile.deltaColor}
                />
              </View>
              <Text style={styles.tileLabel}>{tile.label}</Text>
              <Text style={styles.tileValue} numberOfLines={1}>
                {tile.value}
              </Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Export Report"
          icon="tray-arrow-down"
          height={52}
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
  content: {
    paddingHorizontal: layout.gutter,
    gap: space.lg,
    paddingBottom: space.xxl,
  },
  segment: {
    height: 40,
    backgroundColor: colors.card,
    borderRadius: radius.panel,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    height: 32,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: colors.green,
  },
  segmentText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.onBrand,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  chartLeft: {
    gap: 2,
  },
  chartTitle: {
    ...type.section,
    color: colors.text,
  },
  chartSub: {
    ...type.tiny,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chartRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  chartTotal: {
    ...type.rowPrice,
    color: colors.indigo,
  },
  plot: {
    height: PLOT_HEIGHT + 26,
    marginTop: space.lg,
    justifyContent: 'flex-end',
  },
  gridline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0,
    borderTopWidth: 1.5,
    borderTopColor: colors.gridline,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: PLOT_HEIGHT + 26,
  },
  barCol: {
    width: BAR_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: radius.sm,
  },
  barLabel: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.textSecondary,
    marginTop: 6,
  },
  barLabelPeak: {
    fontWeight: '600',
    color: colors.indigo,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.md,
  },
  tile: {
    width: 170,
    height: 96,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    justifyContent: 'flex-start',
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tileIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    ...type.tiny,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: space.sm,
  },
  tileValue: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.text,
  },
});