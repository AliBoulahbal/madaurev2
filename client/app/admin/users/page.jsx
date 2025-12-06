// client/app/admin/users/page.jsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import { useRouter, usePathname } from 'next/navigation'; // Ajout de usePathname pour Breadcrumbs
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/contexts/AuthContext'; // CORRECTION: Import direct sans le sous-dossier 'Auth'
import { api } from '@/lib/api';
import { FiUsers, FiSearch, FiEdit, FiTrash2, FiLoader, FiX, FiHome, FiChevronLeft, FiUser, FiBriefcase, FiBook, FiUpload, FiLogOut, FiBookOpen } from 'react-icons/fi'; // FiBookOpen ajouté pour Breadcrumbs

// Rôles disponibles pour le système
const SYSTEM_ROLES = ['student', 'teacher', 'admin'];

// Rôles disponibles pour l'ajout MANUEL par l'Admin (excluant student)
const ADD_ROLES = ['teacher', 'admin']; 

const getRoleArabic = (role) => {
    switch (role) {
        case 'student': return 'طالب';
        case 'teacher': return 'أستاذ';
        case 'admin': return 'مدير';
        default: return 'غير مححدد';
    }
};

const getPlaceholders = (role) => {
    switch (role) {
        case 'admin':
            return {
                name: 'مثال: المدير العام',
                email: 'مثال: admin.test@madaure.com',
                password: 'كلمة مرور مؤقتة (Minimum 6 caractères)',
                branch: 'عام (General)',
            };
        case 'teacher':
        default: // Par défaut pour Teacher, car Student est exclu
            return {
                name: 'مثال: الأستاذ محمد علي',
                email: 'مثال: mohamed.ali@teacher.com',
                password: 'كلمة مرور مؤقتة (Minimum 6 caractères)',
                branch: 'الرياضيات / الفيزياء / إلخ',
            };
    }
};

// --- Composant Admin Header (Affiche les infos de l'utilisateur actuel) ---
const AdminHeader = ({ user, getRoleArabic }) => {
    if (!user) return null; // Ne rien afficher si l'utilisateur n'est pas chargé

    return (
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm rounded-lg mb-6">
            <div className="flex items-center gap-3">
                <FiUser className="w-6 h-6 text-madaure-primary" />
                <span className="text-lg font-semibold text-gray-800">
                    مرحباً بك، {user?.name}
                </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiBriefcase className="w-4 h-4 text-gray-500" />
                <span>الدور: {getRoleArabic(user?.role)}</span>
            </div>
        </div>
    );
};
// --- Fin Composant Admin Header ---

