'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  View
} from 'react-native';

const buffer = require('buffer');

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      showProgress: false
    }
  }

  render() {
    let errorCtrl = <View />;

    if(!this.state.success && this.state.badCredentials){
      errorCtrl = <Text style={styles.error}>
        That username and password combination did not work.
      </Text>;
    }

    if(!this.state.success && this.state.unknownError){
      errorCtrl = <Text style={styles.error}>
        That username and password combination did not work.
      </Text>;
    }

    return(
      <View style={styles.container}>
        <Image style={styles.logo} source={require('image!Octocat')} />
        <Text style={styles.heading}>Github Browser</Text>
        <TextInput style={styles.input}
            onChangeText={(text) => this.setState({username: text})}
            placeholder="Github username" />
        <TextInput style={styles.input}
            onChangeText={(text) => this.setState({password: text})}
            placeholder="Github password"
            secureTextEntry={true} />
        <TouchableHighlight
          onPress={this.onLoginPressed.bind(this)}
          style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableHighlight>
        {errorCtrl}
        <ActivityIndicatorIOS
          animating={this.state.showProgress}
          size="large"
          style={styles.loader} />
      </View>
    );
  }
  
  onLoginPressed(){
    console.log('Loggin in: ' + this.state.username);
    this.setState({showProgress: true});
    const AuthService = require('./authservice')
    AuthService.login({
      username: this.state.username,
      password: this.state.password
    }, (results) => {
      this.setState(Object.assign({
        showProgress: false
      }, results));

      if(results.success && this.props.onLogin){
        this.props.onLogin();
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5fcff',
    flex: 1,
    paddingTop: 40,
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
  },
  loader: {
    marginTop: 20
  },
  error: {
    color: 'red',
    paddingTop: 10
  }
});

module.exports = Login;
