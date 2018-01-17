import React, { Component } from 'react';
import { Text,StyleSheet,View,Button, Dimensions,TextInput,ToastAndroid } from 'react-native';
import firebase from 'react-native-firebase';

import ImagePart from '../components/imagePart';


export default class searchScreen extends Component {
    constructor(props){
        super(props);
        this.itemsRef = firebase.database().ref().child('img');
    }
    static navigationOptions = {
        tabBarLabel:"Search"
    }

    state = {
        images: [ 
            {file_name: "masa", img_url: "https://firebasestorage.googleapis.com/v0/b/elliptical-disk-161320.appspot.com/o/assets%2FIMG_20180108_115012.jpg?alt=media&token=8358c7f5-4163-414e-8a14-2d29137a5898",tag:["laptop", "technology", "electronic device", "computer hardware", "computer accessory", "electronics", "multimedia", "computer", "space bar", "netbook"]},
            {file_name: "sandalye", img_url: "https://firebasestorage.googleapis.com/v0/b/elliptical-disk-161320.appspot.com/o/assets%2FIMG_20180108_010649.jpg?alt=media&token=e69ce558-ad0a-45b8-9d07-d0a96e14189e",tag:["ev","araba"]},
                        
        ],
        imagesReference: [],
        text: ''
    }

    componentDidMount(){
        this.itemsRef.on('value', (snap) => {
            var items = [];
            
            snap.forEach((child) => {
                this.state.images.push({
                file_name: child.val().file_name,
                img_url: child.val().img_url,
                tag: child.val().tags
              });
            });
            // this.state.images.push(items);
            // this.setState({images:this.items});
            // console.log(items);
     
        //   this.setState({images:items});
          });
          this.setState({imagesReference: this.state.images});
          this.setState({});
          console.log('===========STATE IMAGES=============');
          console.log(this.state.images);
          console.log(this.state.imagesReference);
          console.log('====================================');
    }

    search(text){
        this.setState({text:text});
        let imgArr = this.state.images;
        for (let i = 0; i < imgArr.length; i++) {
            
                for (let j = 0; j < imgArr[i].tag.length; j++) {
                const element = imgArr[j];
                if (text == imgArr[i].tag[j]) {
                    this.setState({images: [imgArr[i]]  })
                    
                }
            }
            
            

            
        }
        if(!text) {
            this.setState({images:this.state.imagesReference});
            //ToastAndroid.show("Cannot find image", ToastAndroid.SHORT);
        }
    }
    render() {
        let images = this.state.images.map((val,key)=>{
            console.log(val.img_url);
            if (val.img_url!= null) {
                return <View key={key} style={styles.imageWrapper}>
                        
                        <ImagePart imgsource ={val.img_url}/>
                   </View>
            }            
        })
        return (
            <View style={styles.container}>
                <TextInput style={styles.textInput} underlineColorAndroid ='transparent'
                placeholder='search images' onChangeText={(text)=>this.search(text)}
                value={this.state.text}
                />
                <View style={styles.photoWrapper}>
                    {images}
                </View>
            </View>
        )
    }

    listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {
    
          // get children as an array
          var items = [];
          snap.forEach((child) => {
            items.push({
              title: child.val().title,
              _key: child.key
            });
          });
          
          console.log(items)
        //   this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(items)
        //   });
    
        });
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#252525',
    },
    photoWrapper: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 2,
        backgroundColor: '#252525',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageWrapper:{
        padding:2,
        height:120,
        width: (Dimensions.get('window').width/2)-2,

    },
    textInput:{
        textAlign:'center',
        marginTop:10,
        marginBottom:10,
        padding:10,
        backgroundColor:'#fff',
    }
});
