import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Image,
    Switch,
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';

type TeamMember = {
    id: string;
    name: string;
    grade: string;
    skills: string[];
    lookingFor: string[];
    online: boolean;
};

type Team = {
    id: string;
    name: string;
    description: string;
    members: number;
    maxMembers: number;
    project: string;
    skillsNeeded: string[];
    status: 'forming' | 'active' | 'closed';
};

const TeamSearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [viewMode, setViewMode] = useState<'members' | 'teams'>('members');

    const allSkills = [
        'Программирование', 'Дизайн', 'Математика', 'Английский',
        'Презентации', 'Лидерство', 'Исследования', 'Аналитика',
        'Креативность', 'Коммуникация', 'Организация', 'Экономика'
    ];

    const teamMembers: TeamMember[] = [
        {
            id: '1',
            name: 'Айгерім Нұрғали',
            grade: '11А',
            skills: ['Программирование', 'Математика', 'Английский'],
            lookingFor: ['Дизайн', 'Презентации'],
            online: true,
        },
        {
            id: '2',
            name: 'Данияр Сағындық',
            grade: '10Б',
            skills: ['Дизайн', 'Креативность', 'Презентации'],
            lookingFor: ['Программирование', 'Математика'],
            online: false,
        },
        {
            id: '3',
            name: 'Аружан Төлеген',
            grade: '11В',
            skills: ['Лидерство', 'Организация', 'Коммуникация'],
            lookingFor: ['Исследования', 'Аналитика'],
            online: true,
        },
        {
            id: '4',
            name: 'Аслан Жанғазы',
            grade: '10А',
            skills: ['Математика', 'Аналитика', 'Финансы'],
            lookingFor: ['Дизайн', 'Презентации'],
            online: true,
        },
    ];

    const teams: Team[] = [
        {
            id: '1',
            name: 'AI для школы',
            description: 'Разрабатываем систему распознавания лиц для безопасности школы',
            members: 3,
            maxMembers: 5,
            project: 'Республиканская научная ярмарка',
            skillsNeeded: ['Программирование', 'Дизайн', 'Презентации'],
            status: 'forming',
        },
        {
            id: '2',
            name: 'Эко-проект "Зеленая школа"',
            description: 'Исследование и внедрение эко-технологий в школе',
            members: 4,
            maxMembers: 6,
            project: 'Городской экологический конкурс',
            skillsNeeded: ['Исследования', 'Организация', 'Креативность'],
            status: 'active',
        },
        {
            id: '3',
            name: 'Мобильное приложение для учебы',
            description: 'Создаем образовательную платформу для школьников',
            members: 2,
            maxMembers: 4,
            project: 'Хакатон "Digital Education"',
            skillsNeeded: ['Программирование', 'Дизайн', 'Английский'],
            status: 'forming',
        },
    ];

    const toggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const filteredMembers = teamMembers.filter(member => {
        if (showOnlineOnly && !member.online) return false;
        if (searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (selectedSkills.length > 0 && !selectedSkills.some(skill => member.skills.includes(skill))) return false;
        return true;
    });

    const filteredTeams = teams.filter(team => {
        if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (selectedSkills.length > 0 && !selectedSkills.some(skill => team.skillsNeeded.includes(skill))) return false;
        return true;
    });

    const renderMemberCard = (member: TeamMember) => (
        <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberHeader}>
                <View style={styles.avatarContainer}>
                    <Ionicons name={"person"}
                              size={60} color={'#6B7280'}
                    />
                    {member.online && <View style={styles.onlineIndicator} />}
                </View>
                <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberGrade}>{member.grade}</Text>
                    <View style={styles.ratingContainer}>
                        <MaterialIcons name="star" size={16} color={Colors.light.warning} />
                    </View>
                </View>
                <TouchableOpacity style={styles.messageButton}>
                    <Feather name="message-circle" size={22} color={Colors.light.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.skillsSection}>
                <View style={styles.sectionTitleRow}>
                    <MaterialIcons name="check-circle" size={18} color={Colors.light.success} />
                    <Text style={styles.sectionTitle}>Навыки</Text>
                </View>
                <View style={styles.skillsTags}>
                    {member.skills.map((skill, index) => (
                        <View key={index} style={styles.skillTag}>
                            <Text style={styles.skillText}>{skill}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.lookingForSection}>
                <View style={styles.sectionTitleRow}>
                    <MaterialIcons name="search" size={18} color={Colors.light.primary} />
                    <Text style={styles.sectionTitle}>Ищет</Text>
                </View>
                <View style={styles.skillsTags}>
                    {member.lookingFor.map((skill, index) => (
                        <View key={index} style={styles.neededSkillTag}>
                            <Text style={styles.neededSkillText}>{skill}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <TouchableOpacity style={styles.inviteButton}>
                <Text style={styles.inviteButtonText}>Пригласить в команду</Text>
                <Feather name="user-plus" size={18} color="#FFF" />
            </TouchableOpacity>
        </View>
    );

    const renderTeamCard = (team: Team) => (
        <View key={team.id} style={styles.teamCard}>
            <View style={styles.teamHeader}>
                <View style={styles.teamTitleContainer}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <View style={[styles.statusBadge,
                        { backgroundColor: team.status === 'forming' ? Colors.light.warning + '20' :
                                team.status === 'active' ? Colors.light.success + '20' :
                                    Colors.light.neutral[200] }]}>
                        <Text style={[
                            styles.statusText,
                            { color: team.status === 'forming' ? Colors.light.warning :
                                    team.status === 'active' ? Colors.light.success :
                                        Colors.light.neutral[500] }
                        ]}>
                            {team.status === 'forming' ? 'Формируется' :
                                team.status === 'active' ? 'Активна' : 'Закрыта'}
                        </Text>
                    </View>
                </View>
                <View style={styles.membersCount}>
                    <Feather name="users" size={16} color={Colors.light.neutral[500]} />
                    <Text style={styles.membersCountText}>
                        {team.members}/{team.maxMembers}
                    </Text>
                </View>
            </View>

            <Text style={styles.teamDescription}>{team.description}</Text>

            <View style={styles.teamProject}>
                <MaterialIcons name="assignment" size={16} color={Colors.light.primary} />
                <Text style={styles.teamProjectText}>{team.project}</Text>
            </View>

            <View style={styles.skillsSection}>
                <View style={styles.sectionTitleRow}>
                    <MaterialIcons name="engineering" size={18} color={Colors.light.primary} />
                    <Text style={styles.sectionTitle}>Нужны навыки</Text>
                </View>
                <View style={styles.skillsTags}>
                    {team.skillsNeeded.map((skill, index) => (
                        <View key={index} style={styles.neededSkillTag}>
                            <Text style={styles.neededSkillText}>{skill}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.teamFooter}>
                <TouchableOpacity style={styles.viewTeamButton}>
                    <Text style={styles.viewTeamButtonText}>Подробнее</Text>
                    <Feather name="arrow-right" size={18} color={Colors.light.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Вступить</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.title}>Поиск команды</Text>
                    <Text style={styles.subtitle}>
                        Найдите идеальных партнеров для ваших проектов
                    </Text>
                </View>

                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color={Colors.light.neutral[500]} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Поиск по имени или проекту..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={Colors.light.neutral[400]}
                    />
                </View>

                <View style={styles.filterSection}>
                    <View style={styles.viewModeToggle}>
                        <TouchableOpacity
                            style={[styles.viewModeButton, viewMode === 'members' && styles.viewModeActive]}
                            onPress={() => setViewMode('members')}
                        >
                            <Text style={[
                                styles.viewModeText,
                                viewMode === 'members' && styles.viewModeTextActive
                            ]}>
                                Участники
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.viewModeButton, viewMode === 'teams' && styles.viewModeActive]}
                            onPress={() => setViewMode('teams')}
                        >
                            <Text style={[
                                styles.viewModeText,
                                viewMode === 'teams' && styles.viewModeTextActive
                            ]}>
                                Команды
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.filterRow}>
                        <View style={styles.filterItem}>
                            <Ionicons name="radio-button-on" size={18} color={Colors.light.success} />
                            <Text style={styles.filterLabel}>Только онлайн</Text>
                            <Switch
                                value={showOnlineOnly}
                                onValueChange={setShowOnlineOnly}
                                trackColor={{ false: Colors.light.neutral[200], true: Colors.light.primary }}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.skillsSection}>
                    <Text style={styles.skillsTitle}>Фильтр по навыкам</Text>
                    <View style={styles.skillsGrid}>
                        {allSkills.map((skill, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.skillFilterTag,
                                    selectedSkills.includes(skill) && styles.skillFilterTagActive
                                ]}
                                onPress={() => toggleSkill(skill)}
                            >
                                <Text style={[
                                    styles.skillFilterText,
                                    selectedSkills.includes(skill) && styles.skillFilterTextActive
                                ]}>
                                    {skill}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {viewMode === 'members' ? (
                    <View style={styles.resultsSection}>
                        <Text style={styles.resultsTitle}>
                            Найдено участников: {filteredMembers.length}
                        </Text>
                        {filteredMembers.map(renderMemberCard)}
                    </View>
                ) : (
                    <View style={styles.resultsSection}>
                        <Text style={styles.resultsTitle}>
                            Найдено команд: {filteredTeams.length}
                        </Text>
                        {filteredTeams.map(renderTeamCard)}
                    </View>
                )}

                <View style={styles.createTeamCard}>
                    <FontAwesome5 name="users" size={32} color={Colors.light.primary} />
                    <View style={styles.createTeamContent}>
                        <Text style={styles.createTeamTitle}>Не нашли подходящую команду?</Text>
                        <Text style={styles.createTeamDescription}>
                            Создайте свою собственную команду и пригласите участников
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.createTeamButton}>
                        <Text style={styles.createTeamButtonText}>Создать команду</Text>
                        <Feather name="plus" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    header: {
        paddingVertical: Spacing.lg,
    },
    title: {
        fontSize: Typography.headline.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.headline.fontWeight,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[500],
        lineHeight: Typography.body.lineHeight,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        marginBottom: Spacing.lg,
        ...Shadows.sm,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[900],
        paddingVertical: Spacing.sm,
    },
    filterSection: {
        marginBottom: Spacing.lg,
    },
    viewModeToggle: {
        flexDirection: 'row',
        backgroundColor: Colors.light.neutral[100],
        borderRadius: BorderRadius.md,
        padding: Spacing.xs,
        marginBottom: Spacing.md,
    },
    viewModeButton: {
        flex: 1,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        borderRadius: BorderRadius.sm,
    },
    viewModeActive: {
        backgroundColor: Colors.light.background,
        ...Shadows.sm,
    },
    viewModeText: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[500],
        fontWeight: Typography.subtitle.fontWeight,
    },
    viewModeTextActive: {
        color: Colors.light.primary,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    filterLabel: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[600],
        marginRight: Spacing.sm,
    },
    skillsSection: {
        marginBottom: Spacing.lg,
    },
    skillsTitle: {
        fontSize: Typography.subtitle.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.subtitle.fontWeight,
        marginBottom: Spacing.md,
    },
    skillsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    skillFilterTag: {
        backgroundColor: Colors.light.neutral[100],
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
    },
    skillFilterTagActive: {
        backgroundColor: Colors.light.primary + '20',
        borderColor: Colors.light.primary,
    },
    skillFilterText: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[600],
    },
    skillFilterTextActive: {
        color: Colors.light.primary,
        fontWeight: Typography.subtitle.fontWeight,
    },
    resultsSection: {
        marginBottom: Spacing.xl,
    },
    resultsTitle: {
        fontSize: Typography.subtitle.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.subtitle.fontWeight,
        marginBottom: Spacing.md,
    },
    memberCard: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        ...Shadows.sm,
    },
    memberHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: Spacing.md,
    },
    avatar: {
        width: 60,
        height: 60
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Colors.light.success,
        borderWidth: 2,
        borderColor: Colors.light.background,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.subtitle.fontWeight,
        marginBottom: Spacing.xs,
    },
    memberGrade: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[500],
        marginBottom: Spacing.xs,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[600],
        marginLeft: Spacing.xs,
        fontWeight: Typography.subtitle.fontWeight,
    },
    messageButton: {
        padding: Spacing.sm,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.neutral[600],
        fontWeight: Typography.subtitle.fontWeight,
        marginLeft: Spacing.xs,
    },
    skillsTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    skillTag: {
        backgroundColor: Colors.light.success + '20',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.light.success + '40',
    },
    skillText: {
        fontSize: Typography.small.fontSize,
        color: Colors.light.success,
        fontWeight: Typography.subtitle.fontWeight,
    },
    lookingForSection: {
        marginBottom: Spacing.md,
    },
    neededSkillTag: {
        backgroundColor: Colors.light.primary + '20',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.light.primary + '40',
    },
    neededSkillText: {
        fontSize: Typography.small.fontSize,
        color: Colors.light.primary,
        fontWeight: Typography.subtitle.fontWeight,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
    },
    inviteButtonText: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.background,
        fontWeight: Typography.subtitle.fontWeight,
    },
    teamCard: {
        backgroundColor: Colors.light.cardBackground,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.light.cardBorder,
        ...Shadows.sm,
    },
    teamHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    teamTitleContainer: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    teamName: {
        fontSize: Typography.title.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.title.fontWeight,
        marginBottom: Spacing.xs,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
    },
    statusText: {
        fontSize: Typography.small.fontSize,
        fontWeight: Typography.subtitle.fontWeight,
    },
    membersCount: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.neutral[100],
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
    },
    membersCountText: {
        fontSize: Typography.small.fontSize,
        color: Colors.light.neutral[600],
        marginLeft: Spacing.xs,
        fontWeight: Typography.subtitle.fontWeight,
    },
    teamDescription: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[600],
        lineHeight: Typography.body.lineHeight,
        marginBottom: Spacing.md,
    },
    teamProject: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    teamProjectText: {
        fontSize: Typography.caption.fontSize,
        color: Colors.light.primary,
        fontWeight: Typography.subtitle.fontWeight,
        marginLeft: Spacing.xs,
    },
    teamFooter: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    viewTeamButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.background,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.light.primary,
        gap: Spacing.sm,
    },
    viewTeamButtonText: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.primary,
        fontWeight: Typography.subtitle.fontWeight,
    },
    joinButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
    },
    joinButtonText: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.background,
        fontWeight: Typography.subtitle.fontWeight,
    },
    createTeamCard: {
        backgroundColor: Colors.light.primary + '10',
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.light.primary + '20',
        borderStyle: 'dashed',
        marginBottom: Spacing.xl,
    },
    createTeamContent: {
        alignItems: 'center',
        marginVertical: Spacing.md,
    },
    createTeamTitle: {
        fontSize: Typography.title.fontSize,
        color: Colors.light.neutral[900],
        fontWeight: Typography.title.fontWeight,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    createTeamDescription: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.neutral[500],
        textAlign: 'center',
        lineHeight: Typography.body.lineHeight,
    },
    createTeamButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
        ...Shadows.sm,
    },
    createTeamButtonText: {
        fontSize: Typography.body.fontSize,
        color: Colors.light.background,
        fontWeight: Typography.subtitle.fontWeight,
    },
});

export default TeamSearchScreen;