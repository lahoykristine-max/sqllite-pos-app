import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { CartProvider } from '@/store/cart';
import { ProductsProvider } from '@/store/products';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  // The Figma file specifies Inter throughout.
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      {/* ProductsProvider opens pos_inventory.db and runs initDatabase()
          (WAL + schema + indexes + auto-seed) exactly once on mount. */}
      <ProductsProvider>
        <CartProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
            }}
          />
        </CartProvider>
      </ProductsProvider>
    </SafeAreaProvider>
  );
}