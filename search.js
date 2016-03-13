'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import SearchResults from './searchresults';

class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <TextInput style={styles.input}
            onChangeText={(text) => this.setState({searchQuery: text})}
            placeholder="Search" />
        <TouchableHighlight
          onPress={this.onSearchPressed.bind(this)}
          style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableHighlight>
      </View>
    );
  }

  onSearchPressed(){
    this.props.navigator.push({
      component: SearchResults,
      title: 'Results',
      passProps: {
        searchQuery: this.state.searchQuery
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5fcff',
    flex: 1,
    paddingTop: 100,
    padding: 10,
    alignItems: 'center'
  },
  logo: {
    width: 66,
    height: 55
  },
  heading: {
    fontSize: 30,
    marginTop: 30
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  },
  button: {
    height: 50,
    backgroundColor: '#48bbec',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 22,
    color: '#fff',
    alignSelf: 'center'
  }
});

module.exports = Search;
