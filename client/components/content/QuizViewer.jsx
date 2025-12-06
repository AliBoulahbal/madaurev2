// client/components/content/QuizViewer.jsx
'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const QuizViewer = ({ data }) => {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    if (!data || !data.questions || data.questions.length === 0) {
        return <Alert type="info" message="لا توجد أسئلة متوفرة لهذا القسم." />;
    }

    const totalQuestions = data.questions.length;
    const correctCount = data.questions.filter((q, index) => {
        const selectedOption = answers[index];
        return selectedOption !== undefined && q.options[selectedOption]?.isCorrect;
    }).length;
    
    const score = showResults ? `${correctCount} / ${totalQuestions}` : null;

    const handleAnswerChange = (questionIndex, optionIndex) => {
        if (!showResults) {
            setAnswers({
                ...answers,
                [questionIndex]: optionIndex,
            });
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowResults(true);
    };

    return (
        <div dir="rtl" className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">اختبار المعرفة السريعة</h3>
            
            {score && (
                <Alert 
                    type={correctCount / totalQuestions > 0.7 ? 'success' : 'error'} 
                    message={`نتيجتك النهائية: ${score}`} 
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {data.questions.map((question, qIndex) => (
                    <div key={qIndex} className="p-4 border rounded-lg bg-white">
                        <p className="font-semibold text-lg mb-3">
                            {qIndex + 1}. {question.questionText}
                        </p>
                        
                        <div className="space-y-2">
                            {question.options.map((option, oIndex) => {
                                const isSelected = answers[qIndex] === oIndex;
                                const isCorrect = option.isCorrect;
                                
                                let optionClass = "p-3 rounded-lg border cursor-pointer transition duration-150";
                                
                                if (showResults) {
                                    if (isCorrect) {
                                        optionClass = "p-3 rounded-lg border border-green-500 bg-green-50 text-green-800 font-medium";
                                    } else if (isSelected && !isCorrect) {
                                        optionClass = "p-3 rounded-lg border border-red-500 bg-red-50 text-red-800 font-medium";
                                    } else {
                                        optionClass = "p-3 rounded-lg border border-gray-200 text-gray-700";
                                    }
                                } else {
                                    optionClass += isSelected ? " bg-madaure-light border-madaure-primary text-madaure-primary" : " hover:bg-gray-100";
                                }

                                return (
                                    <div 
                                        key={oIndex} 
                                        className={optionClass}
                                        onClick={() => handleAnswerChange(qIndex, oIndex)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {option.text}
                                            {showResults && isCorrect && <FiCheckCircle className="text-green-600" />}
                                            {showResults && isSelected && !isCorrect && <FiXCircle className="text-red-600" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                
                {!showResults && (
                    <Button type="submit" className="w-full">
                        إنهاء الإختبار وعرض النتيجة
                    </Button>
                )}
            </form>
        </div>
    );
};

export default QuizViewer;