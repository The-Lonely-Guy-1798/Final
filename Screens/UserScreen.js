// File: screens/UserScreen.js
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../App';

const QUOTES = [
  'Read more, live more.',
  'Every page is a new world.',
  'Stories change lives.',
  'A good story is a treasure.',
];

const UserScreen = () => {
  const { isDark, setIsDark } = useContext(ThemeContext);
  const [userName, setUserName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [lastChangeDate, setLastChangeDate] = useState(null);
  const [recentStories, setRecentStories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const name = await AsyncStorage.getItem('username');
      const changed = await AsyncStorage.getItem('nameLastChanged');
      const recent = await AsyncStorage.getItem('recentStories');
      if (name) setUserName(name);
      if (changed) setLastChangeDate(new Date(changed));
      if (recent) setRecentStories(JSON.parse(recent));
      // show a quote on open
      const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      Alert.alert('📚 Inspiration', quote);
    };
    loadData();
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const canEditName = () => {
    if (!lastChangeDate) return true;
    const now = new Date();
    const diff = (now - lastChangeDate) / (1000 * 60 * 60 * 24);
    return diff >= 30;
  };

  const handleNameChange = async (text) => {
    if (!canEditName()) return;
    setUserName(text);
    const now = new Date();
    await AsyncStorage.setItem('username', text);
    await AsyncStorage.setItem('nameLastChanged', now.toISOString());
    setLastChangeDate(now);
    setModalVisible(false);
  };

  const openLink = (url) => Linking.openURL(url);
  const themeStyle = isDark ? styles.dark : styles.light;

  return (
    <ScrollView contentContainerStyle={[styles.container, themeStyle]}>
      <View style={styles.section}>
        <Text style={[styles.heading, themeStyle]}>Name</Text>
        <View style={styles.nameRow}>
          <Text style={[styles.userName, themeStyle]}>{userName || 'Signed in User'}</Text>
          <Pressable
            onPress={() => setModalVisible(true)}
            accessibilityLabel="Edit user name"
            accessibilityRole="button"
          >
            <Ionicons name="pencil" size={20} color={isDark ? '#aaa' : '#444'} />
          </Pressable>
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContainer, { backgroundColor: isDark ? '#111' : '#fff' }]}>
            <Text style={{ fontSize: 16, marginBottom: 8, color: isDark ? '#fff' : '#000' }}>
              Enter New Name (can change every 30 days)
            </Text>
            <TextInput
              style={[styles.nameInput, {
                backgroundColor: isDark ? '#222' : '#eee',
                color: isDark ? '#fff' : '#000'
              }]}
              placeholder="New name"
              placeholderTextColor={isDark ? '#888' : '#aaa'}
              onSubmitEditing={(e) => handleNameChange(e.nativeEvent.text)}
            />
            <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: '#007bff' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.sectionRow}>
        <Text style={[styles.label, themeStyle]}>App Theme</Text>
        <Pressable
          onPress={toggleTheme}
          style={styles.themeIconToggle}
          accessibilityRole="switch"
          accessibilityLabel="Toggle app theme"
        >
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={24}
            color={isDark ? '#fff' : '#000'}
          />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, themeStyle]}>Recently Viewed</Text>
        <FlatList
          data={recentStories}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <Text style={[styles.text, { color: isDark ? '#ccc' : '#333' }]}>{item}</Text>
          )}
          ListEmptyComponent={<Text style={{ color: isDark ? '#777' : '#aaa' }}>No recent stories</Text>}
        />
      </View>

      <View style={styles.section}>
        <Pressable style={styles.row} onPress={() => {}} accessibilityLabel="Share App" accessibilityRole="button">
          <Ionicons name="share-social-outline" size={20} style={[styles.icon, themeStyle]} />
          <Text style={[styles.text, themeStyle]}>Share this App</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => openLink('mailto:support@freemiumnovels.com')} accessibilityLabel="Contact us" accessibilityRole="button">
          <Ionicons name="mail-outline" size={20} style={[styles.icon, themeStyle]} />
          <Text style={[styles.text, themeStyle]}>Contact Us</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => openLink('https://freemiumnovels.com/privacy')} accessibilityRole="link">
          <Ionicons name="document-text-outline" size={20} style={[styles.icon, themeStyle]} />
          <Text style={[styles.text, themeStyle]}>Privacy Policy</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => openLink('https://freemiumnovels.com/terms')} accessibilityRole="link">
          <Ionicons name="document-outline" size={20} style={[styles.icon, themeStyle]} />
          <Text style={[styles.text, themeStyle]}>Terms of Service</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    color: '#888',
    marginBottom: 6,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
  nameInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    fontSize: 16,
  },
  themeIconToggle: {
    padding: 6,
    borderRadius: 20,
  },
  light: {
    backgroundColor: '#fff',
    color: '#222',
  },
  dark: {
    backgroundColor: '#121212',
    color: '#eee',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
});

export default UserScreen;
