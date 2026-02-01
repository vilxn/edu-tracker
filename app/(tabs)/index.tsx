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
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';

const { width: screenWidth } = Dimensions.get('window');

// Градиенты для разных элементов
const GRADIENTS = {
    primary: [Colors.light.primary, Colors.light.secondary] as const,
    blue: [Colors.light.info, '#60A5FA'] as const,
    green: [Colors.light.success, '#34D399']  as const,
    orange: [Colors.light.warning, '#FBBF24']  as const
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
    const openModal = (setVisible: React.Dispatch<React.SetStateAction<boolean>>, fadeAnim: Animated.Value, slideAnim: Animated.Value) => {
        setVisible(true);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    const closeModal = (setVisible: React.Dispatch<React.SetStateAction<boolean>>, fadeAnim: Animated.Value, slideAnim: Animated.Value) => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => setVisible(false));
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
            route: '/(tabs)/shanyraks',
            icon: 'trophy',
            gradient: GRADIENTS.primary
        },
        {
            title: '📅 Event Management',
            description: 'Расписание и бронирование локаций',
            route: '/(tabs)/events',
            icon: 'calendar-alt',
            gradient: GRADIENTS.blue
        },
        {
            title: '🎯 Проекты и Олимпиады',
            description: 'Команды и конкурсы',
            route: '/(tabs)/projects',
            icon: 'lightbulb',
            gradient: GRADIENTS.green
        },
        {
            title: '📊 Личный прогресс',
            description: 'Цели и достижения',
            route: '/(tabs)/goals',
            icon: 'chart-line',
            gradient: GRADIENTS.orange
        }
    ];

    const recentActivities = [
        { title: 'Шанырак "Алтын Орда" получил +50 баллов за научный проект', time: '2 часа назад', icon: 'trophy' },
        { title: 'Опубликовано новое положение о "Научной ярмарке"', time: '5 часов назад', icon: 'bullhorn' },
        { title: 'Обновлен рейтинг шаныраков за неделю', time: 'Вчера', icon: 'chart-bar' },
        { title: 'Забронирован актовый зал на мероприятие "День науки"', time: '2 дня назад', icon: 'calendar-check' },
    ];

    // Рендер модального окна с правильными анимациями
    const renderModal = (
        visible: boolean,
        fadeAnim: Animated.Value,
        slideAnim: Animated.Value,
        title: string,
        onClose: () => void,
        content: React.ReactNode
    ) => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color={Colors.light.neutral[600]} />
                        </TouchableOpacity>
                    </View>
                    {content}
                </Animated.View>
            </Animated.View>
        </Modal>
    );

    // Контент для модальных окон
    const profileContent = (
        <ScrollView style={styles.modalBody}>
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
                        closeModal(setProfileVisible, profileFadeAnim, profileSlideAnim);
                        setTimeout(() => openModal(setPersonalDataVisible, personalFadeAnim, personalSlideAnim), 100);
                    }}
                >
                    <Feather name="user" size={22} color={Colors.light.primary} />
                    <Text style={styles.menuText}>Личные данные</Text>
                    <MaterialIcons name="chevron-right" size={24} color={Colors.light.neutral[400]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                        closeModal(setProfileVisible, profileFadeAnim, profileSlideAnim);
                        setTimeout(() => openModal(setSettingsVisible, settingsFadeAnim, settingsSlideAnim), 100);
                    }}
                >
                    <Feather name="settings" size={22} color={Colors.light.primary} />
                    <Text style={styles.menuText}>Настройки</Text>
                    <MaterialIcons name="chevron-right" size={24} color={Colors.light.neutral[400]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                        closeModal(setProfileVisible, profileFadeAnim, profileSlideAnim);
                        setTimeout(() => openModal(setHelpVisible, helpFadeAnim, helpSlideAnim), 100);
                    }}
                >
                    <Feather name="help-circle" size={22} color={Colors.light.primary} />
                    <Text style={styles.menuText}>Помощь</Text>
                    <MaterialIcons name="chevron-right" size={24} color={Colors.light.neutral[400]} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Feather name="log-out" size={22} color={Colors.light.error} />
                    <Text style={[styles.menuText, { color: Colors.light.error }]}>Выйти</Text>
                    <MaterialIcons name="chevron-right" size={24} color={Colors.light.neutral[400]} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const personalContent = (
        <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Имя и фамилия</Text>
                <TextInput
                    style={styles.input}
                    defaultValue="Айсултан Ахметов"
                    placeholder="Введите имя и фамилию"
                    placeholderTextColor={Colors.light.neutral[400]}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Электронная почта</Text>
                <TextInput
                    style={styles.input}
                    defaultValue="aisultan@school.kz"
                    placeholder="Введите email"
                    placeholderTextColor={Colors.light.neutral[400]}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Класс</Text>
                <TextInput
                    style={styles.input}
                    defaultValue="11A"
                    placeholder="Введите класс"
                    placeholderTextColor={Colors.light.neutral[400]}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Телефон</Text>
                <TextInput
                    style={styles.input}
                    defaultValue="+7 777 123 45 67"
                    placeholder="Введите телефон"
                    placeholderTextColor={Colors.light.neutral[400]}
                    keyboardType="phone-pad"
                />
            </View>

            <TouchableOpacity style={[styles.primaryButton, styles.saveButton]}>
                <Text style={styles.primaryButtonText}>Сохранить изменения</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const settingsContent = (
        <ScrollView style={styles.modalBody}>
            <View style={styles.settingItem}>
                <View>
                    <Text style={styles.settingTitle}>Уведомления</Text>
                    <Text style={styles.settingDescription}>Получать уведомления о новых мероприятиях</Text>
                </View>
                <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: Colors.light.neutral[200], true: Colors.light.primary }}
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
                    trackColor={{ false: Colors.light.neutral[200], true: Colors.light.primary }}
                />
            </View>

            <View style={styles.settingItem}>
                <View>
                    <Text style={styles.settingTitle}>Язык</Text>
                    <Text style={styles.settingDescription}>Язык интерфейса приложения</Text>
                </View>
                <TouchableOpacity style={styles.languageButton}>
                    <Text style={styles.languageText}>{language}</Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color={Colors.light.neutral[500]} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.primaryButton, styles.saveButton]}>
                <Text style={styles.primaryButtonText}>Применить настройки</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const helpContent = (
        <ScrollView style={styles.modalBody}>
            <View style={styles.helpSection}>
                <Text style={styles.helpTitle}>Часто задаваемые вопросы</Text>
                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Как подать отчет о мероприятии?</Text>
                    <Text style={styles.faqAnswer}>Перейдите в раздел Цифровые Шаныраки и нажмите Подать отчет</Text>
                </View>
                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Как забронировать локацию?</Text>
                    <Text style={styles.faqAnswer}>В разделе Event Management выберите дату и свободную локацию</Text>
                </View>
                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Как вступить в команду проекта?</Text>
                    <Text style={styles.faqAnswer}>В разделе Проекты и Олимпиады выберите интересующий проект и подайте заявку</Text>
                </View>
            </View>

            <View style={styles.helpSection}>
                <Text style={styles.helpTitle}>Техническая поддержка</Text>
                <TouchableOpacity style={styles.supportButton}>
                    <Feather name="mail" size={20} color={Colors.light.primary} />
                    <Text style={styles.supportButtonText}>support@school.kz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportButton}>
                    <Feather name="phone" size={20} color={Colors.light.primary} />
                    <Text style={styles.supportButtonText}>+7 777 000 00 00</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Верхняя панель */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Добро пожаловать!</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => openModal(setProfileVisible, profileFadeAnim, profileSlideAnim)}
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
                <View style={styles.section}>
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
                                <MaterialIcons name="chevron-right" size={24} color={Colors.light.neutral[500]} />
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
                                <View style={[styles.activityIcon, { backgroundColor: Colors.light.primary + '20' }]}>
                                    <FontAwesome5 name={activity.icon} size={16} color={Colors.light.primary} />
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
            {renderModal(
                profileVisible,
                profileFadeAnim,
                profileSlideAnim,
                'Профиль',
                () => closeModal(setProfileVisible, profileFadeAnim, profileSlideAnim),
                profileContent
            )}

            {renderModal(
                personalDataVisible,
                personalFadeAnim,
                personalSlideAnim,
                'Личные данные',
                () => closeModal(setPersonalDataVisible, personalFadeAnim, personalSlideAnim),
                personalContent
            )}

            {renderModal(
                settingsVisible,
                settingsFadeAnim,
                settingsSlideAnim,
                'Настройки',
                () => closeModal(setSettingsVisible, settingsFadeAnim, settingsSlideAnim),
                settingsContent
            )}

            {renderModal(
                helpVisible,
                helpFadeAnim,
                helpSlideAnim,
                'Помощь',
                () => closeModal(setHelpVisible, helpFadeAnim, helpSlideAnim),
                helpContent
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.lg,
        backgroundColor: Colors.light.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.neutral[200],
    },
    greeting: {
        fontSize: Typography.headline.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.headline.fontWeight,
        marginBottom: Spacing.xs,
    },
    userRole: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.primary,
        fontWeight: Typography.subtitle.fontWeight,
        backgroundColor: Colors.light.primary + '15',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
    },
    profileButton: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.full,
        ...Shadows.lg,
        shadowColor: Colors.light.primary,
    },
    profileGradient: {
        width: '100%',
        height: '100%',
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: Typography.title.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.title.fontWeight,
        marginBottom: Spacing.md,
    },
    statsScrollView: {
        paddingVertical: Spacing.xs,
    },
    statCard: {
        width: 160,
        height: 180,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginRight: Spacing.sm,
        justifyContent: 'space-between',
        ...Shadows.md,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    statValue: {
        fontSize: Typography.headline.fontSize,
        color: '#FFFFFF',
        fontWeight: '800',
        marginBottom: Spacing.xs,
    },
    statLabel: {
        fontSize: Typography.small.fontSize,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
        lineHeight: Typography.small.lineHeight,
    },
    actionsGrid: {
        gap: Spacing.sm,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        ...Shadows.sm,
    },
    actionGradient: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.subtitle.fontWeight,
        marginBottom: Spacing.xs,
    },
    actionDescription: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[500],
        lineHeight: Typography.caption.lineHeight,
    },
    viewAllText: {
        color: Colors.light.primary,
        fontWeight: Typography.subtitle.fontWeight,
        fontSize: Typography.caption.fontSize,
    },
    activitiesContainer: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        ...Shadows.sm,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    activityIcon: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
        marginTop: 2,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.subtitle.fontWeight,
        marginBottom: Spacing.xs,
        lineHeight: Typography.body.lineHeight,
    },
    activityTime: {
        fontSize: Typography.small.fontSize,
        color: Colors.light.neutral[400],
    },
    ctaCard: {
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
        borderRadius: BorderRadius.xxl,
        padding: Spacing.xl,
        ...Shadows.xl,
        shadowColor: Colors.light.primary,
    },
    ctaContent: {
        alignItems: 'center',
    },
    ctaTextContainer: {
        alignItems: 'center',
        marginVertical: Spacing.lg,
    },
    ctaTitle: {
        fontSize: 22,
        color: 'white',
        fontWeight: Typography.title.fontWeight,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    ctaDescription: {
        fontSize: Typography.caption.fontSize,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: Typography.body.lineHeight,
    },
    ctaButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.sm,
    },
    ctaButtonText: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.primary,
        fontWeight: Typography.subtitle.fontWeight,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        borderTopWidth: 1,
        borderTopColor: Colors.light.cardBorder,
        marginTop: Spacing.sm,
    },
    footerText: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[500],
        fontWeight: Typography.subtitle.fontWeight,
        marginBottom: Spacing.xs,
    },
    footerSubtext: {
        fontSize: Typography.small.fontSize,
        color: Colors.light.neutral[400],
    },
    // Модальные окна
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.light.cardBackground,
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        maxHeight: '85%',
        ...Shadows.xl,
        shadowOffset: { width: 0, height: -4 },
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.cardBorder,
    },
    modalTitle: {
        fontSize: Typography.title.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.title.fontWeight,
    },
    closeButton: {
        padding: Spacing.xs,
    },
    modalBody: {
        padding: Spacing.lg,
    },
    // Профиль
    profileInfo: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
        ...Shadows.lg,
        shadowColor: Colors.light.primary,
    },
    profileName: {
        fontSize: Typography.title.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.title.fontWeight,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    profileEmail: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[500],
        marginBottom: Spacing.lg,
    },
    profileStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: Spacing.lg,
    },
    profileStat: {
        alignItems: 'center',
    },
    profileStatValue: {
        fontSize: Typography.headline.fontSize,
        color: Colors.light.primary,
        fontWeight: '800',
        marginBottom: Spacing.xs,
    },
    profileStatLabel: {
        fontSize: Typography.small.fontSize,
        color: Colors.light.neutral[500],
    },
    profileMenu: {
        gap: Spacing.xs,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.md,
    },
    menuText: {
        flex: 1,
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[700],
        fontWeight: Typography.subtitle.fontWeight,
        marginLeft: Spacing.md,
    },
    // Формы
    formGroup: {
        marginBottom: Spacing.lg,
    },
    formLabel: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[700],
        fontWeight: Typography.subtitle.fontWeight,
        marginBottom: Spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[900],
        backgroundColor: Colors.light.neutral[100],
    },
    // Настройки
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.cardBorder,
    },
    settingTitle: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.subtitle.fontWeight,
        marginBottom: Spacing.xs,
    },
    settingDescription: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[500],
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.neutral[100],
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
    },
    languageText: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.subtitle.fontWeight,
        marginRight: Spacing.sm,
    },
    // Помощь
    helpSection: {
        marginBottom: Spacing.xl,
    },
    helpTitle: {
        fontSize: Typography.subtitle.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.title.fontWeight,
        marginBottom: Spacing.md,
    },
    faqItem: {
        marginBottom: Spacing.lg,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.cardBorder,
    },
    faqQuestion: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.subtitle.fontWeight,
        marginBottom: Spacing.sm,
    },
    faqAnswer: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[500],
        lineHeight: Typography.body.lineHeight,
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.cardBorder,
    },
    supportButtonText: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.subtitle.fontWeight,
        marginLeft: Spacing.sm,
    },
    // Кнопки
    primaryButton: {
        backgroundColor: Colors.light.primary,
        padding: Spacing.lg,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    primaryButtonText: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.background,
        fontWeight: Typography.subtitle.fontWeight,
    },
    saveButton: {
        marginTop: Spacing.lg,
    },
});