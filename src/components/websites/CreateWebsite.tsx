import React, { useState, ChangeEvent, MouseEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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

const CreateWebsite: React.FC = () => {

  const userInfo = (typeof localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '') : '');

  const [code, setCode] = useState('');
  const [domain, setDomain] = useState('');
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [errOpen, setErrOpen] = useState(false);
  const [errOpen1, setErrOpen1] = useState(false);
  const [errorCode, setErrorCode] = React.useState<String>();
  const [errorDomain, setErrorDomain] = React.useState<String>();
  const [username, setUsername] = useState('');

  useEffect(() => {
      setUsername(userInfo.username);
  }, []);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setErrOpen(false);
    setErrOpen1(false);
  };

  const handleValidateCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      // Cho phép sử dụng: : / .
      let format = /[`!@#$%^&*()_+\=[\]{};'"\\|,<>/?~]/;
      let check = format.test(event.target.value);
      if (check) {
        return 'Nội dung không được chứa kí tự đặc biệt';
      }
      if (event.target.value.length < 1 || event.target.value.length > 50) {
        return 'Nội dung tối thiểu 1 kí tự, tối đa 50 kí tự';
      }
    }
  };

  const handleValidateDomain = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      // Cho phép sử dụng: : / .
      let format = /[`^*()+{};<>]/;
      let check = format.test(event.target.value);
      if (check) {
        return 'Nội dung không được chứa kí tự đặc biệt';
      }
      if (event.target.value.length < 1 || event.target.value.length > 50) {
        return 'Nội dung tối thiểu 1 kí tự, tối đa 50 kí tự';
      }
    }
  }

  const changeWebsiteCode = (event: ChangeEvent<HTMLInputElement>): void => {
    setCode((event.target as HTMLInputElement).value);
    setErrorCode(handleValidateCode(event));
  };

  const changeDomain = (event: ChangeEvent<HTMLInputElement>): void => {
    setDomain((event.target as HTMLInputElement).value);
    setErrorDomain(handleValidateDomain(event));
  };

  const saveWebsiteInfo = (event: MouseEvent<HTMLElement>): void => {
    if (code.length === 0 || domain.length === 0) {
      setErrOpen1(true);
      return;
    } else {
      if (
        (errorCode == null || typeof errorCode === 'undefined') &&
        (errorDomain == null || typeof errorDomain === 'undefined')
      ) {
        const WebsiteInfo = {
          id: 0,
          code: code,
          domain: domain,
          createdDate: new Date(),
          createdBy: username,
          webKey: 'code:' + code + ', domain: ' + domain,
        };
        WebsiteService.saveWebsite(WebsiteInfo).then((response) => {
          if (typeof response === 'undefined') {
            setErrOpen(true);
          } else {
            setOpen(true);
            history.push({
              pathname: '/website',
            });
          }
        });
      } else {
        setErrOpen(true);
      }
    }
  };

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
          Quay lại danh sách các website
        </Button>
        <Box sx={{ justifyContent: 'space-between', display: 'inline-flex', gap: 2 }}>
          <Button
            color="error"
            sx={{
              width: '100px',
            }}
            variant="outlined"
            onClick={() => {
              history.push('/website');
            }}
          >
            Thoát
          </Button>
          <Button
            variant="contained"
            sx={{
              width: '100px',
            }}
            onClick={(e) => saveWebsiteInfo(e)}
          >
            Lưu
          </Button>
        </Box>
      </Toolbar>
      <Box sx={{ m: 5 }}>
        <Typography variant="h5" sx={{ mb: 2, color: 'blue' }}>
          Thêm website mới
        </Typography>
        <Box sx={{ my: 5, mx: 'auto', width: '80%' }} style={BoxStyle}>
          <FormControl sx={{ width: '100%', gap: 3 }}>
            <TextField
              fullWidth
              label="Code của trang web"
              defaultValue=""
              error={Boolean(errorCode)}
              helperText={errorCode}
              onChange={changeWebsiteCode}
            />
            <TextField
              fullWidth
              label="Tên miền của trang web"
              error={Boolean(errorDomain)}
              helperText={errorDomain}
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
        <Snackbar open={errOpen1} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Bạn cần điền đẩy đủ thông tin.
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default CreateWebsite;
