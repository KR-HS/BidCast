import React, {useState} from 'react'
import './regauction.css'

const RegAuction = () => {

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
        return (
            <section>
                <div className="sec">
                    <div className="header-with-close">
                    <h1>경매장 등록</h1>
                </div>
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
                                className="reg-btn"
                        >새로운 경매장 등록
                        </button>
                    </div>
                </div>
            </section>
        )
}

export default RegAuction;