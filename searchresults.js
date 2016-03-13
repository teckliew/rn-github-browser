'use strict';
import React, {
  Component,
  Text,
  View,
  ListView,
  ActivityIndicatorIOS,
  Image,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

class SearchResults extends Component {
  constructor(props){
    super(props);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })
    this.state = {
      dataSource: ds,
      showProgress: true,
      searchQuery: props.searchQuery
    };
  }

  componentWillMount() {
    this.doSearch();
  }

  doSearch() {
    let url = 'https://api.github.com/search/repositories?q=' + encodeURIComponent(this.state.searchQuery);
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          repositories: responseData.repositories,
          dataSource: this.state.dataSource.cloneWithRows(responseData.items)
        });
      })
      .finally(() => {
        this.setState({
          showProgress: false
        });
      });
  }

  renderRow(rowData) {
    return (
      <View style={{
          padding: 20,
          borderColor: '#d7d7d7',
          borderBottomWidth: 1,
          backgroundColor: '#fff'
        }}>
        <Text style={{
          fontSize: 20,
          fontWeight: '600'
        }}>
          {rowData.full_name}
        </Text>
        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 20
          }}>
          <View style={styles.repoCell}>
            <Image source={require('image!star')}
              style={styles.repoCellIcon}></Image>
            <Text style={styles.repoCellLabel}>
              {rowData.stargazers_count}
            </Text>
          </View>
          <View style={styles.repoCell}>
            <Image source={require('image!fork')}
              style={styles.repoCellIcon}></Image>
            <Text style={styles.repoCellLabel}>
              {rowData.forks}
            </Text>
          </View>
          <View style={styles.repoCell}>
            <Image source={require('image!issues')}
              style={styles.repoCellIcon}></Image>
            <Text style={styles.repoCellLabel}>
              {rowData.open_issues}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    if(this.state.showProgress) {
      return(
        <View style={{
            flex: 1,
            justifyContent: 'center'
          }}>
          <ActivityIndicatorIOS
            size="large"
            animated={true} />
        </View>
      );
    }
    return (
      <View style={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingBottom: 50,
          paddingTop: 50
        }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  repoCell: {
    width: 50,
    alignItems: 'center'
  },
  repoCellIcon: {
    width: 20,
    height: 20,
  },
  repoCellLable: {
    textAlign: 'center'
  }
})

module.exports = SearchResults;
