import React, { useEffect, useState } from 'react';

const useClasses = () => {

    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5001/classes')
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                setClasses(data)
                setLoading(false);
            })
    }, [])
    return [classes, loading]
};

export default useClasses;