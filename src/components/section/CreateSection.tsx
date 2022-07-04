import * as React from 'react';
import { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Divider, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { Toolbar, Typography, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { BoxStyle, ToolbarStyle } from '../../styles/style';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const CreateSection: React.FC = () => {
  let history = useHistory();
  const userInfo = (typeof localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '') : '');

  const [code, setCode] = React.useState('');
  const [divId, setDivId] = React.useState('');
  const [displayMode, setDisplayMode] = React.useState<number>();
  const [desc, setDesc] = React.useState('');
  const [errorCode, setErrorCode] = React.useState<String>();
  const [errorDivId, setErrorDivId] = React.useState<String>();
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const [display, setDisplay] = React.useState('none');
  const [displayDemo, setDisplayDemo] = React.useState('none');
  const [errOpen, setErrOpen] = React.useState(false);
  const [errOpen1, setErrOpen1] = React.useState(false);
  const [displayDemoString, setDisplayDemoString] = React.useState('none');
  const [widthString, setWidthString] = React.useState('');
  const [heightString, setHeightString] = React.useState('');
  const [username, setUsername] = React.useState();

  useEffect(() => {
    setUsername(userInfo.username);
}, []);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrOpen(false);
    setErrOpen1(false);
  };
  const handleChangeDefinition = (event: SelectChangeEvent) => {
    if (event.target.value !== '0') {
      setDisplay('none');
      setDisplayDemo('block');
      setDisplayDemoString('none');
      const value = event.target.value as string;
      let indexX = value.indexOf('x');
      let width = parseInt(value.slice(0, indexX));
      let height = parseInt(value.slice(indexX + 1, value.length));
      setWidth(width);
      setHeight(height);
    } else {
      setDisplay('flex');
      setDisplayDemo('none');
    }
  };

  const handleChangeWidth = (e: any) => {
    setWidth(e.target.value);
    setWidthString(e.target.value + 'px');
  };
  const handleChangeHeight = (e: any) => {
    setHeight(e.target.value);
    setHeightString(e.target.value + 'px');
  };
  const handleChangeSize = () => {
    setDisplayDemoString('block');
  };

  const handleChangeDisplayMode = (event: SelectChangeEvent) => {
    setDisplayMode(event.target.value as unknown as number);
  };
  const handleValidateDivIdAndCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      let format = /[`!@#$%^&*()_+\-=[]{};':"\\|,.<>\/?~]/;
      let check = format.test(event.target.value);
      if (check) {
        return 'Nội dung không được chứa kí tự đặc biệt';
      } else if (event.target.value.length < 2 || event.target.value.length > 50) {
        return 'Nội dung tối thiểu 2 kí tự, tối đa 50 kí tự';
      }
    }
  };

  const handleChangeDivId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDivId(event.target.value as string);
    setErrorDivId(handleValidateDivIdAndCode(event));
  };
  const handleChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value as string);
    setErrorCode(handleValidateDivIdAndCode(event));
  };
  const handleChangeDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(event.target.value as string);
  };

  const saveSection = (event: any) => {
    if (
      divId == null ||
      desc == null ||
      displayMode == null ||
      code == null ||
      width == null ||
      height == null
    ) {
      setErrOpen1(true);
    } else if (
      errorDivId == null ||
      typeof errorDivId === 'undefined' ||
      errorCode == null ||
      typeof errorCode === 'undefined'
    ) {
      event.preventDefault();
      let sectionItem = {
        divId: divId,
        desc: desc,
        mode: displayMode,
        code: code,
        width: width,
        height: height,
        createdBy: username,
      };
      axios.post('/api/sections', sectionItem).then(() => {
        history.goBack();
      });
    } else {
      setErrOpen(true);
    }
  };
  return (
    <div>
      <Toolbar variant="dense" style={ToolbarStyle}>
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
          Quay lại danh sách các khu vực
        </Button>
        <Box sx={{ justifyContent: 'space-between', display: 'inline-flex', gap: 2 }}>
          <Button
            sx={{ minWidth: '100px' }}
            variant="outlined"
            color="error"
            onClick={() => {
              history.push('/section');
            }}
          >
            Hủy
          </Button>
          <Button
            sx={{ minWidth: '100px' }}
            variant="contained"
            onClick={(e) => saveSection(e)}
          >
            Lưu lại
          </Button>
        </Box>
      </Toolbar>
      <Box sx={{ m: 5 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Thêm khu vực mới
        </Typography>
        <Box
          component="form"
          sx={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            gap: '2%',
            width: '100%',
          }}
          style={BoxStyle}
        >
          <TextField
            label="Nhập div_id"
            autoComplete="off"
            required
            inputProps={{ maxLength: 50 }}
            type="text"
            error={Boolean(errorDivId)}
            helperText={errorDivId}
            value={divId || ''}
            onChange={handleChangeDivId}
            sx={{ width: '49%' }}
          />
          <TextField
            label="Nhập mã khu vực"
            autoComplete="off"
            required
            inputProps={{ maxLength: 50 }}
            type="text"
            error={Boolean(errorCode)}
            helperText={errorCode}
            value={code || ''}
            onChange={handleChangeCode}
            sx={{ width: '49%' }}
          />
          <TextField
            label="Mô tả"
            type="text"
            onChange={handleChangeDesc}
            sx={{ width: '100%', mt: 3 }}
          />
          <FormControl sx={{ mt: 3, width: '49%' }}>
            <InputLabel required>Trạng thái hiển thị</InputLabel>
            <Select onChange={handleChangeDisplayMode} label="Trạng thái hiển thị *">
              <MenuItem value={'0'}>Hiển thị ngẫu nhiên</MenuItem>
              <MenuItem value={'1'}>Hiển thị theo tỉ trọng</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ mt: 3, width: '49%' }}>
            <InputLabel id="demo-simple-select-label" required>
              Kích cỡ khu vực
            </InputLabel>
            <Select
              defaultValue=""
              label="Kích cỡ khu vực *"
              onChange={handleChangeDefinition}
            >
              <MenuItem value={'300x100'}>300x100 px</MenuItem>
              <MenuItem value={'728x90'}>728x90 px</MenuItem>
              <MenuItem value={'300x200'}>300x200 px</MenuItem>
              <MenuItem value={'240x400'}>240x400 px</MenuItem>
              <MenuItem value={'180x150'}>180x150 px</MenuItem>
              <MenuItem value={'336x280'}>336x280 px</MenuItem>
              <MenuItem value={'120x600'}>120x600 px</MenuItem>
              <MenuItem value={'160x600'}>160x600 px</MenuItem>
              <MenuItem value={'300x600'}>300x600 px</MenuItem>
              <MenuItem value={'720x300'}>720x300 px</MenuItem>
              <MenuItem value={'468x60'}>468x60 px</MenuItem>
              <MenuItem value={'234x60'}>234x60 px</MenuItem>
              <MenuItem value={'120x240'}>120x240 px</MenuItem>
              <MenuItem value={'250x250'}>250x250 px</MenuItem>
              <MenuItem value={'0'}>Khác</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box
            sx={{
              display: display,
              flexDirection: 'column',
              mt: 3,
              width: '30%',
              gap: 3,
              mr: 3,
              height: 'fit-content',
            }}
            style={BoxStyle}
          >
            <TextField
              label="Nhập chiều dài"
              required
              type="number"
              value={width}
              fullWidth
              onChange={handleChangeWidth}
            />
            <TextField
              label="Nhập chiều cao"
              required
              type="number"
              value={height}
              fullWidth
              onChange={handleChangeHeight}
            />
            <Button variant="contained" onClick={() => handleChangeSize()}>
              Demo
            </Button>
          </Box>
          <Box sx={{ mt: 3, display: displayDemo }} style={BoxStyle}>
            <Typography variant="h6">Demo khu vực</Typography>
            <Divider sx={{ m: 1 }} />
            <Box
              sx={{
                width: width,
                height: height,
                backgroundColor: 'lightgray',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {width}x{height}
            </Box>
          </Box>
          <Box sx={{ mt: 3, display: displayDemoString }} style={BoxStyle}>
            <Typography variant="h6">Demo khu vực</Typography>
            <Divider sx={{ m: 1 }} />
            <Box
              sx={{
                width: widthString,
                height: heightString,
                backgroundColor: 'lightgray',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {width}x{height}px
            </Box>
          </Box>
        </Box>
      </Box>
      <Snackbar open={errOpen} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Lưu thất bại.
        </Alert>
      </Snackbar>
      <Snackbar open={errOpen1} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Bạn cần nhập đầy đủ thông tin trước khi lưu.
        </Alert>
      </Snackbar>
    </div>
  );
};
export default CreateSection;
