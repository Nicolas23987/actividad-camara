import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Permiso de cámara denegado');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permiso de ubicación denegado');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation(loc);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Button title="Tomar Foto" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={{ marginTop: 30 }}>
        <Button title="Obtener Ubicación" onPress={getLocation} />
      </View>
      {location && (
        <View style={styles.infoBox}>
          <Text style={styles.text}>Latitud: {location.coords.latitude}</Text>
          <Text style={styles.text}>Longitud: {location.coords.longitude}</Text>
          <Text style={styles.text}>Precisión: {location.coords.accuracy} m</Text>
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  image: { width: 300, height: 300, marginTop: 20, borderRadius: 10 },
  infoBox: { marginTop: 20, alignItems: 'center', backgroundColor: '#e8e8e8', padding: 15, borderRadius: 10 },
  text: { fontSize: 16, marginVertical: 4 },
  error: { color: 'red', marginTop: 20, fontSize: 16 },
});
