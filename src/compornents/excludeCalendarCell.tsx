import React, { FC, useState } from 'react';
import { TableCell, Tooltip, Button } from '@mui/material';
import { HdrAuto } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';


interface Exclude {
    id: number;
    date: string;
    day: number;
    onSelect: (date: string) => void;
    onHighlight: (date: string) => void;
    highlightedDates: string[];
    unHighlightAll: () => void;
}


const theme = createTheme({
palette: {
    primary: {
    // Purple and green play nicely together.
    main: purple[500],
    },
    secondary: {
    // This is green.A700 as hex.
    main: '#11cb5f',
    },
},
});

const getButtonStyle = (highlighted:boolean, day:number, date:string) => {
const currentDate = new Date();
const buttonDate = new Date(date);
if (highlighted){
    return { backgroundColor: "yellow" };
}
if (buttonDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) {
    return { backgroundColor: "black", color: "white" };
}
return { color: "black"};
};

const ExcludedCell: FC<Exclude> = ({ id, date, day, onSelect, onHighlight,highlightedDates, unHighlightAll }) => {
const [highlighted, setHighlighted] = useState(false);
const isHighlighted = highlightedDates.includes(date)

const handleClick = () => {
    setHighlighted(!highlighted);
    onSelect(date);
    if (!highlighted) {
    onHighlight(date);
    } else {
    unHighlightAll();
    }
};

return (
    <TableCell style={getButtonStyle(isHighlighted, day, date)}>
    <Tooltip title={`Date: ${date}`}>
        <Button color="secondary" onClick={handleClick}>
        <span>{day}</span>
        </Button>
    </Tooltip>
    </TableCell>
);
};

export default ExcludedCell;
