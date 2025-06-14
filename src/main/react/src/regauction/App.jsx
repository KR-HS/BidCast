import React, {useEffect, useState} from 'react'
import Loader from "../Loader/Loader";


export default function App() {
    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 예: 1초 후에 로딩 끝난 걸로 처리
        const timer = setTimeout(() => {
            setIsLoading(false)

            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500); // CSS transition과 동일 시간
            }

        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const [formData, setFormData] = useState({
        title: '',
        startTime: '',
        endTime: '',
        tag: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        console.log(value)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

    }
    if (isLoading) {
        return (
            <Loader/>
        );
    }
        return (
            <section>
                <div className="sec">
                    <h1>경매장 등록</h1>
                    <div>
                        <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>경매장 제목</td>
                                    <td>
                                        <input type="text"
                                               name="title"
                                               value={formData.title}
                                               onChange={handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>시작일자</td>
                                    <td>
                                        <input type="date"
                                               name="startTime"
                                               value={formData.startTime}
                                               onChange={handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>종료일자</td>
                                    <td>
                                        <input type="date"
                                               name="endTime"
                                               value={formData.endTime}
                                               onChange={handleChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>태그</td>
                                    <td>
                                        <input type="text"
                                               name="auctiontag"
                                               value={formData.tag}
                                               onChange={handleChange}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                    <div className="join-btn">
                        <button type="submit"
                                onClick={handleSubmit}
                        >회원가입
                        </button>
                    </div>
                </div>
            </section>
        )

}
