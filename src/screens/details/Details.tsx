import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackParamList} from '../../navigation/AppNavigator.tsx';
import {fetchCharacterDetails} from '../../services/api.ts';
import {Card} from 'react-native-paper';
import styles from './styles.ts';
import {Character, useFavorites} from '../../context/FavoritesContext.tsx';
import {FavoriteButton} from '../../components/favorite-button/FavoriteButton.tsx';
import {RowItem} from '../../components/row-item/RowItem.tsx';

type CharacterDetailsScreenRouteProp = RouteProp<StackParamList, 'Details'>;

type DetailedInfo = {
  homeworld: string;
  species: string;
  films: string[];
  vehicles: string[];
  starships: string[];
};

const CharacterDetails = () => {
  const route = useRoute<CharacterDetailsScreenRouteProp>();
  const {url} = route.params;
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<Character | null>(null);
  const [details, setDetails] = useState<DetailedInfo | null>(null);
  const {favorites, toggleFavorite} = useFavorites();

  useEffect(() => {
    const loadCharacterDetails = async () => {
      try {
        const data = await fetchCharacterDetails(url);
        setCharacter(data);
        const detailedInfo: DetailedInfo = {
          homeworld: '',
          species: '',
          films: [],
          vehicles: [],
          starships: [],
        };

        if (data.homeworld) {
          const homeworldResponse = await fetchCharacterDetails(data.homeworld);
          detailedInfo.homeworld = homeworldResponse.name;
        }

        if (data.species.length > 0) {
          const speciesResponse = await fetchCharacterDetails(data.species[0]);
          detailedInfo.species = speciesResponse.name;
        }

        if (data.films.length > 0) {
          detailedInfo.films = await Promise.all(
            data.films.map(async (filmUrl: string) => {
              const filmResponse = await fetchCharacterDetails(filmUrl);
              return filmResponse.title;
            }),
          );
        }

        if (data.vehicles.length > 0) {
          detailedInfo.vehicles = await Promise.all(
            data.vehicles.map(async (vehicleUrl: string) => {
              const vehicleResponse = await fetchCharacterDetails(vehicleUrl);
              return vehicleResponse.name;
            }),
          );
        }

        if (data.starships.length > 0) {
          detailedInfo.starships = await Promise.all(
            data.starships.map(async (starshipUrl: string) => {
              const starshipResponse = await fetchCharacterDetails(starshipUrl);
              return starshipResponse.name;
            }),
          );
        }

        setDetails(detailedInfo);
      } catch (error) {
        console.error('Failed to load character details', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacterDetails().then();
  }, [url]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!character || !details) {
    return (
      <View style={styles.container}>
        <Text>Failed to load character details.</Text>
      </View>
    );
  }

  const isFavorite = favorites.some(fav => fav.url === character.url);

  const characterInfoList = [
    {title: 'Height', value: character.height},
    {title: 'Mass', value: character.mass},
    {title: 'Hair Color', value: character.hair_color},
    {title: 'Skin Color', value: character.skin_color},
    {title: 'Eye Color', value: character.eye_color},
    {title: 'Birth Year', value: character.birth_year},
    {title: 'Gender', value: character.gender},
  ];

  const detailsList = [
    {title: 'Homeworld', value: details.homeworld},
    {title: 'Species', value: details.species},
    {title: 'Films', value: details.films.join(', ')},
    {title: 'Vehicles', value: details.vehicles.join(', ')},
    {title: 'Starships', value: details.starships.join(', ')},
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.headerText}>{character.name}</Text>
            <FavoriteButton
              isFavorite={isFavorite}
              onPress={() => toggleFavorite(character)}
            />
          </View>

          {characterInfoList.map(({title, value}) => (
            <RowItem key={title} title={title} value={value ?? ''} />
          ))}

          {detailsList.map(({title, value}) => (
            <RowItem key={title} title={title} value={value ?? ''} />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default CharacterDetails;
