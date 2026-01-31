import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    SafeAreaView,
} from 'react-native';
import { Colors, Fonts, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

// ========== TYPES ==========
interface SystemGoal {
    id: string;
    title: string;
    description: string;
    category: 'study' | 'sport' | 'social' | 'creative';
    points: number;
    isCompleted: boolean;
}

interface UserGoal {
    id: string;
    title: string;
    isCompleted: boolean;
    createdAt: string;
}

type GoalTab = 'system' | 'personal';
type CategoryFilter = 'all' | 'study' | 'sport' | 'social' | 'creative';

// ========== COMPONENT PROPS ==========
interface GoalCardProps {
    goal: SystemGoal;
    onComplete: (id: string) => void;
}

interface PersonalGoalCardProps {
    goal: UserGoal;
    onToggle: (id: string) => void;
}

interface CategoryChipProps {
    category: CategoryFilter;
    isActive: boolean;
    onPress: () => void;
}

interface AddGoalModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (title: string) => void;
}

// ========== MOCK DATA ==========
const initialSystemGoals: SystemGoal[] = [
    {
        id: '1',
        title: 'Выиграть школьную олимпиаду по математике',
        description: 'Участие и победа в общешкольном соревновании',
        category: 'study',
        points: 50,
        isCompleted: false,
    },
    {
        id: '2',
        title: 'Организовать спортивный турнир',
        description: 'Планирование и проведение соревнований между классами',
        category: 'sport',
        points: 40,
        isCompleted: false,
    },
    {
        id: '3',
        title: 'Провести субботник в школьном парке',
        description: 'Организация уборки и озеленения территории',
        category: 'social',
        points: 30,
        isCompleted: true,
    },
    {
        id: '4',
        title: 'Создать стенгазету к празднику',
        description: 'Дизайн и оформление тематической газеты',
        category: 'creative',
        points: 25,
        isCompleted: false,
    },
    {
        id: '5',
        title: 'Помочь 5 младшим классам с домашкой',
        description: 'Регулярная помощь в учёбе',
        category: 'study',
        points: 35,
        isCompleted: false,
    },
];

