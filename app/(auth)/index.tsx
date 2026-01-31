import { Link, router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SchoolUnity</Text>
            <Text style={styles.subtitle}>
                Единая платформа для школьного сообщества
            </Text>

            <Link href="/(auth)/onboarding" asChild>
                <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.buttonText}>Присоединиться</Text>
                </TouchableOpacity>
            </Link>


            <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Уже есть аккаунт? Войти</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        padding: 10,
    },
    secondaryButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
});