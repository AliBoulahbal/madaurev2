// client/app/dashboard/summaries/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { FiFileText, FiDownload, FiBookOpen, FiUsers, FiLoader } from 'react-icons/fi';

const SummaryCard = ({ summary }) => {
    const handleDownload = () => {
        // En production, cette action appellerait une API pour enregistrer le téléchargement
        // et redirigerait ensuite vers le lien du fichier (summary.fileUrl)
        
        // Simulation de l'enregistrement de l'activité:
        console.log(`[ACTIVITY LOG] Downloading summary ID: ${summary._id}`);

        // Ouvre le lien de téléchargement (simulé)
        if (summary.fileUrl) {
            window.open(summary.fileUrl, '_blank');
        }
    };

    return (
        <Card className="flex flex-col justify-between p-5 shadow-md hover:shadow-lg transition-shadow">
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <FiFileText className="text-3xl text-madaure-primary" />
                    <h3 className="text-xl font-bold text-gray-900">{summary.title}</h3>
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <FiBookOpen className="text-madaure-primary" />
                        <span>المادة: <span className="font-medium">{summary.subject}</span></span>
                    </div>
                    {summary.teacher && (
                        <div className="flex items-center gap-2">
                            <FiUsers className="text-madaure-primary" />
                            <span>الأستاذ: <span className="font-medium">{summary.teacher.name}</span></span>
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                        {/* Simulation du nombre de téléchargements basé sur le seeder */}
                        تم تحميله {summary.downloadsCount || 50} مرات.
                    </p>
                </div>
            </div>
            
            <Button 
                onClick={handleDownload} 
                className="mt-4 flex items-center justify-center gap-2"
                variant="primary"
            >
                <FiDownload /> تحميل الملف (PDF)
            </Button>
        </Card>
    );
};


const SummariesListPage = () => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                // Création d'une API pour récupérer les résumés (GET /api/summaries)
                const response = await api.get('/summaries'); 
                setSummaries(response.data);
                setError(null);
            } catch (err) {
                setError("فشل في تحميل قائمة الملخصات. يرجى التحقق من اتصال الخادم.");
                console.error("API Error fetching summaries:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummaries();
    }, []);

    if (loading) return (
        <div dir="rtl" className="flex items-center justify-center h-48 text-madaure-primary">
            <FiLoader className="animate-spin text-3xl ml-3" /> جاري تحميل قائمة الملخصات...
        </div>
    );
    
    return (
        <div dir="rtl" className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <FiFileText /> مكتبة الملخصات
                </h2>
                {/* L'ajout se fait via le Dashboard Admin */}
            </div>

            <p className="text-gray-600">ملخصات شاملة للتحضير لشهادة البكالوريا.</p>

            {error && <Alert type="error" message={error} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {summaries.length === 0 && !error ? (
                    <Alert type="info" message="لا توجد ملخصات متاحة حالياً." />
                ) : (
                    summaries.map(summary => <SummaryCard key={summary._id} summary={summary} />)
                )}
            </div>
        </div>
    );
};

export default SummariesListPage;