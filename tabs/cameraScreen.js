
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Alert, Image, NativeModules, ToastAndroid } from 'react-native';
import firebase from 'react-native-firebase';
import Camera from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-spinkit';

var config = {
    apiKey: "AIzaSyC0G-Kbo8p5EokfC7v1Ima8JmUQNJgyqk0",
    authDomain: "elliptical-disk-161320.firebaseapp.com",
    databaseURL: "https://elliptical-disk-161320.firebaseio.com",
    projectId: "elliptical-disk-161320",
    storageBucket: "elliptical-disk-161320.appspot.com",
    messagingSenderId: "474434073781"
};

const defaultApp = firebase.app();

var storage = firebase.storage();
var storageRef = storage.ref();
var db = firebase.database();
var tempFileID = "";

var metadata = {
    contentType: 'image/jpeg'
};

export default class cameraScreen extends React.Component {
    
    constructor() {
        super();
        this.state = {
            isReady: false
        };
    }
    static navigationOptions = {
        tabBarLabel:"Camera"
    }
    render() {
        return (
            <View style={styles.container}>
            <Camera
            ref={(cam) => {
                this.camera = cam;
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
            playSoundOnCapture={false}>
            <View><Text>{this.state.loading}</Text></View>
            {
                (!this.state.loading) ?
                <Text
                style={styles.capture}
                onPress={this.takePicture.bind(this)}></Text>
                :
                <View>
                <Spinner
                style={styles.spinner}
                isVisible={true}
                size={70}
                type={'Bounce'}
                color={'white'}/>
                </View>
                
            }
            </Camera>
            </View>
        );
    }
    takePicture() {
        console.log("*****Take Picture START*****");
        if (!this.state.loading) {
            this.setState({
                loading: true
            });
            
            const options = {};
            this.camera.capture({metadata: options})
            .then((data) => {
                this._UploadFiles(data.path);
                resizeImage(data.path, (resizedImageUri) => {
                    console.log(resizedImageUri);
                    NativeModules.RNImageToBase64.getBase64String(resizedImageUri, async (err, base64) => {
                        
                        if (err) {
                            consolo.log("error ");
                            console.log(err.message);
                            this.setState({
                                loading: false
                            });
                            
                        }else{
                            console.log('base64 ok');
                        }
                        
                        let result = await checkForLabels(base64);
                        console.log(result);
                        
                        let filteredResult = filterLabels(result.responses[0], 0.4);
                        displayResult(filteredResult);
                        
                        this.setState({
                            loading: false
                        });
                    })
                })
            })
            .catch(err => console.error(err.message));
        } else {
            console.log("else running");
            console.log( this.state.loading)
        }
        console.log("*****Take Picture END*****");
        
    }    
    _UploadFiles(dataPath){
        console.log("*****Upload Files START*****");
        var imagePath = dataPath;
        var filename = [];
        var fileID = []
        filename=imagePath.split('/').pop();
        fileID = filename.split('.',1).pop();
        tempFileID = fileID;
        console.log("FILE ID = " + fileID);
        

        console.log("file name "+ filename);
        const unsubscribe = storage.ref('/assets/'+filename)
        .putFile(imagePath).on('state_changed', snapshot => {
            //Current upload state
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + "";
            if (progress == 100) {
                ToastAndroid.show("Upload Completed", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show(progress, ToastAndroid.SHORT);
            }
            
            
        }, err => {
            //Error
            Alert.alert("file upload error");
            unsubscribe();
        }, () => {
            //Success
            firebase.storage().ref('/assets/'+filename).getDownloadURL().then(downloadedFile => {
                
                console.log('====================================');                
                console.log(downloadedFile);
                console.log('====================================');
                dbSet(fileID,downloadedFile);
    
            }).catch(err => {
                //Error
                Alert.alert("url error:" +err.message);
                console.log("ERROR:"+ err.message)
            });
            unsubscribe();
        });
        



        console.log("*****Upload Files END*****");
    }

    
}
async function checkForLabels(base64) {
    
    return await
    fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAx2jPFNZAQNXQjvj8bJjg6gkyb-CrUBZk', {
    method: 'POST',
    body: JSON.stringify({
        "requests": [
            {
                "image": {
                    "content": base64
                },
                "features": [
                    {
                        "type": "LABEL_DETECTION"
                    }
                ]
            }
        ]
    })
}).then((response) => {
    return response.json();
}).catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
      throw error;
    });
}

function displayResult(filteredResult) {
    console.log("*****Display Result START*****");
    let tagArray = [];
    let labelString = '';
    if (filteredResult.length > 0) {
        filteredResult.forEach((resLabel) => {
            console.log(resLabel.description);
            tagArray.push(resLabel.description);
            labelString+=resLabel.description + " ";
        });
        Alert.alert(
            'Label for this image: ',
            labelString
        );
    } else {
        Alert.alert(
            'We can\'t recognize this item'
        );
    }
    // console.log("*****TAGS*****");    
    // console.log('====================================');
    // console.log(tagArray);
    // console.log('====================================');
    dbTagSet(tempFileID,tagArray);
    console.log("*****Display Result END*****");
}

function resizeImage(path, callback, width = 640, height = 480) {
    ImageResizer.createResizedImage(path, width, height, 'JPEG', 80).then((resizedImageUri) => {
        callback(resizedImageUri);
        
    }).catch((err) => {
        console.error(err)
    });
}

function filterLabels(response, minConfidence) {
    let resultArr = [];
    response.labelAnnotations.forEach((label) => {
        if (label.score > minConfidence) {
            resultArr.push(label);
        }
    });
    return resultArr;
}

function dbSet(file,url) {
    firebase.database().ref('img/'+file).set({ img_url: url, file_name: file+".jpg" });    
}

function dbTagSet(file,tag) {
    firebase.database().ref('img/'+file).update({ tags:tag });
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
        margin: 50,
        height: 70,
        width: 70,
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 15
    },
    loadingMsg: {
        position: 'absolute',
        top: '50%',
        left: '50%'
    },
    loadingText: {
        fontSize: 18,
        padding: 5,
        borderRadius: 20,
        backgroundColor: 'white',
        margin: 30
    },
    spinner: {
        marginBottom: 50
    },
});
