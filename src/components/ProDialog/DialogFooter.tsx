import type { FCC } from '@/types/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';
import type { StackProps } from '@mui/material/Stack';

interface Props {
  BoxProps?: BoxProps;
  StackProps?: StackProps;
}

const DialogFooter: FCC<Props> = (props) => {
  const { children, BoxProps, StackProps } = props;
  return (
    <Wrapper {...BoxProps}>
      <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2} {...StackProps}>
        {children}
      </Stack>
    </Wrapper>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderColor: theme.palette.divider,
  marginBottom: '16px',
  marginRight:'10px'
}));

export default DialogFooter;
