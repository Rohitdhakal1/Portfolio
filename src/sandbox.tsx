import React from 'react';
import { Tag } from './components/ui/Tag';
import { Button } from './components/ui/Button'; // <-- 1. Import the new one
import Logo from './components/ui/Logo';
import Field from './components/ui/Field';
import Sidebar from './components/home/Sidebar';
import Footer from './components/home/Footer';
import StatusClock from './components/scenary/StatusClock';
import ProjectCard from './components/home/ProjectCard';
import ProjectIndexCard from './components/home/ProjectIndexCard';

export const Sandbox: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg p-12 space-y-12 font-body">

            {/* SECTION 1: TAGS */}
            <div className="space-y-4">
                <h2 className="text-subtitle font-mono text-ink-dim border-b border-bg-neutral-2 pb-2">Tags</h2>
                <div className="flex gap-4">
                    <Tag variant="neutral">Neutral Tag</Tag>
                    <Tag variant="muted">Muted Tag</Tag>
                    <Tag variant="outline">Outline Tag</Tag>
                </div>
            </div>

            {/* SECTION 2: BUTTONS (Add this when you build Button.tsx!) */}
            <div className="space-y-4">
                <h2 className="text-subtitle font-mono text-ink-dim border-b border-bg-neutral-2 pb-2">Buttons</h2>
                <div className="flex gap-4">
                    <Button>Default Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button href="https://google.com" target="_blank">
                        Open Google
                    </Button>
                </div>
            </div>
            {/* SECTION 3: logo */}
            <div className="space-y-4">
                <h2 className="text-subtitle font-mono text-ink-dim border-b border-bg-neutral-2 pb-2">LOGO</h2>
                <div className="flex gap-4">
                    <Logo width={60} height={48} alt="My Portfolio" />
                </div>
            </div>

            {/* SECTION 4: Field */}
            <div className="space-y-4">
                <h2 className="text-subtitle font-mono text-ink-dim border-b border-bg-neutral-2 pb-2">Field</h2>
                <div className="flex gap-4">
                    <Field name="firstname" label="Name" placeholder="Enter your firstname" required />
                    <Field name="lastname" label="lastname" placeholder="Enter your lastname" required />
                    <Field name="email" label="Email" placeholder="Enter your email" required type="email" />
                    <Field name="url" label="Url" placeholder="Enter your url" required type="url" />
                    <Field name="message" label="Message" placeholder="Enter your message..." required multiline />
                </div>
            </div>
            {/* SECTION 5: sidebar */}
            <div className="space-y-4">
                <h2 className="text-subtitle font-mono text-ink-dim border-b border-bg-neutral-2 pb-2">Sidebar</h2>
                <div className="flex gap-4">
                    <Sidebar
                        active="work"
                        visitorCard={{
                            name: "Rohit",
                            color: "teal",
                            number: 1,
                        }}
                    />
                    <main className="p-12">
                        <h1 className="text-3xl">Sidebar Sandbox</h1>
                        <p className="mt-4">
                            This is the content beside the sidebar.
                        </p>
                    </main>
                </div>
            </div>


            {/* SECTION 6: Footer */}
            <div className="space-y-4">
                <h2 className="text-subtitle font-mono text-ink-dim border-b border-bg-neutral-2 pb-2">Footer</h2>
                <div className="flex gap-4">
                    <Footer color="orange" active="about" />
                    <Footer color="teal" active="home" />
                    <Footer color="green" active="playground" />
                    <Footer color="pink" active="gallery" />

                </div>
            </div>
            {/* SECTION 7: statusClock */}
            <div className="space-y-4">
                <h2 className="text-subtitle font-mono text-ink-dim border-b border-bg-neutral-2 pb-2">StatusClock</h2>
                <div className="flex gap-4">
                    <StatusClock />
                </div>
            </div>
            {/* SECTION 8: projectcard */}
            <div className="space-y-4">
                <h2 className="text-subtitle font-mono text-ink-dim border-b border-bg-neutral-2 pb-2">projectcard</h2>
                <div className="flex gap-4">
                    <ProjectCard
                        title="ShrinkIt URL Shortener"
                        status="SHIPPED"
                        accent="teal"
                        sideProject={true}
                        href="https://github.com/Rohitdhakal1/ShrinkIt_urlShortner"
                    />
                    <ProjectCard
                        title="Comfi Space Chat App"
                        status="SHIPPED"
                        accent="pink"
                        sideProject={true}
                        href="https://github.com/Rohitdhakal1/ComfiSpace-ChatApp"
                    />
                </div>
                <ProjectCard
                    title="AI-Powered Health Platform"
                    status="SHIPPED"
                    accent="orange"
                    sideProject={false}
                    href="https://github.com/Rohitdhakal1/Ai-HealthTracking"
                />
                <ProjectCard
                    title="AI PPT Generator"
                    status="SHIPPED"
                    accent="green"
                    sideProject={false}
                    href="https://github.com/Rohitdhakal1/Ai-ppt-generator-"
                />

            </div>
            {/* SECTION 8: projectIndecCard*/}
            <div className="space-y-4">
                <h2 className="text-subtitle font-mono text-ink-dim border-b border-bg-neutral-2 pb-2">projectcard</h2>
                <div className="flex gap-4">
                    <ProjectIndexCard
                        title="ShrinkIt URL Shortener"
                        image="https://github.com/Rohitdhakal1/ShrinkIt_urlShortner/blob/main/assets/ShrinkIt-logo.png?raw=true"
                        description="ShrinkIt is a URL shortening service that allows you to shorten your long URLs into short URLs. It is a free URL shortening service that is easy to use and efficient."
                        href="https://github.com/Rohitdhakal1/ShrinkIt_urlShortner"
                    />
                    <ProjectIndexCard
                        title="Comfi Space Chat App"
                        image="https://github.com/Rohitdhakal1/ShrinkIt_urlShortner/blob/main/assets/ShrinkIt-logo.png?raw=true"
                        description="Comfi Space is a chat application that allows you to chat with your friends and family. It is a free chat application that is easy to use and efficient."
                        href="https://github.com/Rohitdhakal1/ComfiSpace-ChatApp"
                    />
                </div>
                <ProjectIndexCard
                    title="AI-Powered Health Platform"
                    image="https://github.com/Rohitdhakal1/ShrinkIt_urlShortner/blob/main/assets/ShrinkIt-logo.png?raw=true"
                    description="AI-Powered Health Platform is a health platform that uses AI to track your health and fitness. It is a free health platform that is easy to use and efficient."
                    href="https://github.com/Rohitdhakal1/Ai-HealthTracking"
                />
                <ProjectIndexCard
                    title="AI PPT Generator"
                    image="https://github.com/Rohitdhakal1/ShrinkIt_urlS    hortner/blob/main/assets/ShrinkIt-logo.png?raw=true"
                    description="AI PPT Generator is a tool that uses AI to generate PPTs. It is a free tool that is easy to use and efficient."
                    href="https://github.com/Rohitdhakal1/Ai-ppt-generator-"
                />

            </div>

        </div>
    );
};