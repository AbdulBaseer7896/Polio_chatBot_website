// import clsx from "clsx";
// import gsap from "gsap";
// import { useWindowScroll } from "react-use";
// import { useEffect, useRef, useState } from "react";
// import { TiLocationArrow } from "react-icons/ti";
// import { useNavigate } from 'react-router-dom';
// import Button from "./Button";

// const navItems = ["POlio IN Pakistan", "FAQS", "Knowledge Center", "Multimedia", "Contact Us"];

// const NavBar = () => {
//     const navigate = useNavigate();
//     // State for toggling audio and visual indicator
//     const [isAudioPlaying, setIsAudioPlaying] = useState(false);
//     const [isIndicatorActive, setIsIndicatorActive] = useState(false);

//     // Refs for audio and navigation container
//     const audioElementRef = useRef(null);
//     const navContainerRef = useRef(null);

//     const { y: currentScrollY } = useWindowScroll();
//     const [isNavVisible, setIsNavVisible] = useState(true);
//     const [lastScrollY, setLastScrollY] = useState(0);

//     // Toggle audio and visual indicator
//     const toggleAudioIndicator = () => {
//         setIsAudioPlaying((prev) => !prev);
//         setIsIndicatorActive((prev) => !prev);
//     };

//     // Manage audio playback
//     useEffect(() => {
//         if (isAudioPlaying) {
//             audioElementRef.current.play();
//         } else {
//             audioElementRef.current.pause();
//         }
//     }, [isAudioPlaying]);

//     useEffect(() => {
//         if (currentScrollY === 0) {
//             // Topmost position: show navbar without floating-nav
//             setIsNavVisible(true);
//             navContainerRef.current.classList.remove("floating-nav");
//         } else if (currentScrollY > lastScrollY) {
//             // Scrolling down: hide navbar and apply floating-nav
//             setIsNavVisible(false);
//             navContainerRef.current.classList.add("floating-nav");
//         } else if (currentScrollY < lastScrollY) {
//             // Scrolling up: show navbar with floating-nav
//             setIsNavVisible(true);
//             navContainerRef.current.classList.add("floating-nav");
//         }

//         setLastScrollY(currentScrollY);
//     }, [currentScrollY, lastScrollY]);

//     useEffect(() => {
//         gsap.to(navContainerRef.current, {
//             y: isNavVisible ? 0 : -100,
//             opacity: isNavVisible ? 1 : 0,
//             duration: 0.2,
//         });
//     }, [isNavVisible]);

//     return (
//         <div
//             ref={navContainerRef}
//             className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
//         >
//             <header className="absolute top-1/2 w-full -translate-y-1/2">
//                 <nav className="flex size-full items-center justify-between p-4">
//                     {/* Logo and Product button */}
//                     <div className="flex items-center gap-7">
//                         <img src="/img/poliosmall_log.jpeg" alt="logo" className="w-10 rounded-full" />

//                         <div onClick={() => navigate('/full-chat')}>
//                             <Button
//                                 id="product-button"
//                                 title="Get Your Prediction"
//                                 rightIcon={<TiLocationArrow />}
//                                 containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
//                             />
//                         </div>
//                     </div>

//                     {/* Navigation Links and Audio Button */}
//                     <div className="flex h-full items-center">
//                         <div className="hidden md:block">
//                             {navItems.map((item, index) => (
//                                 <a
//                                     key={index}
//                                     href={`#${item.toLowerCase()}`}
//                                     className="nav-hover-btn"
//                                 >
//                                     {item}
//                                 </a>
//                             ))}
//                         </div>

