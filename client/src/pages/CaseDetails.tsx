import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

interface IUpdate {
    _id: string;
    title: string;
    description: string;
    date: string;
}

interface IDeadline {
    _id: string;
    task: string;
    dueDate: string;
    isCompleted: boolean;
}

interface ICase {
    _id: string;
    title: string;
    status: string;
    timeline: IUpdate[];
    deadlines: IDeadline[];
}

const CaseDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [legalCase, setLegalCase] = useState<ICase | null>(null);
    const [updateData, setUpdateData] = useState({ title: '', description: '' });
    const [deadlineData, setDeadlineData] = useState({ task: '', dueDate: '' });

    const fetchCase = async () => {
        try {
            const res = await api.get(`/cases`); // השרת שלנו מחזיר את כל התיקים, נסנן את הנכון או שנוסיף Endpoint לתיק ספציפי
            const currentCase = res.data.find((c: ICase) => c._id === id);
            setLegalCase(currentCase);
        } catch (err) {
            console.error('Error fetching case details');
        }
    };

    useEffect(() => {
        fetchCase();
    }, [id]);

    const handleAddUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/cases/${id}/update`, updateData);
            setUpdateData({ title: '', description: '' });
            fetchCase();
        } catch (err) {
            alert('שגיאה בעדכון התיק');
        }
    };

    const handleAddDeadline = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/cases/${id}/deadline`, deadlineData);
            setDeadlineData({ task: '', dueDate: '' });
            fetchCase();
        } catch (err) {
            alert('שגיאה בהוספת דדליין');
        }
    };

    if (!legalCase) return <div className="p-8 text-center">טוען נתונים...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto font-sans" dir="rtl">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{legalCase.title}</h1>
            <p className="text-gray-600 mb-8">סטטוס תיק: <span className="font-semibold text-blue-600">{legalCase.status}</span></p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* צד ימין: ציר זמן (Timeline) */}
                <div className="lg:col-span-2">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <h2 className="text-xl font-bold mb-6 border-b pb-2">ציר זמן ועדכונים</h2>

                        <form onSubmit={handleAddUpdate} className="mb-8 bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-bold mb-3">הוסף עדכון חדש:</h3>
                            <input
                                type="text" placeholder="כותרת העדכון" className="w-full border p-2 rounded mb-2 text-sm"
                                value={updateData.title} onChange={e => setUpdateData({ ...updateData, title: e.target.value })} required
                            />
                            <textarea
                                placeholder="פירוט..." className="w-full border p-2 rounded mb-2 text-sm"
                                value={updateData.description} onChange={e => setUpdateData({ ...updateData, description: e.target.value })}
                            />
                            <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">שלח עדכון</button>
                        </form>

                        <div className="space-y-6 relative border-r-2 border-blue-100 pr-6">
                            {legalCase.timeline.map((update) => (
                                <div key={update._id} className="relative">
                                    <div className="absolute -right-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                                    <p className="text-xs text-gray-400">{new Date(update.date).toLocaleDateString('he-IL')}</p>
                                    <h4 className="font-bold text-gray-800">{update.title}</h4>
                                    <p className="text-sm text-gray-600">{update.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* צד שמאל: דדליינים (Deadlines) */}
                <div className="lg:col-span-1">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 border-b pb-2 text-red-600">מועדים קרובים</h2>

                        <form onSubmit={handleAddDeadline} className="mb-6 space-y-2">
                            <input
                                type="text" placeholder="משימה (למשל: דיון הוכחות)" className="w-full border p-2 rounded text-sm"
                                value={deadlineData.task} onChange={e => setDeadlineData({ ...deadlineData, task: e.target.value })} required
                            />
                            <input
                                type="date" className="w-full border p-2 rounded text-sm"
                                value={deadlineData.dueDate} onChange={e => setDeadlineData({ ...deadlineData, dueDate: e.target.value })} required
                            />
                            <button className="w-full bg-red-500 text-white py-2 rounded text-sm font-bold hover:bg-red-600">הוסף מועד</button>
                        </form>

                        <div className="space-y-4">
                            {legalCase.deadlines.map((d) => (
                                <div key={d._id} className="p-3 bg-red-50 border-r-4 border-red-400 rounded">
                                    <p className="text-sm font-bold text-gray-800">{d.task}</p>
                                    <p className="text-xs text-gray-600">{new Date(d.dueDate).toLocaleDateString('he-IL')}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
};

export default CaseDetails;