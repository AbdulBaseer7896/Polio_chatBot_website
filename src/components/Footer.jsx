import React from "react";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-600 text-white py-6 px-4 md:px-8">
      {/* Container */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Section: Logo or Icon */}
        <div className="flex items-center">
          {/* Replace with your own logo/image */}
          <img
            src="/img/PolioLogoPic.png"
            alt="Polio Association for International Travel"
            className="w-44 h-auto mr-4"
          />
          <div className="hidden md:block">
            <p className="font-bold">
              Polio Association
              <br />
              For International Travel
            </p>
          </div>
        </div>

        {/* Center Section: Address & Info */}
        <div className="text-center md:text-center">
          <h2 className="text-lg font-bold uppercase">
            National Emergency Operations Centre
          </h2>
          <p className="text-sm leading-tight mt-1">
            EPI Building Block-2, Prime Minister’s Health Complex, 
            <br />
            Chak Shahzad, 44000, Islamabad
          </p>
          <p className="text-sm leading-tight mt-1">
            Helpline: <span className="font-bold">1166</span>
          </p>
        </div>

        {/* Right Section: Socials, Legal, Contact */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-4">
            {/* Replace href with your actual links */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <FaYoutube size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <FaInstagram size={20} />
            </a>
          </div>
          <div className="text-sm">
            <a href="#legal" className="hover:underline">
              Legal
            </a>
            <span className="mx-2">|</span>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
