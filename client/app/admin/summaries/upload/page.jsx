// client/app/admin/summaries/upload/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { FiFileText, FiUploadCloud, FiSave, FiLoader, FiCheckCircle } from 'react-icons/fi';

const UploadSummaryPage = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    
    // État du formulaire de résumé
    const [summaryData, setSummaryData] = useState({
        title: '',
        subject: '',
        fileUrl: '', // URL du PDF après l'upload (simulé)
    });
    
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Vérification d'autorisation (Teacher ou Admin)
    useEffect(() => {
        if (!authLoading && user && user.role !== 'admin' && user.role !== 'teacher') {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSummaryData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError("الرجاء تحديد ملف بصيغة PDF فقط.");
        }
    };

    // Simulation de l'upload du fichier
    const handleUpload = async () => {
        if (!file) {
            setError("الرجاء تحديد ملف PDF أولاً.");
            return;
        }
        
        setLoading(true);
        setError(null);

        // --- SIMULATION DE L'UPLOAD ---
        try {
            // Dans un vrai projet, le fichier serait envoyé à S3/Firebase et l'URL serait retournée.
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler le temps de chargement
            
            const simulatedUrl = `https://madaure.storage.com/summaries/${Date.now()}_${file.name}`;
            
            setSummaryData(prev => ({ ...prev, fileUrl: simulatedUrl }));
            setSuccess("تم تحميل الملف بنجاح! يمكنك الآن حفظ الملخص.");

        } catch (uploadError) {
            setError("فشل في عملية تحميل الملف.");
        } finally {
            setLoading(false);
        }
    };
    
    // Soumission du formulaire (création du résumé dans la base de données)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!summaryData.fileUrl) {
            setError("الرجاء تحميل ملف PDF أولاً.");
            return;
        }
        if (!summaryData.title || !summaryData.subject) {
            setError("الرجاء ملء العنوان والمادة.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            // Appel à l'API de création de résumé (POST /api/summaries)
            const response = await api.post('/summaries', summaryData); 
            
            setSuccess(`تم إنشاء الملخص "${response.data.title}" بنجاح!`);
            
            // Redirection vers le dashboard des résumés pour voir la mise à jour
            setTimeout(() => {
                router.push('/dashboard/summaries'); 
            }, 1000);
            
        } catch (err) {
            let errorMessage = "فشل في حفظ الملخص في قاعدة البيانات.";
            if (err.response && err.response.data) {
                errorMessage = err.response.data.message || errorMessage;
            }
            setError(errorMessage);
            console.error("Summary Creation Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FiLoader className="animate-spin text-4xl text-madaure-primary" />
            </div>
        );
    }
    
    const isAdmin = user?.role === 'admin' || user?.role === 'teacher';

    if (!isAdmin) return null; // Devrait être redirigé par useEffect

    const isUploading = loading && !summaryData.fileUrl;
    const isReadyToSave = summaryData.fileUrl && !loading;

    return (
        <div dir="rtl" className="space-y-6 p-6">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-4">تحميل ملخص جديد (PDF)</h1>
            
            {success && <Alert type="success" message={success} />}
            {error && <Alert type="error" message={error} />}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Métadonnées du Résumé */}
                <Card className="p-6 space-y-4 shadow-lg">
                    <h2 className="text-xl font-bold text-madaure-primary">معلومات الملف</h2>
                    <Input
                        type="text"
                        name="title"
                        label="عنوان الملخص"
                        placeholder="مثال: ملخص شامل للمتتاليات"
                        value={summaryData.title}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="text"
                        name="subject"
                        label="المادة"
                        placeholder="مثال: الرياضيات"
                        value={summaryData.subject}
                        onChange={handleChange}
                        required
                    />
                </Card>
                
                {/* Zone d'Upload du Fichier */}
                <Card className="p-6 space-y-4 shadow-lg">
                    <h2 className="text-xl font-bold text-madaure-primary">الملف (PDF)</h2>
                    
                    <Input
                        type="file"
                        label="اختر ملف PDF"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />

                    <Button 
                        type="button" 
                        variant="secondary"
                        onClick={handleUpload}
                        disabled={isUploading || !file || summaryData.fileUrl}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        {isUploading ? <FiLoader className="animate-spin" /> : <FiUploadCloud />} 
                        {isUploading ? 'جاري التحميل...' : (summaryData.fileUrl ? 'تم التحميل بنجاح' : 'تحميل الملف')}
                    </Button>
                    
                    {summaryData.fileUrl && (
                        <Alert 
                            type="info" 
                            message={`تم تجهيز الملف: ${file?.name} - جاهز للحفظ في النظام.`} 
                        />
                    )}
                </Card>
                
                {/* Bouton de Soumission Finale */}
                <Card className="p-6 shadow-lg">
                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-full flex items-center justify-center gap-2" 
                        disabled={loading || !isReadyToSave}
                    >
                        {loading ? <FiLoader className="animate-spin" /> : <FiSave />} 
                        {loading ? 'جاري الحفظ...' : 'حفظ الملخص ونشره'}
                    </Button>
                </Card>
            </form>
        </div>
    );
};

export default UploadSummaryPage;