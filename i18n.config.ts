export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    defaultLocale: 'en',
    messages: {
        en: {
            "Dashboard": "Dashboard",
            "Requests": "Requests",
            "Payroll": "Payroll",
            "Penalties": "Penalties",
            "Employees": "Employees",
            "Settings": "Settings",
            "Profile": "Profile",
            common: {
                welcome: "Welcome",
                login: "Login",
                register: "Register Company",
                email: "Email",
                password: "Password",
                submit: "Submit",
                cancel: "Cancel",
                save: "Save",
                loading: "Loading...",
                error: "Error",
                success: "Success"
            },
            nav: {
                dashboard: "Dashboard",
                attendance: "Attendance",
                requests: "Requests",
                penalties: "Penalties",
                payroll: "Payroll",
                experience: "Experience",
                employees: "Employees",
                settings: "Settings",
                logout: "Logout"
            },
            auth: {
                companyName: "Company Name",
                adminName: "Admin Name",
                adminEmail: "Admin Email",
                loginTitle: "Sign in to your account",
                registerTitle: "Register your company"
            }
        },
        ar: {
            "Dashboard": "لوحة التحكم",
            "Requests": "الطلبات",
            "Payroll": "الرواتب",
            "Penalties": "الجزاءات",
            "Employees": "الموظفين",
            "Settings": "الإعدادات",
            "Profile": "الملف الشخصي",
            common: {
                welcome: "مرحباً",
                login: "تسجيل الدخول",
                register: "تسجيل شركة",
                email: "البريد الإلكتروني",
                password: "كلمة المرور",
                submit: "إرسال",
                cancel: "إلغاء",
                save: "حفظ",
                loading: "جاري التحميل...",
                error: "خطأ",
                success: "نجاح"
            },
            nav: {
                dashboard: "لوحة التحكم",
                attendance: "الحضور والانصراف",
                requests: "الطلبات",
                penalties: "الجزاءات",
                payroll: "الرواتب",
                experience: "تجربة الموظف",
                employees: "الموظفين",
                settings: "الإعدادات",
                logout: "تسجيل خروج"
            },
            auth: {
                companyName: "اسم الشركة",
                adminName: "اسم المسؤول",
                adminEmail: "بريد المسؤول",
                loginTitle: "سجل دخولك لحسابك",
                registerTitle: "سجل شركتك"
            }
        }
    }
}))
