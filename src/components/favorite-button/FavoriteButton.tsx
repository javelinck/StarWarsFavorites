import {IconButton, MD3Colors} from 'react-native-paper';
import {View} from 'react-native';
import React from 'react';

type FavoriteButtonProps = {
  isFavorite: boolean;
  size?: number;
  onPress: () => void;
};

const FavoriteButton = ({
  isFavorite,
  size = 40,
  onPress,
}: FavoriteButtonProps) => {
  return (
    <View>
      <IconButton
        icon={isFavorite ? 'heart' : 'heart-outline'}
        size={size}
        onPress={onPress}
        iconColor={MD3Colors.error50}
      />
    </View>
  );
};

export {FavoriteButton};
