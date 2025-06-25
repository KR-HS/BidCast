import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loader from "../Loader/Loader";

export default function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 1500,
            offset: 300,
            once: true });
        AOS.refresh();

        const timer = setTimeout(() => {
            setIsLoading(false)
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="box">
            <div><img src="./img/logo1.png" alt="에러!" style={{margin: '100px 0 400px 0'}} className="logo1" data-aos="fade-up" /></div>
            <div><img src="./img/bid+cast.png" alt="에러!" className="bidcast" data-aos="fade-right" data-aos-offset ="900"/></div>
            <div><img src="./img/introLet1.png" alt="에러!" style={{margin: '50px 0 400px 0'}} className="introLet1" data-aos="fade-left" data-aos-offset ="900"/></div>
            <div><img src="./img/people.png" alt="에러!" style={{width: '300px'}} className="people" data-aos="zoom-in" data-aos-offset ="1300"/></div>
            <div><img src="./img/introLet3.png" alt="에러!" style={{margin: '50px 0 400px 0', width: '700px'}} className="introLet3" data-aos="zoom-out" data-aos-offset ="1300"/></div>
            <div><img src="./img/Vector1.png" alt="에러!" className="vector1" data-aos="flip-down" data-aos-offset ="1700"/></div>
            <div><img src="./img/introLet2.png" alt="에러!" className="introLet2" style={{width: '800px', margin: '50px 0 400px 0'}} data-aos="flip-up" data-aos-offset ="1700"/></div>

            <div className="arrow-circle" data-aos="zoom-in"  data-aos-offset ="1800">
                <a href="/login.do">
                <img src="./img/arrow.png" alt="에러!" className="arrow" />
                </a>
            </div>

            <div style={{marginTop: "300px"}}></div>
        </div>
    );
}