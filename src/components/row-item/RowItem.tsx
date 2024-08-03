import React from 'react';
import {Text} from 'react-native';
import styles from './styles.ts';

const RowItem = ({title, value}: {title: string; value: string}) => (
  <>
    {value && (
      <Text style={styles.itemText}>
        {`${title}: `}
        <Text style={[styles.itemText, styles.boldText]}>{`${value}`}</Text>
      </Text>
    )}
  </>
);

export {RowItem};
