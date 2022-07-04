import React, { useState, ChangeEvent, MouseEvent, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  TextField,
  Box,
  Typography,
  FormControl,
  Toolbar,
  Button,
  Snackbar,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { BoxStyle, ToolbarStyle } from '../../styles/style';

import WebsiteService from '../../services/WebsiteService';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type WebsiteInfo = {
  id: number;
  code: string;
  domain: string;
  createdDate?: Date;
  lastModifiedDate?: Date;
  createdBy?: string;
  lastModifiedBy?: string;
  webKey: string;
};

interface CustomState {
  detail: WebsiteInfo;
}

const UpdateWebsite: React.FC = () => {
  const location = useLocation();
  const state = location.state as CustomState;
  const history = useHistory();
  const userInfo = (typeof localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '') : '');

  const [code, setCode] = useState(state.detail.code);
  const [domain, setDomain] = useState(state.detail.domain);
  const [open, setOpen] = useState(false);
  const [errOpen, setErrOpen] = useState(false);
  const [errorCode, setErrorCode] = React.useState<String>();
  const [errorDomain, setErrorDomain] = React.useState<String>();
  const [username, setUsername] = useState();

  useEffect(() => {
    setUsername(userInfo.username);
  }, []);

  const handleValidateCodeAndDomain = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      // Cho phép sử dụng: : / . 
      let format = /[`!@#$%^&*()_+\-=[\]{};'"\\|,<>/?~]/;
      let check = format.test(event.target.value);
      if (check) {
        return 'Nội dung không được chứa kí tự đặc biệt';
      }
      if (event.target.value.length < 1 || event.target.value.length > 50) {
        return 'Nội dung tối thiểu 1 kí tự, tối đa 50 kí tự';
      }
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setErrOpen(false);
  };

  const changeCode = (event: ChangeEvent<HTMLInputElement>): void => {
    setCode((event.target as HTMLInputElement).value);
    setErrorCode(handleValidateCodeAndDomain(event));
  };

  const changeDomain = (event: ChangeEvent<HTMLInputElement>): void => {
    setDomain((event.target as HTMLInputElement).value);
    setErrorDomain(handleValidateCodeAndDomain(event));
  };

  const updateWebsiteInfo = (event: MouseEvent<HTMLElement>): void => {

    if((errorCode == null || typeof errorCode === 'undefined') && (errorDomain == null || typeof errorDomain === 'undefined')){
    const websiteInfo = {
      id: state.detail.id,
      code: code,
      domain: domain,
      createdDate: state.detail.createdDate,
      lastModifiedDate: new Date(),
      createdBy: state.detail.createdBy,
      lastModifiedBy: username,
      webKey: state.detail.webKey,
    };
    WebsiteService.updateWebsite(websiteInfo).then((response) => {
      if (typeof response === 'undefined') {
        setErrOpen(true);
      } else {
        setOpen(true);
        history.push('/website');
      }
    });
    } else {
      setErrOpen(true);
    }
  };

  // const updateWebsiteInfo = (event: MouseEvent<HTMLElement>): void => {
  //   const websiteInfo = {
  //     id: state.detail.id,
  //     code: code,
  //     domain: domain,
  //     createdDate: state.detail.createdDate,
  //     lastModifiedDate: new Date(),
  //   };
  //   console.log(websiteInfo);
  //   WebsiteService.updateWebsite(websiteInfo);
  // };

  return (
    <div>
      <Toolbar variant="dense" sx={ToolbarStyle}>
        <Button
          onClick={() => history.goBack()}
          variant="text"
          sx={{
            color: '#637381',
            fontSize: '14px',
            textTransform: 'none',
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: '14px', mr: '5px' }} />
          Quay lại chi tiết website
        </Button>
        <Box sx={{ justifyContent: 'space-between', display: 'inline-flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              history.push('/website');
            }}
          >
            Hủy
          </Button>
          <Button variant="contained" onClick={(e) => updateWebsiteInfo(e)}>
            Lưu
          </Button>
        </Box>
      </Toolbar>
      <Box sx={{ m: 5 }}>
        <Typography variant="h5" mb={2}>
          Chỉnh sửa thông tin website
        </Typography>
        <Box sx={{ my: 5, mx: 'auto', width: '80%' }} style={BoxStyle}>
          <FormControl sx={{ gap: 3, width: '100%' }}>
            <TextField
              fullWidth
              label="Code"
              defaultValue=""
              error={Boolean(errorCode)}
              helperText={errorCode}
              value={code || ''}
              onChange={changeCode}
            />
            <TextField
              fullWidth
              label="Website Domain"
              error={Boolean(errorDomain)}
              helperText={errorDomain}
              value={domain || ''}
              onChange={changeDomain}
            />
          </FormControl>
        </Box>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Lưu thành công!
          </Alert>
        </Snackbar>
        <Snackbar open={errOpen} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Lưu không thành công
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default UpdateWebsite;
