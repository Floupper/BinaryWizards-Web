import React from 'react';

function ProgressBar({ progress }) {
    return (
        <div className="relative  w-11/12 self-center" >
            <div className="flex mb-0 items-center justify-between" >
            </div>
            < div className="flex" >
                <div className="w-full bg-gray-200 rounded-full h-4" >
                    <div
                        className="bg-gradient-to-r to-[#377DC9] via-[#8A2BF2] from-[#E7DAB4] h-4 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${progress}%` }
                        }
                    > </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