// ========== COMPONENTS ==========
const GoalCard: React.FC<GoalCardProps> = ({ goal, onComplete }) => {
    type CategoryConfig = {
        [key in SystemGoal['category']]: {
            icon: keyof typeof MaterialIcons.glyphMap;
            color: string;
        };
    };

    const categoryConfig: CategoryConfig = {
        study: {
            icon: 'school',
            color: Colors.light.categories.competition
        },
        sport: {
            icon: 'sports',
            color: Colors.light.categories.olympiad
        },
        social: {
            icon: 'people',
            color: Colors.light.categories.conference
        },
        creative: {
            icon: 'palette',
            color: Colors.light.categories.project
        },
    };

    const config = categoryConfig[goal.category];

    return (
        <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: `${config.color}20` }]}>
                    <MaterialIcons name={config.icon} size={16} color={config.color} />
                    <Text style={[styles.categoryText, { color: config.color }]}>
                        {goal.category === 'study' ? 'Учёба' :
                            goal.category === 'sport' ? 'Спорт' :
                                goal.category === 'social' ? 'Социальное' : 'Творчество'}
                    </Text>
                </View>
                {goal.isCompleted ? (
                    <View style={styles.completedBadge}>
                        <MaterialIcons name="check-circle" size={20} color={Colors.light.success} />
                        <Text style={styles.completedText}>Выполнено</Text>
                    </View>
                ) : (
                    <View style={styles.pointsBadge}>
                        <Text style={styles.pointsText}>+{goal.points}</Text>
                        <Text style={styles.pointsLabel}>баллов</Text>
                    </View>
                )}
            </View>

            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>

            {!goal.isCompleted && (
                <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => onComplete(goal.id)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.completeButtonText}>Отметить выполненным</Text>
                    <MaterialIcons name="check" size={20} color={Colors.light.background} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const PersonalGoalCard: React.FC<PersonalGoalCardProps> = ({ goal, onToggle }) => {
    return (
        <View style={styles.personalGoalCard}>
            <TouchableOpacity
                style={styles.checkbox}
                onPress={() => onToggle(goal.id)}
                activeOpacity={0.7}
            >
                <View style={[styles.checkboxInner, goal.isCompleted && styles.checkboxChecked]}>
                    {goal.isCompleted && (
                        <MaterialIcons name="check" size={16} color={Colors.light.background} />
                    )}
                </View>
            </TouchableOpacity>

            <View style={styles.personalGoalContent}>
                <Text style={[
                    styles.personalGoalTitle,
                    goal.isCompleted && styles.personalGoalTitleCompleted
                ]}>
                    {goal.title}
                </Text>
                <Text style={styles.personalGoalDate}>
                    {new Date(goal.createdAt).toLocaleDateString('ru-RU')}
                </Text>
            </View>

            {goal.isCompleted && (
                <MaterialIcons name="verified" size={20} color={Colors.light.success} />
            )}
        </View>
    );
};

const CategoryChip: React.FC<CategoryChipProps> = ({ category, isActive, onPress }) => {
    const categoryLabels = {
        all: 'Все',
        study: 'Учёба',
        sport: 'Спорт',
        social: 'Социальное',
        creative: 'Творчество',
    };

    const categoryColors = {
        all: Colors.light.categories.all,
        study: Colors.light.categories.competition,
        sport: Colors.light.categories.olympiad,
        social: Colors.light.categories.conference,
        creative: Colors.light.categories.project,
    };

    return (
        <TouchableOpacity
            style={[
                styles.categoryChip,
                isActive && [
                    styles.categoryChipActive,
                    { backgroundColor: categoryColors[category], borderColor: categoryColors[category] }
                ]
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                {categoryLabels[category]}
            </Text>
        </TouchableOpacity>
    );
};

const AddGoalModal: React.FC<AddGoalModalProps> = ({ visible, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = () => {
        if (title.trim().length < 3) {
            Alert.alert('Ошибка', 'Введите название цели (минимум 3 символа)');
            return;
        }
        onSubmit(title);
        setTitle('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Новая личная цель</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={24} color={Colors.light.neutral[600]} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.modalInput}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Например: Прочитать книгу за неделю"
                        placeholderTextColor={Colors.light.neutral[400]}
                        autoFocus
                        maxLength={100}
                    />

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                            <Text style={styles.modalCancelButtonText}>Отмена</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalSubmitButton} onPress={handleSubmit}>
                            <Text style={styles.modalSubmitButtonText}>Добавить цель</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// ========== MAIN COMPONENT ==========
export default function Goals() {
    const [activeTab, setActiveTab] = useState<GoalTab>('system');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [systemGoals, setSystemGoals] = useState<SystemGoal[]>(initialSystemGoals);
    const [userGoals, setUserGoals] = useState<UserGoal[]>([
        { id: '1', title: 'Пробежать 5 км без остановки', isCompleted: true, createdAt: '2024-01-20' },
        { id: '2', title: 'Выучить 50 новых английских слов', isCompleted: false, createdAt: '2024-01-22' },
    ]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const stats = useMemo(() => {
        const completedSystemGoals = systemGoals.filter(g => g.isCompleted);
        const completedUserGoals = userGoals.filter(g => g.isCompleted);

        const totalSystemPoints = completedSystemGoals.reduce((sum, goal) => sum + goal.points, 0);

        const multiplierThreshold = 3;
        const multiplierIncrement = 0.1;
        const multiplierLevels = Math.floor(completedUserGoals.length / multiplierThreshold);
        const currentMultiplier = 1 + (multiplierLevels * multiplierIncrement);

        const effectivePoints = Math.floor(totalSystemPoints * currentMultiplier);

        return {
            totalSystemPoints,
            completedSystemGoals: completedSystemGoals.length,
            completedUserGoals: completedUserGoals.length,
            currentMultiplier,
            effectivePoints,
            multiplierProgress: completedUserGoals.length % multiplierThreshold,
            multiplierThreshold,
        };
    }, [systemGoals, userGoals]);

    const filteredSystemGoals = useMemo(() => {
        if (categoryFilter === 'all') return systemGoals;
        return systemGoals.filter(goal => goal.category === categoryFilter);
    }, [systemGoals, categoryFilter]);

    const handleCompleteSystemGoal = useCallback((goalId: string) => {
        setSystemGoals(prev => prev.map(goal =>
            goal.id === goalId ? { ...goal, isCompleted: true } : goal
        ));

        const goal = systemGoals.find(g => g.id === goalId);
        if (goal) {
            Alert.alert(
                'Цель выполнена!',
                `Шанырак получил +${goal.points} баллов${stats.currentMultiplier > 1 ? ` ×${stats.currentMultiplier.toFixed(1)}` : ''}`,
                [{ text: 'Отлично' }]
            );
        }
    }, [systemGoals, stats.currentMultiplier]);

    const handleToggleUserGoal = useCallback((goalId: string) => {
        setUserGoals(prev => prev.map(goal =>
            goal.id === goalId ? { ...goal, isCompleted: !goal.isCompleted } : goal
        ));
    }, []);

    const handleAddUserGoal = useCallback((title: string) => {
        const newGoal: UserGoal = {
            id: Date.now().toString(),
            title,
            isCompleted: false,
            createdAt: new Date().toISOString(),
        };
        setUserGoals(prev => [newGoal, ...prev]);
    }, []);

    const categories: CategoryFilter[] = ['all', 'study', 'sport', 'social', 'creative'];

    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Цели</Text>
                <Text style={styles.headerSubtitle}>
                    Ваш вклад: +{stats.effectivePoints} баллов за неделю
                    {stats.currentMultiplier > 1 && (
                        <Text style={styles.multiplierText}> (×{stats.currentMultiplier.toFixed(1)})</Text>
                    )}
                </Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.completedSystemGoals}</Text>
                    <Text style={styles.statLabel}>системных</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.completedUserGoals}</Text>
                    <Text style={styles.statLabel}>личных</Text>
                </View>
            </View>
        </View>
    );

    const renderTabBar = () => (
        <View style={styles.tabBar}>
            <TouchableOpacity
                style={[styles.tabButton, activeTab === 'system' && styles.tabButtonActive]}
                onPress={() => setActiveTab('system')}
            >
                <MaterialIcons
                    name="flag"
                    size={20}
                    color={activeTab === 'system' ? Colors.light.primary : Colors.light.neutral[500]}
                />
                <Text style={[styles.tabLabel, activeTab === 'system' && styles.tabLabelActive]}>
                    Системные цели
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tabButton, activeTab === 'personal' && styles.tabButtonActive]}
                onPress={() => setActiveTab('personal')}
            >
                <MaterialIcons
                    name="person"
                    size={20}
                    color={activeTab === 'personal' ? Colors.light.primary : Colors.light.neutral[500]}
                />
                <Text style={[styles.tabLabel, activeTab === 'personal' && styles.tabLabelActive]}>
                    Мои цели
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderMultiplierInfo = () => {
        if (activeTab !== 'personal') return null;

        return (
            <View style={styles.multiplierCard}>
                <View style={styles.multiplierHeader}>
                    <MaterialIcons name="bolt" size={20} color={Colors.light.warning} />
                    <Text style={styles.multiplierTitle}>Бонус шанырака</Text>
                </View>
                <Text style={styles.multiplierDescription}>
                    Каждые {stats.multiplierThreshold} выполненные личные цели увеличивают
                    бонус шанырака на 10%
                </Text>
                <View style={styles.multiplierProgress}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${(stats.multiplierProgress / stats.multiplierThreshold) * 100}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {stats.multiplierProgress}/{stats.multiplierThreshold} до следующего уровня
                    </Text>
                </View>
                <Text style={styles.currentMultiplier}>
                    Текущий множитель: ×{stats.currentMultiplier.toFixed(1)}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {renderHeader()}
                {renderTabBar()}

                {activeTab === 'system' ? (
                    <>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesScroll}
                            contentContainerStyle={styles.categoriesContent}
                        >
                            {categories.map(category => (
                                <CategoryChip
                                    key={category}
                                    category={category}
                                    isActive={categoryFilter === category}
                                    onPress={() => setCategoryFilter(category)}
                                />
                            ))}
                        </ScrollView>

                        <View style={styles.goalsList}>
                            {filteredSystemGoals.map(goal => (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    onComplete={handleCompleteSystemGoal}
                                />
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        {renderMultiplierInfo()}

                        <View style={styles.personalGoalsList}>
                            {userGoals.length > 0 ? (
                                userGoals.map(goal => (
                                    <PersonalGoalCard
                                        key={goal.id}
                                        goal={goal}
                                        onToggle={handleToggleUserGoal}
                                    />
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <MaterialIcons name="inbox" size={64} color={Colors.light.neutral[300]} />
                                    <Text style={styles.emptyStateTitle}>Нет личных целей</Text>
                                    <Text style={styles.emptyStateText}>
                                        Добавьте первую цель и начните прокачивать множитель шанырака
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>

            {activeTab === 'personal' && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setIsAddModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="add" size={28} color={Colors.light.background} />
                </TouchableOpacity>
            )}

            <AddGoalModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onSubmit={handleAddUserGoal}
            />
        </SafeAreaView>
    );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: Fonts.sans,
        fontWeight: '800',
        color: Colors.light.neutral[800],
        marginBottom: Spacing.xs,
    },
    headerSubtitle: {
        fontSize: 16,
        fontFamily: Fonts.sans,
        fontWeight: '400',
        color: Colors.light.neutral[600],
    },
    multiplierText: {
        color: Colors.light.warning,
        fontFamily: Fonts.sans,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginTop: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        ...Shadows.sm,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontFamily: Fonts.sans,
        fontWeight: '700',
        color: Colors.light.neutral[800],
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        fontFamily: Fonts.sans,
        fontWeight: '400',
        color: Colors.light.neutral[500],
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: Colors.light.cardBorder,
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.cardBorder,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        marginHorizontal: Spacing.xs,
    },
    tabButtonActive: {
        backgroundColor: `${Colors.light.primary}15`,
    },
    tabLabel: {
        fontSize: 14,
        fontFamily: Fonts.sans,
        fontWeight: '600',
        color: Colors.light.neutral[500],
        marginLeft: Spacing.sm,
    },
    tabLabelActive: {
        color: Colors.light.primary,
    },
    categoriesScroll: {
        marginTop: Spacing.md,
    },
    categoriesContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
    categoryChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.light.cardBackground,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        marginRight: Spacing.sm,
        ...Shadows.sm,
    },
    categoryChipActive: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    categoryChipText: {
        fontSize: 14,
        fontFamily: Fonts.sans,
        fontWeight: '500',
        color: Colors.light.neutral[600],
    },
    categoryChipTextActive: {
        color: Colors.light.background,
    },
    goalsList: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 100,
    },
    goalCard: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        ...Shadows.sm,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    categoryText: {
        fontSize: 12,
        fontFamily: Fonts.sans,
        fontWeight: '600',
        marginLeft: Spacing.xs,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completedText: {
        fontSize: 12,
        fontFamily: Fonts.sans,
        fontWeight: '600',
        color: Colors.light.success,
        marginLeft: Spacing.xs,
    },
    pointsBadge: {
        alignItems: 'center',
        backgroundColor: `${Colors.light.primary}15`,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.md,
    },
    pointsText: {
        fontSize: 14,
        fontFamily: Fonts.sans,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    pointsLabel: {
        fontSize: 10,
        fontFamily: Fonts.sans,
        fontWeight: '400',
        color: Colors.light.neutral[500],
    },
    goalTitle: {
        fontSize: 18,
        fontFamily: Fonts.sans,
        fontWeight: '600',
        color: Colors.light.neutral[800],
        marginBottom: Spacing.sm,
        lineHeight: 24,
    },
    goalDescription: {
        fontSize: 14,
        fontFamily: Fonts.sans,
        fontWeight: '400',
        color: Colors.light.neutral[600],
        lineHeight: 20,
        marginBottom: Spacing.lg,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.primary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
    },
    completeButtonText: {
        fontSize: 16,
        fontFamily: Fonts.sans,
        fontWeight: '600',
        color: Colors.light.background,
        marginRight: Spacing.sm,
    },
    multiplierCard: {
        backgroundColor: `${Colors.light.warning}10`,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: `${Colors.light.warning}30`,
        ...Shadows.sm,
    },
    multiplierHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    multiplierTitle: {
        fontSize: 18,
        fontFamily: Fonts.sans,
        fontWeight: '600',
        color: Colors.light.neutral[800],
        marginLeft: Spacing.sm,
    },
    multiplierDescription: {
        fontSize: 14,
        fontFamily: Fonts.sans,
        fontWeight: '400',
        color: Colors.light.neutral[600],
        lineHeight: 20,
        marginBottom: Spacing.lg,
    },
    multiplierProgress: {
        marginBottom: Spacing.md,
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
        backgroundColor: Colors.light.warning,
        borderRadius: BorderRadius.sm,
    },
    progressText: {
        fontSize: 12,
        fontFamily: Fonts.sans,
        fontWeight: '500',
        color: Colors.light.neutral[500],
    },
    currentMultiplier: {
        fontSize: 16,
        fontFamily: Fonts.sans,
        fontWeight: '700',
        color: Colors.light.warning,
    },
    personalGoalsList: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 100,
    },
    personalGoalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        ...Shadows.sm,
    },
    checkbox: {
        marginRight: Spacing.md,
    },
    checkboxInner: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.light.neutral[400],
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    personalGoalContent: {
        flex: 1,
    },
    personalGoalTitle: {
        fontSize: 16,
        fontFamily: Fonts.sans,
        fontWeight: '600',
        color: Colors.light.neutral[800],
        marginBottom: Spacing.xs,
    },
    personalGoalTitleCompleted: {
        color: Colors.light.neutral[500],
        textDecorationLine: 'line-through',
    },
    personalGoalDate: {
        fontSize: 12,
        fontFamily: Fonts.sans,
        fontWeight: '400',
        color: Colors.light.neutral[500],
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontFamily: Fonts.sans,
        fontWeight: '600',
        color: Colors.light.neutral[500],
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    emptyStateText: {
        fontSize: 14,
        fontFamily: Fonts.sans,
        fontWeight: '400',
        color: Colors.light.neutral[400],
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: Spacing.xl,
    },
    fab: {
        position: 'absolute',
        right: Spacing.lg,
        bottom: Spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.lg,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.light.background,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        paddingTop: Spacing.xl,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
        ...Shadows.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: Fonts.sans,
        fontWeight: '700',
        color: Colors.light.neutral[800],
    },
    modalInput: {
        backgroundColor: Colors.light.cardBackground,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: 16,
        fontFamily: Fonts.sans,
        fontWeight: '400',
        color: Colors.light.neutral[800],
        marginBottom: Spacing.xl,
        minHeight: 56,
    },
    modalFooter: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    modalCancelButton: {
        flex: 1,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        alignItems: 'center',
    },
    modalCancelButtonText: {
        fontSize: 16,
        fontFamily: Fonts.sans,
        fontWeight: '600',
        color: Colors.light.neutral[600],
    },
    modalSubmitButton: {
        flex: 2,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
    },
    modalSubmitButtonText: {
        fontSize: 16,
        fontFamily: Fonts.sans,
        fontWeight: '700',
        color: Colors.light.background,
    },
});