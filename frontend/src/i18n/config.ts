import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // Common
            welcome: 'Welcome',
            email: 'Email',
            password: 'Password',
            login: 'Sign In',
            logout: 'Logout',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            edit: 'Edit',

            // Login Page
            welcomeBack: 'Welcome Back',
            emailAddress: 'Email Address',
            enterEmail: 'name@coachverse.com',
            enterPassword: '••••••••',
            forgotPassword: 'Forgot?',
            loginFailed: 'Login Failed',
            otherPortals: 'Other Portals',
            dontHaveAccount: "Don't have an account?",
            createNow: 'Create Now',
            enterPortal: 'Enter Portal',

            // Roles
            superAdminPortal: 'Super Admin Portal',
            instituteAdmin: 'Institute Admin',
            teacherLogin: 'Teacher Login',
            studentPortal: 'Student Portal',
            parentLogin: 'Parent Login',

            // Role Descriptions
            platformMasterAccess: 'Platform master access',
            manageYourAcademy: 'Manage your academy',
            coachDashboardAccess: 'Coach dashboard access',
            accessYourLearning: 'Access your learning journey',
            stayUpdatedOnProgress: 'Stay updated on progress',

            // Dashboard
            dashboard: 'Dashboard',
            home: 'Home',
            messages: 'Messages',
            announcements: 'Announcements',
            profile: 'Profile',
            settings: 'Settings',

            // Settings
            appearance: 'Appearance',
            language: 'Language',
            theme: 'Theme',
            lightMode: 'Light Mode',
            darkMode: 'Dark Mode',
            systemMode: 'Use System Theme',

            // Notifications
            notifications: 'Notifications',
            changesSaved: 'Changes saved successfully',
        }
    },
    hi: {
        translation: {
            // Common
            welcome: 'स्वागत है',
            email: 'ईमेल',
            password: 'पासवर्ड',
            login: 'साइन इन करें',
            logout: 'लॉग आउट',
            loading: 'लोड हो रहा है...',
            error: 'त्रुटि',
            success: 'सफलता',
            cancel: 'रद्द करें',
            save: 'सहेजें',
            delete: 'हटाएं',
            edit: 'संपादित करें',

            // Login Page
            welcomeBack: 'वापसी पर स्वागत है',
            emailAddress: 'ईमेल पता',
            enterEmail: 'name@coachverse.com',
            enterPassword: '••••••••',
            forgotPassword: 'भूल गए?',
            loginFailed: 'लॉगिन विफल',
            otherPortals: 'अन्य पोर्टल',
            dontHaveAccount: 'खाता नहीं है?',
            createNow: 'अभी बनाएं',
            enterPortal: 'पोर्टल दर्ज करें',

            // Roles
            superAdminPortal: 'सुपर एडमिन पोर्टल',
            instituteAdmin: 'संस्थान व्यवस्थापक',
            teacherLogin: 'शिक्षक लॉगिन',
            studentPortal: 'छात्र पोर्टल',
            parentLogin: 'अभिभावक लॉगिन',

            // Role Descriptions
            platformMasterAccess: 'प्लेटफॉर्म मास्टर एक्सेस',
            manageYourAcademy: 'अपनी अकादमी प्रबंधित करें',
            coachDashboardAccess: 'कोच डैशबोर्ड एक्सेस',
            accessYourLearning: 'अपनी सीखने की यात्रा तक पहुंचें',
            stayUpdatedOnProgress: 'प्रगति पर अपडेट रहें',

            // Dashboard
            dashboard: 'डैशबोर्ड',
            home: 'होम',
            messages: 'संदेश',
            announcements: 'घोषणाएं',
            profile: 'प्रोफ़ाइल',
            settings: 'सेटिंग्स',

            // Settings
            appearance: 'दिखावट',
            language: 'भाषा',
            theme: 'थीम',
            lightMode: 'लाइट मोड',
            darkMode: 'डार्क मोड',
            systemMode: 'सिस्टम थीम का उपयोग करें',

            // Notifications
            notifications: 'सूचनाएं',
            changesSaved: 'परिवर्तन सफलतापूर्वक सहेजे गए',
        }
    }
};

const savedLanguage = localStorage.getItem('language') || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;