// --- Composant Admin Sidebar ---
const AdminSidebar = ({ currentPath }) => {
    const router = useRouter();
    const { logout } = useAuth(); // Assumons que le contexte d'auth a une fonction de déconnexion

    const links = [
        { href: '/admin/dashboard', name: 'لوحة التحكم', icon: FiHome },
        { href: '/admin/users', name: 'إدارة المستخدمين', icon: FiUsers },
        { href: '/admin/lessons/create', name: 'إضافة درس', icon: FiBook },
        { href: '/admin/summaries/upload', name: 'رفع ملخص', icon: FiUpload },
        // Ajoutez d'autres liens ici
    ];

    const handleLogout = () => {
        // Logique de déconnexion (si elle existe dans useAuth)
        logout(); 
        router.push('/login');
    };

    return (
        <div className="w-64 min-h-screen bg-gray-800 text-white p-4 shadow-2xl flex flex-col justify-between">
            <div>
                <h1 className="text-2xl font-bold mb-6 text-madaure-primary-light border-b border-gray-700 pb-3">
                    لوحة الإدارة
                </h1>
                <nav className="space-y-2">
                    {links.map((link) => {
                        // Utilise pathname pour la détection
                        const isActive = currentPath === link.href || currentPath.startsWith(`${link.href}/`);
                        return (
                            <button
                                key={link.href}
                                onClick={() => router.push(link.href)}
                                className={`w-full text-right p-3 rounded-lg flex items-center gap-3 transition duration-150 ${
                                    isActive
                                        ? 'bg-madaure-primary text-white font-semibold'
                                        : 'hover:bg-gray-700 text-gray-300'
                                }`}
                            >
                                <link.icon className="w-5 h-5" />
                                <span>{link.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-700">
                 <button
                    onClick={handleLogout}
                    className="w-full text-right p-3 rounded-lg flex items-center gap-3 text-red-400 hover:bg-gray-700 transition duration-150"
                >
                    <FiLogOut className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </div>
    );
};
// --- Fin Composant Admin Sidebar ---


// --- Composant Breadcrumbs (Fil d'Ariane) ---
const Breadcrumbs = ({ path, dir = "rtl" }) => {
    const router = useRouter();
    
    // CORRECTION: Assurer que 'path' est une chaîne de caractères non vide.
    const safePath = path || '';
    
    // Définition des chemins et de leurs noms en Arabe (MIS À JOUR)
    const breadcrumbMap = {
        '/admin/dashboard': { name: 'لوحة التحكم', icon: FiHome },
        '/admin/users': { name: 'إدارة المستخدمين', icon: FiUsers },
        '/admin/lessons': { name: 'إدارة الدروس', icon: FiBook },
        '/admin/lessons/create': { name: 'إنشاء درس جديد', icon: FiBook },
        '/admin/summaries': { name: 'إدارة الملخصات', icon: FiBookOpen },
        '/admin/summaries/upload': { name: 'رفع ملخص', icon: FiUpload },
    };

    const segments = safePath // Utilisation de safePath
        .split('/')
        .filter(segment => segment !== '')
        .map((segment, index, array) => {
            const href = '/' + array.slice(0, index + 1).join('/');
            return {
                href: href,
                name: breadcrumbMap[href]?.name || segment, // Utiliser le nom du map ou le segment
                icon: breadcrumbMap[href]?.icon,
                isCurrent: index === array.length - 1,
            };
        });
        
    // Construction du chemin complet
    const initialSegment = { href: '/admin/dashboard', name: 'لوحة التحكم', icon: FiHome, isCurrent: segments.length === 1 && segments[0].href === '/admin/dashboard' };
    
    let fullPath = [];
    if (segments.length > 0 && segments[0].href === '/admin') {
        // Commence à partir de /admin/dashboard
        fullPath = [initialSegment, ...segments.filter(s => s.href !== '/admin')];
    } else if (segments.length === 0) {
        // Cas où le path est juste / (root) ou vide
        fullPath = [initialSegment];
    } else {
        // Pour les autres cas (si la page n'est pas /admin/dashboard, on ajoute le dashboard en premier)
        fullPath = [initialSegment, ...segments];
    }
    
    // Éliminer les doublons et s'assurer que le chemin est logique
    fullPath = fullPath.reduce((acc, current) => {
        const x = acc.find(item => item.href === current.href);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []).filter(item => item.href !== '/admin');


    return (
        <nav className="flex text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 rtl:space-x-reverse space-x-reverse">
                {fullPath.map((item, index) => (
                    <li key={item.href} className="inline-flex items-center">
                        {index > 0 && (
                            // Utilisation de FiChevronLeft pour la direction RTL (Arabe)
                            <FiChevronLeft className="w-4 h-4 text-gray-400" />
                        )}
                        
                        {item.isCurrent ? (
                            <span className="inline-flex items-center text-madaure-primary font-semibold cursor-default mr-1">
                                {item.icon && <item.icon className="w-4 h-4 ml-1" />}
                                {item.name}
                            </span>
                        ) : (
                            <button
                                onClick={() => router.push(item.href)}
                                className="inline-flex items-center hover:text-madaure-primary transition duration-150 mr-1"
                            >
                                {item.icon && <item.icon className="w-4 h-4 ml-1" />}
                                {item.name}
                            </button>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};
// --- Fin Composant Breadcrumbs ---


// --- Composant Modal d'Ajout d'Utilisateur (Admin/Teacher seulement) ---
const AddUserModal = ({ roles, onAdd, onClose }) => {
    const [formData, setFormData] = useState({ 
        name: '', email: '', password: '', role: 'teacher', branch: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const placeholders = getPlaceholders(formData.role);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        if (!formData.name || !formData.email || !formData.password || !formData.role) {
             onClose({ type: 'error', text: "الرجاء ملء جميع الحقول المطلوبة." });
             setIsSaving(false);
             return;
        }
        // NOTE: La logique métier complète est dans le composant parent
        await onAdd(formData);
        setIsSaving(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
            <Card className="max-w-xl w-full p-6 shadow-2xl relative">
                <button onClick={() => onClose(null)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
                    <FiX size={24} />
                </button>
                <h2 className="text-2xl font-bold border-b pb-2 mb-4 text-madaure-primary">
                    إضافة مستخدم جديد (أستاذ/مدير)
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="الاسم الكامل" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder={placeholders.name} />
                    <Input label="البريد الإلكتروني" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder={placeholders.email} />
                     <Input label="كلمة المرور المؤقتة" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder={placeholders.password} />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الدور (الرتبة)</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-madaure-primary focus:border-madaure-primary">
                            {ADD_ROLES.map(role => (<option key={role} value={role}>{getRoleArabic(role)}</option>))}
                        </select>
                    </div>

                    <Input label="الفرع/التخصص (اختياري)" name="branch" type="text" value={formData.branch} onChange={handleChange} placeholder={placeholders.branch} />
                    
                    <Button type="submit" variant="primary" className="w-full mt-4" disabled={isSaving}>
                        {isSaving ? (<FiLoader className="animate-spin ml-2" />) : ('إضافة المستخدم')}
                    </Button> 
                </form>
            </Card>
        </div>
    );
};
// --- Fin Composant Modal d'Ajout ---

// --- Composant Modal de Modification (Existante) ---
const EditUserModal = ({ user, onUpdate, onClose, currentUser }) => {
    const [formData, setFormData] = useState({ 
        name: user.name, email: user.email, role: user.role, branch: user.branch || ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const placeholders = getPlaceholders(user.role);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // L'Admin ne peut pas modifier son propre compte depuis ce modal
        if (user._id === currentUser._id.toString()) {
            onClose({ type: 'warning', text: "لا يمكنك تعديل حسابك الخاص من هنا." });
            return;
        }
        // NOTE: La logique métier complète est dans le composant parent
        await onUpdate(user._id, formData);
        setIsSaving(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
            <Card className="max-w-xl w-full p-6 shadow-2xl relative">
                <button onClick={() => onClose(null)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
                    <FiX size={24} />
                </button>
                <h2 className="text-2xl font-bold border-b pb-2 mb-4 text-madaure-primary">
                    تعديل المستخدم: {user.name}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="الاسم" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder={placeholders.name} />
                    <Input label="البريد الإلكتروني" name="email" type="email" value={formData.email} onChange={handleChange} required disabled />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الدور (الرتبة)</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-madaure-primary focus:border-madaure-primary disabled:bg-gray-100" disabled={user._id === currentUser._id.toString()}>
                            {SYSTEM_ROLES.map(role => (<option key={role} value={role}>{getRoleArabic(role)}</option>))}
                        </select>
                    </div>

                    <Input label="الفرع/التخصص" name="branch" type="text" value={formData.branch} onChange={handleChange} placeholder={placeholders.branch} />
                    
                    <Button type="submit" variant="primary" className="w-full mt-4" disabled={isSaving}>
                        {isSaving ? (<FiLoader className="animate-spin ml-2" />) : ('حفظ التغييرات')}
                    </Button>
                </form>
            </Card>
        </div>
    );
};
// --- Fin Composant Modal de Modification ---


const UserManagementPage = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); // Utilisation de usePathname
    
    const hasFetched = useRef(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loadingData, setLoadingData] = useState(true); 
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);
    const [editingUser, setEditingUser] = useState(null); 
    const [isAddingUser, setIsAddingUser] = useState(false); 

    const isAdmin = user?.role === 'admin'; 

    
    const fetchUsers = useCallback(async () => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        
        setLoadingData(true);
        setError(null); 
        try {
            const response = await api.get('/users'); 
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (err) {
            setError("فشل في تحميل قائمة المستخدمين. تأكد أنك Admin.");
            console.error("User Fetch Error:", err);
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => {
        if (authLoading) return; 
        if (isAdmin) {
            fetchUsers();
        } else {
            router.push('/dashboard'); 
        }
    }, [user, authLoading, router, fetchUsers, isAdmin]); 

    useEffect(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = users.filter(u => 
            u.name.toLowerCase().includes(lowerCaseSearch) || 
            u.email.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);
    
    const handleEditUserClick = (userToEdit) => {
        if (!isAdmin) { setStatusMessage({ type: 'error', text: "لا تملك صلاحيات للتعديل." }); return; }
        setEditingUser(userToEdit);
    };

    const handleCloseModal = (message) => {
        setEditingUser(null);
        setIsAddingUser(false); 
        if (message) { setStatusMessage(message); }
    };
    
    const handleAddNewUser = async (formData) => {
        setStatusMessage({ type: 'info', text: 'جاري إضافة المستخدم الجديد...' });
        try {
            const endpoint = '/users'; 
            const payload = { 
                name: formData.name, email: formData.email, password: formData.password, 
                role: formData.role, branch: formData.branch,
            };
            
            const response = await api.post(endpoint, payload); 

            const newUser = response.data.user || response.data || { ...formData, _id: response.data._id || Date.now() }; 
            
            setUsers(prev => [newUser, ...prev]);
            setFilteredUsers(prev => [newUser, ...prev]);
        
            handleCloseModal({ type: 'success', text: `تم إضافة المستخدم ${formData.name} بنجاح!` });
            
        } catch (err) {
            const errorMessage = err.message || err.response?.data?.message || 'خطأ في الاتصال.';
            handleCloseModal({ type: 'error', text: `فشل الإضافة: ${errorMessage}.` });
            console.error("Add User Error:", err.response || err);
        }
    };

    const handleUserUpdate = async (userId, formData) => {
        setStatusMessage({ type: 'info', text: 'جاري تحديث بيانات المستخدم...' });
        try {
            await api.put(`/users/${userId}`, formData); 
            
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...formData } : u));
            setFilteredUsers(prev => prev.map(u => u._id === userId ? { ...u, ...formData } : u)); 
            
            handleCloseModal({ type: 'success', text: "تم تحديث بيانات المستخدم بنجاح." });
            
        } catch (err) {
            handleCloseModal({ type: 'error', text: `فشل التحديث: ${err.response?.data?.message || 'خطأ في الاتصال.'}` });
            console.error("User Update Error:", err);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!isAdmin) { setError("لا تملك صلاحيات لتغير الأدوار."); return; }
        if (userId === user._id.toString()) { setStatusMessage({ type: 'warning', text: "لا يمكنك تغيير دورك الخاص من هنا." }); return; }

        if (window.confirm(`هل أنت متأكد من تغيير دور المستخدم إلى ${getRoleArabic(newRole)}؟`)) {
            setStatusMessage({ type: 'info', text: 'جاري التحديث...' });
            try {
                await api.put(`/users/${userId}`, { role: newRole });
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
                setFilteredUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u)); 
                setStatusMessage({ type: 'success', text: "تم تحديث دور المستخدم بنجاح." });
            } catch (err) {
                setStatusMessage({ type: 'error', text: `فشل التحديث: ${err.response?.data?.message || 'خطأ في الاتصال.'}` });
                console.error("Role Update Error:", err);
            }
        }
    };
    
    const handleDeleteUser = async (userId, userName) => {
        if (!isAdmin) { setError("لا تملك صلاحيات لحذف المستخدمين."); return; }
         if (userId === user._id.toString()) { setStatusMessage({ type: 'warning', text: "لا يمكنك حذف حسابك الخاص." }); return; }

        if (window.confirm(`هل أنت متأكد من حذف المستخدم ${userName} نهائياً؟`)) {
            setStatusMessage({ type: 'info', text: 'جاري الحذف...' });
            try {
                await api.delete(`/users/${userId}`); 
                setUsers(prev => prev.filter(u => u._id !== userId));
                setFilteredUsers(prev => prev.filter(userItem => userItem._id !== userId)); 
                setStatusMessage({ type: 'success', text: "تم حذف المستخدم بنجاح." });
            } catch (err) {
                setStatusMessage({ type: 'error', text: `فشل الحذف: ${err.response?.data?.message || 'خطأ في الاتصال.'}` });
                console.error("Delete User Error:", err);
            }
        }
    };

    if (authLoading || loadingData) {
         return (
            <div className="flex justify-center items-center h-screen">
                <FiLoader className="animate-spin text-4xl text-madaure-primary" />
            </div>
        );
    }
    
    if (!isAdmin) { return null; }

    return (
        <div dir="rtl" className="flex min-h-screen"> 
            
            {/* Colonne 1: Sidebar (INCLUS DANS CETTE ANCIENNE VERSION) */}
            <AdminSidebar currentPath={pathname} />

            {/* Colonne 2: Contenu principal */}
            <div className="flex-1 p-6 bg-gray-50 space-y-6">
                <AdminHeader user={user} getRoleArabic={getRoleArabic} />
                <Breadcrumbs path={pathname} /> 

                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                    <FiUsers /> إدارة المستخدمين
                </h1>
                
                {error && <Alert type="error" message={error} className="mb-4" />}
                {statusMessage && <Alert type={statusMessage.type} message={statusMessage.text} className="mb-4" />}

                <div className="flex justify-between items-center gap-4">
                    <Input type="text" placeholder="ابحث بالاسم أو البريد الإلكتروني..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<FiSearch />} className="max-w-md" />
                    <p className="text-gray-600 font-medium">{filteredUsers.length} / {users.length} مستخدم</p>
                </div>

                <Card className="shadow-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفرع</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور الحالي</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">لا يوجد مستخدمون مطابقون لنتائج البحث.</td></tr>
                            ) : (
                                filteredUsers.map(u => (
                                    <tr key={u._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.branch || 'غير مححدد'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className={`p-1 border rounded-md text-sm ${u.role === 'admin' ? 'bg-red-100' : 'bg-gray-100'}`} disabled={u._id === user._id.toString()}>
                                                {SYSTEM_ROLES.map(role => (<option key={role} value={role}>{getRoleArabic(role)}</option>))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEditUserClick(u)} disabled={u._id === user._id.toString()}><FiEdit /> تعديل</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleDeleteUser(u._id, u.name)} disabled={u._id === user._id.toString()}><FiTrash2 /> حذف</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Card>
                
                <div className="pt-4">
                    <Button variant="secondary" className="mt-4" onClick={() => setIsAddingUser(true)}>
                        إضافة مستخدم جديد يدوياً
                    </Button>
                </div>
                
                {editingUser && (<EditUserModal user={editingUser} onUpdate={handleUserUpdate} onClose={handleCloseModal} currentUser={user} />)}

                {isAddingUser && (<AddUserModal roles={ADD_ROLES} onAdd={handleAddNewUser} onClose={handleCloseModal} />)}
            </div>
        </div>
    );
};

export default UserManagementPage;

// --- DÉFINITIONS SUPPLÉMENTAIRES NÉCESSAIRES ---
// Les composants AdminSidebar, AdminHeader et Breadcrumbs sont définis plus haut.
// Nous allons conserver uniquement le bloc de code principal et ses dépendances.
// Le bloc de définitions dupliquées est supprimé ici.