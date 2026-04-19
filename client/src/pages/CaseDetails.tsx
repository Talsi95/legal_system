import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

interface IUpdate {
    _id: string;
    title: string;
    description: string;
    date: string;
    isCompleted?: boolean;
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
            const res = await api.get(`/cases`);
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

    const toggleUpdateStatus = async (updateId: string) => {
        try {
            await api.patch(`/cases/${id}/update/${updateId}/toggle`);
            fetchCase();
        } catch (err) {
            alert('לא ניתן לעדכן את הסטטוס כרגע');
        }
    };

    const handleDeleteUpdate = async (updateId: string) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק עדכון זה?')) return;

        try {
            await api.delete(`/cases/${legalCase?._id}/update/${updateId}`);
            fetchCase();
        } catch (err) {
            alert('שגיאה במחיקת העדכון');
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
                                <div key={update._id} className={`relative p-3 rounded-lg transition ${update.isCompleted ? 'bg-gray-50' : ''}`}>
                                    <div className={`absolute -right-[31px] top-4 w-4 h-4 rounded-full border-2 border-white ${update.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}></div>

                                    <div className="flex justify-between items-start gap-4">
                                        <div className={`flex-1 ${update.isCompleted ? 'opacity-50' : ''}`}>
                                            <p className="text-xs text-gray-400">{new Date(update.date).toLocaleDateString('he-IL')}</p>
                                            <h4 className={`font-bold ${update.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                {update.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">{update.description}</p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => toggleUpdateStatus(update._id)}
                                                className={`text-xs px-3 py-1 rounded border transition-colors whitespace-nowrap ${update.isCompleted
                                                    ? 'bg-green-100 border-green-200 text-green-700 hover:bg-green-200'
                                                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {update.isCompleted ? '✓ בוצע' : 'סמן כבוצע'}
                                            </button>

                                            <button
                                                onClick={() => handleDeleteUpdate(update._id)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors title='מחק עדכון'"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

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