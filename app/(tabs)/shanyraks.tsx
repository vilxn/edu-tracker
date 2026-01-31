import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    Modal,
    ScrollView,
    Alert,
    SafeAreaView,
    Dimensions,
    Animated,
    StatusBar,
} from 'react-native';
import { MaterialIcons, FontAwesome5, AntDesign, Feather } from '@expo/vector-icons';

// ========== TYPES ==========
interface Shanyrak {
    id: string;
    name: string;
    points: number;
    members: number;
    color: string;
}

interface Activity {
    id: string;
    name: string;
    description: string;
    category: 'event' | 'sport' | 'study' | 'creative';
    points: number;
    timestamp: string;
    shanyrakId: string;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    progress?: number;
    icon: keyof typeof MaterialIcons.glyphMap;
    rewardPoints: number;
}

interface ActivityReport {
    name: string;
    description: string;
    category: 'event' | 'sport' | 'study' | 'creative';
    participants: number;
    timestamp: string;
    shanyrakId?: string;
}

type TabType = 'ranking' | 'history' | 'achievements';

// ========== COMPONENT PROPS ==========
interface ShanyrakRankingProps {
    shanyrak: Shanyrak;
    position: number;
    onPress?: () => void;
}

interface HistoryItemProps {
    activity: Activity;
    shanyrakColor: string;
}

interface AchievementBadgeProps {
    achievement: Achievement;
}

interface TabButtonProps {
    tab: { key: TabType; label: string; icon: keyof typeof MaterialIcons.glyphMap };
    isActive: boolean;
    onPress: () => void;
}

