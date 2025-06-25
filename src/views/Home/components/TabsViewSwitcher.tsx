import { Box, Tabs, Tab } from '@mui/material';
import { CalendarToday, CalendarViewWeek, CalendarMonth } from '@mui/icons-material';
import React from 'react';

type ViewMode = 'daily' | 'weekly' | 'monthly';

interface Props {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  from?: string
}

const TabsViewSwitcher: React.FC<Props> = ({ viewMode, onChange, from }) => {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    onChange(newValue as ViewMode);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', flexGrow: 1 }}>
      <Tabs value={viewMode} onChange={handleChange} variant="fullWidth">
        <Tab icon={<CalendarToday />} label="Ngày" value="daily" />
        <Tab icon={<CalendarViewWeek />} label="Tuần" value="weekly" />
        {!from &&<Tab icon={<CalendarMonth />} label="Tháng" value="monthly" />}
      </Tabs>
    </Box>
  );
};

export default TabsViewSwitcher;
