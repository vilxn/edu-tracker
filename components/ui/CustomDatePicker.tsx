import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DatePickerProps {
    value: Date;
    onChange: (event: any, date?: Date) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    locale?: string;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
                                                         value,
                                                         onChange,
                                                         minimumDate = new Date(2000, 0, 1),
                                                         maximumDate = new Date(2100, 11, 31),
                                                         locale = 'ru-RU',
                                                     }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentDate, setCurrentDate] = useState(value);

    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const isDateDisabled = (date: Date) => {
        return date < minimumDate || date > maximumDate;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
        return date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear();
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push(date);
        }

        // Дополняем последнюю неделю пустыми ячейками
        const totalCells = days.length;
        const remainingCells = 7 - (totalCells % 7);

        if (remainingCells < 7) {
            for (let i = 0; i < remainingCells; i++) {
                days.push(null);
            }
        }

        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return (
            <View style={styles.calendarContainer}>
                <View style={styles.weekDaysRow}>
                    {weekDays.map((day, index) => (
                        <Text key={index} style={styles.weekDayText}>
                            {day}
                        </Text>
                    ))}
                </View>

                {weeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.weekRow}>
                        {week.map((date, dayIndex) => {
                            if (!date) {
                                return <View key={`empty-${weekIndex}-${dayIndex}`} style={styles.emptyDayCell} />;
                            }

                            const disabled = isDateDisabled(date);
                            const today = isToday(date);
                            const selected = isSelected(date);

                            return (
                                <TouchableOpacity
                                    key={date.toISOString()}
                                    style={[
                                        styles.dayCell,
                                        selected && styles.selectedDay,
                                        today && !selected && styles.todayDay,
                                    ]}
                                    disabled={disabled}
                                    onPress={() => {
                                        setCurrentDate(date);
                                        onChange({ type: 'set' }, date);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.dayText,
                                        selected && styles.selectedDayText,
                                        today && !selected && styles.todayDayText,
                                        disabled && styles.disabledDayText,
                                    ]}>
                                        {date.getDate()}
                                    </Text>
                                    {today && !selected && <View style={styles.todayIndicator} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>
        );
    };

    const changeMonth = (increment: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + increment);

        if (newDate >= minimumDate && newDate <= maximumDate) {
            setCurrentDate(newDate);
        }
    };

    const changeYear = (increment: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(newDate.getFullYear() + increment);

        if (newDate >= minimumDate && newDate <= maximumDate) {
            setCurrentDate(newDate);
        }
    };

    const years = [];
    const startYear = minimumDate.getFullYear();
    const endYear = maximumDate.getFullYear();

    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }

    return (
        <>
            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="calendar" size={20} color="#6366F1" />
                <Text style={styles.dateText}>
                    {value.toLocaleDateString(locale, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalContent}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => changeYear(-1)}>
                                    <Ionicons name="chevron-back" size={24} color="#6366F1" />
                                </TouchableOpacity>

                                <View style={styles.monthYearContainer}>
                                    <Text style={styles.monthText}>
                                        {months[currentDate.getMonth()]}
                                    </Text>
                                    <Text style={styles.yearText}>
                                        {currentDate.getFullYear()}
                                    </Text>
                                </View>

                                <TouchableOpacity onPress={() => changeYear(1)}>
                                    <Ionicons name="chevron-forward" size={24} color="#6366F1" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.subHeader}>
                                <TouchableOpacity onPress={() => changeMonth(-1)}>
                                    <Ionicons name="chevron-back" size={20} color="#666" />
                                </TouchableOpacity>

                                <Text style={styles.currentMonthYear}>
                                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </Text>

                                <TouchableOpacity onPress={() => changeMonth(1)}>
                                    <Ionicons name="chevron-forward" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {renderCalendar()}

                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={styles.todayButton}
                                    onPress={() => {
                                        const today = new Date();
                                        if (!isDateDisabled(today)) {
                                            setCurrentDate(today);
                                            onChange({ type: 'set' }, today);
                                            setModalVisible(false);
                                        }
                                    }}
                                >
                                    <Text style={styles.todayButtonText}>Сегодня</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Отмена</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={() => {
                                        onChange({ type: 'set' }, currentDate);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.confirmButtonText}>Выбрать</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    dateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 12,
        marginRight: 12,
        marginBottom: 12
    },
    dateText: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        marginHorizontal: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: 350,
        maxHeight: 600,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthYearContainer: {
        alignItems: 'center',
    },
    monthText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    yearText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    currentMonthYear: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    yearSelector: {
        maxHeight: 200,
        marginBottom: 20,
    },
    yearList: {
        padding: 10,
    },
    yearItem: {
        flex: 1,
        margin: 4,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    selectedYear: {
        backgroundColor: '#6366F1',
    },
    yearTextItem: {
        fontSize: 14,
        color: '#374151',
    },
    selectedYearText: {
        color: '#FFF',
        fontWeight: '600',
    },
    calendarContainer: {
        marginBottom: 20,
    },
    weekDaysRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    dayCell: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        margin: 2,
    },
    emptyDayCell: {
        flex: 1,
        height: 40, // Такая же высота как у обычных ячеек
        margin: 2,
        minWidth: 0,
    },
    dayText: {
        fontSize: 14,
        color: '#1F2937',
    },
    selectedDay: {
        backgroundColor: '#6366F1',
    },
    selectedDayText: {
        color: '#FFF',
        fontWeight: '600',
    },
    todayDay: {
        backgroundColor: '#E0E7FF',
    },
    todayDayText: {
        color: '#4F46E5',
        fontWeight: '600',
    },
    todayIndicator: {
        position: 'absolute',
        bottom: 2,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#4F46E5',
    },
    disabledDayText: {
        color: '#9CA3AF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 16,
    },
    todayButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    todayButtonText: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '600',
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    cancelButtonText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    confirmButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#6366F1',
    },
    confirmButtonText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
    },
});

export default CustomDatePicker;