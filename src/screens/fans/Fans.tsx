import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {fetchCharacters} from '../../services/api.ts';
import {useNavigation} from '@react-navigation/native';
import {Character, useFavorites} from '../../context/FavoritesContext.tsx';
import {Card, Button, Searchbar} from 'react-native-paper';
import styles from './styles';
import {NativeStackNavigationProp} from 'react-native-screens/native-stack';
import {StackParamList} from '../../navigation/AppNavigator.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import {FavoriteButton} from '../../components/favorite-button/FavoriteButton.tsx';
import {RowItem} from '../../components/row-item/RowItem.tsx';

const CardComponent = ({count, title}: {count: number; title: string}) => (
  <Card style={styles.card}>
    <Card.Content>
      <Text style={styles.headerText}>{count}</Text>
      <Text style={styles.subheaderText}>{title}</Text>
    </Card.Content>
  </Card>
);

const Fans = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const {
    favorites,
    toggleFavorite,
    maleCount,
    femaleCount,
    otherCount,
    resetFavorites,
  } = useFavorites();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const loadCharacters = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);

    const data = await fetchCharacters(page);

    if (data.results.length === 0) {
      setHasMore(false);
    } else {
      setCharacters(prev => [...prev, ...data.results]);
    }

    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadCharacters().then();
  }, [page]);

  const filteredCharacters = useMemo(
    () =>
      characters.filter(char =>
        char.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [characters, search],
  );

  const handleToggleFavorite = (character: Character) =>
    toggleFavorite(character);

  const onEndReached = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const navigateToDetails = (url: string) =>
    navigation.navigate('Details', {url});

  const keyExtractor = () => uuid.v4().toString();
  const renderItem = ({item}: {item: Character}) => {
    const isFavorite = favorites.some(fav => fav.url === item.url);

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => navigateToDetails(item.url)}>
          <RowItem value={item.name} title="Name" />
          <RowItem value={item.birth_year} title="Birth Year" />
          <RowItem value={item.gender} title="Gender" />
          <RowItem value={item.homeworld_name} title="Home World" />
          <RowItem value={item.species_name} title="Species" />
        </TouchableOpacity>

        <FavoriteButton
          isFavorite={isFavorite}
          onPress={() => handleToggleFavorite(item)}
        />
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) {
      return null;
    }

    return <ActivityIndicator style={styles.activity} />;
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.cardContainer}>
          <CardComponent count={maleCount} title="Male" />
          <CardComponent count={femaleCount} title="Female" />
          <CardComponent count={otherCount} title="Others" />
        </View>

        <Button
          mode="elevated"
          onPress={resetFavorites}
          textColor="red"
          style={styles.clearButton}>
          Clear Fans
        </Button>
      </View>

      <Searchbar
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
        mode="view"
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredCharacters}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

export default Fans;