//                         <button
//                             onClick={toggleAudioIndicator}
//                             className="ml-10 flex items-center space-x-0.5"
//                         >
//                             <audio
//                                 ref={audioElementRef}
//                                 className="hidden"
//                                 src="/audio/loop.mp3"
//                                 loop
//                             />
//                             {[1, 2, 3, 4].map((bar) => (
//                                 <div
//                                     key={bar}
//                                     className={clsx("indicator-line", {
//                                         active: isIndicatorActive,
//                                     })}
//                                     style={{
//                                         animationDelay: `${bar * 0.1}s`,
//                                     }}
//                                 />
//                             ))}
//                         </button>
//                     </div>
//                 </nav>
//             </header>
//         </div>
//     );
// };

// export default NavBar;

import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import Button from "./Button";
import { FiMenu, FiX } from "react-icons/fi";

const navItems = ["POlio IN Pakistan", "FAQS", "Knowledge Center", "Multimedia", "Contact Us"];

const NavBar = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navContainerRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const { y: currentScrollY } = useWindowScroll();
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (currentScrollY === 0) {
            setIsNavVisible(true);
            navContainerRef.current.classList.remove("floating-nav");
        } else if (currentScrollY > lastScrollY) {
            setIsNavVisible(false);
            navContainerRef.current.classList.add("floating-nav");
            setIsMobileMenuOpen(false);
        } else if (currentScrollY < lastScrollY) {
            setIsNavVisible(true);
            navContainerRef.current.classList.add("floating-nav");
        }
        setLastScrollY(currentScrollY);
    }, [currentScrollY, lastScrollY]);

    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100,
            opacity: isNavVisible ? 1 : 0,
            duration: 0.2,
        });
    }, [isNavVisible]);

    return (
        <>
            <div
                ref={navContainerRef}
                className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
            >
                <header className="absolute top-1/2 w-full -translate-y-1/2">
                    <nav className="flex size-full items-center justify-between p-4">
                        {/* Left Section - Logo */}
                        <div className="flex items-center">
                            <img 
                                src="/img/poliosmall_log.jpeg" 
                                alt="logo" 
                                className="w-10 rounded-full" 
                            />
                        </div>

                        {/* Right Section - Desktop Nav & Mobile Menu Button */}
                        <div className="flex items-center gap-8">
                            {/* Desktop Navigation */}
                            <div className="hidden md:flex h-full items-center gap-8">
                                {navItems.map((item, index) => (
                                    <a
                                        key={index}
                                        href={`#${item.toLowerCase()}`}
                                        className="nav-hover-btn text-sm font-medium text-gray-700 hover:text-blue-600"
                                    >
                                        {item}
                                    </a>
                                ))}
                                
                                <div onClick={() => navigate('/full-chat')}>
                                    <Button
                                        id="product-button"
                                        title="Get Voice Assistant"
                                        rightIcon={<TiLocationArrow />}
                                        containerClass="bg-blue-50 flex items-center justify-center gap-1 ml-4"
                                    />
                                </div>
                            </div>

                            {/* Mobile Menu Button - Right Side */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden text-gray-600 hover:text-gray-800 ml-4"
                            >
                                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </button>
                        </div>
                    </nav>
                </header>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                ref={mobileMenuRef}
                className={clsx(
                    "fixed top-20 z-40 w-full bg-white shadow-lg transition-all duration-300 md:hidden",
                    {
                        "opacity-0 -translate-y-4 pointer-events-none": !isMobileMenuOpen,
                        "opacity-100 translate-y-0": isMobileMenuOpen,
                    }
                )}
            >
                <div className="p-4 space-y-4">
                    {navItems.map((item, index) => (
                        <a
                            key={index}
                            href={`#${item.toLowerCase()}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item}
                        </a>
                    ))}
                    
                    <div 
                        onClick={() => {
                            navigate('/full-chat');
                            setIsMobileMenuOpen(false);
                        }}
                        className="pt-4 border-t border-gray-100"
                    >
                        <Button
                            id="mobile-product-button"
                            title="Get Voice Assistant"
                            rightIcon={<TiLocationArrow />}
                            containerClass="bg-blue-50 w-full flex items-center justify-center gap-1"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavBar;