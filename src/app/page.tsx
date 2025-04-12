import Header from '@/components/Header';
import Image from 'next/image';
import image from '@/assets/download.jpg'

export default function HomePage() {
  return (
    <div>
      <Header />
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
            <div className="mt-20 text-2xl">
              <a
                href="/signin" 
                className="font-bold px-6 py-3 max-w-md ml-45 bg-pink-500 text-white rounded-full hover:bg-pink-600"
              >
                New Savings
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}