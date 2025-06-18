// File: screens/BitcoinScreen.js
import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { ThemeContext } from '../App';

const { width } = Dimensions.get('window');

const currencyOptions = [
  { label: 'Bitcoin', value: 'bitcoin' },
  { label: 'Ethereum', value: 'ethereum' },
  { label: 'Solana', value: 'solana' },
  { label: 'Dogecoin', value: 'dogecoin' },
];

export default function BitcoinScreen() {
  const [selected, setSelected] = useState('bitcoin');
  const [coinData, setCoinData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const loadArticles = useCallback(() => {
    if (loadingArticles) return;
    setLoadingArticles(true);
    setTimeout(() => {
      const newArticles = Array.from({ length: 5 }, (_, i) => ({
        id: `article-${page}-${i}`,
        title: `Finance Article ${(page - 1) * 5 + i + 1}`,
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      }));
      setArticles((prev) => [...prev, ...newArticles]);
      setPage((prev) => prev + 1);
      setLoadingArticles(false);
    }, 1000);
  }, [loadingArticles, page]);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res1 = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${selected}`
      );
      const coin = await res1.json();
      setCoinData(coin[0]);

      const res2 = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selected}/market_chart?vs_currency=usd&days=180`
      );
      const trend = await res2.json();
      setHistory(trend.prices.map((p) => p[1]));
    } catch (e) {
      console.error('API error', e);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDetails();
    setArticles([]);
    setPage(1);
    loadArticles();
    setRefreshing(false);
  };

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const percentColor =
    coinData?.price_change_percentage_24h >= 0 ? '#28a745' : '#dc3545';

  return (
    <PaperProvider>
      <ScrollView
        style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.tracker}>
          <Text style={[styles.trackerTitle, { color: isDark ? '#fff' : '#000' }]}>Select Cryptocurrency</Text>

          <Button mode="outlined" onPress={() => setModalVisible(true)}>
            {currencyOptions.find((c) => c.value === selected)?.label || 'Select'}
          </Button>

          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={[styles.modalContainer, { backgroundColor: isDark ? '#111' : '#fff' }]}>
                {currencyOptions.map((coin) => (
                  <Pressable
                    key={coin.value}
                    onPress={() => {
                      setSelected(coin.value);
                      setModalVisible(false);
                    }}
                    style={styles.modalItem}
                  >
                    <Text style={{ color: isDark ? '#fff' : '#000' }}>{coin.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Modal>

          {loading ? (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.dataDisplay}>
              <Text style={[styles.coinName, { color: isDark ? '#fff' : '#000' }]}>{coinData?.name}</Text>
              <View style={styles.inlineRow}>
                <Text style={[styles.price, { color: isDark ? '#fff' : '#000' }]}>${coinData?.current_price?.toLocaleString()}</Text>
                <Text style={[styles.change, { color: percentColor }]}>  ({coinData?.price_change_percentage_24h?.toFixed(2)}%)</Text>
              </View>
              <Text style={[styles.chartTitle, { color: isDark ? '#aaa' : '#555' }]}>Last 6 Months</Text>

              {history.length > 0 && (
                <LineChart
                  data={{ labels: [], datasets: [{ data: history }] }}
                  width={width * 0.85}
                  height={120}
                  withDots={false}
                  withInnerLines={false}
                  chartConfig={{
                    backgroundGradientFrom: isDark ? '#000' : '#fff',
                    backgroundGradientTo: isDark ? '#000' : '#fff',
                    color: () => '#007aff',
                    strokeWidth: 2,
                  }}
                  bezier
                  style={{ marginTop: 10, borderRadius: 12 }}
                />
              )}
            </View>
          )}
        </View>

        <View style={styles.articleSection}>
          <Text style={[styles.articleTitle, { color: isDark ? '#fff' : '#000' }]}>Finance Articles</Text>
          {articles.map((article) => (
            <TouchableOpacity key={article.id} activeOpacity={0.85} style={[styles.articleCard, { backgroundColor: isDark ? '#111' : '#f9f9f9' }]}>
              <Text style={[styles.articleHeading, { color: isDark ? '#fff' : '#000' }]}>{article.title}</Text>
              <Text style={[styles.articleBody, { color: isDark ? '#aaa' : '#444' }]}>{article.body}</Text>
            </TouchableOpacity>
          ))}
          {loadingArticles && <ActivityIndicator size="small" color="#999" />}
          <Button mode="text" onPress={loadArticles}>Load More</Button>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tracker: { padding: 20 },
  trackerTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  dataDisplay: { marginTop: 20, alignItems: 'center' },
  coinName: { fontSize: 26, fontWeight: 'bold', marginBottom: 6 },
  inlineRow: { flexDirection: 'row', alignItems: 'center' },
  price: { fontSize: 22, fontWeight: '600' },
  change: { fontSize: 16, marginLeft: 8 },
  chartTitle: { marginTop: 20, fontSize: 16, fontWeight: '500' },
  articleSection: { paddingHorizontal: 16, paddingVertical: 24 },
  articleTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  articleCard: {
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
  },
  articleHeading: { fontSize: 15, fontWeight: 'bold' },
  articleBody: { marginTop: 4, fontSize: 14 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    margin: 40,
    borderRadius: 10,
    padding: 10,
  },
  modalItem: { padding: 12 },
});
