'use strict';
import React, {
  Component,
  Text,
  View,
  ListView,
  Image,
  StyleSheet
} from 'react-native';
import moment from 'moment';

class PushPayload extends Component {
  constructor(props){
    super(props);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })
    this.state = {
      dataSource: ds.cloneWithRows(props.pushEvent.payload.commits),
      pushEvent: props.pushEvent
    };
  }

  renderRow(rowData){
    return(
      <View style={{
          flex: 1,
          justifyContent: 'center',
          borderColor: '#d7d7d7',
          borderBottomWidth: 1,
          paddingTop: 20,
          paddingBottom: 20,
          padding: 10
        }}>
        <Text><Text style={styles.bold}>{rowData.sha.substring(0, 6)}</Text> - {rowData.message}</Text>
      </View>
    );
  }

  render() {
    return(
      <View style={{
          flex: 1,
          paddingTop: 80,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}>
        <Image
          source={{uri: this.state.pushEvent.actor.avatar_url}}
          style={{
            height: 120,
            width: 120,
            borderRadius: 60
          }} />
        <Text style={{
            paddingTop: 20,
            paddingBottom: 20,
            fontSize: 20
          }}>
          {moment(this.state.pushEvent.created_at).fromNow()}
        </Text>
        <Text><Text style={styles.bold}>{this.state.pushEvent.actor.login}</Text> pushed to</Text>
        <Text>{this.state.pushEvent.payload.ref.replace('refs/heads/', '')}</Text>
        <Text>at <Text style={styles.bold}>{this.state.pushEvent.repo.name}</Text></Text>
        <Text style={{
            padding: 40,
            fontSize: 20
          }}>
          {this.state.pushEvent.payload.commits.length} Commits
        </Text>
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  bold: {
    fontWeight: '800',
    fontSize: 16
  }
})

module.exports = PushPayload;
