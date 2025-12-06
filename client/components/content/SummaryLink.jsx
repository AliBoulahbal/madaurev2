// client/components/content/SummaryLink.jsx
'use client';
import React from 'react';
import Button from '@/components/ui/Button';
import { FiDownload, FiFileText } from 'react-icons/fi';
import Link from 'next/link';

const SummaryLink = ({ data }) => {
    // Supposons que data.summaryId est l'ID du résumé dans le Modèle Summary
    const downloadUrl = `/api/summaries/${data.summaryId}/download`; 

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
                <FiFileText className="text-3xl text-madaure-primary" />
                <p className="font-medium text-gray-800">
                    ملخص الدرس جاهز للتحميل بصيغة PDF.
                </p>
            </div>
            
            <Link href={downloadUrl} target="_blank">
                <Button variant="primary">
                    <span className="flex items-center gap-2">
                        <FiDownload /> تحميل الملخص
                    </span>
                </Button>
            </Link>
        </div>
    );
};

export default SummaryLink;