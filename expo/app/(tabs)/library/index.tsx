import Chip from '@/components/ui/custom/Chip';
import { useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HistoryContent from '@/components/ui/custom/library/HistoryContent';
import DictionaryContent from '@/components/ui/custom/library/DictionaryContent';
import FavoriteToggle from '@/components/ui/custom/library/FavoriteToggle';
import { useAppState } from '@/state/useAppState';
import { Colors } from '@/constants/Colors';;

export default function LibraryScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const insets = useSafeAreaInsets()
  const [activeChip, setActiveChip] = useState<'Dictionary' | 'History'>('History')
  const isFavoritesChipActive = useAppState((state) => state.isFavoritesChipActive)
  const setIsFavoritesChipActive = useAppState((state) => state.setIsFavoritesChipActive)

  const handleChipPress = (chip: 'Dictionary' | 'History') => {
    setActiveChip(chip)
  }

  return (
    <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: theme.background}]}>
      <View style={styles.chipContainer}>
        <Chip label={'Dictionary'} onPress={() => handleChipPress('Dictionary')}></Chip>
        <View style={[{paddingHorizontal: 16}]}>
          <Chip label={'History'} onPress={() => handleChipPress('History')}></Chip>
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