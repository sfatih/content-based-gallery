import React, { Component } from 'react';
import { Text,StyleSheet,Image } from 'react-native';

export default class imagePart extends Component {
    static navigationOptions = {
        tabBarLabel:"Search"
    }

    state = {  }
    render() {
        return (

            // <Image source={ {uri: this.props.imgSource} } style={styles.image}
            // />

            <Image source={{uri: this.props.imgsource}} style={styles.image}
            />
        )
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: null,
        alignSelf:'stretch',
    }
});