// ========== COMPONENTS ==========
const ShanyrakRanking: React.FC<ShanyrakRankingProps> = ({ shanyrak, position, onPress }) => {
    const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4A6572'];
    const animation = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(animation, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, []);

    const scale = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
    });

    // Функция для затемнения цвета
    const darkenColor = (color: string, percent: number) => {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;

        return `#${(
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        )
            .toString(16)
            .slice(1)}`;
    };

    const positionColor = darkenColor(shanyrak.color, -20); // Темнее на 20%
    const pointsColor = '#5D9CEC';

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity style={styles.rankingCard} onPress={onPress} activeOpacity={0.7}>
                <View style={[styles.positionBadge, { backgroundColor: positionColor }]}>
                    <Text style={styles.positionText}>{position}</Text>
                    {position <= 3 && (
                        <View style={styles.medalContainer}>
                            <MaterialIcons
                                name="emoji-events"
                                size={16}
                                color={medalColors[position - 1]}
                                style={styles.medalIcon}
                            />
                        </View>
                    )}
                </View>
                <View style={styles.rankingContent}>
                    <Text style={styles.shanyrakName}>{shanyrak.name}</Text>
                    <View style={styles.rankingDetails}>
                        <View style={styles.detailItem}>
                            <MaterialIcons name="emoji-events" size={14} color="#FFB74D" />
                            <Text style={styles.detailText}>{shanyrak.points.toLocaleString()} баллов</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Feather name="users" size={14} color="#64B5F6" />
                            <Text style={styles.detailText}>{shanyrak.members} участников</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.pointsCircle, { backgroundColor: pointsColor }]}>
                    <Text style={styles.pointsText}>{shanyrak.points}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const HistoryItem: React.FC<HistoryItemProps> = ({ activity, shanyrakColor }) => {
    const categoryIcons: Record<Activity['category'], keyof typeof MaterialIcons.glyphMap> = {
        event: 'celebration',
        sport: 'sports',
        study: 'school',
        creative: 'palette',
    };

    return (
        <View style={styles.historyItem}>
            <View style={[styles.historyIcon, { backgroundColor: `${shanyrakColor}20` }]}>
                <MaterialIcons name={categoryIcons[activity.category]} size={24} color={shanyrakColor} />
            </View>
            <View style={styles.historyContent}>
                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle} numberOfLines={1}>
                        {activity.name}
                    </Text>
                    <View style={styles.pointsBadge}>
                        <Text style={styles.pointsBadgeText}>+{activity.points}</Text>
                    </View>
                </View>
                <Text style={styles.historyDescription} numberOfLines={2}>
                    {activity.description}
                </Text>
                <Text style={styles.historyDate}>
                    {new Date(activity.timestamp).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </Text>
            </View>
        </View>
    );
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
    const achievementColor = achievement.unlocked ? '#FFD700' : '#E0E0E0';
    const borderColor = achievement.unlocked ? '#FFB74D' : '#BDBDBD';

    return (
        <View style={[styles.achievementCard, !achievement.unlocked && styles.achievementLocked]}>
            <View style={[
                styles.achievementIcon,
                { backgroundColor: achievementColor, borderColor }
            ]}>
                <MaterialIcons name={achievement.icon} size={28} color="white" />
            </View>
            <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                {achievement.progress !== undefined && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${achievement.progress}%` },
                                    achievement.unlocked && styles.progressFillUnlocked,
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>{achievement.progress}%</Text>
                    </View>
                )}
                {achievement.unlocked && (
                    <View style={styles.rewardBadge}>
                        <MaterialIcons name="star" size={12} color="#FFD700" />
                        <Text style={styles.rewardText}>+{achievement.rewardPoints} баллов</Text>
                    </View>
                )}
            </View>
            <MaterialIcons
                name={achievement.unlocked ? 'check-circle' : 'lock'}
                size={24}
                color={achievement.unlocked ? '#4CAF50' : '#9E9E9E'}
            />
        </View>
    );
};

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onPress }) => (
    <TouchableOpacity style={[styles.tabButton, isActive && styles.tabButtonActive]} onPress={onPress}>
        <MaterialIcons
            name={tab.icon}
            size={24}
            color={isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
        />
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
    </TouchableOpacity>
);

const ActivityReportForm: React.FC<{
    visible: boolean;
    onClose: () => void;
    onSubmit: (report: ActivityReport) => void;
    shanyraks: Shanyrak[];
}> = ({ visible, onClose, onSubmit, shanyraks }) => {
    const [formData, setFormData] = useState<Omit<ActivityReport, 'timestamp'>>({
        name: '',
        description: '',
        category: 'event',
        participants: 0,
        shanyrakId: shanyraks[0]?.id,
    });

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            Alert.alert('Ошибка', 'Введите название активности');
            return;
        }
        if (formData.participants < 1) {
            Alert.alert('Ошибка', 'Укажите количество участников');
            return;
        }

        onSubmit({
            ...formData,
            timestamp: new Date().toISOString(),
        });

        setFormData({
            name: '',
            description: '',
            category: 'event',
            participants: 0,
            shanyrakId: shanyraks[0]?.id,
        });
        onClose();
    };

    const categories = [
        { value: 'event' as const, label: 'Мероприятие', icon: 'celebration' as keyof typeof MaterialIcons.glyphMap, color: '#FF7043' },
        { value: 'sport' as const, label: 'Спорт', icon: 'sports' as keyof typeof MaterialIcons.glyphMap, color: '#42A5F5' },
        { value: 'study' as const, label: 'Учеба', icon: 'school' as keyof typeof MaterialIcons.glyphMap, color: '#66BB6A' },
        { value: 'creative' as const, label: 'Творчество', icon: 'palette' as keyof typeof MaterialIcons.glyphMap, color: '#AB47BC' },
    ];

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Новый отчет</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Шанырак</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shanyrakPicker}>
                                {shanyraks.map((shanyrak) => (
                                    <TouchableOpacity
                                        key={shanyrak.id}
                                        style={[
                                            styles.shanyrakOption,
                                            formData.shanyrakId === shanyrak.id && styles.shanyrakOptionActive,
                                            { borderColor: shanyrak.color },
                                        ]}
                                        onPress={() => setFormData({ ...formData, shanyrakId: shanyrak.id })}
                                    >
                                        <View style={[styles.shanyrakDot, { backgroundColor: shanyrak.color }]} />
                                        <Text style={styles.shanyrakOptionText}>{shanyrak.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Название активности *</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                placeholder="Субботник в парке"
                                placeholderTextColor="#9E9E9E"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Категория</Text>
                            <View style={styles.categoryGrid}>
                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.value}
                                        style={[
                                            styles.categoryCard,
                                            formData.category === cat.value && { backgroundColor: `${cat.color}20`, borderColor: cat.color },
                                        ]}
                                        onPress={() => setFormData({ ...formData, category: cat.value })}
                                    >
                                        <MaterialIcons
                                            name={cat.icon}
                                            size={24}
                                            color={formData.category === cat.value ? cat.color : '#757575'}
                                        />
                                        <Text
                                            style={[
                                                styles.categoryLabel,
                                                formData.category === cat.value && { color: cat.color },
                                            ]}
                                        >
                                            {cat.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Описание</Text>
                            <TextInput
                                style={[styles.textInput, styles.multilineInput]}
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                placeholder="Опишите проведенную активность..."
                                placeholderTextColor="#9E9E9E"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Количество участников *</Text>
                            <View style={styles.participantsContainer}>
                                <TouchableOpacity
                                    style={styles.participantButton}
                                    onPress={() =>
                                        setFormData({
                                            ...formData,
                                            participants: Math.max(0, formData.participants - 1),
                                        })
                                    }
                                >
                                    <MaterialIcons name="remove" size={24} color="#5D9CEC" />
                                </TouchableOpacity>
                                <TextInput
                                    style={[styles.textInput, styles.participantInput]}
                                    value={formData.participants.toString()}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, participants: parseInt(text) || 0 })
                                    }
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity
                                    style={styles.participantButton}
                                    onPress={() =>
                                        setFormData({ ...formData, participants: formData.participants + 1 })
                                    }
                                >
                                    <MaterialIcons name="add" size={24} color="#5D9CEC" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.previewCard}>
                            <Text style={styles.previewTitle}>Предварительный расчет</Text>
                            <View style={styles.previewRow}>
                                <Text style={styles.previewLabel}>Баллов за участников:</Text>
                                <Text style={styles.previewValue}>{formData.participants * 5}</Text>
                            </View>
                            <View style={styles.previewRow}>
                                <Text style={styles.previewLabel}>Бонус за активность:</Text>
                                <Text style={styles.previewValue}>+10</Text>
                            </View>
                            <View style={[styles.previewRow, styles.previewTotal]}>
                                <Text style={styles.previewTotalLabel}>Итого:</Text>
                                <Text style={styles.previewTotalValue}>
                                    {Math.min(100, Math.max(10, formData.participants * 5 + 10))} баллов
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Отмена</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: '#5D9CEC' }]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>Отправить отчет</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

// ========== MAIN COMPONENT ==========
export default function Shanyraks() {
    const [shanyraks, setShanyraks] = useState<Shanyrak[]>([
        { id: '1', name: 'Алтын Орда', points: 1245, members: 28, color: '#FF7043' },
        { id: '2', name: 'Жеті Жарғы', points: 1180, members: 25, color: '#42A5F5' },
        { id: '3', name: 'Сарыарка', points: 1120, members: 30, color: '#66BB6A' },
        { id: '4', name: 'Тулпар', points: 980, members: 22, color: '#AB47BC' },
        { id: '5', name: 'Көкше', points: 875, members: 26, color: '#FFCA28' },
    ]);

    const [activities, setActivities] = useState<Activity[]>([
        {
            id: '1',
            name: 'Субботник в парке',
            description: 'Уборка территории городского парка',
            category: 'event',
            points: 50,
            timestamp: '2024-01-20',
            shanyrakId: '1',
        },
        {
            id: '2',
            name: 'Математическая олимпиада',
            description: 'Школьный этап республиканской олимпиады',
            category: 'study',
            points: 100,
            timestamp: '2024-01-18',
            shanyrakId: '2',
        },
        {
            id: '3',
            name: 'Баскетбольный турнир',
            description: 'Победа в межшкольных соревнованиях',
            category: 'sport',
            points: 75,
            timestamp: '2024-01-15',
            shanyrakId: '3',
        },
    ]);

    const [achievements, setAchievements] = useState<Achievement[]>([
        {
            id: '1',
            title: 'Лидер месяца',
            description: 'Первое место в рейтинге',
            unlocked: true,
            icon: 'emoji-events',
            rewardPoints: 200,
        },
        {
            id: '2',
            title: 'Активный организатор',
            description: 'Провести 5 мероприятий',
            unlocked: false,
            progress: 60,
            icon: 'group-work',
            rewardPoints: 150,
        },
        {
            id: '3',
            title: 'Спортивная слава',
            description: 'Участие в 3 спортивных событиях',
            unlocked: true,
            icon: 'sports',
            rewardPoints: 100,
        },
        {
            id: '4',
            title: 'Умники и умницы',
            description: '10 учебных достижений',
            unlocked: false,
            progress: 30,
            icon: 'school',
            rewardPoints: 300,
        },
        {
            id: '5',
            title: 'Творческая мастерская',
            description: 'Организовать 2 творческих мероприятия',
            unlocked: false,
            progress: 50,
            icon: 'palette',
            rewardPoints: 120,
        },
    ]);

    const [activeTab, setActiveTab] = useState<TabType>('ranking');
    const [reportModalVisible, setReportModalVisible] = useState(false);

    const sortedShanyraks = useMemo(
        () => [...shanyraks].sort((a, b) => b.points - a.points),
        [shanyraks]
    );

    const handleSubmitReport = useCallback((report: ActivityReport) => {
        const newPoints = Math.min(100, Math.max(10, report.participants * 5 + 10));
        const shanyrak = shanyraks.find((s) => s.id === report.shanyrakId);

        const newActivity: Activity = {
            id: Date.now().toString(),
            name: report.name,
            description: report.description,
            category: report.category,
            points: newPoints,
            timestamp: report.timestamp,
            shanyrakId: report.shanyrakId || shanyraks[0].id,
        };

        setActivities((prev) => [newActivity, ...prev]);

        if (shanyrak) {
            setShanyraks((prev) =>
                prev.map((s) =>
                    s.id === shanyrak.id ? { ...s, points: s.points + newPoints } : s
                )
            );
        }

        Alert.alert('Успешно!', `Отчет добавлен. Начислено ${newPoints} баллов.`);
    }, [shanyraks]);

    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: '#2C3E50' }]}>
            <View style={styles.headerContent}>
                <View>
                    <Text style={styles.headerTitle}>Рейтинг Шаныраков</Text>
                    <Text style={styles.headerSubtitle}>Соревнование в реальном времени</Text>
                </View>
                <View style={styles.headerStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{shanyraks.length}</Text>
                        <Text style={styles.statLabel}>Шаныраков</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {shanyraks.reduce((sum, s) => sum + s.points, 0).toLocaleString()}
                        </Text>
                        <Text style={styles.statLabel}>Всего баллов</Text>
                    </View>
                </View>
            </View>
            <MaterialIcons name="leaderboard" size={48} color="rgba(255,255,255,0.2)" style={styles.headerIcon} />
        </View>
    );

    const tabs: { key: TabType; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
        { key: 'ranking', label: 'Рейтинг', icon: 'leaderboard' },
        { key: 'history', label: 'История', icon: 'history' },
        { key: 'achievements', label: 'Достижения', icon: 'emoji-events' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />

            {renderHeader()}

            <View style={styles.tabBar}>
                {tabs.map((tab) => (
                    <TabButton
                        key={tab.key}
                        tab={tab}
                        isActive={activeTab === tab.key}
                        onPress={() => setActiveTab(tab.key)}
                    />
                ))}
            </View>

            <View style={styles.content}>
                {activeTab === 'ranking' && (
                    <FlatList
                        data={sortedShanyraks}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <ShanyrakRanking
                                shanyrak={item}
                                position={index + 1}
                                onPress={() =>
                                    Alert.alert(item.name, `Всего баллов: ${item.points}\nУчастников: ${item.members}`)
                                }
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {activeTab === 'history' && (
                    <FlatList
                        data={activities}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const shanyrak = shanyraks.find((s) => s.id === item.shanyrakId);
                            return <HistoryItem activity={item} shanyrakColor={shanyrak?.color || '#4A6572'} />;
                        }}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <MaterialIcons name="history" size={64} color="#E0E0E0" />
                                <Text style={styles.emptyStateTitle}>История пуста</Text>
                                <Text style={styles.emptyStateText}>
                                    Добавьте первый отчет об активности
                                </Text>
                            </View>
                        }
                    />
                )}

                {activeTab === 'achievements' && (
                    <FlatList
                        data={achievements}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <AchievementBadge achievement={item} />}
                        contentContainerStyle={styles.listContent}
                        numColumns={2}
                        columnWrapperStyle={styles.achievementGrid}
                    />
                )}
            </View>

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: '#5D9CEC' }]}
                onPress={() => setReportModalVisible(true)}
                activeOpacity={0.8}
            >
                <MaterialIcons name="add" size={28} color="white" />
            </TouchableOpacity>

            <ActivityReportForm
                visible={reportModalVisible}
                onClose={() => setReportModalVisible(false)}
                onSubmit={handleSubmitReport}
                shanyraks={shanyraks}
            />
        </SafeAreaView>
    );
}

// ========== STYLES ==========
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: 'white',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    headerStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 12,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 8,
    },
    headerIcon: {
        position: 'absolute',
        right: 24,
        bottom: 16,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#2C3E50',
        marginHorizontal: 16,
        marginTop: -16,
        borderRadius: 16,
        padding: 4,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    tabButtonActive: {
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        marginLeft: 8,
    },
    tabLabelActive: {
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingTop: 16,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    rankingCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    positionBadge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        position: 'relative',
    },
    positionText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '800',
    },
    medalContainer: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 2,
    },
    medalIcon: {
        // Стили иконки медали
    },
    rankingContent: {
        flex: 1,
    },
    shanyrakName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    rankingDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 6,
        color: '#666',
        fontSize: 13,
        fontWeight: '500',
    },
    pointsCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    pointsText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
    },
    historyItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    historyIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    historyContent: {
        flex: 1,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        flex: 1,
        marginRight: 12,
    },
    pointsBadge: {
        backgroundColor: '#4CAF5020',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 50,
        alignItems: 'center',
    },
    pointsBadgeText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '800',
    },
    historyDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    historyDate: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
    },
    achievementCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        margin: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        minHeight: 180,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    achievementLocked: {
        opacity: 0.7,
    },
    achievementIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 2,
    },
    achievementContent: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
    },
    achievementDescription: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
        marginBottom: 12,
        flex: 1,
    },
    progressContainer: {
        marginTop: 'auto',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#5D9CEC',
        borderRadius: 3,
    },
    progressFillUnlocked: {
        backgroundColor: '#4CAF50',
    },
    progressText: {
        fontSize: 10,
        color: '#999',
        fontWeight: '600',
        textAlign: 'right',
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    rewardText: {
        fontSize: 11,
        color: '#FF8F00',
        fontWeight: '700',
        marginLeft: 4,
    },
    achievementGrid: {
        justifyContent: 'space-between',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#757575',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#BDBDBD',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 12,
        shadowColor: '#5D9CEC',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '90%',
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 32,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        paddingHorizontal: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    shanyrakPicker: {
        flexDirection: 'row',
    },
    shanyrakOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        backgroundColor: 'white',
        marginRight: 8,
    },
    shanyrakOptionActive: {
        backgroundColor: '#F0F8FF',
    },
    shanyrakDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    shanyrakOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    textInput: {
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#333',
        backgroundColor: 'white',
    },
    multilineInput: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        flex: 1,
        minWidth: (width - 72) / 2,
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
    },
    categoryLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#757575',
        marginTop: 8,
    },
    participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    participantButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    participantInput: {
        flex: 1,
        marginHorizontal: 12,
        textAlign: 'center',
    },
    previewCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    previewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    previewLabel: {
        fontSize: 14,
        color: '#666',
    },
    previewValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    previewTotal: {
        paddingTop: 12,
        borderTopWidth: 2,
        borderTopColor: '#E0E0E0',
        marginTop: 4,
    },
    previewTotalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    previewTotalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#4CAF50',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        padding: 18,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    submitButton: {
        flex: 2,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
    },
});