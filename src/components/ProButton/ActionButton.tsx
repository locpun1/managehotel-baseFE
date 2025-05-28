import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import LoginIcon from '@mui/icons-material/Login';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import type { LoadingButtonProps } from '@mui/lab/LoadingButton';
import LoadingButton from '@mui/lab/LoadingButton';

import Logger from '@/utils/Logger';

const Icons = {
  search: SearchIcon,
  download: FileDownloadIcon,
  save: SaveIcon,
  cancel: CloseIcon,
  delete: DeleteIcon,
  check: CheckIcon,
  add: AddIcon,
  upload: UploadIcon,
  return: KeyboardReturnIcon,
  forward: ArrowForwardIcon,
  outward: ArrowOutwardIcon,
  login: LoginIcon,
  edit: EditIcon,
  expand: ExpandMoreIcon,
  print: PrintIcon,
} as const;

interface Props extends LoadingButtonProps {
  actionType?: keyof typeof Icons;
  iconPosition?: 'start' | 'end';
  onSubmit?: () => Promise<void>;
  backgroundColor?:string;
  border?: string,
  borderRadius?:string,
  fontColor?: string
  form?:string,
}

const ActionButton = (props: Props) => {
  const { actionType, iconPosition , onSubmit, loading,backgroundColor, border,fontColor, borderRadius,form, ...rest } = props;

  const [submitting, setSubmitting] = useState<boolean>(false);

  const Icon = actionType && Icons[actionType];

  const handleSubmit = async () => {
    if (!onSubmit) {
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit();
    } catch (error) {
      Logger.log(error);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <LoadingButton
      form={form}
      type={form ? 'submit' : 'button'} // 👈 CHỈNH DÒNG NÀY
      onClick={!form ? handleSubmit : undefined} // Nếu là form submit thì KHÔNG override
      loading={submitting || loading}
      {...(actionType && {
        loadingPosition: iconPosition,
        startIcon: Icon && iconPosition === 'start' ? <Icon /> : void 0,
        endIcon: Icon && iconPosition === 'end' ? <Icon /> : void 0,
        variant: actionType === 'cancel' ? 'outlined' : void 0,
      })}
      style={{
        backgroundColor,
        border,
        borderRadius,
        color: fontColor,
        width:"80px",
        ...rest.style
      }}
      {...rest}
    />
  );
};

export default ActionButton;
