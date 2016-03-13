'use strict';
import React, {
  Component,
  Text,
  View,
  ListView,
  ActivityIndicatorIOS,
  Image,
  TouchableHighlight
} from 'react-native';
import moment from 'moment';
import PushPayload from './pushpayload'

class Feed extends Component {
  constructor(props){
    super(props);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })
    this.state = {
      dataSource: ds.cloneWithRows(['A','B','C']),
      showProgress: true
    };
  }

  componentWillMount() {
    this.fetchFeed();
  }

  fetchFeed() {
    require('./authservice').getAuthInfo((err, authInfo) => {
      let url = 'https://api.github.com/users/' + authInfo.user.login + '/received_events';

      fetch(url, {
        headers: authInfo.header
      })
      .then((response) => response.json())
      .then((responseData) => {
        let feedItems = responseData.filter((ev) => ev.type == 'PushEvent');
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(feedItems),
          showProgress: false
        })
      })
      .catch((err) => err);
    });
  }

  pressRow(rowData){
    this.props.navigator.push({
      title: 'Push Event',
      component: PushPayload,
      passProps: {
        pushEvent: rowData
      }
    });
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
        onPress={()=> this.pressRow(rowData)}
        underlayColor='#ddd'>
        <View style={{
            flex: 1,
            flexDirection: 'row',
            padding: 20,
            alignItems: 'center',
            borderColor: '#d7d7d7',
            borderBottomWidth: 1
          }}>
          <Image source={{uri: rowData.actor.avatar_url}}
            style={{
              height: 35,
              width: 35,
              borderRadius: 18
            }}
            />
          <View style={{
              paddingLeft: 20
            }}>
            <Text style={{backgroundColor: '#fff'}}>
              {moment(rowData.created_at).fromNow()}
            </Text>
            <Text style={{backgroundColor: '#fff'}}>
              <Text style={{fontWeight: '600'}}>{rowData.actor.login}</Text>
            </Text>
            <Text style={{backgroundColor: '#fff'}}>
              {rowData.payload.ref.replace('refs/heads/', '')}
            </Text>
            <Text style={{backgroundColor: '#fff'}}>
              at <Text style={{fontWeight: '600'}}>{rowData.repo.name}</Text>
            </Text>
          </View>
        </View>
      </TouchableHighlight>
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

module.exports = Feed;
