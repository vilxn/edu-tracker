import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';
import { AppRoute } from '@/constants/navigation';

// Светлая цветовая палитра
const LIGHT_PURPLE = '#7C3AED';
const PURPLE = '#8B5CF6';
const BLUE = '#3B82F6';
const LIGHT_BLUE = '#60A5FA';
const DARK_BLUE = '#1E40AF';
const ACCENT_PURPLE = '#A78BFA';

export default function HomeScreen() {
    const router = useRouter();
    const [profileVisible, setProfileVisible] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const openProfile = () => {
        setProfileVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeProfile = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setProfileVisible(false));
    };

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
            color: BLUE
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
                    onPress={openProfile}
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
                            <View key={index} style={styles.statCard}>
                                <View style={[styles.statIconContainer, { backgroundColor: `${PURPLE}20` }]}>
                                    <FontAwesome5 name={stat.icon} size={20} color={PURPLE} />
                                </View>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
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
                                style={[styles.actionCard, { borderLeftColor: action.color }]}
                                onPress={() => router.push(action.route)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.actionContent}>
                                    <View style={[styles.actionIconContainer, { backgroundColor: `${action.color}20` }]}>
                                        <FontAwesome5 name={action.icon} size={24} color={action.color} />
                                    </View>
                                    <Text style={styles.actionTitle}>{action.title}</Text>
                                    <Text style={styles.actionDescription}>{action.description}</Text>
                                    <View style={styles.actionArrow}>
                                        <MaterialIcons name="arrow-forward" size={20} color={action.color} />
                                    </View>
                                </View>
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

            {/* Модальное окно профиля */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={profileVisible}
                onRequestClose={closeProfile}
            >
                <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Профиль</Text>
                            <TouchableOpacity onPress={closeProfile} style={styles.closeButton}>
                                <AntDesign name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileInfo}>
                            <LinearGradient
                                colors={[PURPLE, LIGHT_PURPLE]}
                                style={styles.profileImage}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <MaterialIcons name="person" size={40} color="white" />
                            </LinearGradient>
                            <Text style={styles.profileName}>Айсултан Ахметов</Text>
                            <Text style={styles.profileEmail}>aisultan@school.kz</Text>
                        </View>

                        <View style={styles.profileStats}>
                            <View style={styles.profileStat}>
                                <Text style={styles.profileStatValue}>8</Text>
                                <Text style={styles.profileStatLabel}>Шаныраков</Text>
                            </View>
                            <View style={styles.profileStat}>
                                <Text style={styles.profileStatValue}>24</Text>
                                <Text style={styles.profileStatLabel}>Мероприятий</Text>
                            </View>
                            <View style={styles.profileStat}>
                                <Text style={styles.profileStatValue}>156</Text>
                                <Text style={styles.profileStatLabel}>Баллов</Text>
                            </View>
                        </View>

                        <View style={styles.profileMenu}>
                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialIcons name="person-outline" size={24} color="#666" />
                                <Text style={styles.menuText}>Личные данные</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialIcons name="settings" size={24} color="#666" />
                                <Text style={styles.menuText}>Настройки</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialIcons name="help-outline" size={24} color="#666" />
                                <Text style={styles.menuText}>Помощь</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialIcons name="logout" size={24} color="#EF4444" />
                                <Text style={[styles.menuText, { color: '#EF4444' }]}>Выйти</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    greeting: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Inter_400Regular',
    },
    userName: {
        fontSize: 24,
        color: '#1F2937',
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
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
        color: '#1F2937',
        fontFamily: 'Inter_700Bold',
        marginBottom: 16,
    },
    viewAllText: {
        color: BLUE,
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
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        color: '#1F2937',
        fontFamily: 'Inter_800ExtraBold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
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
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    actionContent: {
        padding: 20,
        position: 'relative',
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    actionTitle: {
        fontSize: 18,
        color: '#1F2937',
        fontFamily: 'Inter_700Bold',
        marginBottom: 8,
    },
    actionDescription: {
        fontSize: 14,
        color: '#6B7280',
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
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activitiesContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: BLUE,
        marginTop: 8,
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        color: '#1F2937',
        fontFamily: 'Inter_500Medium',
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 12,
        color: '#9CA3AF',
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
        color: '#E5E7EB',
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
        borderTopColor: '#E5E7EB',
        marginTop: 8,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter_500Medium',
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Inter_400Regular',
    },
    // Стили для модального окна профиля
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 20,
        color: '#1F2937',
        fontFamily: 'Inter_700Bold',
    },
    closeButton: {
        padding: 4,
    },
    profileInfo: {
        alignItems: 'center',
        padding: 32,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: PURPLE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    profileName: {
        fontSize: 24,
        color: '#1F2937',
        fontFamily: 'Inter_700Bold',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter_400Regular',
    },
    profileStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    profileStat: {
        alignItems: 'center',
    },
    profileStatValue: {
        fontSize: 20,
        color: PURPLE,
        fontFamily: 'Inter_800ExtraBold',
        marginBottom: 4,
    },
    profileStatLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: 'Inter_400Regular',
    },
    profileMenu: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
        fontFamily: 'Inter_500Medium',
        marginLeft: 16,
    },
});