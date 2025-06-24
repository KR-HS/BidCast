import React, { useEffect, useState } from 'react';
import Loader from "../Loader/Loader";
import { FaRegImage } from "react-icons/fa6";

export default function App() {
    const [formData, setFormData] = useState({
        title: '',
        startTime: '',
        endTime: '',
        tags: [],
        items: [{ name: '', content:'', image: null, preview: null }]
    });
    const [tags, setTags] = useState([]);


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 500);

        fetch('api/auctions/tags')
            .then(res => res.json())
            .then(data => setTags(data))
            .catch(err => console.error('태그 목록 불러오기 실패:', err));

        return () => clearTimeout(timer);
    }, []);

    const handleTagCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const updatedTags = checked
            ? [...formData.tags, value]
            : formData.tags.filter(tag => tag !== value);

        setFormData({ ...formData, tags: updatedTags });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;
        setFormData({ ...formData, items: updatedItems });
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            const updatedItems = [...formData.items];
            updatedItems[index].image = file;
            updatedItems[index].preview = preview;
            setFormData({ ...formData, items: updatedItems });
        }
    };

    const handleImageDrop = (e, index) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const preview = URL.createObjectURL(file);
            const updatedItems = [...formData.items];
            updatedItems[index].image = file;
            updatedItems[index].preview = preview;
            setFormData({ ...formData, items: updatedItems });
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { name: '', image: null, preview: null }]
        });
    };

    const removeItem = (indexToRemove) => {
        const updatedItems = formData.items.filter((_, index) => index !== indexToRemove);
        setFormData({ ...formData, items: updatedItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("startTime", formData.startTime);
        formDataToSend.append("endTime", formData.endTime);

        formData.tags.forEach(tag => {
            formDataToSend.append("tags", tag);
        });

        formData.items.forEach((item) => {
            formDataToSend.append("itemNames", item.name);
            formDataToSend.append("content", item.content);
            if (item.image) {
                formDataToSend.append("images", item.image);
            } else {
                formDataToSend.append("images", new Blob()); // 빈 이미지 처리 (null이면 오류)
            }
        });

        try {
            const response = await fetch('/api/auctions/regAuction', {
                method: 'POST',
                body: formDataToSend,
                credentials: 'include',
            });

            if (response.status === 401) {
                window.location.href = '/login.do';
                return;
            }

            const data = await response.json();
            if (data.success) {
                alert('경매장 등록이 완료되었습니다.');
                window.location.href = '/myPage.do';
            } else {
                alert('경매장 등록에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('경매장 등록 요청 실패:', error);
            alert('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <section>
            <div className="sec">
                <div className="header-with-close">
                    <h1>경매장 등록</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td>경매장 제목</td>
                            <td>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>시작일자</td>
                            <td>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>종료일자</td>
                            <td>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>태그</td>
                            <td>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '26px 13px',
                                        alignItems: 'center',
                                        width: '310px'
                                    }}
                                >
                                    {tags.map(tag => (
                                        <label
                                            key={tag.tagKey}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '14px',
                                                gap: '4px',
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                value={String(tag.tagKey)}
                                                checked={formData.tags.includes(String(tag.tagKey))}
                                                onChange={handleTagCheckboxChange}
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                            {tag.tagName}
                                        </label>
                                    ))}
                                </div>
                            </td>
                        </tr>

                        {formData.items.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td>물품 {index + 1}</td>
                                    <td
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="물품명"
                                            value={item.name}
                                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                            style={{
                                                flex: '1 1 auto',
                                                maxWidth: '270px'
                                            }}
                                        />
                                        {formData.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                style={{
                                                    padding: '5px 8px',
                                                    backgroundColor: '#e74c3c',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0
                                                }}
                                            >
                                                X
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <textarea
                                            placeholder="설명"
                                            value={item.content}
                                            onChange={(e) => handleItemChange(index, "content", e.target.value)}
                                            className="content-box"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <div
                                            onClick={() => document.getElementById(`imageUpload-${index}`).click()}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleImageDrop(e, index)}
                                            style={{
                                                border: '2px dashed #ccc',
                                                borderRadius: '10px',
                                                padding: '20px 0',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: '#f9f9f9',
                                            }}
                                        >
                                            {item.preview ? (
                                                <img
                                                    src={item.preview}
                                                    alt="미리보기"
                                                    style={{ height: '57px', borderRadius: '8px' }}
                                                />
                                            ) : (
                                                <div>
                                                    <FaRegImage size={35} />
                                                    <div style={{ color: '#888' }}>
                                                        클릭 또는 이미지를 끌어다 놓으세요
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            id={`imageUpload-${index}`}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleImageChange(e, index)}
                                        />
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}

                        <tr>
                            <td colSpan={2} style={{ textAlign: 'center' }}>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: 'black',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    + 물품 추가
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button
                                    type="submit"
                                    className="reg-btn"
                                >
                                    새로운 경매장 등록
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </section>
    );
}
