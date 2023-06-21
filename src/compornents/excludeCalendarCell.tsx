import React, { FC, useState } from 'react';
import { TableCell, Tooltip, Button } from '@mui/material';
import { HdrAuto } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';


interface Exclude {
    date: string;
    excludedStatus: string;
    day: number;
    onSelect: (date: string, excludedStatus: string) => void;
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

    return { color: "black"};
};

const ExcludedCell: FC<Exclude> = ({ excludedStatus, date, day, onSelect, onHighlight,highlightedDates, unHighlightAll }) => {
    const isHighlighted = highlightedDates.includes(date)

    const handleClick = () => {
        onSelect(date, excludedStatus);
        if (!isHighlighted) {
          onHighlight(date);
        } else {
          onHighlight(date); // ハイライトを個別に解除するように修正
        }
      };

    return (
        <TableCell style={getButtonStyle(isHighlighted, day, date)}>
        <Tooltip title={`Date: ${date}`}>
            <Button color="secondary" onClick={handleClick}>
            <span>{day}</span>
            <span>{excludedStatus}</span>
            </Button>
        </Tooltip>
        </TableCell>
    );
};

export default ExcludedCell;
