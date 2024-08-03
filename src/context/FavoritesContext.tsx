import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Character = {
  name: string;
  gender: string;
  url: string;
  birth_year: string;
  homeworld_name: string;
  species_name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
};

interface FavoritesContextType {
  favorites: Character[];
  maleCount: number;
  femaleCount: number;
  otherCount: number;
  toggleFavorite: (character: Character) => void;
  resetFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
};

const FAVORITES_STORAGE_KEY = 'favorites';

export const FavoritesProvider = ({children}: {children: ReactNode}) => {
  const [favorites, setFavorites] = useState<Character[]>([]);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(
          FAVORITES_STORAGE_KEY,
        );
        if (storedFavorites) {
          const parsedFavorites: Character[] = JSON.parse(storedFavorites);
          setFavorites(parsedFavorites);
          updateCounts(parsedFavorites);
        }
      } catch (error) {
        console.error('Failed to load favorites', error);
      }
    };

    loadFavorites().then();
  }, []);

  const saveFavorites = async (favoritesChar: Character[]) => {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favoritesChar),
      );
    } catch (error) {
      console.error('Failed to save favorites', error);
    }
  };

  const toggleFavorite = (character: Character) => {
    const existingIndex = favorites.findIndex(fav => fav.url === character.url);
    let updatedFavorites = [];

    if (existingIndex >= 0) {
      updatedFavorites = [
        ...favorites.slice(0, existingIndex),
        ...favorites.slice(existingIndex + 1),
      ];
    } else {
      updatedFavorites = [...favorites, character];
    }

    setFavorites(updatedFavorites);
    updateCounts(updatedFavorites);
    saveFavorites(updatedFavorites).then();
  };

  const resetFavorites = async () => {
    setFavorites([]);
    setMaleCount(0);
    setFemaleCount(0);
    setOtherCount(0);
    await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
  };

  const updateCounts = (favoritesChar: Character[]) => {
    const male = favoritesChar.filter(
      character => character.gender === 'male',
    ).length;
    const female = favoritesChar.filter(
      character => character.gender === 'female',
    ).length;
    const other = favoritesChar.filter(
      character => character.gender !== 'male' && character.gender !== 'female',
    ).length;

    setMaleCount(male);
    setFemaleCount(female);
    setOtherCount(other);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        maleCount,
        femaleCount,
        otherCount,
        toggleFavorite,
        resetFavorites,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
};
