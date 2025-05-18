import React, { useState } from 'react';
import "./TopBar.css"
import { Knob } from 'primereact/knob';
import { Tooltip } from 'primereact/tooltip';

const TopBar: React.FC = () => {

    const courseTitle = 'Web Design for Web Developers: Build Beautiful Websites!'
    // Dữ liệu giả lập cho tiến độ
    const [knobValue, setKnobValue] = useState<number>(4); // complete lessons
    const totalLessons = 21;

    return (
        <div className='align-items-center flex justify-content-center' style={{ color: '#fff', backgroundColor: '#1d1e27', height: '4rem', borderBottom: '1px solid #595c73' }}>
            <div className='h-full w-full relative' style={{ padding: '0 1.6rem' }}>
                <header className='flex justify-content-between align-items-center gap-4 h-full'>
                    <a href="/" style={{ color: '#6d28d2', textDecoration: 'none' }}>
                        <img src="/Logo.svg" alt="TOEIC STUDY" className='max-w-full h-auto' style={{ verticalAlign: 'middle' }} loading='lazy' />
                    </a>

                    <div className='' style={{ height: '40%', borderLeft: '1px solid #595c73' }}></div>
                    
                    <div className='flex flex-1' style={{ minWidth: '1px' }}>
                        <h1 className='max-w-full course-title' style={{ fontSize: 'inherit', fontWeight: 'normal' }}>
                            <a href="/courses/0" className='course-title align-items-center' style={{ color: '#ffffff', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>{courseTitle}</a>
                        </h1>
                        <div className='flex-1' style={{ minWidth: '1px'}}></div>
                    </div>

                    <div className='relative flex align-items-center'>
                        <Tooltip target=".knob" content={`${knobValue} of ${totalLessons} complete`} position='bottom'/>
                        <Knob className='knob' value={knobValue} readOnly showValue={false} size={50} strokeWidth={5} min={0} max={totalLessons} />
                        <span>Your progress</span>
                    </div>
                </header>
            </div>
        </div >
    )
}

export default TopBar;