// client/components/content/VideoViewer.jsx
'use client';
import React from 'react';

const VideoViewer = ({ data }) => {
    if (!data.url) {
        return <Alert type="error" message="رابط الفيديو غير متوفر." />;
    }
    
    // Utiliser une iframe pour les vidéos embarquées (YouTube, Vimeo) ou balise <video>
    // Ici, nous utilisons un iframe simple.
    return (
        <div className="aspect-w-16 aspect-h-9 relative">
            <iframe
                src={data.url}
                title={data.title || "Video Lesson"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-xl"
            ></iframe>
        </div>
    );
};

export default VideoViewer;