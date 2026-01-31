import { useState, useRef, useEffect } from 'react';
import { Link, router } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const rotationAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.timing(rotationAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            rotationAnim.setValue(0);
        }
    }, [isLoading]);

    const spin = rotationAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('Ошибка', 'Пожалуйста, введите корректный email');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    const handleForgotPassword = () => {
        Alert.alert('Восстановление пароля', 'На вашу почту будет отправлена ссылка для сброса пароля', [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Отправить', onPress: () => {
                    Alert.alert('Успешно', 'Письмо отправлено на ' + email);
                }}
        ]);
    };

    const handleLoginWithGoogle = () => {
        Alert.alert('Google вход', 'Вход через Google в разработке');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>SchoolUnity</Text>
                    <Text style={styles.subtitle}>Вход в аккаунт</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email или логин</Text>
                        <View style={[
                            styles.inputWrapper,
                            emailFocused && styles.inputWrapperFocused
                        ]}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={emailFocused ? '#007AFF' : '#666'}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="school@edu.kz"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                                showSoftInputOnFocus={true}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Пароль</Text>
                        <View style={[
                            styles.inputWrapper,
                            passwordFocused && styles.inputWrapperFocused
                        ]}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={passwordFocused ? '#007AFF' : '#666'}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Введите пароль"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoComplete="password"
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={passwordFocused ? '#007AFF' : '#666'}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={handleForgotPassword}
                            style={styles.forgotPasswordButton}
                        >
                            <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                    <Ionicons name="sync" size={20} color="white" />
                                </Animated.View>
                                <Text style={styles.loginButtonText}>Вход...</Text>
                            </View>
                        ) : (
                            <Text style={styles.loginButtonText}>Войти</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>или войти через</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleLoginWithGoogle}
                    >
                        <Ionicons name="logo-google" size={20} color="#666" />
                        <Text style={styles.googleButtonText}>Продолжить с Google</Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Нет аккаунта? </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.registerLink}>Зарегистрироваться</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    <Link href="/" asChild>
                        <TouchableOpacity style={styles.backButton}>
                            <Ionicons name="arrow-back" size={16} color="#007AFF" />
                            <Text style={styles.backButtonText}>Назад на главную</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 12,
    },
    inputWrapperFocused: {
        borderColor: '#007AFF',
        backgroundColor: '#fff',
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        borderWidth: 0,
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
    },
    eyeButton: {
        padding: 8,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    loginButtonDisabled: {
        backgroundColor: '#66a3ff',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#eee',
    },
    dividerText: {
        paddingHorizontal: 12,
        color: '#999',
        fontSize: 14,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingVertical: 14,
        marginBottom: 24,
    },
    googleButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    registerText: {
        fontSize: 14,
        color: '#666',
    },
    registerLink: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    backButtonText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#007AFF',
    },
});