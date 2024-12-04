import React from 'react';

function ProgressBar({ progress }) {
    return (
        <div className="relative pt-1" >
            <div className="flex mb-2 items-center justify-between" >
                <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-100" >
                    Progress
                </div>
            </div>
            < div className="flex mb-2" >
                <div className="w-full bg-gray-200 rounded-full h-2.5" >
                    <div
                        className="bg-gradient-to-r from-orange-400 to-green-400 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }
                        }
                    > </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
