import { ReactNode } from 'react';

import { Box, DialogProps } from '@mui/material';
import ActionButton from '@/components/ProButton/ActionButton';
import DialogContainer from '@/components/ProDialog/DialogContainer';
import DialogContent from '@/components/ProDialog/DialogContent';
import DialogFooter from '@/components/ProDialog/DialogFooter';
import DialogHeader from '@/components/ProDialog/DialogHeader';

interface Props extends Omit<DialogProps, 'open' | 'fullScreen'> {
  dialogKey: string | null | boolean;
  handleClose: () => void;
  children: ReactNode;
  dialogTitle?: string;
  dialogContentHeight?: string | number;
  showSaveButton?: boolean;
  customButtons?: ReactNode;
  hasError?: boolean,
  isActiveFooter?:boolean
}

const DialogComponent = ({
  dialogKey,
  handleClose,
  children,
  dialogTitle,
  dialogContentHeight,
  showSaveButton = false,
  customButtons,
  hasError,
  isActiveFooter = true,
  ...rest
}: Props) => {
  
  return (
    <DialogContainer {...rest} open={!!dialogKey} onClose={handleClose}>
      {isActiveFooter && <DialogHeader onClose={handleClose} title={dialogTitle || ''} marginTop={2} />}
      <DialogContent sx={{ textAlign: isActiveFooter ? "" : "center", maxHeight: 'fit-content'}}>
        {/* <Box sx={{ height: {xs: hasError ? 800 : 500, md: hasError ? 420 : 350}, padding: 2, maxHeight:"fit-content" }}>{children}</Box> */}
        <Box sx={{ padding: 2}}>{children}</Box>
      </DialogContent>
      {isActiveFooter &&<DialogFooter>
        {customButtons}
        <ActionButton border='1px solid #00C7BE' fontColor='#00C7BE' actionType='cancel' onClick={handleClose}>
          Hủy
        </ActionButton>
      </DialogFooter>
      }
    </DialogContainer>
  );
};

export default DialogComponent;
