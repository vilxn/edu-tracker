import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    FlatList,
    Dimensions,
    Modal,
    Animated,
    Image,
} from 'react-native';
import {
    Ionicons,
    MaterialIcons,
    FontAwesome5,
    Feather,
    AntDesign,
    MaterialCommunityIcons,
} from '@expo/vector-icons';
import {router} from "expo-router";

const { width } = Dimensions.get('window');

enum EventCategory {
    ALL = 'all',
    OLYMPIAD = 'olympiad',
    PROJECT = 'project',
    HACKATHON = 'hackathon',
    CONFERENCE = 'conference',
    COMPETITION = 'competition'
}

interface Event {
    id: string;
    title: string;
    category: EventCategory;
    deadline: string;
    level: string;
    participants: number;
    difficulty: 'easy' | 'medium' | 'hard';
    rewards: string[];
    color: string;
    icon: string;
    organization: string;
    description: string;
}

const ProjectsScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState<EventCategory>(EventCategory.ALL);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const categories = [
        { id: EventCategory.ALL, name: 'Все', icon: 'magnify', color: '#6366F1' },
        { id: EventCategory.OLYMPIAD, name: 'Олимпиады', icon: 'trophy', color: '#F59E0B' },
        { id: EventCategory.PROJECT, name: 'Проекты', icon: 'lightbulb', color: '#10B981' },
        { id: EventCategory.HACKATHON, name: 'Хакатоны', icon: 'code-braces', color: '#8B5CF6' },
        { id: EventCategory.CONFERENCE, name: 'Конференции', icon: 'presentation', color: '#EC4899' },
        { id: EventCategory.COMPETITION, name: 'Конкурсы', icon: 'trophy', color: '#3B82F6' },
    ];

    const events: Event[] = [
        {
            id: '1',
            title: 'Республиканская олимпиада по математике',
            category: EventCategory.OLYMPIAD,
            deadline: '2024-03-15',
            level: 'Республиканский',
            participants: 156,
            difficulty: 'hard',
            rewards: ['+100 баллов', 'Грант на обучение', 'Льгота при поступлении'],
            color: '#3B82F6',
            icon: 'calculator',
            organization: 'МОН РК',
            description: 'Ежегодная олимпиада для 9-11 классов',
        },
        {
            id: '2',
            title: 'Школьный хакатон по AI',
            category: EventCategory.HACKATHON,
            deadline: '2024-04-20',
            level: 'Школьный',
            participants: 24,
            difficulty: 'medium',
            rewards: ['Гаджеты', 'Стажировка', '+50 баллов'],
            color: '#8B5CF6',
            icon: 'robot',
            organization: 'IT школа',
            description: 'Создание AI-решений для школьных задач',
        },
        {
            id: '3',
            title: 'Экологический проект "Зеленая школа"',
            category: EventCategory.PROJECT,
            deadline: '2024-05-10',
            level: 'Городской',
            participants: 42,
            difficulty: 'easy',
            rewards: ['Экопризы', 'Публикация', '+30 баллов'],
            color: '#10B981',
            icon: 'leaf',
            organization: 'Экоцентр',
            description: 'Исследование и улучшение экологии школы',
        },
        {
            id: '4',
            title: 'Научная конференция молодых исследователей',
            category: EventCategory.CONFERENCE,
            deadline: '2024-03-30',
            level: 'Международный',
            participants: 89,
            difficulty: 'hard',
            rewards: ['Диплом', 'Публикация', 'Поездка за границу'],
            color: '#EC4899',
            icon: 'microscope',
            organization: 'Научное общество',
            description: 'Представление исследовательских работ',
        },
        {
            id: '5',
            title: 'Конкурс чтецов "Живая классика"',
            category: EventCategory.COMPETITION,
            deadline: '2024-04-05',
            level: 'Школьный',
            participants: 67,
            difficulty: 'easy',
            rewards: ['Книги', 'Диплом', '+20 баллов'],
            color: '#3B82F6',
            icon: 'book-open',
            organization: 'Кафедра литературы',
            description: 'Конкурс художественного чтения',
        },
        {
            id: '6',
            title: 'Олимпиада по программированию',
            category: EventCategory.OLYMPIAD,
            deadline: '2024-05-25',
            level: 'Городской',
            participants: 78,
            difficulty: 'medium',
            rewards: ['Ноутбук', 'Курсы', '+60 баллов'],
            color: '#F59E0B',
            icon: 'laptop',
            organization: 'Технопарк',
            description: 'Решение алгоритмических задач',
        },
    ];

    const recommendedEvents = [
        {
            id: 'rec1',
            title: 'Олимпиада по физике',
            matches: 95,
            reason: 'На основе ваших интересов',
            category: EventCategory.OLYMPIAD,
        },
        {
            id: 'rec2',
            title: 'Конкурс программирования',
            matches: 88,
            reason: 'Популярно в вашей школе',
            category: EventCategory.COMPETITION,
        },
    ];

    const skills = ['Python', 'Дизайн', 'Математика', 'Презентации', 'Английский'];

    useEffect(() => {
        filterEvents();
    }, [selectedCategory, searchQuery]);

    const filterEvents = () => {
        let result = events;

        if (selectedCategory !== EventCategory.ALL) {
            result = result.filter(event => event.category === selectedCategory);
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(event =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.organization.toLowerCase().includes(query)
            );
        }

        setFilteredEvents(result);
    };

    const handleEventPress = (event: Event) => {
        setSelectedEvent(event);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setModalVisible(true);
    };

    const closeModal = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
            setSelectedEvent(null);
        });
    };

    const renderEventCard = ({ item }: { item: Event }) => (
        <TouchableOpacity onPress={() => handleEventPress(item)}>
            <View style={[styles.eventCard, { borderLeftColor: item.color }]}>
                <View style={styles.eventHeader}>
                    <View style={[styles.eventIconContainer, { backgroundColor: item.color + '30' }]}>
                        <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
                    </View>
                    <View style={styles.eventBadge}>
                        <Text style={[styles.eventBadgeText, { color: item.color }]}>{item.level}</Text>
                    </View>
                </View>

                <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.eventDescription} numberOfLines={2}>{item.description}</Text>

                <View style={styles.eventFooter}>
                    <View style={styles.eventInfo}>
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                        <Text style={styles.eventInfoText}>До {item.deadline}</Text>
                    </View>
                    <View style={styles.eventInfo}>
                        <Ionicons name="people-outline" size={16} color="#666" />
                        <Text style={styles.eventInfoText}>{item.participants} участников</Text>
                    </View>
                </View>

                <View style={styles.difficultyContainer}>
                    <View style={[
                        styles.difficultyDot,
                        { backgroundColor: item.difficulty === 'easy' ? '#10B981' : item.difficulty === 'medium' ? '#F59E0B' : '#EF4444' }
                    ]} />
                    <Text style={styles.difficultyText}>
                        {item.difficulty === 'easy' ? 'Начинающий' : item.difficulty === 'medium' ? 'Средний' : 'Продвинутый'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderCategory = ({ item }: { item: typeof categories[0] }) => (
        <TouchableOpacity
            style={[
                styles.categoryCard,
                selectedCategory === item.id && { backgroundColor: item.color + '20', borderColor: item.color }
            ]}
            onPress={() => setSelectedCategory(item.id)}
        >
            <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={selectedCategory === item.id ? item.color : '#666'}
            />
            <Text style={[
                styles.categoryText,
                selectedCategory === item.id && { color: item.color, fontWeight: '600' }
            ]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const renderRecommendedCard = ({ item }: { item: typeof recommendedEvents[0] }) => (
        <View style={styles.recommendedCard}>
            <View style={styles.recommendedHeader}>
                <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{item.matches}% совпадение</Text>
                </View>
                <Ionicons name="sparkles" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.recommendedTitle}>{item.title}</Text>
            <Text style={styles.recommendedReason}>{item.reason}</Text>
            <TouchableOpacity style={styles.recommendedButton}>
                <Text style={styles.recommendedButtonText}>Подробнее</Text>
                <Feather name="arrow-right" size={16} color="#8B5CF6" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Найди своё мероприятие</Text>
                        <Text style={styles.subtitle}>Участвуй, побеждай, развивайся</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Ionicons name="person-circle-outline" size={32} color="#6366F1" />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Поиск олимпиад, проектов..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: '#6366F1' }]}>
                        <MaterialIcons name="event-available" size={24} color="#FFF" />
                        <Text style={styles.statNumber}>{events.length}</Text>
                        <Text style={styles.statLabel}>Всего</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#10B981' }]}>
                        <MaterialIcons name="groups" size={24} color="#FFF" />
                        <Text style={styles.statNumber}>{events.reduce((sum, event) => sum + event.participants, 0)}</Text>
                        <Text style={styles.statLabel}>Участников</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: '#F59E0B' }]}>
                        <MaterialIcons name="emoji-events" size={24} color="#FFF" />
                        <Text style={styles.statNumber}>{events.filter(e => e.difficulty === 'easy').length}</Text>
                        <Text style={styles.statLabel}>Для новичков</Text>
                    </View>
                </View>

                {selectedCategory === EventCategory.ALL && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Рекомендовано для вас</Text>
                            <Ionicons name="sparkles" size={20} color="#F59E0B" />
                        </View>
                        <FlatList
                            data={recommendedEvents}
                            renderItem={renderRecommendedCard}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.recommendedList}
                        />
                    </View>
                )}

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {selectedCategory === EventCategory.ALL ? 'Все мероприятия' : categories.find(c => c.id === selectedCategory)?.name}
                        </Text>
                        <TouchableOpacity style={styles.filterButton}>
                            <Feather name="filter" size={18} color="#666" />
                            <Text style={styles.filterText}>Сортировка</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={categories}
                        renderItem={renderCategory}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesList}
                    />

                    {filteredEvents.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                            <Text style={styles.emptyStateText}>Мероприятия не найдены</Text>
                            <Text style={styles.emptyStateSubtext}>Попробуйте изменить фильтры или поиск</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredEvents}
                            renderItem={renderEventCard}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            contentContainerStyle={styles.eventsList}
                        />
                    )}
                </View>

                <View style={[styles.teamCard, { backgroundColor: '#8B5CF6' }]}>
                    <View style={styles.teamContent}>
                        <Text style={styles.teamTitle}>Найди команду</Text>
                        <Text style={styles.teamSubtitle}>Объединяйся с талантливыми участниками</Text>

                        <View style={styles.skillsContainer}>
                            {skills.map((skill, index) => (
                                <View key={index} style={styles.skillTag}>
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.findTeamButton}
                            onPress={() => {router.push("/(tabs)/search-team/searchTeam")}}>
                            <Text style={styles.findTeamButtonText}>Найти команду</Text>
                            <Feather name="users" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400' }}
                        style={styles.teamImage}
                    />
                </View>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                    <TouchableOpacity style={styles.modalOverlay} onPress={closeModal} activeOpacity={1}>
                        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                            {selectedEvent && (
                                <>
                                    <View style={[styles.modalHeader, { backgroundColor: selectedEvent.color }]}>
                                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                            <Ionicons name="close" size={24} color="#FFF" />
                                        </TouchableOpacity>
                                        <View style={styles.modalIconContainer}>
                                            <MaterialCommunityIcons name={selectedEvent.icon as any} size={40} color="#FFF" />
                                        </View>
                                        <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                                        <Text style={styles.modalOrganization}>{selectedEvent.organization}</Text>
                                    </View>

                                    <ScrollView style={styles.modalBody}>
                                        <View style={styles.detailSection}>
                                            <Text style={styles.detailTitle}>Описание</Text>
                                            <Text style={styles.detailText}>{selectedEvent.description}</Text>
                                        </View>

                                        <View style={styles.detailSection}>
                                            <Text style={styles.detailTitle}>Награды</Text>
                                            {selectedEvent.rewards.map((reward, index) => (
                                                <View key={index} style={styles.rewardItem}>
                                                    <Ionicons name="trophy-outline" size={18} color={selectedEvent.color} />
                                                    <Text style={styles.rewardText}>{reward}</Text>
                                                </View>
                                            ))}
                                        </View>

                                        <View style={styles.detailSection}>
                                            <Text style={styles.detailTitle}>Детали</Text>
                                            <View style={styles.detailRow}>
                                                <Ionicons name="calendar-outline" size={20} color="#666" />
                                                <Text style={styles.detailLabel}>Дедлайн:</Text>
                                                <Text style={styles.detailValue}>{selectedEvent.deadline}</Text>
                                            </View>
                                            <View style={styles.detailRow}>
                                                <Ionicons name="flag-outline" size={20} color="#666" />
                                                <Text style={styles.detailLabel}>Уровень:</Text>
                                                <Text style={styles.detailValue}>{selectedEvent.level}</Text>
                                            </View>
                                            <View style={styles.detailRow}>
                                                <Ionicons name="people-outline" size={20} color="#666" />
                                                <Text style={styles.detailLabel}>Участников:</Text>
                                                <Text style={styles.detailValue}>{selectedEvent.participants}</Text>
                                            </View>
                                            <View style={styles.detailRow}>
                                                <Ionicons name="layers-outline" size={20} color="#666" />
                                                <Text style={styles.detailLabel}>Категория:</Text>
                                                <Text style={styles.detailValue}>
                                                    {categories.find(c => c.id === selectedEvent.category)?.name}
                                                </Text>
                                            </View>
                                        </View>
                                    </ScrollView>

                                    <View style={styles.modalFooter}>
                                        <TouchableOpacity style={styles.secondaryButton}>
                                            <Text style={[styles.buttonText, { color: selectedEvent.color }]}>Добавить в календарь</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: selectedEvent.color }]}>
                                            <Text style={styles.buttonText}>Участвовать</Text>
                                            <Feather name="arrow-right" size={20} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 5,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFF',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#FFF',
        opacity: 0.9,
        marginTop: 2,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    seeAll: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '600',
    },
    categoriesList: {
        paddingHorizontal: 20,
    },
    categoryCard: {
        alignItems: 'center',
        padding: 16,
        marginRight: 12,
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    categoryText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
    },
    filterText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    recommendedList: {
        paddingHorizontal: 20,
    },
    recommendedCard: {
        width: width * 0.7,
        padding: 20,
        marginRight: 16,
        borderRadius: 20,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    recommendedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    matchBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    matchText: {
        fontSize: 12,
        color: '#92400E',
        fontWeight: '600',
    },
    recommendedTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    recommendedReason: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    recommendedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    recommendedButtonText: {
        fontSize: 14,
        color: '#8B5CF6',
        fontWeight: '600',
        marginRight: 4,
    },
    eventsList: {
        paddingHorizontal: 20,
    },
    eventCard: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    eventIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eventBadge: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
    },
    eventBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        lineHeight: 24,
    },
    eventDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
        lineHeight: 20,
    },
    eventFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    eventInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventInfoText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 6,
    },
    difficultyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    difficultyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    difficultyText: {
        fontSize: 12,
        color: '#666',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 8,
        textAlign: 'center',
    },
    teamCard: {
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    teamContent: {
        flex: 1,
    },
    teamTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    teamSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 20,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    skillTag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    skillText: {
        fontSize: 12,
        color: '#FFF',
        fontWeight: '500',
    },
    findTeamButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    findTeamButtonText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
        marginRight: 8,
    },
    teamImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginLeft: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 40,
        elevation: 10,
        maxHeight: '80%',
    },
    modalHeader: {
        padding: 24,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
    modalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalOrganization: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
    },
    modalBody: {
        padding: 24,
        maxHeight: 400,
    },
    detailSection: {
        marginBottom: 24,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    rewardText: {
        fontSize: 15,
        color: '#4B5563',
        marginLeft: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 15,
        color: '#6B7280',
        marginLeft: 12,
        marginRight: 8,
        width: 100,
    },
    detailValue: {
        fontSize: 15,
        color: '#1F2937',
        fontWeight: '500',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    primaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        marginLeft: 12,
    },
    secondaryButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginRight: 8,
    },
});

export default ProjectsScreen;