import axios from 'axios';
import {Character} from '../context/FavoritesContext.tsx';

export const fetchCharacters = async (page: number) => {
  try {
    const response = await axios.get(
      `https://swapi.dev/api/people/?page=${page}`,
    );
    const charactersData: Character[] = response.data.results;

    const characters = await Promise.all(
      charactersData.map(async (character: any) => {
        if (character.homeworld) {
          try {
            const homeworldResponse = await axios.get(character.homeworld);
            character.homeworld_name = homeworldResponse.data.name;
          } catch (error) {
            character.homeworld_name = '';
          }
        }

        if (character.species.length > 0) {
          try {
            const speciesResponse = await axios.get(character.species[0]);
            character.species_name = speciesResponse.data.name;
          } catch (error) {
            character.species_name = '';
          }
        }

        return character;
      }),
    );

    return {results: characters};
  } catch (error) {
    return {results: []};
  }
};

export const fetchCharacterDetails = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};
