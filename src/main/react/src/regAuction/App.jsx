import React, { useEffect, useState } from 'react';
import Loader from "../Loader/Loader";
import { FaRegImage } from "react-icons/fa6";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import koLocale from "date-fns/locale/ko";
import { format } from 'date-fns';

export default function App() {
    const [formData, setFormData] = useState({
        title: '',
        startTime: '',
        endTime: '',
        tags: [],
        thumbnail: null,
        thumbnailPreview: null,
        items: [{ name: '', initPrice:null, content:'', image: null, preview: null }]
    });
    const [tags, setTags] = useState([]);

    const [error,setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [datePickerOpen, setDatePickerOpen] = useState(false);
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

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                thumbnail: file,
                thumbnailPreview: preview
            }));
        }
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
            items: [...formData.items, { name: '', content: '', image: null, preview: null }]
        });
    };

    const removeItem = (indexToRemove) => {
        const updatedItems = formData.items.filter((_, index) => index !== indexToRemove);
        setFormData({ ...formData, items: updatedItems });
    };


    const validateForm = () => {
        if (!formData.title.trim()) {
            alert('경매장 제목을 입력해주세요.');
            return false;
        }

        if (!formData.startTime) {
            alert('시작 시간을 선택해주세요.');
            return false;
        }

        if (formData.items.some(item => !item.name.trim())) {
            alert('모든 물품의 이름을 입력해주세요.');
            return false;
        }

        if (formData.items.some(item => item.initPrice===null||item.initPrice===0)) {
            alert('모든 물품의 시작가격을 입력해주세요');
            return false;
        }

        if (formData.items.some(item => !item.content.trim())) {
            alert('모든 물품의 설명을 입력해주세요.');
            return false;
        }
        if (formData.items.some(item => !item.image)) {
            alert('모든 물품의 이미지를 등록해주세요.');
            return false;
        }

        if (!formData.thumbnail) {
            alert('썸네일 이미지를 선택해주세요.');
            return false;
        }

        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()) return;

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("startTime", formData.startTime);
        formDataToSend.append("endTime", formData.endTime);

        formData.tags.forEach(tag => {
            formDataToSend.append("tags", tag);
        });

        if (formData.thumbnail) {
            formDataToSend.append("thumbnail", formData.thumbnail);
        }

        formData.items.forEach((item) => {
            // formDataToSend.append("itemNames", item.name);
            // formDataToSend.append("content", item.content);
            if (item.image) {
                formDataToSend.append("images", item.image);
            } else {
                formDataToSend.append("images", new Blob()); // 빈 이미지 처리
            }
        });

        const items = formData.items.map(item => ({
            prodName: item.name,
            prodDetail: item.content,
            initPrice: Number(item.initPrice),
        }));

        formDataToSend.append('items', new Blob([JSON.stringify(items)], { type: 'application/json' }));

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
                console.log(data.message);
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
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={koLocale}>
                                    <DateTimePicker
                                        label={null}
                                        value={formData.startTime ? new Date(formData.startTime) : null}
                                        onChange={(date) => {
                                            const formatted = date ? format(date, "yyyy-MM-dd'T'HH:mm") : ''; // yyyy-MM-ddTHH:mm
                                            handleChange({
                                                target: {
                                                    name: 'startTime',
                                                    value: formatted,
                                                },
                                            });
                                        }}
                                        ampm={true}
                                        inputFormat="yyyy-MM-dd'T'HH:mm"
                                        enableAccessibleFieldDOMStructure={false}
                                        open={datePickerOpen}
                                        onOpen={() => setDatePickerOpen(true)}
                                        onClose={() => setDatePickerOpen(false)}
                                        slotProps={{
                                            textField: {
                                                placeholder: "시작일자를 지정해주세요",
                                                inputProps: {
                                                    readOnly: true, // 직접 입력 막기
                                                },
                                                onClick: () => setDatePickerOpen(true),
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </td>
                        </tr>
                        {/*<tr>*/}
                        {/*    <td>종료일자</td>*/}
                        {/*    <td>*/}
                        {/*        <input*/}
                        {/*            type="datetime-local"*/}
                        {/*            name="endTime"*/}
                        {/*            value={formData.endTime}*/}
                        {/*            onChange={handleChange}*/}
                        {/*        />*/}
                        {/*    </td>*/}
                        {/*</tr>*/}

                        <tr>
                            <td>썸네일 이미지</td>
                            <td>
                                <div className="thumbnailImgWrap"
                                    onClick={() => document.getElementById('thumbnailUpload').click()}
                                >
                                    {formData.thumbnailPreview ? (
                                        <img
                                            src={formData.thumbnailPreview}
                                            alt="썸네일 미리보기"
                                            style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '8px' }}
                                        />
                                    ) : (
                                        <div style={{ color: '#888' }}>
                                            <FaRegImage size={50} />
                                            <div>클릭하여 썸네일 선택</div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="thumbnailUpload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleThumbnailChange}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>태그</td>
                            <td>
                                <div className="tagWrap">
                                    {tags.map(tag => (
                                        <label key={tag.tagKey} className="tag">
                                            <input
                                                type="checkbox"
                                                className="tagInput"
                                                value={String(tag.tagKey)}
                                                checked={formData.tags.includes(String(tag.tagKey))}
                                                onChange={handleTagCheckboxChange}
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
                                    <td className="product">
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
                                                className="removeProdBtn"
                                                onClick={() => removeItem(index)}
                                            >
                                                X
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>시작가격</td>
                                    <td className="initPrice">
                                        <input
                                            type="number"
                                            value={item.initPrice ?? ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                handleItemChange(index, 'initPrice', value === '' ? null : Number(value));
                                            }}
                                            min="1000"
                                            step="1000"
                                            style={{ width: "120px" }}
                                            placeholder="시작가격"
                                        />
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
                                        <div className="prodImgWrap"
                                            onClick={() => document.getElementById(`imageUpload-${index}`).click()}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleImageDrop(e, index)}
                                        >
                                            {item.preview ? (
                                                <img
                                                    src={item.preview}
                                                    alt="미리보기"
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
                                    className="addProdBtn"
                                    onClick={addItem}
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
