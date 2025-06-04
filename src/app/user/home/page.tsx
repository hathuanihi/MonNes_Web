import UserHeader from '@/components/header/UserHeader';
import Image from 'next/image';
import image from '@/assets/download.jpg'

export default function HomePage() {
    return (
        <div>
            <UserHeader />
            <main className="mt-15 bg-[#DAFFF6]">
                <div className="max-w-5xl flex flex-row">
                    <div className="w-1/2 ml-0">
                        <Image
                            src={image}
                            alt="Savings Illustration"
                            width={500}
                            height={400}
                            priority
                        />
                    </div>

                    <div className="w-1/2 rounded-lg justify-center items-center pt-30">
                        <h2 className="text-4xl font-bold uppercase text-[#006B6C]">
                            Your Smartest Way to Save
                        </h2>
                        <p className="mt-8 text-[#006B6C] text-xl max-w-md text-center ml-15">
                            Take control of your finances with effortless tools, smart insights, and personalized saving goals—designed to help you
                            make every dollar count.
                        </p>
                        <div className="mt-10 text-base flex justify-center"> {/* Căn giữa và thu nhỏ chiều ngang nút */}
                            <a
                                href="/user/dashboard"
                                className="bg-gradient-to-r from-[#FF086A] via-[#FB5D5D] to-[#F19BDB] hover:from-pink-600 hover:to-pink-700 text-white font-bold px-3 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 border-2 border-pink-300 w-[180px] justify-center"
                            >
                                THỐNG KÊ
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}