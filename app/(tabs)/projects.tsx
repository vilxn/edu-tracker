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
    Alert,
} from 'react-native';
import {
    Ionicons,
    MaterialIcons,
    Feather,
    MaterialCommunityIcons,
} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import CustomDatePicker from "@/components/ui/CustomDatePicker";

const { width } = Dimensions.get('window');

enum EventStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

enum LocationType {
    AUDITORIUM = 'auditorium',
    GYM = 'gym',
    ATRIUM = 'atrium',
    CLASSROOM = 'classroom',
    LIBRARY = 'library',
    SPORTS_FIELD = 'sports_field',
}

interface Event {
    id: string;
    title: string;
    description: string;
    location: LocationType;
    date: Date;
    startTime: string;
    endTime: string;
    organizer: string;
    status: EventStatus;
    participants: number;
    needsEquipment: boolean;
    createdBy: string;
    createdAt: Date;
    adminNotes?: string;
}

interface TimeSlot {
    time: string;
    available: boolean;
    event?: Event;
}

interface Location {
    id: LocationType;
    name: string;
    capacity: number;
    icon: string;
    color: string;
    description: string;
}

const EventManagementScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedLocation, setSelectedLocation] = useState<LocationType>(LocationType.AUDITORIUM);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [timePickerMode, setTimePickerMode] = useState<'start' | 'end'>('start');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const [userRole, setUserRole] = useState<'student' | 'admin'>('student');

    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        location: LocationType.AUDITORIUM,
        date: new Date(),
        startTime: '14:00',
        endTime: '15:30',
        participants: 20,
        needsEquipment: false,
    });

    const locations: Location[] = [
        {
            id: LocationType.AUDITORIUM,
            name: 'Актовый зал',
            capacity: 200,
            icon: 'theater',
            color: '#6366F1',
            description: 'Большой зал для мероприятий',
        },
        {
            id: LocationType.GYM,
            name: 'Спортзал',
            capacity: 100,
            icon: 'basketball',
            color: '#10B981',
            description: 'Спортивный зал',
        },
        {
            id: LocationType.ATRIUM,
            name: 'Атриум',
            capacity: 150,
            icon: 'nature-people',
            color: '#F59E0B',
            description: 'Центральное пространство школы',
        },
        {
            id: LocationType.CLASSROOM,
            name: 'Класс 301',
            capacity: 30,
            icon: 'school',
            color: '#3B82F6',
            description: 'Учебный класс',
        },
        {
            id: LocationType.LIBRARY,
            name: 'Библиотека',
            capacity: 50,
            icon: 'library',
            color: '#8B5CF6',
            description: 'Читальный зал',
        },
        {
            id: LocationType.SPORTS_FIELD,
            name: 'Спортплощадка',
            capacity: 80,
            icon: 'soccer-field',
            color: '#EC4899',
            description: 'Уличная спортивная площадка',
        },
    ];

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
    ];

    const [events, setEvents] = useState<Event[]>([
        {
            id: '1',
            title: 'Концерт ко Дню учителя',
            description: 'Ежегодный праздничный концерт',
            location: LocationType.AUDITORIUM,
            date: new Date('2024-10-05'),
            startTime: '15:00',
            endTime: '17:00',
            organizer: 'Ученический совет',
            status: EventStatus.APPROVED,
            participants: 180,
            needsEquipment: true,
            createdBy: 'Иван Петров',
            createdAt: new Date('2024-09-20'),
        },
        {
            id: '2',
            title: 'Баскетбольный турнир',
            description: 'Межклассовые соревнования',
            location: LocationType.GYM,
            date: new Date('2024-10-12'),
            startTime: '14:00',
            endTime: '16:30',
            organizer: 'Спортивный клуб',
            status: EventStatus.PENDING,
            participants: 40,
            needsEquipment: false,
            createdBy: 'Алексей Сидоров',
            createdAt: new Date('2024-09-25'),
        },
        {
            id: '3',
            title: 'Научная ярмарка',
            description: 'Выставка научных проектов',
            location: LocationType.ATRIUM,
            date: new Date('2024-10-08'),
            startTime: '10:00',
            endTime: '14:00',
            organizer: 'Научное общество',
            status: EventStatus.APPROVED,
            participants: 120,
            needsEquipment: true,
            createdBy: 'Мария Иванова',
            createdAt: new Date('2024-09-22'),
        },
        {
            id: '4',
            title: 'Собрание литературного клуба',
            description: 'Обсуждение новых произведений',
            location: LocationType.LIBRARY,
            date: new Date('2024-10-03'),
            startTime: '16:00',
            endTime: '17:30',
            organizer: 'Литературный клуб',
            status: EventStatus.APPROVED,
            participants: 25,
            needsEquipment: false,
            createdBy: 'Ольга Козлова',
            createdAt: new Date('2024-09-28'),
        },
        {
            id: '5',
            title: 'Родительское собрание',
            description: 'Собрание для родителей 10-х классов',
            location: LocationType.CLASSROOM,
            date: new Date('2024-10-10'),
            startTime: '18:00',
            endTime: '20:00',
            organizer: 'Администрация',
            status: EventStatus.APPROVED,
            participants: 60,
            needsEquipment: true,
            createdBy: 'Директор школы',
            createdAt: new Date('2024-09-15'),
            adminNotes: 'Приоритетное мероприятие',
        },
    ]);

    const [blockedDates, setBlockedDates] = useState<Date[]>([
        new Date('2024-10-01'),
        new Date('2024-10-15'),
        new Date('2024-10-20'),
    ]);

    const getStatusColor = (status: EventStatus) => {
        switch (status) {
            case EventStatus.APPROVED: return '#10B981';
            case EventStatus.PENDING: return '#F59E0B';
            case EventStatus.REJECTED: return '#EF4444';
            case EventStatus.DRAFT: return '#6B7280';
            case EventStatus.CANCELLED: return '#9CA3AF';
        }
    };

    const getStatusText = (status: EventStatus) => {
        switch (status) {
            case EventStatus.APPROVED: return 'Утверждено';
            case EventStatus.PENDING: return 'На рассмотрении';
            case EventStatus.REJECTED: return 'Отклонено';
            case EventStatus.DRAFT: return 'Черновик';
            case EventStatus.CANCELLED: return 'Отменено';
        }
    };

    const getTimeSlotsForLocation = () => {
        const locationEvents = events.filter(event =>
            event.location === selectedLocation &&
            event.date.toDateString() === selectedDate.toDateString()
        );

        return timeSlots.map(time => {
            const conflictingEvent = locationEvents.find(event =>
                event.startTime <= time && event.endTime > time
            );

            const isBlocked = blockedDates.some(date =>
                date.toDateString() === selectedDate.toDateString()
            );

            return {
                time,
                available: !conflictingEvent && !isBlocked,
                event: conflictingEvent,
            };
        });
    };

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleTimeChange = (event: any, time?: Date) => {
        setShowTimePicker(false);
        if (time) {
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;

            if (timePickerMode === 'start') {
                setNewEvent({ ...newEvent, startTime: timeString });
            } else {
                setNewEvent({ ...newEvent, endTime: timeString });
            }
        }
    };

    const handleCreateEvent = () => {
        if (!newEvent.title.trim() || !newEvent.description.trim()) {
            Alert.alert('Ошибка', 'Заполните все обязательные поля');
            return;
        }

        const newEventObj: Event = {
            id: Date.now().toString(),
            title: newEvent.title,
            description: newEvent.description,
            location: newEvent.location,
            date: newEvent.date,
            startTime: newEvent.startTime,
            endTime: newEvent.endTime,
            organizer: 'Вы',
            status: EventStatus.PENDING,
            participants: newEvent.participants,
            needsEquipment: newEvent.needsEquipment,
            createdBy: 'Текущий пользователь',
            createdAt: new Date(),
        };

        setEvents([...events, newEventObj]);
        setNewEvent({
            title: '',
            description: '',
            location: LocationType.AUDITORIUM,
            date: new Date(),
            startTime: '14:00',
            endTime: '15:30',
            participants: 20,
            needsEquipment: false,
        });
        setIsCreatingEvent(false);
        Alert.alert('Успешно', 'Заявка на мероприятие отправлена на рассмотрение');
    };

    const handleApproveEvent = (eventId: string) => {
        setEvents(events.map(event =>
            event.id === eventId ? { ...event, status: EventStatus.APPROVED } : event
        ));
        Alert.alert('Утверждено', 'Мероприятие утверждено');
    };

    const handleRejectEvent = (eventId: string) => {
        setEvents(events.map(event =>
            event.id === eventId ? { ...event, status: EventStatus.REJECTED } : event
        ));
        Alert.alert('Отклонено', 'Мероприятие отклонено');
    };

    const handleBlockDate = () => {
        const newBlockedDate = new Date(selectedDate);
        setBlockedDates([...blockedDates, newBlockedDate]);
        Alert.alert('Дата заблокирована', 'Локации на эту дату недоступны для бронирования');
    };

    const handleUnblockDate = () => {
        const updatedDates = blockedDates.filter(date =>
            date.toDateString() !== selectedDate.toDateString()
        );
        setBlockedDates(updatedDates);
        Alert.alert('Дата разблокирована', 'Локации на эту дату снова доступны');
    };

    const renderTimeSlot = ({ item }: { item: TimeSlot }) => {
        const location = locations.find(l => l.id === selectedLocation);
        return (
            <TouchableOpacity
                style={[
                    styles.timeSlot,
                    !item.available && styles.timeSlotBooked,
                ]}
                disabled={!item.available}
                onPress={() => {
                    setNewEvent({
                        ...newEvent,
                        startTime: item.time,
                        endTime: timeSlots[timeSlots.indexOf(item.time) + 2] || item.time,
                    });
                    setIsCreatingEvent(true);
                }}
            >
                <Text style={[
                    styles.timeSlotText,
                    !item.available && styles.timeSlotTextBooked,
                ]}>
                    {item.time}
                </Text>
                {item.event && (
                    <View style={styles.eventIndicator}>
                        <MaterialIcons name="event" size={12} color="#FFF" />
                    </View>
                )}
                {!item.available && !item.event && (
                    <View style={styles.blockedIndicator}>
                        <MaterialIcons name="block" size={12} color="#FFF" />
                    </View>
                )}
                {item.available && (
                    <View style={styles.availableIndicator}>
                        <MaterialIcons name="check-circle" size={12} color="#10B981" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderEventCard = ({ item }: { item: Event }) => {
        const location = locations.find(l => l.id === item.location);
        return (
            <TouchableOpacity
                style={styles.eventCard}
                onPress={() => {
                    setSelectedEvent(item);
                    setModalVisible(true);
                }}
            >
                <View style={styles.eventHeader}>
                    <View style={[styles.eventIconContainer, { backgroundColor: location?.color + '20' }]}>
                        <MaterialCommunityIcons name={location?.icon as any} size={20} color={location?.color} />
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {getStatusText(item.status)}
                        </Text>
                    </View>
                </View>

                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDescription} numberOfLines={2}>{item.description}</Text>

                <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                        <Ionicons name="location-outline" size={14} color="#666" />
                        <Text style={styles.eventDetailText}>{location?.name}</Text>
                    </View>
                    <View style={styles.eventDetail}>
                        <Ionicons name="calendar-outline" size={14} color="#666" />
                        <Text style={styles.eventDetailText}>
                            {item.date.toLocaleDateString('ru-RU')} {item.startTime}-{item.endTime}
                        </Text>
                    </View>
                    <View style={styles.eventDetail}>
                        <Ionicons name="people-outline" size={14} color="#666" />
                        <Text style={styles.eventDetailText}>{item.participants} чел.</Text>
                    </View>
                </View>

                {userRole === 'admin' && item.status === EventStatus.PENDING && (
                    <View style={styles.adminActions}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                            onPress={() => handleApproveEvent(item.id)}
                        >
                            <Ionicons name="checkmark" size={16} color="#FFF" />
                            <Text style={styles.actionButtonText}>Утвердить</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                            onPress={() => handleRejectEvent(item.id)}
                        >
                            <Ionicons name="close" size={16} color="#FFF" />
                            <Text style={styles.actionButtonText}>Отклонить</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderLocation = ({ item }: { item: Location }) => (
        <TouchableOpacity
            style={[
                styles.locationCard,
                selectedLocation === item.id && { borderColor: item.color, borderWidth: 2 },
            ]}
            onPress={() => setSelectedLocation(item.id)}
        >
            <View style={[styles.locationIconContainer, { backgroundColor: item.color + '20' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={styles.locationName}>{item.name}</Text>
            <View style={styles.locationCapacity}>
                <Ionicons name="people" size={12} color="#666" />
                <Text style={styles.capacityText}>{item.capacity}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Управление мероприятиями</Text>
                        <Text style={styles.subtitle}>Планируй и организуй школьные события</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.roleSwitch}
                        onPress={() => setUserRole(userRole === 'student' ? 'admin' : 'student')}
                    >
                        <Text style={styles.roleText}>
                            {userRole === 'student' ? 'Ученик' : 'Администратор'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.availabilitySection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Карта занятости</Text>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={() => setIsCreatingEvent(true)}
                        >
                            <Ionicons name="add" size={20} color="#FFF" />
                            <Text style={styles.createButtonText}>Создать заявку</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dateSelector}>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar" size={20} color="#6366F1" />
                            <Text style={styles.dateText}>
                                {selectedDate.toLocaleDateString('ru-RU', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short'
                                })}
                            </Text>
                            <Feather name="chevron-down" size={16} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <CustomDatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                        maximumDate={new Date(new Date().getFullYear() + 1, 11, 31)}
                        />

                    <View style={styles.locationsContainer}>
                        <FlatList
                            data={locations}
                            renderItem={renderLocation}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.locationsList}
                        />
                    </View>

                    <View style={styles.timeSlotsContainer}>
                        <Text style={styles.timeSlotsTitle}>Доступное время:</Text>
                        <FlatList
                            data={getTimeSlotsForLocation()}
                            renderItem={renderTimeSlot}
                            keyExtractor={item => item.time}
                            numColumns={3}
                            scrollEnabled={false}
                            contentContainerStyle={styles.timeSlotsGrid}
                        />
                    </View>

                    {blockedDates.some(date => date.toDateString() === selectedDate.toDateString()) && (
                        <View style={styles.blockedWarning}>
                            <MaterialIcons name="warning" size={20} color="#F59E0B" />
                            <Text style={styles.blockedText}>
                                {userRole === 'admin'
                                    ? 'Вы заблокировали эту дату для школьных нужд'
                                    : 'Эта дата заблокирована администрацией'}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.eventsSection}>

                    {events.filter(e => e.createdBy === 'Текущий пользователь').length === 0 ? (
                        <View style={styles.emptyState}>
                            <MaterialIcons name="event-note" size={48} color="#9CA3AF" />
                            <Text style={styles.emptyStateText}>У вас нет заявок</Text>
                            <Text style={styles.emptyStateSubtext}>Создайте первую заявку на мероприятие</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={events.filter(e => e.createdBy === 'Текущий пользователь')}
                            renderItem={renderEventCard}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            contentContainerStyle={styles.eventsList}
                        />
                    )}
                </View>

                {userRole === 'admin' && (
                    <View style={styles.adminSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Заявки на рассмотрении</Text>
                            <View style={styles.pendingCount}>
                                <Text style={styles.pendingCountText}>
                                    {events.filter(e => e.status === EventStatus.PENDING).length}
                                </Text>
                            </View>
                        </View>

                        {events.filter(e => e.status === EventStatus.PENDING).length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="checkmark-done-circle" size={48} color="#10B981" />
                                <Text style={styles.emptyStateText}>Все заявки обработаны</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={events.filter(e => e.status === EventStatus.PENDING)}
                                renderItem={renderEventCard}
                                keyExtractor={item => item.id}
                                scrollEnabled={false}
                                contentContainerStyle={styles.eventsList}
                            />
                        )}
                    </View>
                )}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isCreatingEvent}
                onRequestClose={() => setIsCreatingEvent(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Новая заявка на мероприятие</Text>
                            <TouchableOpacity onPress={() => setIsCreatingEvent(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Название мероприятия *</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={newEvent.title}
                                    onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                                    placeholder="Введите название"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Описание *</Text>
                                <TextInput
                                    style={[styles.formInput, styles.textArea]}
                                    value={newEvent.description}
                                    onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                                    placeholder="Опишите мероприятие"
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Локация</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={newEvent.location}
                                        onValueChange={(value) => setNewEvent({ ...newEvent, location: value })}
                                        style={styles.picker}
                                    >
                                        {locations.map(location => (
                                            <Picker.Item
                                                key={location.id}
                                                label={`${location.name} (до ${location.capacity} чел.)`}
                                                value={location.id}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.formRow}>
                                <View style={[styles.formGroup, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>Дата</Text>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Text style={styles.timeButtonText}>
                                            {newEvent.date.toLocaleDateString('ru-RU')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.formGroup, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>Время начала</Text>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => {
                                            setTimePickerMode('start');
                                            setShowTimePicker(true);
                                        }}
                                    >
                                        <Text style={styles.timeButtonText}>{newEvent.startTime}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.formGroup, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>Время окончания</Text>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => {
                                            setTimePickerMode('end');
                                            setShowTimePicker(true);
                                        }}
                                    >
                                        <Text style={styles.timeButtonText}>{newEvent.endTime}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Количество участников</Text>
                                <View style={styles.participantsContainer}>
                                    <TouchableOpacity
                                        style={styles.participantButton}
                                        onPress={() => setNewEvent({
                                            ...newEvent,
                                            participants: Math.max(1, newEvent.participants - 5)
                                        })}
                                    >
                                        <Ionicons name="remove" size={20} color="#666" />
                                    </TouchableOpacity>
                                    <Text style={styles.participantCount}>{newEvent.participants}</Text>
                                    <TouchableOpacity
                                        style={styles.participantButton}
                                        onPress={() => setNewEvent({
                                            ...newEvent,
                                            participants: newEvent.participants + 5
                                        })}
                                    >
                                        <Ionicons name="add" size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => setNewEvent({ ...newEvent, needsEquipment: !newEvent.needsEquipment })}
                                >
                                    <View style={[
                                        styles.checkbox,
                                        newEvent.needsEquipment && { backgroundColor: '#6366F1' }
                                    ]}>
                                        {newEvent.needsEquipment && (
                                            <Ionicons name="checkmark" size={16} color="#FFF" />
                                        )}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Требуется дополнительное оборудование</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsCreatingEvent(false)}
                            >
                                <Text style={styles.cancelButtonText}>Отмена</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleCreateEvent}
                            >
                                <Text style={styles.submitButtonText}>Отправить на согласование</Text>
                                <Feather name="send" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.detailModalOverlay}>
                    <View style={styles.detailModalContent}>
                        {selectedEvent && (
                            <>
                                <View style={styles.detailModalHeader}>
                                    <View style={styles.eventDetailHeader}>
                                        <View style={[styles.detailIconContainer, {
                                            backgroundColor: locations.find(l => l.id === selectedEvent.location)?.color + '20'
                                        }]}>
                                            <MaterialCommunityIcons
                                                name={locations.find(l => l.id === selectedEvent.location)?.icon as any}
                                                size={24}
                                                color={locations.find(l => l.id === selectedEvent.location)?.color}
                                            />
                                        </View>
                                        <Text style={styles.detailEventTitle}>{selectedEvent.title}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Ionicons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView style={styles.detailModalBody}>
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>Статус</Text>
                                        <View style={[
                                            styles.detailStatusBadge,
                                            { backgroundColor: getStatusColor(selectedEvent.status) + '20' }
                                        ]}>
                                            <Text style={[
                                                styles.detailStatusText,
                                                { color: getStatusColor(selectedEvent.status) }
                                            ]}>
                                                {getStatusText(selectedEvent.status)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>Описание</Text>
                                        <Text style={styles.detailText}>{selectedEvent.description}</Text>
                                    </View>

                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>Детали</Text>
                                        <View style={styles.detailRow}>
                                            <Ionicons name="location-outline" size={18} color="#666" />
                                            <Text style={styles.detailLabel}>Локация:</Text>
                                            <Text style={styles.detailValue}>
                                                {locations.find(l => l.id === selectedEvent.location)?.name}
                                            </Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Ionicons name="calendar-outline" size={18} color="#666" />
                                            <Text style={styles.detailLabel}>Дата:</Text>
                                            <Text style={styles.detailValue}>
                                                {selectedEvent.date.toLocaleDateString('ru-RU')}
                                            </Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Ionicons name="time-outline" size={18} color="#666" />
                                            <Text style={styles.detailLabel}>Время:</Text>
                                            <Text style={styles.detailValue}>
                                                {selectedEvent.startTime} - {selectedEvent.endTime}
                                            </Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Ionicons name="people-outline" size={18} color="#666" />
                                            <Text style={styles.detailLabel}>Участники:</Text>
                                            <Text style={styles.detailValue}>{selectedEvent.participants} чел.</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Ionicons name="person-outline" size={18} color="#666" />
                                            <Text style={styles.detailLabel}>Организатор:</Text>
                                            <Text style={styles.detailValue}>{selectedEvent.organizer}</Text>
                                        </View>
                                        {selectedEvent.needsEquipment && (
                                            <View style={styles.detailRow}>
                                                <MaterialIcons name="devices" size={18} color="#666" />
                                                <Text style={styles.detailLabel}>Оборудование:</Text>
                                                <Text style={styles.detailValue}>Требуется</Text>
                                            </View>
                                        )}
                                    </View>

                                    {selectedEvent.adminNotes && (
                                        <View style={styles.detailSection}>
                                            <Text style={styles.detailSectionTitle}>Заметки администрации</Text>
                                            <Text style={styles.detailText}>{selectedEvent.adminNotes}</Text>
                                        </View>
                                    )}
                                </ScrollView>

                                <View style={styles.detailModalFooter}>
                                    <TouchableOpacity
                                        style={styles.closeDetailButton}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.closeDetailButtonText}>Закрыть</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {showTimePicker && (
                <DateTimePicker
                    value={new Date(`2000-01-01T${timePickerMode === 'start' ? newEvent.startTime : newEvent.endTime}:00`)}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
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
        paddingTop: 10,
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
    roleSwitch: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#6366F1',
        borderRadius: 20,
    },
    roleText: {
        fontSize: 12,
        color: '#FFF',
        fontWeight: '600',
    },
    availabilitySection: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6366F1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 12,
        marginRight: 12,
    },
    dateText: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        marginHorizontal: 8,
    },
    blockButton: {
        width: 44,
        height: 44,
        backgroundColor: '#EF4444',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationsContainer: {
        marginBottom: 20,
    },
    locationsList: {
        paddingRight: 20,
    },
    locationCard: {
        alignItems: 'center',
        padding: 12,
        marginRight: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        minWidth: 100,
    },
    locationIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 4,
    },
    locationCapacity: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    capacityText: {
        fontSize: 10,
        color: '#666',
        marginLeft: 2,
    },
    timeSlotsContainer: {
        marginBottom: 16,
    },
    timeSlotsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    timeSlotsGrid: {
        flexGrow: 1,
    },
    timeSlot: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        margin: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    timeSlotBooked: {
        backgroundColor: '#FEE2E2',
        borderColor: '#FCA5A5',
    },
    timeSlotText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
    },
    timeSlotTextBooked: {
        color: '#DC2626',
    },
    eventIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#3B82F6',
        borderRadius: 6,
        padding: 2,
    },
    blockedIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#EF4444',
        borderRadius: 6,
        padding: 2,
    },
    availableIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    blockedWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    blockedText: {
        flex: 1,
        fontSize: 14,
        color: '#92400E',
        marginLeft: 8,
    },
    eventsSection: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 5,
    },
    seeAll: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
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
    eventsList: {
        paddingTop: 8,
    },
    eventCard: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    eventIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 6,
    },
    eventDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
        lineHeight: 18,
    },
    eventDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    eventDetail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventDetailText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    adminActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    actionButtonText: {
        fontSize: 12,
        color: '#FFF',
        fontWeight: '600',
    },
    adminSection: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginBottom: 30,
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 5,
    },
    pendingCount: {
        backgroundColor: '#F59E0B20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    pendingCountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#92400E',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
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
        fontWeight: '700',
        color: '#1F2937',
    },
    modalBody: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 16,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    formInput: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    formRow: {
        flexDirection: 'row',
        gap: 12,
    },
    timeButton: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    timeButtonText: {
        fontSize: 14,
        color: '#1F2937',
    },
    pickerContainer: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    participantButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    participantCount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        minWidth: 40,
        textAlign: 'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#374151',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    submitButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#6366F1',
        gap: 8,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    detailModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    detailModalContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        maxHeight: '80%',
    },
    detailModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    eventDetailHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailEventTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    detailModalBody: {
        padding: 20,
        maxHeight: 400,
    },
    detailSection: {
        marginBottom: 24,
    },
    detailSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    detailStatusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    detailStatusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    detailText: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 16,
        color: '#6B7280',
        marginLeft: 12,
        marginRight: 8,
        width: 100,
    },
    detailValue: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
        flex: 1,
    },
    detailModalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    closeDetailButton: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    closeDetailButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
});

export default EventManagementScreen;