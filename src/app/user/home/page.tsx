"use client";

import React from 'react';
import UserHeader from '@/components/header/UserHeader';
import Image from 'next/image';
import image from '@/assets/image_home.jpg'; 

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-100 to-yellow-100 text-rose-900 overflow-x-hidden">
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <UserHeader />
            </div>

            <main className="pt-24 pb-12"> {/* Đảm bảo padding top đủ lớn cho UserHeader */}
                <section className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-x-12 gap-y-10 min-h-[calc(100vh-140px)]">
                        
                        <div className="lg:w-1/2 space-y-7 text-center lg:text-left">
                            <h1 
                                className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] font-bevietnampop animate-titleReveal" // Thêm animate-titleReveal
                            >
                                Giải Pháp Tiết Kiệm Thông Minh Cho Bạn
                            </h1>
                            <p className="text-lg md:text-xl text-rose-800 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.3s'}}> {/* animate-fadeInUp */}
                                Khám phá cách MonNes giúp bạn kiểm soát tương lai tài chính của mình. Từ việc đặt mục tiêu cho đến theo dõi các khoản sinh lời, chúng tôi đồng hành cùng bạn trên mọi bước đường tiết kiệm thông minh.
                            </p>
                            {/* SỬA ĐỔI Ở ĐÂY: Bọc nút trong một div và căn giữa div đó trên mobile, căn trái trên lg */}
                            <div className="pt-6 flex justify-center lg:justify-start"> 
                                <a
                                    href="/user/yoursavings/newsavings" // Nên dùng Link của Next.js nếu là internal route
                                    className="inline-block bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] text-white font-extrabold px-10 py-4 sm:px-12 sm:py-5 rounded-full shadow-2xl ring-4 ring-[#FF086A]/30 focus:ring-8 focus:ring-[#FF086A]/60 transition-all duration-300 ease-in-out transform hover:scale-110 hover:brightness-110 hover:shadow-[0_8px_32px_0_rgba(236,72,153,0.25)] text-lg sm:text-xl tracking-wide animate-bounce-slow outline-none border-none font-bevietnampop"
                                    tabIndex={0}
                                    style={{letterSpacing: '0.04em', animationDelay: '0.6s'}} // Thêm animationDelay
                                >
                                    MỞ SỔ NGAY HÔM NAY
                                </a>
                            </div>
                        </div>

                        <div className="lg:w-1/2 flex justify-center lg:justify-end animate-fadeInRight" style={{ animationDelay: '0.1s'}}> {/* Thêm animationDelay */}
                            <div className="group p-3 sm:p-4 bg-white/70 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/40 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(236,72,153,0.3)]">
                                <Image
                                    src={image} 
                                    alt="Hình Minh Họa Tiết Kiệm Thông Minh"
                                    width={550} 
                                    height={440}
                                    priority
                                    className="rounded-xl object-cover aspect-[55/44] transition-transform duration-300 ease-in-out group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <style jsx global>{`
                /* ... (keyframes giữ nguyên như bạn đã cung cấp) ... */
                @keyframes fadeInUp { /* Giữ lại hoặc đổi tên nếu muốn hiệu ứng khác */
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
                .animate-fadeInRight { animation: fadeInRight 0.8s ease-out forwards; }

                @keyframes titleReveal {
                    0% {
                        transform: scale(0.95) translateY(8px);
                        opacity: 0;
                    }
                    70% {
                        transform: scale(1.01) translateY(0px);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1) translateY(0px);
                        opacity: 1;
                    }
                }
                .animate-titleReveal {
                    animation: titleReveal 0.9s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s both; /* Sửa delay cho title */
                }

                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-slow {
                    animation: bounceSlow 1.8s infinite cubic-bezier(0.6, 0.05, 0.2, 0.95);
                }

                .font-bevietnampop {
                    font-family: 'Be Vietnam Pro', 'Inter', 'Montserrat', 'Arial', sans-serif;
                }
            `}</style>
            
        </div>
    );
}