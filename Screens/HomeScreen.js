// File: screens/HomeScreen.js
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, ImageBackground,
  Image, Pressable, useWindowDimensions, RefreshControl, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../App';

const newlyAddedStories = [
  { title: 'Story 1', image: 'https://placekitten.com/300/200' },
  { title: 'Story 2', image: 'https://placekitten.com/301/200' },
  { title: 'Story 3', image: 'https://placekitten.com/302/200' },
  { title: 'Story 4', image: 'https://placekitten.com/303/200' },
];

const trendingData = {
  daily: [
    { title: 'Story A', image: 'https://placekitten.com/200/150', views: '1.1M views' },
    { title: 'Story B', image: 'https://placekitten.com/201/150', views: '950K views' },
    { title: 'Story C', image: 'https://placekitten.com/202/150', views: '820K views' },
  ],
  weekly: [
    { title: 'Story D', image: 'https://placekitten.com/203/150', views: '2.4M views' },
    { title: 'Story E', image: 'https://placekitten.com/204/150', views: '1.7M views' },
    { title: 'Story F', image: 'https://placekitten.com/205/150', views: '1.3M views' },
  ],
  monthly: [
    { title: 'Story G', image: 'https://placekitten.com/206/150', views: '3.2M views' },
    { title: 'Story H', image: 'https://placekitten.com/207/150', views: '2.8M views' },
    { title: 'Story I', image: 'https://placekitten.com/208/150', views: '2.1M views' },
  ],
};

const latestUpdates = [
  { title: 'Story 1', image: 'https://placekitten.com/100/100', chapter: 'Chapter 45', updated: '20 mins ago' },
  { title: 'Story 2', image: 'https://placekitten.com/101/100', chapter: 'Chapter 78', updated: '50 mins ago' },
  { title: 'Story 3', image: 'https://placekitten.com/102/100', chapter: 'Chapter 32', updated: '2 hours ago' },
  { title: 'Story 4', image: 'https://placekitten.com/103/100', chapter: 'Chapter 89', updated: '5 hours ago' },
  { title: 'Story 5', image: 'https://placekitten.com/104/100', chapter: 'Chapter 101', updated: '10 hours ago' },
];

const HomeScreen = () => {
  const [trendingTab, setTrendingTab] = useState('daily');
  const carouselRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const { isDark } = useContext(ThemeContext);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (carouselIndex + 1) % newlyAddedStories.length;
      setCarouselIndex(nextIndex);
      if (carouselRef.current) {
        carouselRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselIndex]);

  const textColor = { color: isDark ? '#fff' : '#000' };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={[styles.navbar, { backgroundColor: isDark ? '#121212' : '#f8f8f8' }]}>
        <Text style={[styles.navTitle, textColor]}>Home</Text>
        <Ionicons name="home-outline" size={24} color={isDark ? '#fff' : '#000'} />
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="star" size={20} color="#ff9900" style={styles.icon} />
          <Text style={[styles.sectionTitle, textColor]}>Newly Added</Text>
        </View>
        <FlatList
          ref={carouselRef}
          data={newlyAddedStories}
          keyExtractor={(item) => item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85}>
              <ImageBackground
                source={{ uri: item.image }}
                style={[styles.carouselItem, { width: width * 0.7 }]}
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.carouselText}>{item.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />

        <View style={styles.sectionHeader}>
          <Ionicons name="flame" size={20} color="#e63946" style={styles.icon} />
          <Text style={[styles.sectionTitle, textColor]}>Trending Stories</Text>
        </View>

        <View style={[styles.tabContainer, { backgroundColor: isDark ? '#222' : '#f2f2f2' }]}>
          {['daily', 'weekly', 'monthly'].map((tab) => (
            <Pressable key={tab} onPress={() => setTrendingTab(tab)} style={[styles.tabButton, trendingTab === tab && styles.tabActive]}>
              <Text style={[styles.tabText, trendingTab === tab && styles.tabTextActive, textColor]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </Pressable>
          ))}
        </View>

        {trendingData[trendingTab].map((item, index) => (
          <TouchableOpacity key={index} activeOpacity={0.85} style={[styles.trendingCard, { backgroundColor: isDark ? '#111' : '#fff' }]}>
            <Image source={{ uri: item.image }} style={{ width: width * 0.25, height: width * 0.25, borderRadius: 8, marginRight: 12 }} />
            <View style={styles.trendingTextContainer}>
              <Text style={[styles.trendingTitle, textColor]}>{item.title}</Text>
              <Text style={[styles.trendingViews, { color: isDark ? '#aaa' : '#666' }]}>{item.views}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.sectionHeader}>
          <Ionicons name="time" size={20} color="#0077b6" style={styles.icon} />
          <Text style={[styles.sectionTitle, textColor]}>Latest Updates</Text>
        </View>
        {latestUpdates.map((item, index) => (
          <TouchableOpacity key={index} activeOpacity={0.85} style={[styles.updateCard, { backgroundColor: isDark ? '#111' : '#fff' }]}>
            <Image source={{ uri: item.image }} style={{ width: width * 0.18, height: width * 0.18, borderRadius: 8, marginRight: 12 }} />
            <View style={styles.updateTextContainer}>
              <Text style={[styles.updateTitle, textColor]}>{item.title}</Text>
              <Text style={[styles.updateChapter, { color: isDark ? '#ccc' : '#555' }]}>{item.chapter}</Text>
              <Text style={[styles.updateTime, { color: isDark ? '#888' : '#888' }]}>{item.updated}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: '5%', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#ddd'
  },
  navTitle: { fontSize: 22, fontWeight: 'bold' },
  container: { paddingBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10, paddingHorizontal: '5%' },
  icon: { marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  carouselItem: {
    height: 160, marginRight: 16,
    justifyContent: 'flex-end', borderRadius: 16, overflow: 'hidden'
  },
  overlay: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 10 },
  carouselText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  trendingCard: {
    flexDirection: 'row', padding: 12, marginBottom: 12,
    borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, alignItems: 'center', marginHorizontal: '5%'
  },
  trendingTextContainer: { flex: 1 },
  trendingTitle: { fontSize: 16, fontWeight: 'bold' },
  trendingViews: { marginTop: 4 },
  updateCard: {
    flexDirection: 'row', padding: 12, marginBottom: 12,
    borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, alignItems: 'center', marginHorizontal: '5%'
  },
  updateTextContainer: { flex: 1 },
  updateTitle: { fontSize: 15, fontWeight: 'bold' },
  updateChapter: { marginTop: 2 },
  updateTime: { fontSize: 12, marginTop: 2 },
  tabContainer: {
    flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12,
    paddingVertical: 8, borderRadius: 8, marginHorizontal: '5%'
  },
  tabButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  tabText: { color: '#333' },
  tabTextActive: { fontWeight: 'bold' },
});

export default HomeScreen;
