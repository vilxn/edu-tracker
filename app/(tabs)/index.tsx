import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Добро пожаловать в Школьную Платформу!</Text>

            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push('/shanyraks')}
            >
                <Text style={styles.cardTitle}>🏆 Цифровые Шаныраки</Text>
                <Text style={styles.cardDesc}>Смотрите рейтинг и подавайте отчеты.</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push('/events')}
            >
                <Text style={styles.cardTitle}>📅 Мероприятия</Text>
                <Text style={styles.cardDesc}>Проверяйте расписание и подавайте заявки.</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push('/projects')}
            >
                <Text style={styles.cardTitle}>🏫 Проекты и Олимпиады</Text>
                <Text style={styles.cardDesc}>Найдите команду и участвуйте в конкурсах.</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    cardDesc: {
        fontSize: 14,
        color: 'white',
    },
});
