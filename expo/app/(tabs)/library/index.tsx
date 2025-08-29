import Chip from '@/components/ui/custom/Chip';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HistoryContent from '@/components/ui/custom/library/HistoryContent';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets()
  const [activeChip, setActiveChip] = useState<'Library' | 'History' | 'Favorites'>('History')


  const handleChipPress = (chip: 'Library' | 'History' | 'Favorites') => {
    setActiveChip(chip)
    console.log(chip);
    
  }




  return (
    <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <View style={styles.chipContainer}>
        <Chip label={'Library'} onPress={() => handleChipPress('Library')}></Chip>
        <View style={[{paddingHorizontal: 16}]}>
          <Chip label={'History'} onPress={() => handleChipPress('History')}></Chip>
        </View>
        <Chip label={'Favorites'} onPress={() => handleChipPress('Favorites')}></Chip>
      </View>
      <View>
        <Text>yooooo</Text>
      </View>
      <View style={styles.contentContainer}>
        {activeChip === 'History' && <HistoryContent />}
        {/* {activeChip === 'Dictionary' && <DictionaryContent />} */}
        {/* {activeChip === 'Favorites' && <FavoritesContent />} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chipContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
});