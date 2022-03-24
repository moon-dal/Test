import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
// console.log(SCREEN_WIDTH);

const API_KEY = "a45caa8b24fef0b8a722c68b99e8d18d";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rains",
  Thunderstorm: "lightnings",
  Drizzle: "rain",
  Snow: "snowflake-8",
  Atmosphere: "fog",
};

export default function App() {
  const [ok, setOk] = useState(true);
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude }, { useGoogleMaps: false }
    );
    setCity(location[0].city);


    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>) : (
          days.map((day, index) =>
            <View key={index} style={styles.day}>
              <View style={styles.tempBox}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={70} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyDescription}>{day.weather[0].description}</Text>
            </View>
          )

        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3399FF"
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 70,
    fontWeight: "500",
    color: "white",
  },
  weather: {
    textAlign: "left",
    marginLeft: 20,
  },
  day: {
    width: SCREEN_WIDTH,
  },
  tempBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
  },
  temp: {
    fontSize: 100,
    marginTop: 20,
    color: "white",
  },
  description: {
    fontSize: 45,
    marginTop: -10,
    color: "white",
  },
  tinyDescription: {
    fontSize: 30,
    color: "white",
  },
});