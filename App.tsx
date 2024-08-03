import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator.tsx';
import {FavoritesProvider} from './src/context/FavoritesContext';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <FavoritesProvider>
      <AppNavigator />
    </FavoritesProvider>
  );
};

export default App;
