
import React, { Component } from 'react';
import { Text,StyleSheet,View,Button } from 'react-native';

export default class listScreen extends Component {
    static navigationOptions = {
        tabBarLabel:"List Screen"
    }

    state = {  }
    render() {
        return (
            <View style = {{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            
            <Text style={styles.container}>LIST SCREEN</Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
    }
});
