import React from 'react';

const Profile = () => {
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <div className="grid grid-cols-2 items-center justify-center w-3/4 h-screen p-10 relative">
                {/* Left Section - Text */}
                <div className="text-white text-left">
                    <h1 className="text-3xl font-bold mb-4">Hello, <br /> Dr. Muhammad Mohsin Khan</h1>
                    <p className="text-lg text-[#A3A3A4] pr-10">
                        I'm currently an Assistant Professor at SPCAI, PAF-IAST, specializing in AI, Machine Learning, and Biomedical Imaging. <br /> br
                        With a Postdoc from Yale and PhD research at Queen Mary University, London, my work focuses on AI-driven solutions for healthcare and automation
                    </p>
                </div>

                {/* Right Section - Image Container */}
                <div className="relative flex justify-center">
                    {/* Background Shapes */}
                    <div className="absolute -left-2 bottom-[-40px] w-[60%] h-[60%] bg-gray-800 rounded-lg shadow-lg z-0"></div>
                    <div className="absolute -left-20 bottom-[-80px] w-[40%] h-[40%] bg-gray-700 rounded-lg shadow-lg z-0"></div>

                    <div className="absolute -right-10 bottom-[-40px] w-[80%] h-[90%] bg-gray-800 rounded-lg shadow-lg z-0"></div>
                    <div className="absolute -right-20 bottom-[-80px] w-[60%] h-[70%] bg-gray-700 rounded-lg shadow-lg z-0"></div>

                    {/* Profile Image */}
                    <img src="/img/Profile_picture.png" alt="Profile" className="relative w-[80%] object-cover z-10 rounded-3xl" />
                </div>
            </div>
        </div>
    );
};

export default Profile;
