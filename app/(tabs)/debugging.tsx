// debugging.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    TextInput,
    Alert,
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';
import axios from 'axios';

const ECHO_API_URL = "http://localhost:3000/echo"

export default function DebuggingScreen() {
    const [message, setMessage] = useState('Hello from React Native');
    const [response, setResponse] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const sendEcho = async () => {
        if (!message.trim()) {
            Alert.alert('Ошибка', 'Введите сообщение');
            return;
        }

        setLoading(true);
        setResponse('');

        try {
            console.log('📤 Отправка echo запроса на:', ECHO_API_URL);
            console.log('Сообщение:', message);

            const result = await axios.post(ECHO_API_URL, {
                message: message,
                timestamp: new Date().toISOString(),
                platform: Platform.OS,
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('✅ Ответ сервера:', result.data);

            setResponse(JSON.stringify(result.data, null, 2));

            Alert.alert(
                'Успех!',
                `Сервер ответил: "${result.data.echo || result.data.message}"`
            );

        } catch (error: any) {
            console.error('❌ Ошибка:', error);

            let errorMsg = 'Неизвестная ошибка';

            if (error.response) {
                errorMsg = `Сервер вернул ошибку ${error.response.status}: ${JSON.stringify(error.response.data)}`;
            } else if (error.request) {
                errorMsg = 'Нет ответа от сервера. Проверьте:\n• Сервер запущен?\n• Правильный URL?';
            } else {
                errorMsg = error.message;
            }

            setResponse(`ОШИБКА:\n${errorMsg}`);
            Alert.alert('Ошибка соединения', errorMsg);

        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Echo Endpoint Debugger</Text>

            <Text style={styles.label}>URL:</Text>
            <Text style={styles.url}>{ECHO_API_URL}</Text>

            <Text style={styles.label}>Введите сообщение:</Text>
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Введите текст для эхо..."
                multiline
            />

            <View style={styles.buttonContainer}>
                <Button
                    title={loading ? "Отправка..." : "Отправить Echo"}
                    onPress={sendEcho}
                    disabled={loading}
                />
            </View>

            {response ? (
                <View style={styles.responseContainer}>
                    <Text style={styles.responseTitle}>Ответ сервера:</Text>
                    <Text style={styles.responseText}>{response}</Text>
                </View>
            ) : (
                <Text style={styles.placeholder}>
                    {loading ? 'Ожидание ответа...' : 'Ответ появится здесь'}
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 5,
        color: '#555',
    },
    url: {
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        backgroundColor: 'white',
    },
    buttonContainer: {
        marginVertical: 20,
    },
    responseContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 5,
        padding: 15,
        backgroundColor: '#E8F5E9',
    },
    responseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2E7D32',
    },
    responseText: {
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
        color: '#333',
    },
    placeholder: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
        fontStyle: 'italic',
    },
});