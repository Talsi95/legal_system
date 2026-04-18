import { useEffect, useState } from 'react';
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
}

interface ICase {
    _id: string;
    title: string;
    status: string;
    timeline: IUpdate[];
    deadlines: IDeadline[];
    lawyer: { name: string; email: string };
}

const ClientDashboard = () => {
    const [clientCases, setClientCases] = useState<ICase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCases = async () => {
            try {
                const res = await api.get('/cases');
                setClientCases(res.data);
            } catch (err) {
                console.error('Failed to fetch client cases');
            } finally {
                setLoading(false);
            }
        };
        fetchMyCases();
    }, []);

    if (loading) return <div className="p-10 text-center">טוען את פרטי התיק שלך...</div>;

    if (clientCases.length === 0) {
        return (
            <div className="p-10 text-center text-gray-600">
                לא נמצאו תיקים משויכים לחשבון זה.
            </div>
        );
    }

    // ללקוח ממוצע בדרך כלל יש תיק אחד, נציג את הראשון או רשימה אם יש יותר
    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 border-b pb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">שלום, {clientCases[0].title}</h1>
                        <p className="text-gray-500 text-sm">צפייה בסטטוס התיק המשפטי שלך בזמן אמת</p>
                    </div>
                    <div className="text-left text-xs text-gray-400">
                        עורך דין מטפל: {clientCases[0].lawyer.name}
                    </div>
                </header>

                {clientCases.map((c) => (
                    <div key={c._id} className="space-y-8">

                        {/* כרטיס סטטוס מהיר */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between border-r-8 border-green-500">
                            <div>
                                <p className="text-sm text-gray-500">סטטוס נוכחי:</p>
                                <h2 className="text-xl font-bold text-gray-800">
                                    {c.status === 'open' ? 'בטיפול פעיל' : 'ממתין לעדכון'}
                                </h2>
                            </div>
                            <div className="bg-green-50 px-4 py-2 rounded-lg text-green-700 font-bold">
                                {c.timeline.length > 0 ? 'מעודכן' : 'בתהליך'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* ציר זמן - Timeline */}
                            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-lg mb-6 text-gray-800">מה התחדש בתיק?</h3>
                                <div className="relative border-r-2 border-gray-100 pr-6 space-y-8">
                                    {c.timeline.map((item) => (
                                        <div key={item._id} className="relative">
                                            <div className="absolute -right-[31px] top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                            <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('he-IL')}</span>
                                            <h4 className="font-bold text-gray-800">{item.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* דדליינים - מה השלב הבא? */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
                                <h3 className="font-bold text-lg mb-6 text-orange-600">מועדים חשובים</h3>
                                <div className="space-y-4">
                                    {c.deadlines.length > 0 ? (
                                        c.deadlines.map((d) => (
                                            <div key={d._id} className="p-4 bg-orange-50 rounded-xl">
                                                <p className="text-sm font-bold text-gray-800">{d.task}</p>
                                                <p className="text-xs text-orange-700 mt-1">
                                                    {new Date(d.dueDate).toLocaleDateString('he-IL')}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">אין מועדים קרובים כרגע.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientDashboard;