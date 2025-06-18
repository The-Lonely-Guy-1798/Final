// File: screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, useWindowDimensions, PixelRatio } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const normalize = (size) => {
  const scale = PixelRatio.getFontScale();
  return size * scale;
};

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Animated.View style={[styles.container, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}
      >
        <Text style={styles.appName}>Freemium Novels</Text>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/29/29302.png' }}
          style={[styles.bookImage, { width: width * 0.25, aspectRatio: 1 }]}
          resizeMode="contain"
        />
        <Text style={styles.taglinePrimary}>Great Stories Shouldn’t Cost a Dime.</Text>
        <Text style={styles.taglineSecondary}>New stories every 5th, 15th and 25th of the month</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '8%',
  },
  appName: {
    fontSize: normalize(30),
    fontWeight: '800',
    marginBottom: 24,
    color: '#222',
    fontFamily: 'serif',
    textAlign: 'center',
  },
  bookImage: {
    marginBottom: 24,
  },
  taglinePrimary: {
    fontSize: normalize(18),
    fontWeight: '600',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Georgia',
    marginBottom: 6,
  },
  taglineSecondary: {
    fontSize: normalize(13),
    color: '#777',
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
});

export default SplashScreen;
