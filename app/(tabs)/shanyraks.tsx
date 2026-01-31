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
    StatusBar, Platform,
} from 'react-native';
import { MaterialIcons, FontAwesome5, AntDesign, Feather } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius, Spacing, Typography } from '@/constants/theme'; // Импортируем цветовую схему

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

const ShanyrakRanking: React.FC<ShanyrakRankingProps> = ({ shanyrak, position, onPress }) => {
    const medalColors = [Colors.light.warning, '#C0C0C0', '#CD7F32', Colors.light.neutral[500]];
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

    const positionColor = darkenColor(shanyrak.color, -20);
    const pointsColor = Colors.light.info;

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
                            <MaterialIcons name="emoji-events" size={14} color={Colors.light.warning} />
                            <Text style={styles.detailText}>{shanyrak.points.toLocaleString()} баллов</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Feather name="users" size={14} color={Colors.light.info} />
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

    const categoryColors: Record<Activity['category'], string> = {
        event: Colors.light.categories.conference,
        sport: Colors.light.accent,
        study: Colors.light.success,
        creative: Colors.light.categories.hackathon,
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
                    <View style={[styles.pointsBadge, { backgroundColor: `${categoryColors[activity.category]}20` }]}>
                        <Text style={[styles.pointsBadgeText, { color: categoryColors[activity.category] }]}>
                            +{activity.points}
                        </Text>
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
    const achievementColor = achievement.unlocked ? Colors.light.warning : Colors.light.neutral[300];
    const borderColor = achievement.unlocked ? Colors.light.warning : Colors.light.neutral[400];
    const progressColor = achievement.unlocked ? Colors.light.success : Colors.light.info;

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
                                    { width: `${achievement.progress}%`, backgroundColor: progressColor },
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>{achievement.progress}%</Text>
                    </View>
                )}
                {achievement.unlocked && (
                    <View style={styles.rewardBadge}>
                        <MaterialIcons name="star" size={12} color={Colors.light.warning} />
                        <Text style={styles.rewardText}>+{achievement.rewardPoints} баллов</Text>
                    </View>
                )}
            </View>
            <MaterialIcons
                name={achievement.unlocked ? 'check-circle' : 'lock'}
                size={24}
                color={achievement.unlocked ? Colors.light.success : Colors.light.neutral[500]}
            />
        </View>
    );
};

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onPress }) => (
    <TouchableOpacity
        style={[
            styles.tabButton,
            isActive && [
                styles.tabButtonActive,
                { backgroundColor: Colors.light.primary + '30' }
            ]
        ]}
        onPress={onPress}
    >
        <MaterialIcons
            name={tab.icon}
            size={24}
            color={isActive ? Colors.light.primary : Colors.light.neutral[400]}
        />
        <Text style={[
            styles.tabLabel,
            isActive ? { color: Colors.light.primary, fontWeight: '600' } : { color: Colors.light.neutral[500] }
        ]}>
            {tab.label}
        </Text>
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
        {
            value: 'event' as const,
            label: 'Мероприятие',
            icon: 'celebration' as keyof typeof MaterialIcons.glyphMap,
            color: Colors.light.categories.conference
        },
        {
            value: 'sport' as const,
            label: 'Спорт',
            icon: 'sports' as keyof typeof MaterialIcons.glyphMap,
            color: Colors.light.accent
        },
        {
            value: 'study' as const,
            label: 'Учеба',
            icon: 'school' as keyof typeof MaterialIcons.glyphMap,
            color: Colors.light.success
        },
        {
            value: 'creative' as const,
            label: 'Творчество',
            icon: 'palette' as keyof typeof MaterialIcons.glyphMap,
            color: Colors.light.categories.hackathon
        },
    ];

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <SafeAreaView style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Новый отчет</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color={Colors.light.neutral[800]} />
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
                                            formData.shanyrakId === shanyrak.id && [
                                                styles.shanyrakOptionActive,
                                                { borderColor: shanyrak.color, backgroundColor: `${shanyrak.color}20` }
                                            ],
                                            { borderColor: Colors.light.neutral[300] },
                                        ]}
                                        onPress={() => setFormData({ ...formData, shanyrakId: shanyrak.id })}
                                    >
                                        <View style={[styles.shanyrakDot, { backgroundColor: shanyrak.color }]} />
                                        <Text style={[
                                            styles.shanyrakOptionText,
                                            formData.shanyrakId === shanyrak.id && { color: shanyrak.color }
                                        ]}>
                                            {shanyrak.name}
                                        </Text>
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
                                placeholderTextColor={Colors.light.neutral[400]}
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
                                            formData.category === cat.value && {
                                                backgroundColor: `${cat.color}20`,
                                                borderColor: cat.color
                                            },
                                        ]}
                                        onPress={() => setFormData({ ...formData, category: cat.value })}
                                    >
                                        <MaterialIcons
                                            name={cat.icon}
                                            size={24}
                                            color={formData.category === cat.value ? cat.color : Colors.light.neutral[500]}
                                        />
                                        <Text
                                            style={[
                                                styles.categoryLabel,
                                                formData.category === cat.value ? { color: cat.color } : { color: Colors.light.neutral[500] }
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
                                placeholderTextColor={Colors.light.neutral[400]}
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
                                    <MaterialIcons name="remove" size={24} color={Colors.light.info} />
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
                                    <MaterialIcons name="add" size={24} color={Colors.light.info} />
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
                                <Text style={[styles.previewTotalValue, { color: Colors.light.success }]}>
                                    {Math.min(100, Math.max(10, formData.participants * 5 + 10))} баллов
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: Colors.light.neutral[300] }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.cancelButtonText, { color: Colors.light.neutral[600] }]}>
                                Отмена
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: Colors.light.info }]}
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
        {
            id: '1',
            name: 'Алтын Орда',
            points: 1245,
            members: 28,
            color: Colors.light.categories.conference
        },
        {
            id: '2',
            name: 'Жеті Жарғы',
            points: 1180,
            members: 25,
            color: Colors.light.info
        },
        {
            id: '3',
            name: 'Сарыарка',
            points: 1120,
            members: 30,
            color: Colors.light.success
        },
        {
            id: '4',
            name: 'Тулпар',
            points: 980,
            members: 22,
            color: Colors.light.categories.hackathon
        },
        {
            id: '5',
            name: 'Көкше',
            points: 875,
            members: 26,
            color: Colors.light.warning
        },
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
        <View style={[styles.header, { backgroundColor: Colors.light.neutral[800] }]}>
            <View style={styles.headerContent}>
                <View>
                    <Text style={styles.headerTitle}>Рейтинг Шаныраков</Text>
                    <Text style={styles.headerSubtitle}>Соревнование в реальном времени</Text>
                </View>

                {
                    Platform.OS === 'web' ? (
                        <View style={[styles.headerStats, { backgroundColor: Colors.light.neutral[700] + '40' }]}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{shanyraks.length}</Text>
                                <Text style={styles.statLabel}>Шаныраков</Text>
                            </View>
                            <View style={[styles.statDivider, { backgroundColor: Colors.light.neutral[600] + '40' }]} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {shanyraks.reduce((sum, s) => sum + s.points, 0).toLocaleString()}
                                </Text>
                                <Text style={styles.statLabel}>Всего баллов</Text>
                            </View>
                        </View>) : (<View></View>)
                }

            </View>
            <MaterialIcons
                name="leaderboard"
                size={48}
                color={Colors.light.neutral[600]}
                style={styles.headerIcon}
            />
        </View>
    );

    const tabs: { key: TabType; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
        { key: 'ranking', label: 'Рейтинг', icon: 'leaderboard' },
        { key: 'history', label: 'История', icon: 'history' },
        { key: 'achievements', label: 'Достижения', icon: 'emoji-events' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.light.neutral[800]} />

            {renderHeader()}

            <View style={[
                styles.tabBar,
                {
                    backgroundColor: Colors.light.neutral[800],
                    ...Shadows.md
                }
            ]}>
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
                            return <HistoryItem activity={item} shanyrakColor={shanyrak?.color || Colors.light.neutral[500]} />;
                        }}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <MaterialIcons name="history" size={64} color={Colors.light.neutral[300]} />
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
                style={[styles.fab, { backgroundColor: Colors.light.info }]}
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
        backgroundColor: Colors.light.background,
    },
    header: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg + 10,
        paddingBottom: Spacing.xl,
        borderBottomLeftRadius: BorderRadius.xxl,
        borderBottomRightRadius: BorderRadius.xxl,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        ...Typography.headline,
        color: Colors.light.neutral[100],
        marginBottom: Spacing.xs,
    },
    headerSubtitle: {
        ...Typography.caption,
        color: Colors.light.neutral[300],
        fontWeight: '500',
    },
    headerStats: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
    },
    statValue: {
        ...Typography.subtitle,
        color: Colors.light.neutral[100],
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 10,
        color: Colors.light.neutral[300],
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: 24,
        marginHorizontal: Spacing.sm,
    },
    headerIcon: {
        position: 'absolute',
        right: Spacing.xl,
        bottom: Spacing.lg,
        zIndex: -100
    },
    tabBar: {
        flexDirection: 'row',
        marginHorizontal: Spacing.lg,
        marginTop: -16,
        borderRadius: BorderRadius.lg,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
    },
    tabButtonActive: {},
    tabLabel: {
        ...Typography.small,
        marginLeft: Spacing.xs,
    },
    tabLabelActive: {},
    content: {
        flex: 1,
        paddingTop: Spacing.lg,
    },
    listContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 100,
    },
    rankingCard: {
        flexDirection: 'row',
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        ...Shadows.md,
    },
    positionBadge: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.lg,
        ...Shadows.sm,
        position: 'relative',
    },
    positionText: {
        color: 'white',
        ...Typography.title,
    },
    medalContainer: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.sm,
        padding: 2,
    },
    medalIcon: {},
    rankingContent: {
        flex: 1,
    },
    shanyrakName: {
        ...Typography.title,
        color: Colors.light.neutral[800],
        marginBottom: Spacing.sm,
    },
    rankingDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 6,
        color: Colors.light.neutral[600],
        fontSize: 13,
        fontWeight: '500',
    },
    pointsCircle: {
        width: 64,
        height: 64,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.sm,
    },
    pointsText: {
        color: 'white',
        ...Typography.subtitle,
        fontWeight: '800',
    },
    historyItem: {
        flexDirection: 'row',
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        ...Shadows.sm,
    },
    historyIcon: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.lg,
    },
    historyContent: {
        flex: 1,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    historyTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.light.neutral[800],
        flex: 1,
        marginRight: Spacing.md,
    },
    pointsBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
        minWidth: 50,
        alignItems: 'center',
    },
    pointsBadgeText: {
        ...Typography.small,
        fontWeight: '800',
    },
    historyDescription: {
        ...Typography.caption,
        color: Colors.light.neutral[600],
        lineHeight: 20,
        marginBottom: Spacing.sm,
    },
    historyDate: {
        fontSize: 12,
        color: Colors.light.neutral[500],
        fontWeight: '500',
    },
    achievementCard: {
        flex: 1,
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        margin: Spacing.xs,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        minHeight: 180,
        ...Shadows.sm,
    },
    achievementLocked: {
        opacity: 0.7,
    },
    achievementIcon: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
        ...Shadows.sm,
        borderWidth: 2,
    },
    achievementContent: {
        flex: 1,
    },
    achievementTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.light.neutral[800],
        marginBottom: Spacing.xs,
    },
    achievementDescription: {
        ...Typography.small,
        color: Colors.light.neutral[600],
        lineHeight: 16,
        marginBottom: Spacing.md,
        flex: 1,
    },
    progressContainer: {
        marginTop: 'auto',
    },
    progressBar: {
        height: 6,
        backgroundColor: Colors.light.neutral[200],
        borderRadius: BorderRadius.sm,
        overflow: 'hidden',
        marginBottom: Spacing.xs,
    },
    progressFill: {
        height: '100%',
        borderRadius: BorderRadius.sm,
    },
    progressText: {
        fontSize: 10,
        color: Colors.light.neutral[500],
        fontWeight: '600',
        textAlign: 'right',
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${Colors.light.warning}20`,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
        borderRadius: BorderRadius.md,
        alignSelf: 'flex-start',
        marginTop: Spacing.sm,
    },
    rewardText: {
        fontSize: 11,
        color: Colors.light.warning,
        fontWeight: '700',
        marginLeft: 4,
    },
    achievementGrid: {
        justifyContent: 'space-between',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xl * 2,
    },
    emptyStateTitle: {
        ...Typography.subtitle,
        color: Colors.light.neutral[500],
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    emptyStateText: {
        ...Typography.caption,
        color: Colors.light.neutral[400],
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
    },
    fab: {
        position: 'absolute',
        right: Spacing.lg,
        bottom: Spacing.lg,
        width: 64,
        height: 64,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.lg,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.light.cardBackground,
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        maxHeight: '90%',
        ...Shadows.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.neutral[200],
    },
    modalTitle: {
        ...Typography.title,
        color: Colors.light.neutral[800],
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        paddingHorizontal: Spacing.lg,
    },
    inputGroup: {
        marginBottom: Spacing.lg,
    },
    inputLabel: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.light.neutral[800],
        marginBottom: Spacing.md,
    },
    shanyrakPicker: {
        flexDirection: 'row',
    },
    shanyrakOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 2,
        backgroundColor: Colors.light.cardBackground,
        marginRight: Spacing.sm,
    },
    shanyrakOptionActive: {},
    shanyrakDot: {
        width: 12,
        height: 12,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.sm,
    },
    shanyrakOptionText: {
        ...Typography.small,
        fontWeight: '600',
        color: Colors.light.neutral[800],
    },
    textInput: {
        borderWidth: 2,
        borderColor: Colors.light.neutral[300],
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        ...Typography.body,
        color: Colors.light.neutral[800],
        backgroundColor: Colors.light.cardBackground,
    },
    multilineInput: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    categoryCard: {
        flex: 1,
        minWidth: (width - 72) / 2,
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: Colors.light.neutral[300],
        backgroundColor: Colors.light.cardBackground,
    },
    categoryLabel: {
        ...Typography.small,
        fontWeight: '600',
        marginTop: Spacing.sm,
    },
    participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    participantButton: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: `${Colors.light.info}10`,
        borderWidth: 2,
        borderColor: Colors.light.neutral[300],
    },
    participantInput: {
        flex: 1,
        marginHorizontal: Spacing.md,
        textAlign: 'center',
    },
    previewCard: {
        backgroundColor: Colors.light.neutral[50],
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 2,
        borderColor: Colors.light.neutral[200],
    },
    previewTitle: {
        ...Typography.subtitle,
        fontWeight: '700',
        color: Colors.light.neutral[800],
        marginBottom: Spacing.lg,
    },
    previewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    previewLabel: {
        ...Typography.caption,
        color: Colors.light.neutral[600],
    },
    previewValue: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.light.neutral[800],
    },
    previewTotal: {
        paddingTop: Spacing.md,
        borderTopWidth: 2,
        borderTopColor: Colors.light.neutral[200],
        marginTop: 4,
    },
    previewTotalLabel: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.light.neutral[800],
    },
    previewTotalValue: {
        ...Typography.subtitle,
        fontWeight: '800',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: Colors.light.neutral[200],
        gap: Spacing.md,
    },
    cancelButton: {
        flex: 1,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        alignItems: 'center',
        backgroundColor: Colors.light.cardBackground,
    },
    cancelButtonText: {
        ...Typography.body,
        fontWeight: '600',
    },
    submitButton: {
        flex: 2,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    submitButtonText: {
        ...Typography.body,
        fontWeight: '700',
        color: 'white',
    },
});