// import { Result } from 'antd';
// //import React from 'react';

// const App = () => {
//     return (
    
//     <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
//     )
// }


// export default App;
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Result } from 'antd';

const App = () => {
    const [showResult, setShowResult] = useState(false); // State to control when to show the Result

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowResult(true); // After 2 seconds, set showResult to true
        }, 500);

        return () => {
            clearTimeout(timeoutId); // Clear the timeout if the component unmounts
        };
    }, []); // Empty dependency array to run the effect only once

    return (
        <div>
            {showResult && (
                <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
            )}
        </div>
    );
}

export default App;

