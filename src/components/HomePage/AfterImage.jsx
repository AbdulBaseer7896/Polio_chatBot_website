import React from 'react'

const AfterImage = () => {
    return (
        <div className='px-[15%] my-16'>
            <div className=''>
                <h1 className='text-5xl text-center pb-8 font-bold text-[#53AD49]'>Polio Free Pakistan for Every Child</h1>
                <p className='text-white text-justify'>Since 1994, the Pakistan Polio Eradication Programme has been fighting to end the crippling poliovirus from the country. The initiative is driven by up to <span className='text-[#53AD49] font-bold'>400,000</span>  trained and dedicated polio workers, the largest <span className='text-[#53AD49] font-bold'> surveillance</span> surveillance network in the world, quality data collection and analysis, behavioral change communication, state of the art laboratories, and some of the best epidemiologists and public health experts in Pakistan and the world.</p>

                <div className='text-center text-[#53AD49]'>
                    <a href="https://www.endpolio.com.pk/polioin-pakistan" className='text-2xl font-bold ' target="_blank" >READ MORE</a>
                </div>
            </div>

            <div className='grid grid-rows-1 grid-cols-3 gap-5 mt-16'>
                <div className='bg-white rounded-3xl shadow-2xl border-4 border-[#53AD49]'>
                    <img className='rounded-t-2xl' src="/img/HomePage_Div_1.webp" alt="" />
                    <div className='px-6 py-6 text-center'>
                        <h1 className='text-2xl font-bold text-[#53AD49] pb-4'>POLIO CASES</h1>
                        <p className='text-xl'>Polio Cases Across Pakistan’s Districts and Provinces</p>
                    </div>
                </div>
                <div className='bg-white rounded-3xl shadow-2xl border-4 border-[#53AD49]'>
                    <img className='rounded-t-2xl' src="/img/HomePage_Div_2.webp" alt="" />
                    <div className='px-6 py-6 text-center'>
                        <h1 className='text-2xl font-bold text-[#53AD49] pb-4'>POLIO UPDATES AND MEDIA RELEASES</h1>
                        <p className='text-xl'>Media Coverage of the Pakistan Polio Eradication Programme</p>
                    </div>
                </div>
                <div className='bg-white rounded-3xl shadow-2xl border-4 border-[#53AD49]'>
                    <img className='rounded-t-2xl' src="/img/HomePage_Div_3.png" alt="" />
                    <div className='px-6 py-6 text-center'>
                        <h1 className='text-2xl font-bold text-[#53AD49] pb-4'>NEWSLETTER</h1>
                        <p className='text-xl'>Newsletter of the Pakistan Polio Eradication Programme</p>
                    </div>
                </div>
                <div className='bg-white rounded-3xl shadow-2xl border-4 border-[#53AD49]'>
                    <img className='rounded-t-2xl' src="/img/HomePage_Div_4.webp" alt="" />
                    <div className='px-6 py-6 text-center'>
                        <h1 className='text-2xl font-bold text-[#53AD49] pb-4'>FIELD STORIES</h1>
                        <p className='text-xl'>Real Life Stories of Real Heroes Eradicating Polio</p>
                    </div>
                </div>
                <div className='bg-white rounded-3xl shadow-2xl border-4 border-[#53AD49]'>
                    <img className='rounded-t-2xl' src="/img/HomePage_Div_5.webp" alt="" />
                    <div className='px-6 py-6 text-center'>
                        <h1 className='text-2xl font-bold text-[#53AD49] pb-4'>FREQUENTLY ASKED QUESTIONS</h1>
                        <p className='text-xl'>Answers to Parent’s Most Frequent Questions About Polio</p>
                    </div>
                </div>
                <div className='bg-white rounded-3xl shadow-2xl border-4 border-[#53AD49]'>
                    <img className='rounded-t-2xl' src="/img/HomePage_Div_6.webp" alt="" />
                    <div className='px-6 py-6 text-center'>
                        <h1 className='text-2xl font-bold text-[#53AD49] pb-4'>REPORTS AND FACT SHEETS</h1>
                        <p className='text-xl'>Global and National Reports on Polio Eradication</p>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default AfterImage