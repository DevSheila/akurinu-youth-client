import React, { useState } from 'react';
import WidgetsFollow from '../WidgetsFollow/WidgetsFollow';
import SearchWidget from '../../elements/SearchWidget/SearchWidget';
import './Widgets.css';

const Widgets = () => {
    const [text, setText] = useState('');

    return (
        <div className='widgets'>
            <SearchWidget 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                placeholder='Search Users'
            />
            <WidgetsFollow searchText={text} />
        </div>
    );
};

export default Widgets;
