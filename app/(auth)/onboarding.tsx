import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    Alert
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import {Link, router} from "expo-router";

export default function OnboardingScreen() {
    const [step, setStep] = useState(1);
    const [interests, setInterests] = useState([]);
    const [grade, setGrade] = useState('');
    const [leadership, setLeadership] = useState(null);
    const [clubType, setClubType] = useState(null);
    const [availability, setAvailability] = useState([]);

    const interestOptions = [
        { id: 1, name: 'Спорт', icon: '⚽', color: '#4CAF50', iconName: 'sports-soccer' },
        { id: 2, name: 'Искусство', icon: '🎨', color: '#9C27B0', iconName: 'palette' },
        { id: 3, name: 'Наука', icon: '🔬', color: '#2196F3', iconName: 'science' },
        { id: 4, name: 'Музыка', icon: '🎵', color: '#FF9800', iconName: 'music-note' },
        { id: 5, name: 'Технологии', icon: '💻', color: '#607D8B', iconName: 'computer' },
        { id: 6, name: 'Волонтерство', icon: '🤝', color: '#E91E63', iconName: 'handshake' },
        { id: 7, name: 'Дебаты', icon: '🗣️', color: '#3F51B5', iconName: 'forum' },
        { id: 8, name: 'Журналистика', icon: '📰', color: '#795548', iconName: 'article' },
    ];

    const leadershipOptions = [
        { id: 1, level: 'Начинающий', icon: '🌱', desc: 'Мало опыта, хочу научиться' },
        { id: 2, level: 'Опытный', icon: '🌿', desc: 'Был помощником лидера' },
        { id: 3, level: 'Лидер', icon: '🌳', desc: 'Руководил командами' },
    ];

    const clubTypeOptions = [
        { id: 1, type: 'Академические', iconName: 'school' },
        { id: 2, type: 'Творческие', iconName: 'brush' },
        { id: 3, type: 'Спортивные', iconName: 'soccer' },
        { id: 4, type: 'Социальные', iconName: 'account-group' },
    ];

    const availabilityOptions = [
        { id: 1, day: 'Понедельник', icon: '📅' },
        { id: 2, day: 'Вторник', icon: '📅' },
        { id: 3, day: 'Среда', icon: '📅' },
        { id: 4, day: 'Четверг', icon: '📅' },
        { id: 5, day: 'Пятница', icon: '📅' },
        { id: 6, day: 'Суббота', icon: '📅' },
    ];

    const toggleInterest = (id) => {
        if (interests.includes(id)) {
            setInterests(interests.filter(item => item !== id));
        } else {
            setInterests([...interests, id]);
        }
    };

    const toggleAvailability = (id : number) => {
        if (availability.includes(id)) {
            setAvailability(availability.filter(item => item !== id));
        } else {
            setAvailability([...availability, id]);
        }
    };

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = () => {
        const userProfile = {
            interests,
            grade,
            leadership,
            clubType,
            availability
        };
        console.log('User profile:', userProfile);
        Alert.alert('Профиль создан!', 'Теперь ты можешь пользоваться всеми функциями платформы');
        // Здесь будет навигация на главный экран
    };

    const renderStepIndicator = () => {
        return (
            <View style={styles.stepIndicator}>
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} style={styles.stepContainer}>
                        <View style={[
                            styles.stepCircle,
                            { backgroundColor: step >= item ? '#007AFF' : '#E0E0E0' }
                        ]}>
                            <Text style={styles.stepText}>{item}</Text>
                        </View>
                        {item < 5 && <View style={[
                            styles.stepLine,
                            { backgroundColor: step > item ? '#007AFF' : '#E0E0E0' }
                        ]} />}
                    </View>
                ))}
            </View>
        );
    };

    const renderStepContent = () => {
        switch(step) {
            case 1:
                // @ts-ignore
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.questionHeader}>
                            <MaterialIcons name="emoji-events" size={40} color="#FFD700" />
                            <Text style={styles.questionTitle}>Давайте познакомимся!</Text>
                            <Text style={styles.questionSubtitle}>Расскажите о своих интересах</Text>
                        </View>

                        <Text style={styles.questionText}>
                            Какие сферы деятельности вас интересуют? (можно выбрать несколько)
                        </Text>

                        <View style={styles.optionsGrid}>
                            {interestOptions.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.interestCard,
                                        {
                                            backgroundColor: interests.includes(item.id) ? item.color + '20' : '#F5F5F5',
                                            borderColor: interests.includes(item.id) ? item.color : '#E0E0E0'
                                        }
                                    ]}
                                    onPress={() => toggleInterest(item.id)}
                                >
                                    <View style={styles.interestIconContainer}>
                                        <MaterialIcons
                                            name={item.iconName}
                                            size={28}
                                            color={interests.includes(item.id) ? item.color : '#666'}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.interestText,
                                        { color: interests.includes(item.id) ? item.color : '#333' }
                                    ]}>
                                        {item.name}
                                    </Text>
                                    {interests.includes(item.id) && (
                                        <Ionicons name="checkmark-circle" size={20} color={item.color} style={styles.checkIcon} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );

            case 2:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.questionHeader}>
                            <FontAwesome5 name="user-graduate" size={40} color="#4CAF50" />
                            <Text style={styles.questionTitle}>Общая информация</Text>
                            <Text style={styles.questionSubtitle}>Расскажите о вашем классе</Text>
                        </View>

                        <Text style={styles.questionText}>
                            В каком вы классе?
                        </Text>

                        <View style={styles.gradeInputContainer}>
                            <MaterialIcons name="class" size={24} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.gradeInput}
                                placeholder="Например: 10Б или 9А"
                                value={grade}
                                onChangeText={setGrade}
                                keyboardType="default"
                                maxLength={10}
                            />
                        </View>

                        <View style={styles.tipContainer}>
                            <MaterialIcons name="lightbulb" size={20} color="#FF9800" />
                            <Text style={styles.tipText}>
                                Эта информация поможет подобрать подходящие мероприятия для вашего возраста
                            </Text>
                        </View>
                    </View>
                );

            case 3:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.questionHeader}>
                            <FontAwesome5 name="crown" size={40} color="#FF9800" />
                            <Text style={styles.questionTitle}>Лидерский опыт</Text>
                            <Text style={styles.questionSubtitle}>Расскажите о вашем опыте руководства</Text>
                        </View>

                        <Text style={styles.questionText}>
                            Какой у вас опыт лидерской деятельности?
                        </Text>

                        <View style={styles.leadershipContainer}>
                            {leadershipOptions.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.leadershipCard,
                                        leadership === item.id && styles.leadershipCardSelected
                                    ]}
                                    onPress={() => setLeadership(item.id)}
                                >
                                    <Text style={styles.leadershipIcon}>{item.icon}</Text>
                                    <Text style={styles.leadershipLevel}>{item.level}</Text>
                                    <Text style={styles.leadershipDesc}>{item.desc}</Text>
                                    {leadership === item.id && (
                                        <View style={styles.selectedIndicator}>
                                            <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );

            case 4:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.questionHeader}>
                            <MaterialCommunityIcons name="account-group" size={40} color="#9C27B0" />
                            <Text style={styles.questionTitle}>Клубные предпочтения</Text>
                            <Text style={styles.questionSubtitle}>Какие кружки вам интересны?</Text>
                        </View>

                        <Text style={styles.questionText}>
                            Какие типы школьных клубов вас привлекают?
                        </Text>

                        <View style={styles.clubContainer}>
                            {clubTypeOptions.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.clubCard,
                                        clubType === item.id && styles.clubCardSelected
                                    ]}
                                    onPress={() => setClubType(item.id)}
                                >
                                    <View style={styles.clubIconContainer}>
                                        <MaterialCommunityIcons
                                            name={item.iconName}
                                            size={32}
                                            color={clubType === item.id ? '#9C27B0' : '#666'}
                                        />
                                    </View>
                                    <Text style={styles.clubTypeText}>{item.type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );

            case 5:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.questionHeader}>
                            <Ionicons name="time" size={40} color="#2196F3" />
                            <Text style={styles.questionTitle}>Доступность</Text>
                            <Text style={styles.questionSubtitle}>Когда вы свободны?</Text>
                        </View>

                        <Text style={styles.questionText}>
                            В какие дни вы готовы участвовать в школьных активностях?
                        </Text>

                        <View style={styles.availabilityContainer}>
                            {availabilityOptions.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.availabilityCard,
                                        availability.includes(item.id) && styles.availabilityCardSelected
                                    ]}
                                    onPress={() => toggleAvailability(item.id)}
                                >
                                    <Text style={styles.availabilityIcon}>{item.icon}</Text>
                                    <Text style={styles.availabilityDay}>{item.day}</Text>
                                    {availability.includes(item.id) && (
                                        <View style={styles.availabilityCheck}>
                                            <Ionicons name="checkmark" size={16} color="#FFF" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.summaryContainer}>
                            <Text style={styles.summaryTitle}>Ваш профиль готов!</Text>
                            <View style={styles.summaryItem}>
                                <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                                <Text style={styles.summaryText}>
                                    Интересы: {interests.length} выбрано
                                </Text>
                            </View>
                            {grade && (
                                <View style={styles.summaryItem}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                                    <Text style={styles.summaryText}>Класс: {grade}</Text>
                                </View>
                            )}
                            {leadership && (
                                <View style={styles.summaryItem}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                                    <Text style={styles.summaryText}>
                                        Опыт: {leadershipOptions.find(l => l.id === leadership)?.level}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderStepIndicator()}

                {renderStepContent()}
            </ScrollView>

            <View style={styles.footer}>
                {step > 1 && (
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={20} color="#666" />
                        <Text style={styles.backButtonText}>Назад</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        (step === 1 && interests.length === 0) ||
                        (step === 2 && !grade.trim()) ||
                        (step === 3 && leadership === null) ||
                        (step === 4 && clubType === null)
                            ? styles.nextButtonDisabled : null
                    ]}
                    onPress={handleNext}
                    disabled={
                        (step === 1 && interests.length === 0) ||
                        (step === 2 && !grade.trim()) ||
                        (step === 3 && leadership === null) ||
                        (step === 4 && clubType === null)
                    }
                >

                    {step === 5 ? (
                      <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => router.replace('/(tabs)/')}
                      >
                          <Text style={styles.nextButtonText}>Завершить</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                      >
                          <Text style={styles.nextButtonText}>Далее</Text>
                      </TouchableOpacity>
                    )}

                    {step < 5 && <Ionicons name="arrow-forward" size={20} color="#FFF" />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    stepLine: {
        width: 40,
        height: 3,
        marginHorizontal: 5,
    },
    stepContent: {
        flex: 1,
    },
    questionHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    questionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        textAlign: 'center',
    },
    questionSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
        textAlign: 'center',
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 25,
        textAlign: 'center',
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    interestCard: {
        width: '48%',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 2,
        alignItems: 'center',
        position: 'relative',
    },
    interestIconContainer: {
        marginBottom: 10,
    },
    interestText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    checkIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    gradeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
    },
    inputIcon: {
        marginRight: 10,
    },
    gradeInput: {
        flex: 1,
        fontSize: 18,
        color: '#333',
    },
    tipContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF3E0',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    tipText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#666',
    },
    leadershipContainer: {
        gap: 15,
    },
    leadershipCard: {
        backgroundColor: '#F5F5F5',
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        position: 'relative',
    },
    leadershipCardSelected: {
        backgroundColor: '#E3F2FD',
        borderColor: '#2196F3',
    },
    leadershipIcon: {
        fontSize: 40,
        marginBottom: 10,
    },
    leadershipLevel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    leadershipDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    clubContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    clubCard: {
        width: '48%',
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    clubCardSelected: {
        backgroundColor: '#F3E5F5',
        borderColor: '#9C27B0',
    },
    clubIconContainer: {
        marginBottom: 10,
    },
    clubTypeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    clubIcon: {
        fontSize: 24,
    },
    availabilityContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    availabilityCard: {
        width: '31%',
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        position: 'relative',
    },
    availabilityCardSelected: {
        backgroundColor: '#E3F2FD',
        borderColor: '#2196F3',
    },
    availabilityIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    availabilityDay: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    availabilityCheck: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryContainer: {
        backgroundColor: '#F8F9FA',
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    summaryText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#666',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#FFF',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    backButtonText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#666',
    },
    nextButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        flex: 1,
        marginLeft: 20,
        justifyContent: 'center',
    },
    nextButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 10,
    },
});