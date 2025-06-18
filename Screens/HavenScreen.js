// File: screens/HavenScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { ThemeContext } from '../App';
import NetInfo from '@react-native-community/netinfo';

const mockStories = Array.from({ length: 50 }, (_, i) => ({
  id: i.toString(),
  title: `Story ${String.fromCharCode(65 + (i % 26))}${i}`,
  chapters: 5 + (i % 20),
  image: `https://placekitten.com/100/${100 + (i % 5)}`,
}));

export default function HavenScreen() {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [online, setOnline] = useState(true);
  const { isDark } = useContext(ThemeContext);

  const PAGE_SIZE = 10;
  const filtered = mockStories.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const onRefresh = () => {
    setRefreshing(true);
    NetInfo.fetch().then(state => {
      setOnline(state.isConnected);
      setRefreshing(false);
    });
  };

  const renderEmpty = () => {
    const shuffled = mockStories.sort(() => 0.5 - Math.random()).slice(0, 5);
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#fff' : '#000', marginBottom: 10 }}>No stories found. Try these instead:</Text>
        {shuffled.map((item) => (
          <TouchableOpacity key={item.id} activeOpacity={0.85}>
            <View style={[styles.storyCard, { backgroundColor: isDark ? '#111' : '#fff' }]}>
              <Image source={{ uri: item.image }} style={styles.storyImage} />
              <View style={styles.storyTextContainer}>
                <Text style={[styles.storyTitle, { color: isDark ? '#fff' : '#000' }]}>{item.title}</Text>
                <Text style={{ color: isDark ? '#aaa' : '#666' }}>{item.chapters} Chapters</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!online) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 18 }}>No internet connection</Text>
        <Button mode="contained" onPress={onRefresh} style={{ marginTop: 16 }}>Try Again</Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search stories..."
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        style={[styles.searchInput, {
          backgroundColor: isDark ? '#111' : '#f0f0f0',
          color: isDark ? '#fff' : '#000',
          borderColor: isDark ? '#444' : '#ccc',
        }]}
      />

      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={paged}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85}>
            <View style={[styles.storyCard, { backgroundColor: isDark ? '#111' : '#fff' }]}>
              <Image source={{ uri: item.image }} style={styles.storyImage} />
              <View style={styles.storyTextContainer}>
                <Text style={[styles.storyTitle, { color: isDark ? '#fff' : '#000' }]}>{item.title}</Text>
                <Text style={{ color: isDark ? '#aaa' : '#666' }}>{item.chapters} Chapters</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View style={styles.footerControls}>
            <Button
              disabled={page === 0}
              onPress={() => setPage((p) => Math.max(p - 1, 0))}
              style={styles.pageBtn}
            >
              Previous
            </Button>
            <Button
              disabled={(page + 1) * PAGE_SIZE >= filtered.length}
              onPress={() => setPage((p) => p + 1)}
              style={styles.pageBtn}
            >
              Next
            </Button>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchInput: {
    marginBottom: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 8,
    padding: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  storyTextContainer: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  pageBtn: {
    borderRadius: 8,
    marginHorizontal: 6,
  },
});
