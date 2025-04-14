
import React from 'react';

const AboutMe = () => {
    return (
        <div className="p-6 shadow-lg rounded-lg bg-[#26292A] mt-10 mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-center text-teal-200 mb-8">About Me</h1>
            
            <Section title="Current Position">
                <p className="mb-6 text-gray-300">
                    I am <strong>Dr. Muhammad Mohsin Khan</strong>, an <Highlight>Assistant Professor</Highlight> at the {' '}
                    <Highlight>Sino-Pak Center for Artificial Intelligence (SPCAI)</Highlight>, Pak-Austria Fachhochschule: Institute of Applied Sciences and Technology (PAF-IAST), Haripur, Pakistan. 
                    With over <Highlight>15 years</Highlight> of combined teaching and research experience, I specialize in {' '}
                    <Highlight>Artificial Intelligence (AI), Machine Learning (ML), Biomedical Imaging, and Cloud Computing</Highlight>.
                </p>
            </Section>

            <Section title="Education & Training">
                <p className="mb-6 text-gray-300">
                    • Completed <Highlight>Postdoctoral research</Highlight> at Yale University's Department of Radiology and Biomedical Imaging (USA), focusing on AI-driven medical imaging<br/>
                    • Earned <Highlight>PhD in Electronic Engineering</Highlight> through a split-degree program: coursework at IIUI Islamabad and research at Queen Mary University London<br/>
                    • Dissertation: <Highlight>"Efficient Computer Diagnostic System for Early Detection of Cancer"</Highlight> developed deep learning tools for breast cancer detection
                </p>
            </Section>

            <Section title="Research Leadership">
                <p className="mb-6 text-gray-300">
                    • Principal Investigator for HEC-funded project on <Highlight>automated stroke detection using deep neural networks</Highlight><br/>
                    • Supervised <Highlight>12+ graduate students</Highlight> in AI applications for healthcare and industrial automation<br/>
                    • Published <Highlight>20+ peer-reviewed papers</Highlight> in top-tier journals and conferences
                </p>
            </Section>

            <Section title="Academic Contributions">
                <p className="mb-6 text-gray-300">
                    • Recipient of <Highlight>Best University Teacher Award</Highlight> at International Islamic University Islamabad<br/>
                    • Certified <Highlight>HEC Master Trainer</Highlight> and <Highlight>Professional Engineer</Highlight> (Pakistan Engineering Council)<br/>
                    • Key roles in curriculum development and quality assurance committees
                </p>
            </Section>

            <Section title="Technical Focus">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BulletList items={[
                        'Medical image analysis',
                        'Computer vision',
                        'Cloud infrastructure',
                        'AI-driven diagnostics'
                    ]}/>
                    <BulletList items={[
                        'Biomedical imaging systems',
                        'Industrial automation',
                        'Intelligent decision systems',
                        'Healthcare optimization'
                    ]}/>
                </div>
            </Section>

            <div className="mt-8 border-t border-gray-600 pt-6">
                <p className="text-lg italic text-gray-400">
                    "Driven to create AI solutions that transform healthcare, enhance industrial automation, and empower data-driven decision making across sectors."
                </p>
            </div>
        </div>
    );
};

// Reusable components
const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-semibold text-teal-300 mb-4">{title}</h2>
        {children}
    </div>
);

const Highlight = ({ children }) => (
    <span className="text-teal-200 font-medium">{children}</span>
);

const BulletList = ({ items }) => (
    <ul className="list-disc list-inside space-y-2">
        {items.map((item, index) => (
            <li key={index} className="text-gray-300">
                <span className="text-teal-200">•</span> {item}
            </li>
        ))}
    </ul>
);

export default AboutMe;