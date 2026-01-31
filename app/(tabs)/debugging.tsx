// React Native - RegisterScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Ошибка', 'Email и пароль обязательны');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Ошибка', 'Пароль должен быть не менее 6 символов');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                email,
                password,
                name
            });

            Alert.alert('Успех', 'Регистрация прошла успешно!');

            // Сохраняем токен
            const { token, user } = response.data;
            console.log('Токен:', token);
            console.log('Пользователь:', user);

            // Можно сохранить токен в AsyncStorage
            // await AsyncStorage.setItem('token', token);

        } catch (error: any) {
            console.error('Ошибка регистрации:', error);

            if (error.response?.data?.error) {
                Alert.alert('Ошибка', error.response.data.error);
            } else {
                Alert.alert('Ошибка', 'Не удалось зарегистрироваться');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>

            <TextInput
                style={styles.input}
                placeholder="Имя (необязательно)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Пароль (минимум 6 символов)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                title={loading ? "Регистрация..." : "Зарегистрироваться"}
                onPress={handleRegister}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center'
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15
    }
});