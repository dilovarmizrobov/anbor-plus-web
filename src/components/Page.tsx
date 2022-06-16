import React from 'react';
import {Helmet, HelmetProvider} from "react-helmet-async";

const Page: React.FC<{title: string}> = ({title}) => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
            </Helmet>
        </HelmetProvider>
    );
};

export default React.memo(Page);
