import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 5,
  },
  card: {
    flex: 1,
    margin: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subheaderText: {
    fontSize: 16,
  },
  clearButton: {
    borderColor: 'red',
    marginBottom: 5,
    marginHorizontal: 5,
    width: '50%',
    alignSelf: 'flex-end',
  },
  searchBar: {
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginLeft: 10,
  },
  activity: {
    margin: 10,
  },
});
