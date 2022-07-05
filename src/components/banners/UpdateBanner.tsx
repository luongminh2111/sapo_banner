import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../configs/FireBase';
import { v4 } from 'uuid';
import { SelectChangeEvent } from '@mui/material';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Toolbar, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { BoxStyle, ToolbarStyle } from '../../styles/style';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Input = styled('input')({
  display: 'none',
});

type BannerInfo = {
  id: number;
  code: string;
  title: string;
  imgUrl: string;
  url: string;
  type: string;
  popUp: number;
  width: number;
  height: number;
  createdBy: string;
  lastModifiedBy: string;
  createdDate?: Date;
  lastModifiedDate?: Date;
};
interface CustomState {
  detail: BannerInfo;
}

const UpdateBanner: React.FC = (props: any) => {
  let id = props.match.params.id;
  const location = useLocation();
  const state = location.state as CustomState;
  let history = useHistory();
  const userInfo = (typeof localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '') : '');

  const [code, setCode] = React.useState(state.detail.code);
  const [title, setTitle] = React.useState(state.detail.title);
  const [type, setType] = React.useState(state.detail.type);
  const [popUp, setPopUp] = React.useState<string>(
    state.detail.popUp === 0 ? 'Không' : 'Có'
  );
  const [linkUrl, setLinkUrl] = React.useState(state.detail.url);
  const [fileName, setFileName] = React.useState('');
  const [imageUpload, setImageUpload] = React.useState(null);
  const [preViewImage, setPreViewImage] = React.useState(state.detail.imgUrl);
  const [oldImage, setOldImage] = React.useState('');
  const [display, setDisplay] = React.useState(
    state.detail.type == 'Khac' ? 'none' : 'block'
  );
  const [errorCode, setErrorCode] = React.useState<String>();
  const [errorInputWebUrl, setErrorInputWebUrl] = React.useState<String>();
  const [errorInputUtmSource, setErrorInputUtmSource] = React.useState<String>();
  const [errorInputUtmMedium, setErrorInputUtmMedium] = React.useState<String>();
  const [errorInputUtmCampaign, setErrorInputUtmCampaign] = React.useState<String>();
  const [errorTitle, setErrorTitle] = React.useState<String>();
  const [widthImg, setWidthImg] = React.useState(state.detail.width);
  const [heightImg, setHeightImg] = React.useState(state.detail.height);
  const [open, setOpen] = React.useState(false);
  const [errOpen, setErrOpen] = React.useState(false);
  const [webUrl, setWebUrl] = React.useState('');
  const [source, setSource] = React.useState('');
  const [campaignName, setCampaignName] = React.useState('');
  const [campaignMedium, setCampaignMedium] = React.useState('');
  const [username, setUsername] = React.useState();

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setErrOpen(false);
  };

  const splitLinkUrl = (linkUrl: string) => {
    if (linkUrl.length > 0) {
      let indexOfUtmSource = linkUrl.indexOf('utm_source');
      let indexOfUtmMedium = linkUrl.indexOf('utm_medium');
      let indexOfUtmCampaign = linkUrl.indexOf('utm_campaign');
      let webUrl = linkUrl.slice(0, indexOfUtmSource - 1);
      let utmSource = linkUrl.slice(indexOfUtmSource + 11, indexOfUtmMedium - 1);
      let utmMedium = linkUrl.slice(indexOfUtmMedium + 11, indexOfUtmCampaign - 1);
      let utmCampaign = linkUrl.slice(indexOfUtmCampaign + 13, linkUrl.length);
      setWebUrl(webUrl);
      setSource(utmSource);
      setCampaignMedium(utmMedium);
      setCampaignName(utmCampaign);
    } else {
      setWebUrl('');
      setSource('');
      setCampaignMedium('');
      setCampaignName('');
    }
  };
  useEffect(() => {
    getData();
    setUsername(userInfo.username);
  }, []);
  const getData = () => {
    fetch('/api/banners/' + id)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCode(data.code);
        setTitle(data.title);
        setType(data.type);
        setPopUp(data.popUp);
        setLinkUrl(data.url);
        setPreViewImage(data.imgUrl);
        setOldImage(data.imgUrl);
      });
    splitLinkUrl(linkUrl);
  };
  const handleChangeCampaignName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignName(event.target.value as string);
    setErrorInputUtmCampaign(handleValueInput(event));
  };
  const handleChangeCampaignMedium = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignMedium(event.target.value as string);
    setErrorInputUtmMedium(handleValueInput(event));
  };
  const handleValueInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      let format = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>?~]/;
      let check = format.test(event.target.value);
      if (check) {
        return 'Nội dung không được chứa kí tự đặc biệt';
      }
    }
    if (event.target.value.length === 0) {
      return 'Nội dung không được để trống';
    }
  };
  const handleChangeWebsiteURL = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebUrl(event.target.value as string);
    setErrorInputWebUrl(handleValueInput(event));
  };
  const handleChangeSource = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value as string);
    setErrorInputUtmSource(handleValueInput(event));
  };
  const onLoadImg = () => {
    let imgLoad = document.getElementById('imgUpload') as HTMLImageElement;
    setWidthImg(imgLoad.naturalWidth);
    setHeightImg(imgLoad.naturalHeight);
  };

  const handleValidateCodeAndTittle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      let format = /[`!@#$%^&*()+=[\]{};':"\\|,.<>?~]/;
      let check = format.test(event.target.value);
      if (check) {
        return 'Nội dung không được chứa kí tự đặc biệt';
      } else if (event.target.value.length < 6 || event.target.value.length > 50) {
        return 'Nội dung tối thiểu 6 kí tự, tối đa 50 kí tự';
      }
    }
  };
  const handleChangeType = (event: SelectChangeEvent) => {
    if (event.target.value !== 'Khác') {
      setDisplay('block');
    } else {
      setDisplay('none');
    }
    setType(event.target.value as string);
  };

  const handleChangePopUp = (event: SelectChangeEvent) => {
    setPopUp(event.target.value as string);
  };
  const handleChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value as string);
    setErrorCode(handleValidateCodeAndTittle(event));
  };
  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value as string);
    setErrorTitle(handleValidateCodeAndTittle(event));
  };
  const getImage = (e: any) => {
    let url = URL.createObjectURL(e.target.files[0]);
    setImageUpload(e.target.files[0]);
    setPreViewImage(url);
    setFileName(e.target.files[0].name);
  };

  const saveBanner = (event: any) => {
    event.preventDefault();
    if (
      errorCode != null ||
      errorTitle != null ||
      errorInputUtmCampaign != null ||
      errorInputUtmMedium != null ||
      errorInputUtmSource != null ||
      errorInputWebUrl != null
    ) {
      setErrOpen(true);
      return;
    } else {
      if (imageUpload == null) {
        let bannerItem = {
          id: id,
          code: code,
          title: title,
          imgUrl: preViewImage,
          type: type,
          popUp: popUp === 'Không' ? 0 : 1,
          url:
            webUrl +
            '?' +
            'utm_source=' +
            source +
            '&utm_medium=' +
            campaignMedium +
            '&utm_campaign=' +
            campaignName,
          width: widthImg,
          height: heightImg,
          createdBy: state.detail.createdBy,
          lastModifiedBy: username,
        };

        axios.put('/api/banners', bannerItem).then((response) => {
          setOpen(true);
          history.push('/banner');
        });
      } else {
        if (fileName != null) {
          const imageRef = ref(storage, `images/${fileName + v4()}`);
          uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              let bannerItem = {
                id: id,
                code: code,
                title: title,
                type: type,
                popUp: popUp === 'Không' ? 0 : 1,
                imgUrl: url,
                url:
                  webUrl +
                  '?' +
                  'utm_source=' +
                  source +
                  '&utm_medium=' +
                  campaignMedium +
                  '&utm_campaign=' +
                  campaignName,
                width: widthImg,
                height: heightImg,
                createdBy: state.detail.createdBy,
                lastModifiedBy: username,
              };

              axios.put('/api/banners', bannerItem).then((response) => {
                setOpen(true);
                history.push('/banner');
              });
            });
          });
        }
      }
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
          Quay lại chi tiết banner
        </Button>
        <Box sx={{ justifyContent: 'space-between', display: 'inline-flex', gap: 2 }}>
          <Button
            sx={{ minWidth: '100px' }}
            variant="outlined"
            onClick={() => {
              history.push('/banner');
            }}
          >
            Hủy
          </Button>
          <Button
            sx={{ minWidth: '100px' }}
            variant="contained"
            onClick={(e) => saveBanner(e)}
          >
            Lưu
          </Button>
        </Box>
      </Toolbar>
      <Box sx={{ m: 5 }}>
        <Typography variant="h5" mb={2} color="blue">
          Chỉnh sửa thông tin banner
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sx={{ pr: 3, pb: 3 }}>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                '& .MuiTextField-root': {
                  width: '100%',
                },
              }}
              style={BoxStyle}
            >
              <TextField
                label="Nhập mã banner"
                type="text"
                value={code || ''}
                required
                error={Boolean(errorCode)}
                helperText={errorCode}
                onChange={handleChangeCode}
              />
              <TextField
                label="Nhập chủ đề banner"
                type="text"
                value={title || ''}
                required
                error={Boolean(errorTitle)}
                helperText={errorTitle}
                onChange={handleChangeTitle}
              />
              <FormControl sx={{ width: '100%' }}>
                <InputLabel required>Chọn loại banner</InputLabel>
                <Select
                  value={type}
                  onChange={handleChangeType}
                  label="Chọn loại banner *"
                >
                  <MenuItem value={'Khác'}>
                    <em>Khác</em>
                  </MenuItem>
                  <MenuItem value={'Liên kết tới một link mới'}>
                    Liên kết tới một link mới
                  </MenuItem>
                  <MenuItem value={'Liên kết tới một iframe'}>
                    Liên kết tới một iframe
                  </MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: display }}>
                <Box
                  sx={{
                    display: 'flex',

                    flexDirection: 'column',
                    gap: 3,
                    '& .MuiTextField-root': {
                      width: '100%',
                    },
                  }}
                  style={BoxStyle}
                >
                  <TextField
                    label="URl Trang Web"
                    required
                    type="text"
                    value={webUrl || ''}
                    fullWidth
                    error={Boolean(errorInputWebUrl)}
                    helperText={errorInputWebUrl}
                    onChange={handleChangeWebsiteURL}
                  />
                  <TextField
                    label="Nguồn chiến dịch"
                    required
                    type="text"
                    value={source || ''}
                    fullWidth
                    error={Boolean(errorInputUtmSource)}
                    helperText={errorInputUtmSource}
                    onChange={handleChangeSource}
                  />
                  <TextField
                    label="Phương tiện chiến dịch"
                    required
                    type="text"
                    value={campaignMedium || ''}
                    fullWidth
                    error={Boolean(errorInputUtmMedium)}
                    helperText={errorInputUtmMedium}
                    onChange={handleChangeCampaignMedium}
                  />
                  <TextField
                    label="Tên chiến dịch"
                    required
                    type="text"
                    value={campaignName || ''}
                    fullWidth
                    error={Boolean(errorInputUtmCampaign)}
                    helperText={errorInputUtmCampaign}
                    onChange={handleChangeCampaignName}
                  />
                </Box>
              </Box>

              <FormControl sx={{ width: '100%' }}>
                <InputLabel required>Chọn trạng thái popup</InputLabel>
                <Select
                  value={popUp}
                  onChange={handleChangePopUp}
                  label="Chọn trạng thái popup *"
                >
                  <MenuItem value={'Không'}>Không</MenuItem>
                  <MenuItem value={'Có'}>Có</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={2}>
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={getImage}
                  />
                  <Button variant="contained" component="span">
                    Tải ảnh lên
                  </Button>
                </label>
                <label>
                  <TextField
                    disabled
                    type="text"
                    variant="standard"
                    value={fileName || ''}
                  />
                </label>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ pr: 3, pb: 3 }} display="flex">
            <Card
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
              style={BoxStyle}
            >
              <CardMedia
                component="img"
                id="imgUpload"
                image={preViewImage || ''}
                onLoad={onLoadImg}
                sx={{ objectFit: 'contain' }}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Lưu thành công
        </Alert>
      </Snackbar>
      <Snackbar open={errOpen} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Chỉnh sửa thất bại
        </Alert>
      </Snackbar>
    </div>
  );
};
export default UpdateBanner;
