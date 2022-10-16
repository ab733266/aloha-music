import React, { Component } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const drums = require('./music/drums.mp3');
const ukulele = require('./music/ukulele.mp3');
const drumImage = require('./images/drums.png');
const ukuleleImage = require('./images/ukulele.png');

export default class App extends Component {
  state = {
    isDrumsPlaying: false,
    isUkulelePlaying: false,
    drumPlaybackInstance: null,
    ukulelePlaybackInstance: null,
    volume: 1.0,
    isBuffering: false,
  }

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.loadDrumAudio();
    this.loadUkuleleAudio();
  }

  handleDrumPlayPause = async () => {
    const { isDrumsPlaying, drumPlaybackInstance, ukulelePlaybackInstance } = this.state;
    if (isDrumsPlaying) {
      await drumPlaybackInstance.pauseAsync();
    } else {
      await drumPlaybackInstance.playAsync();
      await ukulelePlaybackInstance.pauseAsync();
    }
    this.setState({
      isDrumsPlaying: !isDrumsPlaying
    });
  }

  handleUkulelePlayPause = async () => {
    const { isUkulelePlaying, ukulelePlaybackInstance, drumPlaybackInstance } = this.state;
    if (isUkulelePlaying){
      await ukulelePlaybackInstance.pauseAsync();
    } else {
      await ukulelePlaybackInstance.playAsync();
      await drumPlaybackInstance.pauseAsync();
    }
    this.setState({
      isUkulelePlaying: !isUkulelePlaying
    });
  }

  async loadDrumAudio() {
    const drumPlaybackInstance = new Audio.Sound();
    const source = drums;
    const status = {
      shouldPlay: this.state.isDrumsPlaying,
      volume: this.state.volume,
    };
    await drumPlaybackInstance.loadAsync(source, status, false);
    this.setState({
      drumPlaybackInstance
    });
  }

  async loadUkuleleAudio() {
    const ukulelePlaybackInstance = new Audio.Sound();
    const source = ukulele;
    const status = {
      shouldPlay: this.state.isUkulelePlaying,
      volume: this.state.volume,
    };
    await ukulelePlaybackInstance.loadAsync(source, status, false);
    this.setState({
      ukulelePlaybackInstance
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.largeText}>Aloha Music</Text>

        <View >
          <Image source={ukuleleImage} style={styles.photos} />
          <TouchableOpacity
            style={styles.control}
            onPress={this.handleUkulelePlayPause}>
            {this.state.isUkulelePlaying ?
              <Feather name="pause" size={32} color="#563822" /> :
              <Feather name="play" size={32} color="#563822" />
            }
          </TouchableOpacity>
        </View>

        <View >
          <Image source={drumImage} style={styles.photos} />
          <TouchableOpacity
            style={styles.control}
            onPress={this.handleDrumPlayPause}>
            {this.state.isDrumsPlaying ?
              <Feather name="pause" size={32} color="#563822" /> :
              <Feather name="play" size={32} color="#563822" />
            }
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buffer: {
    color: '#fff'
  },
  largeText: {
    fontSize: 35,
    backgroundColor: '#da9547',
    width: 350,
    textAlign: 'center',
    color: '#563822',
    fontWeight: 'bold',
    marginBottom: 20
  },
  control: {
    margin: 20,
    alignItems: 'center'
  },
  photos: {
    width: 350,
    height: 210
  },
});