import React, {
    Component
} from 'react';
import {
    Image,
    StyleSheet
} from 'react-native';

export default class imagePart extends Component {
    render() {
        return (
            // />
            <
            Image source = {
                {
                    uri: this.props.imgsource,
                }
            }
            style = {
                styles.image
            }
            />
        );
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: null,
        alignSelf: 'stretch',
    },
});