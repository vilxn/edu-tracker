import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal, Animated, Alert } from 'react-native';
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
    const [personalDataVisible, setPersonalDataVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [helpVisible, setHelpVisible] = useState(false);
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

    const handleLogout = () => {
        Alert.alert(
            'Выход из аккаунта',
            'Вы точно хотите выйти?',
            [
                {
                    text: 'Отмена',
                    style: 'cancel',
                    onPress: () => console.log('Отмена выхода')
                },
                {
                    text: 'Выйти',
                    style: 'destructive',
                    onPress: () => {
                        console.log('Выход выполнен');
                        closeProfile();
                        // Здесь добавьте логику выхода из приложения
                        // Например: router.replace('/login');
                    }
                }
            ]
        );
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

    const themeOptions = [
        { name: 'Светлая', value: 'light', color: '#FFFFFF', textColor: '#000000' },
        { name: 'Тёмная', value: 'dark', color: '#1F2937', textColor: '#FFFFFF' },
        { name: 'Синяя', value: 'blue', color: '#1E40AF', textColor: '#FFFFFF' },
        { name: 'Фиолетовая', value: 'purple', color: '#7C3AED', textColor: '#FFFFFF' },
    ];

    const [selectedTheme, setSelectedTheme] = useState('light');

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
                animationType="slide"
                transparent={true}
                visible={profileVisible}
                onRequestClose={closeProfile}
            >
                <View style={styles.modalOverlay}>
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
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    closeProfile();
                                    setTimeout(() => setPersonalDataVisible(true), 100);
                                }}
                            >
                                <MaterialIcons name="person-outline" size={24} color="#666" />
                                <Text style={styles.menuText}>Личные данные</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    closeProfile();
                                    setTimeout(() => setSettingsVisible(true), 100);
                                }}
                            >
                                <MaterialIcons name="settings" size={24} color="#666" />
                                <Text style={styles.menuText}>Настройки</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    closeProfile();
                                    setTimeout(() => setHelpVisible(true), 100);
                                }}
                            >
                                <MaterialIcons name="help-outline" size={24} color="#666" />
                                <Text style={styles.menuText}>Помощь</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleLogout}
                            >
                                <MaterialIcons name="logout" size={24} color="#EF4444" />
                                <Text style={[styles.menuText, { color: '#EF4444' }]}>Выйти</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Модальное окно личных данных */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={personalDataVisible}
                onRequestClose={() => setPersonalDataVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setPersonalDataVisible(false)} style={styles.backButton}>
                                <AntDesign name="arrowleft" size={24} color="#666" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Личные данные</Text>
                            <View style={styles.closeButton} />
                        </View>

                        <ScrollView style={styles.personalDataContent}>
                            <View style={styles.infoSection}>
                                <Text style={styles.infoSectionTitle}>Основная информация</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>ФИО:</Text>
                                    <Text style={styles.infoValue}>Ахметов Айсултан Бахытжанулы</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Дата рождения:</Text>
                                    <Text style={styles.infoValue}>15.03.2007</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Класс:</Text>
                                    <Text style={styles.infoValue}>10 "А"</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Школа:</Text>
                                    <Text style={styles.infoValue}>НИШ ФМН г. Астана</Text>
                                </View>
                            </View>

                            <View style={styles.infoSection}>
                                <Text style={styles.infoSectionTitle}>Шанырак</Text>
                                <View style={styles.shanyrakInfo}>
                                    <View style={styles.shanyrakBadge}>
                                        <FontAwesome5 name="trophy" size={20} color={PURPLE} />
                                        <Text style={styles.shanyrakName}>Алтын Орда</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Статус:</Text>
                                        <Text style={[styles.infoValue, { color: '#10B981' }]}>Активный член</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Роль:</Text>
                                        <Text style={styles.infoValue}>Капитан команды</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Баллы команды:</Text>
                                        <Text style={[styles.infoValue, { color: PURPLE, fontWeight: 'bold' }]}>850</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>Место в рейтинге:</Text>
                                        <Text style={[styles.infoValue, { color: '#F59E0B' }]}>3 место</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.infoSection}>
                                <Text style={styles.infoSectionTitle}>Контактная информация</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Email:</Text>
                                    <Text style={styles.infoValue}>aisultan@school.kz</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Телефон:</Text>
                                    <Text style={styles.infoValue}>+7 777 123 4567</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Модальное окно настроек */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={settingsVisible}
                onRequestClose={() => setSettingsVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setSettingsVisible(false)} style={styles.backButton}>
                                <AntDesign name="arrowleft" size={24} color="#666" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Настройки</Text>
                            <View style={styles.closeButton} />
                        </View>

                        <ScrollView style={styles.settingsContent}>
                            <View style={styles.settingsSection}>
                                <Text style={styles.settingsSectionTitle}>Тема приложения</Text>
                                <Text style={styles.settingsDescription}>Выберите цветовую тему</Text>

                                <View style={styles.themeGrid}>
                                    {themeOptions.map((theme) => (
                                        <TouchableOpacity
                                            key={theme.value}
                                            style={[
                                                styles.themeOption,
                                                {
                                                    backgroundColor: theme.color,
                                                    borderColor: selectedTheme === theme.value ? PURPLE : '#E5E7EB'
                                                }
                                            ]}
                                            onPress={() => setSelectedTheme(theme.value)}
                                        >
                                            <Text style={[styles.themeName, { color: theme.textColor }]}>
                                                {theme.name}
                                            </Text>
                                            {selectedTheme === theme.value && (
                                                <View style={styles.selectedIndicator}>
                                                    <AntDesign name="check" size={16} color="#FFFFFF" />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.settingsSection}>
                                <Text style={styles.settingsSectionTitle}>Уведомления</Text>
                                <View style={styles.settingItem}>
                                    <View>
                                        <Text style={styles.settingLabel}>Push-уведомления</Text>
                                        <Text style={styles.settingDescription}>Получать уведомления о событиях</Text>
                                    </View>
                                    <TouchableOpacity style={styles.switch}>
                                        <View style={[styles.switchTrack, { backgroundColor: '#10B981' }]}>
                                            <View style={styles.switchThumb} />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.settingItem}>
                                    <View>
                                        <Text style={styles.settingLabel}>Email-уведомления</Text>
                                        <Text style={styles.settingDescription}>Получать новости на почту</Text>
                                    </View>
                                    <TouchableOpacity style={styles.switch}>
                                        <View style={[styles.switchTrack, { backgroundColor: '#9CA3AF' }]}>
                                            <View style={[styles.switchThumb, { transform: [{ translateX: 16 }] }]} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.settingsSection}>
                                <Text style={styles.settingsSectionTitle}>Конфиденциальность</Text>
                                <TouchableOpacity style={styles.settingsButton}>
                                    <Text style={styles.settingsButtonText}>Изменить пароль</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.settingsButton}>
                                    <Text style={styles.settingsButtonText}>Настройки конфиденциальности</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.settingsSection}>
                                <Text style={styles.settingsSectionTitle}>О приложении</Text>
                                <Text style={styles.versionText}>Версия 1.0.0</Text>
                                <Text style={styles.buildText}>Сборка 2024.01</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Модальное окно помощи */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={helpVisible}
                onRequestClose={() => setHelpVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setHelpVisible(false)} style={styles.backButton}>
                                <AntDesign name="arrowleft" size={24} color="#666" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Помощь</Text>
                            <View style={styles.closeButton} />
                        </View>

                        <ScrollView style={styles.helpContent}>
                            <View style={styles.helpSection}>
                                <Text style={styles.helpSectionTitle}>Часто задаваемые вопросы</Text>

                                <View style={styles.faqItem}>
                                    <Text style={styles.faqQuestion}>Как подать отчет по шаныраку?</Text>
                                    <Text style={styles.faqAnswer}>
                                        Перейдите в раздел "Цифровые Шаныраки", выберите ваш шанырак и нажмите "Подать отчет". Заполните форму и отправьте на проверку.
                                    </Text>
                                </View>

                                <View style={styles.faqItem}>
                                    <Text style={styles.faqQuestion}>Как записаться на мероприятие?</Text>
                                    <Text style={styles.faqAnswer}>
                                        В разделе "Мероприятия" выберите интересующее вас событие и нажмите "Записаться". Вы получите уведомление о подтверждении.
                                    </Text>
                                </View>

                                <View style={styles.faqItem}>
                                    <Text style={styles.faqQuestion}>Как добавить цель?</Text>
                                    <Text style={styles.faqAnswer}>
                                        В разделе "Цели" нажмите на кнопку "+", заполните информацию о цели и установите срок выполнения.
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.helpSection}>
                                <Text style={styles.helpSectionTitle}>Техническая поддержка</Text>

                                <TouchableOpacity style={styles.supportContact}>
                                    <View style={styles.supportIcon}>
                                        <MaterialIcons name="email" size={24} color={PURPLE} />
                                    </View>
                                    <View style={styles.supportInfo}>
                                        <Text style={styles.supportTitle}>Email поддержка</Text>
                                        <Text style={styles.supportValue}>support@school.kz</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.supportContact}>
                                    <View style={styles.supportIcon}>
                                        <MaterialIcons name="phone" size={24} color={PURPLE} />
                                    </View>
                                    <View style={styles.supportInfo}>
                                        <Text style={styles.supportTitle}>Телефон поддержки</Text>
                                        <Text style={styles.supportValue}>+7 7172 123 456</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.supportContact}>
                                    <View style={styles.supportIcon}>
                                        <MaterialIcons name="chat" size={24} color={PURPLE} />
                                    </View>
                                    <View style={styles.supportInfo}>
                                        <Text style={styles.supportTitle}>Онлайн-чат</Text>
                                        <Text style={styles.supportValue}>Доступен с 9:00 до 18:00</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.helpSection}>
                                <Text style={styles.helpSectionTitle}>Руководство пользователя</Text>
                                <TouchableOpacity style={styles.downloadButton}>
                                    <MaterialIcons name="file-download" size={20} color="#FFFFFF" />
                                    <Text style={styles.downloadButtonText}>Скачать руководство (PDF)</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
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
    // Стили для модальных окон
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
        maxHeight: '90%',
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
        flex: 1,
        textAlign: 'center',
    },
    closeButton: {
        padding: 4,
        width: 32,
    },
    backButton: {
        padding: 4,
        width: 32,
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
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
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
    // Стили для личных данных
    personalDataContent: {
        paddingHorizontal: 20,
    },
    infoSection: {
        marginBottom: 24,
        paddingTop: 20,
    },
    infoSectionTitle: {
        fontSize: 18,
        color: '#1F2937',
        fontFamily: 'Inter_700Bold',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter_400Regular',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#1F2937',
        fontFamily: 'Inter_500Medium',
        flex: 2,
        textAlign: 'right',
    },
    shanyrakInfo: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
    },
    shanyrakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    shanyrakName: {
        fontSize: 18,
        color: PURPLE,
        fontFamily: 'Inter_700Bold',
        marginLeft: 12,
    },
    // Стили для настроек
    settingsContent: {
        paddingHorizontal: 20,
    },
    settingsSection: {
        marginBottom: 24,
        paddingTop: 20,
    },
    settingsSectionTitle: {
        fontSize: 18,
        color: '#1F2937',
        fontFamily: 'Inter_700Bold',
        marginBottom: 8,
    },
    settingsDescription: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter_400Regular',
        marginBottom: 16,
    },
    themeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    themeOption: {
        width: '48%',
        height: 100,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        position: 'relative',
    },
    themeName: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: PURPLE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    settingLabel: {
        fontSize: 16,
        color: '#1F2937',
        fontFamily: 'Inter_500Medium',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter_400Regular',
    },
    switch: {
        padding: 4,
    },
    switchTrack: {
        width: 48,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    switchThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    settingsButton: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    settingsButtonText: {
        fontSize: 16,
        color: '#1F2937',
        fontFamily: 'Inter_500Medium',
        textAlign: 'center',
    },
    versionText: {
        fontSize: 16,
        color: '#1F2937',
        fontFamily: 'Inter_400Regular',
        marginBottom: 4,
    },
    buildText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter_400Regular',
    },
    // Стили для помощи
    helpContent: {
        paddingHorizontal: 20,
    },
    helpSection: {
        marginBottom: 24,
        paddingTop: 20,
    },
    helpSectionTitle: {
        fontSize: 18,
        color: '#1F2937',
        fontFamily: 'Inter_700Bold',
        marginBottom: 16,
    },
    faqItem: {
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
    },
    faqQuestion: {
        fontSize: 16,
        color: '#1F2937',
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter_400Regular',
        lineHeight: 20,
    },
    supportContact: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 12,
    },
    supportIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${PURPLE}20`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    supportInfo: {
        flex: 1,
    },
    supportTitle: {
        fontSize: 16,
        color: '#1F2937',
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 4,
    },
    supportValue: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Inter_400Regular',
    },
    downloadButton: {
        backgroundColor: PURPLE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
    },
    downloadButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'Inter_600SemiBold',
        marginLeft: 8,
    },
    // Остальные стили как были ранее...
    // Добавьте остальные стили из предыдущего кода...
    // ...
});