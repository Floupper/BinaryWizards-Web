import React from 'react';

function ProgressBar({ progress }) {
    return (
        <div className="relative pt-5 w-11/12 self-center" >
            <div className="flex mb-0 items-center justify-between" >

            </div>
            < div className="flex mb-8" >
                <div className="w-full bg-gray-200 rounded-full h-4" >
                    <div
                        className="bg-gradient-to-r from-orange-400 to-green-400 h-4 rounded-full"
                        style={{ width: `${progress}%` }
                        }
                    > </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
