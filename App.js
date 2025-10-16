import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar } from 'react-native';

// API Configuration
const API_URL = 'http://localhost:5001/api';
const USER_ID = 1;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen setScreen={setCurrentScreen} />;
      case 'cycle':
        return <CycleScreen setScreen={setCurrentScreen} />;
      case 'jetlag':
        return <JetLagScreen setScreen={setCurrentScreen} />;
      default:
        return <HomeScreen setScreen={setCurrentScreen} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderScreen()}
      <BottomNav currentScreen={currentScreen} setScreen={setCurrentScreen} />
    </View>
  );
}

// Home Screen Component
function HomeScreen({ setScreen }) {
  const [tamagotchiMood, setTamagotchiMood] = useState('sleepy');
  const [sleepData, setSleepData] = useState(null);
  const [loading, setLoading] = useState(false);

  const moods = {
    sleepy: { emoji: '😴', text: 'Feeling sleepy' },
    happy: { emoji: '😊', text: 'Feeling great!' },
    stressed: { emoji: '😰', text: 'Feeling stressed' }
  };

  useEffect(() => {
    fetchSleepData();
  }, []);

  const fetchSleepData = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${USER_ID}/sleep?days=1`);
      const data = await response.json();
      if (data.length > 0) {
        setSleepData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching sleep data:', error);
    }
  };

  const cycleMood = async () => {
    const moodKeys = Object.keys(moods);
    const currentIndex = moodKeys.indexOf(tamagotchiMood);
    const nextIndex = (currentIndex + 1) % moodKeys.length;
    const newMood = moodKeys[nextIndex];
    setTamagotchiMood(newMood);

    try {
      await fetch(`${API_URL}/users/${USER_ID}/avatar/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predicted_state: tamagotchiMood,
          actual_state: newMood,
          mood_emoji: moods[newMood].emoji
        })
      });
    } catch (error) {
      console.error('Error logging mood:', error);
    }
  };

  const getAIAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/${USER_ID}/ai-analysis/sleep`, {
        method: 'POST',
      });
      const data = await response.json();
      alert('AI Analysis complete! Check console for insights.');
      console.log('AI Insights:', data);
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      alert('Error generating AI analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sleep OS</Text>
      </View>

      {/* Tamagotchi */}
      <TouchableOpacity onPress={cycleMood} style={styles.tamagotchiCard}>
        <Text style={styles.tamagotchiEmoji}>{moods[tamagotchiMood].emoji}</Text>
        <Text style={styles.tamagotchiText}>{moods[tamagotchiMood].text}</Text>
        <Text style={styles.tamagotchiHint}>Tap to change mood</Text>
      </TouchableOpacity>

      {/* Intervention Card */}
      <View style={styles.interventionCard}>
        <Text style={styles.interventionEmoji}>💊</Text>
        <View style={styles.interventionContent}>
          <Text style={styles.interventionTitle}>Take 3mg melatonin now</Text>
          <Text style={styles.interventionSubtitle}>Jet lag day 2 · Optimal timing</Text>
        </View>
      </View>

      {/* Sleep Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.summaryScore}>
              {sleepData?.sleep_quality ? sleepData.sleep_quality * 20 : '76'}
            </Text>
            <Text style={styles.summaryLabel}>Sleep Score</Text>
          </View>
          <Text style={styles.stars}>
            {'⭐'.repeat(sleepData?.sleep_quality || 3)}
          </Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Duration</Text>
            <Text style={styles.metricValue}>
              {sleepData?.sleep_duration ? `${sleepData.sleep_duration.toFixed(1)} hrs` : '7.5 hrs'}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Wake-ups</Text>
            <Text style={styles.metricValue}>2</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>REM</Text>
            <Text style={styles.metricValue}>1.8 hrs</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setScreen('cycle')}
        >
          <Text style={styles.primaryButtonText}>View Trends</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => alert('Add note feature coming soon!')}
        >
          <Text style={styles.secondaryButtonText}>Add Note</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Cycle Screen Component
function CycleScreen({ setScreen }) {
  const days = [
    { date: 14, current: false },
    { date: 15, current: false },
    { date: 16, current: true },
    { date: 17, current: false },
    { date: 18, current: false },
    { date: 19, current: false },
    { date: 20, current: false }
  ];

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cycle</Text>
      </View>

      {/* Calendar */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>October 2025</Text>
        <View style={styles.calendarHeader}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <Text key={i} style={styles.dayLabel}>{day}</Text>
          ))}
        </View>
        <View style={styles.calendarDays}>
          {days.map((day, i) => (
            <View
              key={i}
              style={[
                styles.calendarDay,
                day.current && styles.calendarDayCurrent
              ]}
            >
              <Text style={styles.calendarDayText}>{day.date}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Phase Info */}
      <View style={styles.phaseCard}>
        <Text style={styles.phaseTitle}>Follicular Phase</Text>
        <Text style={styles.phaseSubtitle}>Day 12 of your cycle</Text>
        <View style={styles.phaseTip}>
          <Text style={styles.phaseTipText}>Expected: High quality sleep</Text>
          <Text style={styles.phaseTipBold}>💡 Tip: Set bedroom temp to 67°F</Text>
        </View>
      </View>

      {/* Total Sleep Time Over Cycle */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Sleep Time Over Your Cycle</Text>
        <View style={styles.cycleGraphContainer}>
          <View style={styles.cycleGraphYAxis}>
            <Text style={styles.yAxisLabel}>8h</Text>
            <Text style={styles.yAxisLabel}>7h</Text>
            <Text style={styles.yAxisLabel}>6h</Text>
            <Text style={styles.yAxisLabel}>5h</Text>
          </View>
          <View style={styles.cycleGraphArea}>
            {/* Bars for each day of cycle */}
            {[6.5, 7.0, 7.2, 7.5, 7.8, 8.0, 7.9, 7.7, 7.5, 7.3, 7.0, 6.8, 6.5, 6.3, 6.5, 6.8, 7.0, 7.2, 7.5, 7.8, 7.6, 7.4, 7.2, 7.0, 6.8, 6.6, 6.5, 6.7].map((hours, i) => (
              <View key={i} style={styles.cycleGraphBarContainer}>
                <View style={[styles.cycleGraphBar, { height: `${(hours / 8) * 100}%` }]} />
              </View>
            ))}
          </View>
        </View>
        <View style={styles.cyclePhaseLabels}>
          <Text style={styles.phaseLabel}>Menstrual</Text>
          <Text style={styles.phaseLabel}>Follicular</Text>
          <Text style={styles.phaseLabel}>Ovulation</Text>
          <Text style={styles.phaseLabel}>Luteal</Text>
        </View>
        <Text style={styles.chartLabel}>28-day cycle view</Text>
      </View>

      {/* Predicted Quality */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Predicted Quality</Text>
        <Text style={styles.predictionScore}>8.2/10</Text>
        <View style={styles.chart}>
          {[30, 50, 70, 100, 70, 50, 40, 30, 20].map((height, i) => (
            <View
              key={i}
              style={[styles.chartBar, { height: height }]}
            />
          ))}
        </View>
        <Text style={styles.chartLabel}>Last 9 days trend</Text>
      </View>
    </ScrollView>
  );
}

// Jet Lag Screen Component
function JetLagScreen({ setScreen }) {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setScreen('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jet Lag Recovery</Text>
      </View>

      {/* Travel Info */}
      <View style={styles.travelCard}>
        <View style={styles.travelHeader}>
          <Text style={styles.travelRoute}>London → New York</Text>
          <View style={styles.timezoneBadge}>
            <Text style={styles.timezoneBadgeText}>-5 hrs</Text>
          </View>
        </View>
        <Text style={styles.travelSubtitle}>Recovery: Day 3 of 5</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* Circadian Rhythm Graph */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Circadian Rhythm vs Local Circadian Rhythm</Text>
        <View style={styles.circadianGraph}>
          {/* Time labels */}
          <View style={styles.circadianLabels}>
            <Text style={styles.circadianLabel}>00:00</Text>
            <Text style={styles.circadianLabel}>06:00</Text>
            <Text style={styles.circadianLabel}>12:00</Text>
            <Text style={styles.circadianLabel}>18:00</Text>
            <Text style={styles.circadianLabel}>24:00</Text>
          </View>

          {/* Graph area */}
          <View style={styles.circadianGraphArea}>
            {/* Local rhythm - dashed line */}
            <View style={styles.circadianLocal} />

            {/* Your rhythm - solid line */}
            <View style={styles.circadianYours} />

            {/* Current position marker */}
            <View style={styles.circadianMarker}>
              <Text style={styles.circadianMarkerText}>You are here</Text>
              <View style={styles.circadianMarkerDot} />
            </View>
          </View>

          {/* Legend */}
          <View style={styles.circadianLegend}>
            <View style={styles.legendItem}>
              <View style={styles.legendLineLocal} />
              <Text style={styles.legendText}>Local Rhythm</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendLineYours} />
              <Text style={styles.legendText}>Your Rhythm</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Protocol */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Protocol</Text>

        <View style={styles.protocolItem}>
          <Text style={styles.protocolCheck}>✓</Text>
          <View style={styles.protocolContent}>
            <Text style={styles.protocolTitle}>09:00 SAD lamp</Text>
            <Text style={styles.protocolSubtitle}>30 minutes</Text>
          </View>
        </View>

        <View style={[styles.protocolItem, styles.protocolItemActive]}>
          <Text style={styles.protocolCheck}>⏰</Text>
          <View style={styles.protocolContent}>
            <Text style={styles.protocolTitle}>18:00 Melatonin 3mg</Text>
            <Text style={styles.protocolSubtitle}>In 2 hours</Text>
          </View>
        </View>

        <View style={styles.protocolItem}>
          <Text style={styles.protocolCheck}>⏰</Text>
          <View style={styles.protocolContent}>
            <Text style={styles.protocolTitle}>21:30 Wind-down routine</Text>
            <Text style={styles.protocolSubtitle}>In 5.5 hours</Text>
          </View>
        </View>

        <View style={styles.trackingInfo}>
          <Text style={styles.trackingText}>
            Based on your last trip, you adjusted in 4 days. <Text style={styles.trackingBold}>On track!</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Bottom Navigation
function BottomNav({ currentScreen, setScreen }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setScreen('home')}
      >
        <Text style={[styles.navLabel, currentScreen === 'home' && styles.navLabelActive]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setScreen('cycle')}
      >
        <Text style={[styles.navLabel, currentScreen === 'cycle' && styles.navLabelActive]}>
          Cycle
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setScreen('jetlag')}
      >
        <Text style={[styles.navLabel, currentScreen === 'jetlag' && styles.navLabelActive]}>
          Jet Lag
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },

  // Tamagotchi
  tamagotchiCard: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  tamagotchiEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  tamagotchiText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  tamagotchiHint: {
    fontSize: 14,
    color: '#666',
  },

  // Intervention Card
  interventionCard: {
    backgroundColor: '#000',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  interventionEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  interventionContent: {
    flex: 1,
  },
  interventionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  interventionSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stars: {
    fontSize: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },

  // Calendar
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    width: 40,
    textAlign: 'center',
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  calendarDayCurrent: {
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#000',
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },

  // Phase Card
  phaseCard: {
    backgroundColor: '#000',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  phaseSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
  },
  phaseTip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
  },
  phaseTipText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  phaseTipBold: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },

  // Cycle Sleep Graph
  cycleGraphContainer: {
    flexDirection: 'row',
    height: 140,
    marginTop: 16,
    marginBottom: 16,
  },
  cycleGraphYAxis: {
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingVertical: 4,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666',
  },
  cycleGraphArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingTop: 8,
  },
  cycleGraphBarContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 1,
  },
  cycleGraphBar: {
    backgroundColor: '#000',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  cyclePhaseLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 8,
  },
  phaseLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },

  // Prediction Chart
  predictionScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 8,
  },
  chartBar: {
    flex: 1,
    backgroundColor: '#000',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Travel Card
  travelCard: {
    backgroundColor: '#000',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
  },
  travelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  travelRoute: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  timezoneBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timezoneBadgeText: {
    fontSize: 14,
    color: '#fff',
  },
  travelSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
  },

  // Protocol
  protocolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  protocolItemActive: {
    backgroundColor: '#e0e0e0',
    borderColor: '#999',
  },
  protocolCheck: {
    fontSize: 20,
    marginRight: 12,
  },
  protocolContent: {
    flex: 1,
  },
  protocolTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  protocolSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  trackingInfo: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  trackingText: {
    fontSize: 14,
    color: '#000',
  },
  trackingBold: {
    fontWeight: '600',
  },

  // Circadian Rhythm Graph
  circadianGraph: {
    marginTop: 8,
  },
  circadianLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  circadianLabel: {
    fontSize: 10,
    color: '#666',
  },
  circadianGraphArea: {
    height: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    position: 'relative',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  circadianLocal: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 1,
  },
  circadianYours: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 100,
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  circadianMarker: {
    position: 'absolute',
    top: 45,
    right: 60,
    alignItems: 'center',
  },
  circadianMarkerText: {
    fontSize: 10,
    color: '#000',
    fontWeight: '600',
    marginBottom: 4,
  },
  circadianMarkerDot: {
    width: 12,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  circadianLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendLineLocal: {
    width: 24,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#999',
  },
  legendLineYours: {
    width: 24,
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 20,
    paddingTop: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#000',
    fontWeight: '600',
  },
});
