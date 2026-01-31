import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AppRoute } from '@/constants/navigation';

// Цвета в темно-синей и фиолетовой палитре
const DARK_PURPLE = '#2D1B69';
const PURPLE = '#4A2FBD';
const BLUE = '#1E40AF';
const LIGHT_BLUE = '#3B82F6';
const DARK_BLUE = '#1E3A8A';
const LIGHT_PURPLE = '#7C3AED';

export default function HomeScreen() {
    const router = useRouter();

    const stats = [
        { label: 'Активных шаныраков', value: '12', icon: 'trophy' },
        { label: 'Мероприятий на этой неделе', value: '8', icon: 'calendar' },
        { label: 'Выполнено целей', value: '47', icon: 'check-circle' },
        { label: 'Учеников онлайн', value: '156', icon: 'users' },
    ];

    const quickActions: Array<{
        title: string;
        description: string;
        route: AppRoute;
        icon: string;
        color: string;
    }> = [
        {
            title: '🏆 Цифровые Шаныраки',
            description: 'Рейтинг команд и подача отчетов',
            route: '/shanyraks',
            icon: 'trophy',
            color: '#EC4899'
        },
        {
            title: '📅 Мероприятия',
            description: 'Расписание и подача заявок',
            route: '/events',
            icon: 'calendar',
            color: '#10B981'
        },
        {
            title: '🎯 Цели',
            description: 'Личные цели и задачи',
            route: '/goals',
            icon: 'target',
            color: '#F59E0B'
        },
        {
            title: '🏫 Проекты и Олимпиады',
            description: 'Команды и конкурсы',
            route: '/projects',
            icon: 'lightbulb',
            color: '#3B82F6'
        },


    ];

    const recentActivities = [
        { title: 'Шанырак "Алтын Орда" получил +50 баллов', time: '2 часа назад' },
        { title: 'Новое мероприятие: "Научная ярмарка"', time: '5 часов назад' },
        { title: 'Обновлен рейтинг шаныраков', time: 'Вчера' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Верхняя панель с профилем */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Добро пожаловать,</Text>
                    <Text style={styles.userName}>Айсултан!</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => router.push('/profile')}
                >
                    <LinearGradient
                        colors={[PURPLE, LIGHT_PURPLE]}
                        style={styles.profileGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <MaterialIcons name="person" size={24} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Статистика */}
                <View style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>Общая статистика</Text>
                    <View style={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <LinearGradient
                                key={index}
                                colors={[DARK_BLUE, BLUE]}
                                style={styles.statCard}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.statIconContainer}>
                                    <FontAwesome5 name={stat.icon} size={20} color="white" />
                                </View>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </LinearGradient>
                        ))}
                    </View>
                </View>

                {/* Основные разделы */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Основные разделы</Text>
                    <View style={styles.actionsGrid}>
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.actionCard}
                                onPress={() => router.push(action.route)}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[DARK_PURPLE, PURPLE]}
                                    style={[styles.actionGradient, { borderColor: action.color }]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <View style={styles.actionIconContainer}>
                                        <FontAwesome5 name={action.icon} size={24} color="white" />
                                    </View>
                                    <Text style={styles.actionTitle}>{action.title}</Text>
                                    <Text style={styles.actionDescription}>{action.description}</Text>
                                    <View style={styles.actionArrow}>
                                        <MaterialIcons name="arrow-forward" size={20} color="white" />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Последние активности */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Последние активности</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>Все →</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.activitiesContainer}>
                        {recentActivities.map((activity, index) => (
                            <View key={index} style={styles.activityItem}>
                                <View style={styles.activityDot} />
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityTitle}>{activity.title}</Text>
                                    <Text style={styles.activityTime}>{activity.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Призыв к действию */}
                <LinearGradient
                    colors={[PURPLE, LIGHT_PURPLE]}
                    style={styles.ctaCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.ctaContent}>
                        <FontAwesome5 name="rocket" size={32} color="white" />
                        <View style={styles.ctaTextContainer}>
                            <Text style={styles.ctaTitle}>Начни свой путь к успеху!</Text>
                            <Text style={styles.ctaDescription}>
                                Присоединяйся к мероприятиям, ставь цели и веди свой шанырак к победе
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.ctaButton}>
                            <Text style={styles.ctaButtonText}>Начать сейчас</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Футер */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Школьная цифровая платформа v1.0</Text>
                    <Text style={styles.footerSubtext}>Объединяем школу в цифровом пространстве</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    greeting: {
        fontSize: 14,
        color: '#94A3B8',
        fontFamily: 'Inter_400Regular',
    },
    userName: {
        fontSize: 24,
        color: 'white',
        fontFamily: 'Inter_700Bold',
        marginTop: 2,
    },
    profileButton: {
        width: 48,
        height: 48,
    },
    profileGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: PURPLE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    statsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Inter_700Bold',
        marginBottom: 16,
    },
    viewAllText: {
        color: LIGHT_BLUE,
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        width: '48%',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        color: 'white',
        fontFamily: 'Inter_800ExtraBold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#E2E8F0',
        fontFamily: 'Inter_400Regular',
        lineHeight: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    actionCard: {
        width: '100%',
        marginBottom: 12,
    },
    actionGradient: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 4,
        position: 'relative',
        shadowColor: PURPLE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    actionTitle: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Inter_700Bold',
        marginBottom: 8,
    },
    actionDescription: {
        fontSize: 14,
        color: '#E2E8F0',
        fontFamily: 'Inter_400Regular',
        lineHeight: 20,
        marginBottom: 16,
    },
    actionArrow: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activitiesContainer: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    activityDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: LIGHT_BLUE,
        marginTop: 6,
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Inter_500Medium',
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 12,
        color: '#94A3B8',
        fontFamily: 'Inter_400Regular',
    },
    ctaCard: {
        marginHorizontal: 20,
        marginBottom: 24,
        borderRadius: 24,
        padding: 24,
        shadowColor: LIGHT_PURPLE,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    ctaContent: {
        alignItems: 'center',
    },
    ctaTextContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    ctaTitle: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Inter_700Bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    ctaDescription: {
        fontSize: 14,
        color: '#E2E8F0',
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 20,
    },
    ctaButton: {
        backgroundColor: 'white',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 8,
    },
    ctaButtonText: {
        fontSize: 16,
        color: PURPLE,
        fontFamily: 'Inter_600SemiBold',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
        borderTopWidth: 1,
        borderTopColor: '#334155',
        marginTop: 8,
    },
    footerText: {
        fontSize: 14,
        color: '#94A3B8',
        fontFamily: 'Inter_500Medium',
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 12,
        color: '#64748B',
        fontFamily: 'Inter_400Regular',
    },
});