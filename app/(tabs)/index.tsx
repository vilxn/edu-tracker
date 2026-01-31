import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Modal,
    Animated,
    TextInput,
    Switch,
    Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { AppRoute } from '@/constants/navigation';

const { width: screenWidth } = Dimensions.get('window');

// Цветовая палитра
const PRIMARY_PURPLE = '#7C3AED';
const SECONDARY_PURPLE = '#8B5CF6';
const ACCENT_BLUE = '#3B82F6';
const LIGHT_BLUE = '#60A5FA';
const SUCCESS_GREEN = '#10B981';
const WARNING_ORANGE = '#F59E0B';
const ERROR_RED = '#EF4444';
const NEUTRAL_GRAY = '#6B7280';
const LIGHT_GRAY = '#F9FAFB';

// Градиенты для разных элементов
const GRADIENTS = {
    primary: [PRIMARY_PURPLE, SECONDARY_PURPLE],
    blue: [ACCENT_BLUE, LIGHT_BLUE],
    green: [SUCCESS_GREEN, '#34D399'],
    orange: [WARNING_ORANGE, '#FBBF24']
};

export default function HomeScreen() {
    const router = useRouter();

    // Состояния для модальных окон
    const [profileVisible, setProfileVisible] = useState(false);
    const [personalDataVisible, setPersonalDataVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [helpVisible, setHelpVisible] = useState(false);

    // Отдельные анимационные значения для каждого модального окна
    const profileFadeAnim = useRef(new Animated.Value(0)).current;
    const profileSlideAnim = useRef(new Animated.Value(50)).current;

    const personalFadeAnim = useRef(new Animated.Value(0)).current;
    const personalSlideAnim = useRef(new Animated.Value(50)).current;

    const settingsFadeAnim = useRef(new Animated.Value(0)).current;
    const settingsSlideAnim = useRef(new Animated.Value(50)).current;

    const helpFadeAnim = useRef(new Animated.Value(0)).current;
    const helpSlideAnim = useRef(new Animated.Value(50)).current;

    // Состояния для настроек
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('Русский');

    // Функции для открытия модальных окон с анимацией
    const openProfileModal = () => {
        setProfileVisible(true);
        Animated.parallel([
            Animated.timing(profileFadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(profileSlideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    const closeProfileModal = () => {
        Animated.parallel([
            Animated.timing(profileFadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(profileSlideAnim, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => setProfileVisible(false));
    };

    const openPersonalModal = () => {
        setPersonalDataVisible(true);
        Animated.parallel([
            Animated.timing(personalFadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(personalSlideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    const closePersonalModal = () => {
        Animated.parallel([
            Animated.timing(personalFadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(personalSlideAnim, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => setPersonalDataVisible(false));
    };

    const openSettingsModal = () => {
        setSettingsVisible(true);
        Animated.parallel([
            Animated.timing(settingsFadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(settingsSlideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    const closeSettingsModal = () => {
        Animated.parallel([
            Animated.timing(settingsFadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(settingsSlideAnim, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => setSettingsVisible(false));
    };

    const openHelpModal = () => {
        setHelpVisible(true);
        Animated.parallel([
            Animated.timing(helpFadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(helpSlideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    const closeHelpModal = () => {
        Animated.parallel([
            Animated.timing(helpFadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(helpSlideAnim, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => setHelpVisible(false));
    };

    // Данные для статистики
    const stats = [
        { label: 'Активных шаныраков', value: '12', icon: 'trophy', gradient: GRADIENTS.primary },
        { label: 'Мероприятий на неделе', value: '8', icon: 'calendar', gradient: GRADIENTS.blue },
        { label: 'Выполнено целей', value: '47', icon: 'check-circle', gradient: GRADIENTS.green },
        { label: 'Учеников онлайн', value: '156', icon: 'users', gradient: GRADIENTS.orange },
    ];

    const quickActions = [
        {
            title: '🏆 Цифровые Шаныраки',
            description: 'Рейтинг команд и подача отчетов',
            route: '/shanyraks',
            icon: 'trophy',
            gradient: GRADIENTS.primary
        },
        {
            title: '📅 Event Management',
            description: 'Расписание и бронирование локаций',
            route: '/events',
            icon: 'calendar-alt',
            gradient: GRADIENTS.blue
        },
        {
            title: '🎯 Проекты и Олимпиады',
            description: 'Команды и конкурсы',
            route: '/projects',
            icon: 'lightbulb',
            gradient: GRADIENTS.green
        },
        {
            title: '📊 Личный прогресс',
            description: 'Цели и достижения',
            route: '/goals',
            icon: 'chart-line',
            gradient: GRADIENTS.orange
        },
    ];

    const recentActivities = [
        { title: 'Шанырак "Алтын Орда" получил +50 баллов за научный проект', time: '2 часа назад', icon: 'trophy' },
        { title: 'Опубликовано новое положение о "Научной ярмарке"', time: '5 часов назад', icon: 'bullhorn' },
        { title: 'Обновлен рейтинг шаныраков за неделю', time: 'Вчера', icon: 'chart-bar' },
        { title: 'Забронирован актовый зал на мероприятие "День науки"', time: '2 дня назад', icon: 'calendar-check' },
    ];

    // Рендер модального окна с правильными анимациями
    const renderProfileModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={profileVisible}
            onRequestClose={closeProfileModal}
        >
            <Animated.View style={[styles.modalOverlay, { opacity: profileFadeAnim }]}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateY: profileSlideAnim }] }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Профиль</Text>
                        <TouchableOpacity onPress={closeProfileModal} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalBody}>
                        <View style={styles.profileInfo}>
                            <LinearGradient
                                colors={GRADIENTS.primary}
                                style={styles.profileImage}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <MaterialIcons name="person" size={40} color="white" />
                            </LinearGradient>
                            <Text style={styles.profileName}>Айсултан Ахметов</Text>
                            <Text style={styles.profileEmail}>aisultan@school.kz</Text>
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
                        </View>

                        <View style={styles.profileMenu}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    closeProfileModal();
                                    setTimeout(() => openPersonalModal(), 100);
                                }}
                            >
                                <Feather name="user" size={22} color={PRIMARY_PURPLE} />
                                <Text style={styles.menuText}>Личные данные</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    closeProfileModal();
                                    setTimeout(() => openSettingsModal(), 100);
                                }}
                            >
                                <Feather name="settings" size={22} color={PRIMARY_PURPLE} />
                                <Text style={styles.menuText}>Настройки</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    closeProfileModal();
                                    setTimeout(() => openHelpModal(), 100);
                                }}
                            >
                                <Feather name="help-circle" size={22} color={PRIMARY_PURPLE} />
                                <Text style={styles.menuText}>Помощь</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <Feather name="log-out" size={22} color={ERROR_RED} />
                                <Text style={[styles.menuText, { color: ERROR_RED }]}>Выйти</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );

    const renderPersonalModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={personalDataVisible}
            onRequestClose={closePersonalModal}
        >
            <Animated.View style={[styles.modalOverlay, { opacity: personalFadeAnim }]}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateY: personalSlideAnim }] }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Личные данные</Text>
                        <TouchableOpacity onPress={closePersonalModal} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalBody}>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Имя и фамилия</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue="Айсултан Ахметов"
                                placeholder="Введите имя и фамилию"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Электронная почта</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue="aisultan@school.kz"
                                placeholder="Введите email"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Класс</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue="11A"
                                placeholder="Введите класс"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Телефон</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue="+7 777 123 45 67"
                                placeholder="Введите телефон"
                                keyboardType="phone-pad"
                            />
                        </View>

                        <TouchableOpacity style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Сохранить изменения</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );

    const renderSettingsModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={settingsVisible}
            onRequestClose={closeSettingsModal}
        >
            <Animated.View style={[styles.modalOverlay, { opacity: settingsFadeAnim }]}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateY: settingsSlideAnim }] }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Настройки</Text>
                        <TouchableOpacity onPress={closeSettingsModal} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalBody}>
                        <View style={styles.settingItem}>
                            <View>
                                <Text style={styles.settingTitle}>Уведомления</Text>
                                <Text style={styles.settingDescription}>Получать уведомления о новых мероприятиях</Text>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: '#E5E7EB', true: PRIMARY_PURPLE }}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View>
                                <Text style={styles.settingTitle}>Темная тема</Text>
                                <Text style={styles.settingDescription}>Использовать темную тему оформления</Text>
                            </View>
                            <Switch
                                value={darkMode}
                                onValueChange={setDarkMode}
                                trackColor={{ false: '#E5E7EB', true: PRIMARY_PURPLE }}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View>
                                <Text style={styles.settingTitle}>Язык</Text>
                                <Text style={styles.settingDescription}>Язык интерфейса приложения</Text>
                            </View>
                            <TouchableOpacity style={styles.languageButton}>
                                <Text style={styles.languageText}>{language}</Text>
                                <MaterialIcons name="arrow-drop-down" size={24} color={NEUTRAL_GRAY} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Применить настройки</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );

    const renderHelpModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={helpVisible}
            onRequestClose={closeHelpModal}
        >
            <Animated.View style={[styles.modalOverlay, { opacity: helpFadeAnim }]}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateY: helpSlideAnim }] }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Помощь</Text>
                        <TouchableOpacity onPress={closeHelpModal} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalBody}>
                        <View style={styles.helpSection}>
                            <Text style={styles.helpTitle}>Часто задаваемые вопросы</Text>
                            <View style={styles.faqItem}>
                                <Text style={styles.faqQuestion}>Как подать отчет о мероприятии?</Text>
                                <Text style={styles.faqAnswer}>Перейдите в раздел "Цифровые Шаныраки" и нажмите "Подать отчет"</Text>
                            </View>
                            <View style={styles.faqItem}>
                                <Text style={styles.faqQuestion}>Как забронировать локацию?</Text>
                                <Text style={styles.faqAnswer}>В разделе "Event Management" выберите дату и свободную локацию</Text>
                            </View>
                            <View style={styles.faqItem}>
                                <Text style={styles.faqQuestion}>Как вступить в команду проекта?</Text>
                                <Text style={styles.faqAnswer}>В разделе "Проекты и Олимпиады" выберите интересующий проект и подайте заявку</Text>
                            </View>
                        </View>

                        <View style={styles.helpSection}>
                            <Text style={styles.helpTitle}>Техническая поддержка</Text>
                            <TouchableOpacity style={styles.supportButton}>
                                <Feather name="mail" size={20} color={PRIMARY_PURPLE} />
                                <Text style={styles.supportButtonText}>support@school.kz</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.supportButton}>
                                <Feather name="phone" size={20} color={PRIMARY_PURPLE} />
                                <Text style={styles.supportButtonText}>+7 777 000 00 00</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Верхняя панель */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Добро пожаловать,</Text>
                    <Text style={styles.userName}>Айсултан! 👋</Text>
                    <Text style={styles.userRole}>Старший префект</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={openProfileModal}
                >
                    <LinearGradient
                        colors={GRADIENTS.primary}
                        style={styles.profileGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <MaterialIcons name="person" size={24} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* Статистика */}
                <View style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>📈 Общая статистика</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScrollView}>
                        {stats.map((stat, index) => (
                            <LinearGradient
                                key={index}
                                colors={stat.gradient}
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
                    </ScrollView>
                </View>

                {/* Основные разделы */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🚀 Основные разделы</Text>
                    <View style={styles.actionsGrid}>
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.actionCard}
                                onPress={() => router.push(action.route)}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={action.gradient}
                                    style={styles.actionGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <FontAwesome5 name={action.icon} size={24} color="white" />
                                </LinearGradient>
                                <View style={styles.actionTextContainer}>
                                    <Text style={styles.actionTitle}>{action.title}</Text>
                                    <Text style={styles.actionDescription}>{action.description}</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color={NEUTRAL_GRAY} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Последние активности */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📝 Последние активности</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>Все →</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.activitiesContainer}>
                        {recentActivities.map((activity, index) => (
                            <View key={index} style={styles.activityItem}>
                                <View style={[styles.activityIcon, { backgroundColor: `${PRIMARY_PURPLE}20` }]}>
                                    <FontAwesome5 name={activity.icon} size={16} color={PRIMARY_PURPLE} />
                                </View>
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
                    colors={GRADIENTS.primary}
                    style={styles.ctaCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.ctaContent}>
                        <FontAwesome5 name="rocket" size={36} color="white" />
                        <View style={styles.ctaTextContainer}>
                            <Text style={styles.ctaTitle}>Начни свой путь к успеху!</Text>
                            <Text style={styles.ctaDescription}>
                                Присоединяйся к мероприятиям, ставь цели и веди свой шанырак к победе
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.ctaButton}
                            onPress={() => router.push('/events')}
                        >
                            <Text style={styles.ctaButtonText}>Начать сейчас →</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Футер */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Школьная цифровая платформа v2.0</Text>
                    <Text style={styles.footerSubtext}>Объединяем школу в цифровом пространстве</Text>
                </View>
            </ScrollView>

            {/* Модальные окна */}
            {renderProfileModal()}
            {renderPersonalModal()}
            {renderSettingsModal()}
            {renderHelpModal()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    greeting: {
        fontSize: 14,
        color: NEUTRAL_GRAY,
        fontFamily: 'Inter-Regular',
        marginBottom: 2,
    },
    userName: {
        fontSize: 28,
        color: '#111827',
        fontFamily: 'Inter-Bold',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: PRIMARY_PURPLE,
        fontFamily: 'Inter-SemiBold',
        backgroundColor: `${PRIMARY_PURPLE}15`,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    profileButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        shadowColor: PRIMARY_PURPLE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    profileGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainer: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    statsScrollView: {
        paddingVertical: 4,
    },
    section: {
        paddingHorizontal: 24,
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
        color: '#111827',
        fontFamily: 'Inter-Bold',
        marginBottom: 16,
    },
    statCard: {
        width: 160,
        height: 140,
        borderRadius: 20,
        padding: 20,
        marginRight: 12,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        color: '#FFFFFF',
        fontFamily: 'Inter-ExtraBold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'Inter-Medium',
        lineHeight: 16,
    },
    actionsGrid: {
        gap: 12,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    actionGradient: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        color: '#111827',
        fontFamily: 'Inter-SemiBold',
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 13,
        color: NEUTRAL_GRAY,
        fontFamily: 'Inter-Regular',
        lineHeight: 18,
    },
    viewAllText: {
        color: PRIMARY_PURPLE,
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
    },
    activitiesContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    activityIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        color: '#111827',
        fontFamily: 'Inter-Medium',
        marginBottom: 4,
        lineHeight: 20,
    },
    activityTime: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Inter-Regular',
    },
    ctaCard: {
        marginHorizontal: 24,
        marginBottom: 24,
        borderRadius: 24,
        padding: 28,
        shadowColor: PRIMARY_PURPLE,
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
        fontSize: 22,
        color: 'white',
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    ctaDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
        lineHeight: 22,
    },
    ctaButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 8,
    },
    ctaButtonText: {
        fontSize: 16,
        color: PRIMARY_PURPLE,
        fontFamily: 'Inter-SemiBold',
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
        color: NEUTRAL_GRAY,
        fontFamily: 'Inter-Medium',
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Inter-Regular',
    },
    // Модальные окна
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 22,
        color: '#111827',
        fontFamily: 'Inter-Bold',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 24,
    },
    // Профиль
    profileInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: PRIMARY_PURPLE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    profileName: {
        fontSize: 22,
        color: '#111827',
        fontFamily: 'Inter-Bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    profileEmail: {
        fontSize: 14,
        color: NEUTRAL_GRAY,
        fontFamily: 'Inter-Regular',
        marginBottom: 20,
    },
    profileStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
    },
    profileStat: {
        alignItems: 'center',
    },
    profileStatValue: {
        fontSize: 24,
        color: PRIMARY_PURPLE,
        fontFamily: 'Inter-ExtraBold',
        marginBottom: 4,
    },
    profileStatLabel: {
        fontSize: 12,
        color: NEUTRAL_GRAY,
        fontFamily: 'Inter-Regular',
    },
    profileMenu: {
        gap: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
        fontFamily: 'Inter-Medium',
        marginLeft: 16,
    },
    // Формы
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 14,
        color: '#374151',
        fontFamily: 'Inter-Medium',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#111827',
        backgroundColor: LIGHT_GRAY,
    },
    // Настройки
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    settingTitle: {
        fontSize: 16,
        color: '#111827',
        fontFamily: 'Inter-Medium',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: NEUTRAL_GRAY,
        fontFamily: 'Inter-Regular',
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: LIGHT_GRAY,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    languageText: {
        fontSize: 14,
        color: '#111827',
        fontFamily: 'Inter-Medium',
        marginRight: 8,
    },
    // Помощь
    helpSection: {
        marginBottom: 32,
    },
    helpTitle: {
        fontSize: 18,
        color: '#111827',
        fontFamily: 'Inter-Bold',
        marginBottom: 16,
    },
    faqItem: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    faqQuestion: {
        fontSize: 16,
        color: '#111827',
        fontFamily: 'Inter-SemiBold',
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 14,
        color: NEUTRAL_GRAY,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    supportButtonText: {
        fontSize: 16,
        color: '#111827',
        fontFamily: 'Inter-Medium',
        marginLeft: 12,
    },
    // Общие кнопки
    saveButton: {
        backgroundColor: PRIMARY_PURPLE,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'Inter-SemiBold',
    },
});