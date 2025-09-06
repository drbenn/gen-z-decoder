import Chip from '@/components/ui/custom/Chip';
import { useState } from 'react';
import { ImageBackground, StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HistoryContent from '@/components/ui/custom/library/HistoryContent';
import DictionaryContent from '@/components/ui/custom/library/DictionaryContent';
import FavoriteToggle from '@/components/ui/custom/library/FavoriteToggle';
import { useAppState } from '@/state/useAppState';
import { Colors } from '@/constants/Colors';

export default function LibraryScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const insets = useSafeAreaInsets()
  const [activeChip, setActiveChip] = useState<'Dictionary' | 'History'>('Dictionary')
  const isFavoritesChipActive = useAppState((state) => state.isFavoritesChipActive)
  const setIsFavoritesChipActive = useAppState((state) => state.setIsFavoritesChipActive)

  const handleChipPress = (chip: 'Dictionary' | 'History') => {
    setActiveChip(chip)
  }

  return (
    <View style={[styles.container, {paddingTop: insets.top / 10, paddingBottom: insets.bottom}]}>
        {/* Sick svg-ish pattern background */}
        <ImageBackground 
          source={colorScheme === 'dark' 
            ? require('@/assets/images/i-like-food-dark-blue-260.png') 
            : require('@/assets/images/i-like-food-light-260.png')
          }
          style={{
            position: 'absolute',
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: -1
          }}
          resizeMode="repeat"
        />

        <View style={styles.chipContainer}>
          <Chip 
            label={'Dictionary'} 
            onPress={() => handleChipPress('Dictionary')}
            active={activeChip === 'Dictionary'}
          />
          <View style={[{paddingHorizontal: 16}]}>
            <Chip 
              label={'History'} 
              onPress={() => handleChipPress('History')}
              active={activeChip === 'History'}
            />
          </View>
          <FavoriteToggle isActive={isFavoritesChipActive} onPress={() => setIsFavoritesChipActive(!isFavoritesChipActive)}></FavoriteToggle>
        </View>
        <View style={styles.contentContainer}>
          {activeChip === 'History' && <HistoryContent />}
          {activeChip === 'Dictionary' && <DictionaryContent />}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  chipContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
});