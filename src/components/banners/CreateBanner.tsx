import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../configs/FireBase';
import { FormHelperText, SelectChangeEvent } from '@mui/material';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import { BoxStyle1 } from '../../styles/style';
import { Divider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import PageService from '../../services/PageService';
import WebsiteService from '../../services/WebsiteService';
import BannerService from '../../services/BannerService';
import {
  Toolbar,
  Typography,
  Box,
  TextField,
  Grid,
  Card,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  CardMedia,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { BoxStyle, ToolbarStyle } from '../../styles/style';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import WebsiteManage from '../../pages/WebsiteManage';
import { async } from '@firebase/util';
const styleModal = {
  position: 'absolute' as 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '1px solid green',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
};
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Input = styled('input')({
  display: 'none',
});
type PageInfo = {
  id: number;
  websiteId: number;
  pageName: string;
  pageUrl: string;
  webDomain?: string;
  createdDate?: Date;
  lastModifiedDate?: Date;
  createdBy?: string;
  lastModifiedBy?: string;
};
type WebInfo = {
  id: number;
  code: string;
  domain: string;
  webKey: string;
  createdDate?: Date;
  lastModifiedDate?: Date;
  createdBy?: string;
  lastModifiedBy?: string;
};
const CreateBanner: React.FC = () => {
  let history = useHistory();
  const userInfo = (typeof localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '') : '');

  const [pstValue, setPstValue] = React.useState<string>('0');
  const [position, setPosition] = React.useState<string>('default');
  const [pageNameList, setPageNameList] = React.useState<string[]>([]);
  const [pageList, setPageList] = React.useState([] as PageInfo[]);
  const [code, setCode] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('');
  const [popUp, setPopUp] = React.useState('Không');
  const [campaignMedium, setCampaignMedium] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [imageUpload, setImageUpload] = React.useState(null);
  const [preViewImage, setPreViewImage] = React.useState('');
  const [display, setDisplay] = React.useState('none');
  const [errorCode, setErrorCode] = React.useState<String>();
  const [errorTitle, setErrorTitle] = React.useState<String>();
  const [errorInputWebUrl, setErrorInputWebUrl] = React.useState<String>();
  const [errorInputUtmSource, setErrorInputUtmSource] = React.useState<String>();
  const [errorInputUtmMedium, setErrorInputUtmMedium] = React.useState<String>();
  const [errorInputUtmCampaign, setErrorInputUtmCampaign] = React.useState<String>();
  const [widthImg, setWidthImg] = React.useState(400);
  const [heightImg, setHeightImg] = React.useState(550);
  const [open, setOpen] = React.useState(false);
  const [errOpen, setErrOpen] = React.useState(false);
  const [errCheckOpen, setErrCheckOpen] = React.useState(false);
  const [webUrl, setWebUrl] = React.useState('');
  const [source, setSource] = React.useState('');
  const [campaignName, setCampaignName] = React.useState('');
  const [displaySeclect, setDisplaySeclect] = React.useState('none');
  const [displayImgPre, setDisplayImgPre] = React.useState('flex');
  const [displayImgPre1, setDisplayImgPre1] = React.useState('none');
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openCheckAll, setOpenCheckAll] = React.useState<boolean>(false);
  const [pageName, setPageName] = React.useState('');
  const [errorName, setErrorName] = React.useState<String>();
  const [errorUrl, setErrorUrl] = React.useState<String>();
  const [pageUrl, setPageUrl] = React.useState('');
  const [webList, setWebList] = React.useState([] as WebInfo[]);
  const [webCode, setWebCode] = React.useState('');
  const [webDomain, setWebDomain] = React.useState('');
  const [errorWebCode, setErrorWebCode] = React.useState<String>();
  const [errorWebDomain, setErrorWebDomain] = React.useState<String>();
  const [displayBox, setDisplayBox] = React.useState('none');
  const [username, setUsername] = useState();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    getAllWebsite();
    setUsername(userInfo.username);
  }, []);

  const getAllWebsite = async () => {
    await WebsiteService.getAllWebsite().then((res) => {
      setWebList(res.data);
    });
  };
  const getPageByWebsiteCode = async (code: string) => {
    await PageService.getPageByWebsiteCode(code).then((response) => {
      setPageList(response.data);
    });
  };
  const handleChangePositionValue = (e: any) => {
    setPstValue(e.target.value as string);
  };
  const handleChangePosition = (e: any) => {
    setPosition(e.target.value as string);
    if (e.target.value !== 'default') {
      setDisplayBox('flex');
    }
  };
  const handleValidateCodeAndDomain = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      let format = /[`!@#$%^&*()_+\-=[]{};':"\\|,.<>\/?~]/;
      let check = format.test(event.target.value);
      if (check) {
        return 'Nội dung không được chứa kí tự đặc biệt';
      }
      if (event.target.value.length < 1 || event.target.value.length > 50) {
        return 'Nội dung tối thiểu 1 kí tự, tối đa 50 kí tự';
      }
    }
  };
  const handleChangeWebsiteCode = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setWebCode((event.target as HTMLInputElement).value);
    setErrorWebCode(handleValidateCodeAndDomain(event));
  };

  const handleChangeDomain = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setWebDomain((event.target as HTMLInputElement).value);
    setErrorWebDomain(handleValidateCodeAndDomain(event));
  };

  const handleChangeWebCode = (event: SelectChangeEvent) => {
    setWebCode(event.target.value as string);
    getPageByWebsiteCode(event.target.value);
  };
  const changePageUrl = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPageUrl((event.target as HTMLInputElement).value);
  };
  const handleOpen = () => {
    setOpen(true as boolean);
  };
  const handleOpenModal = () => {
    setOpenModal(true as boolean);
  };
  const handleCloseModal = () => {
    setOpenModal(false as boolean);
  };
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setErrOpen(false);
    setErrCheckOpen(false);
    setOpenCheckAll(false);
  };
  const changePageName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPageName((event.target as HTMLInputElement).value);
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
      let format = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
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
  };
  const handleChangeSource = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value as string);
    setErrorInputUtmSource(handleValueInput(event));
  };
  const handleChangeType = (event: SelectChangeEvent) => {
    if (event.target.value !== 'Khac') {
      setDisplay('block');
    } else {
      setDisplay('none');
    }
    setType(event.target.value as string);
  };

  const onLoadImg = () => {
    let imgLoad = document.getElementById('imgUpload') as HTMLImageElement;
    setWidthImg(imgLoad.naturalWidth);
    setHeightImg(imgLoad.naturalHeight);
  };

  const handleValidateCodeAndTittle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      let format = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
      let check = format.test(event.target.value);
      if (check) {
        return 'Nội dung không được chứa kí tự đặc biệt';
      } else if (event.target.value.length < 1 || event.target.value.length > 50) {
        return 'Nội dung tối thiểu 1 kí tự, tối đa 50 kí tự';
      }
    }
  };

  const handleChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value as string);
    setErrorCode(handleValidateCodeAndTittle(event));
  };
  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value as string);
    setErrorTitle(handleValidateCodeAndTittle(event));
  };
  const handleChange = (event: SelectChangeEvent<typeof pageNameList>) => {
    const {
      target: { value },
    } = event;
    setPageNameList(typeof value === 'string' ? value.split(',') : value);
  };
  const handleChangePopUp = (event: SelectChangeEvent) => {
    setPopUp(event.target.value as string);
    if (event.target.value === 'Có') {
      setDisplayImgPre('none');
      setDisplayImgPre1('flex');
      setDisplaySeclect('inline-block');
    } else {
      setDisplayImgPre('flex');
      setDisplayImgPre1('none');
      setDisplaySeclect('none');
    }
  };

  const getImage = (e: any) => {
    let url = URL.createObjectURL(e.target.files[0]);
    setImageUpload(e.target.files[0]);
    setPreViewImage(url);
    setFileName(e.target.files[0].name);
  };
  const savePageInfo = async (event: React.MouseEvent<HTMLElement>) => {
    if (webCode !== '') {
      await webList.map((webItem) => {
        if (webItem.code === webCode) {
          if (pageName.length === 0 || pageUrl.length === 0) {
            setOpenCheckAll(true);
            return;
          } else {
            const PageInfo = {
              id: 0,
              websiteId: webItem.id,
              pageName: pageName,
              pageUrl: pageUrl,
              createdDate: new Date(),
              createdBy: username,
            };
            PageService.savePage(PageInfo, setOpen).then((response) => {
              if (typeof response === 'undefined') {
                setOpenModal(false as boolean);
                setErrOpen(true);
              } else {
                setOpenModal(false as boolean);
                setOpen(true);
                setPageList((prevState) => [...prevState, PageInfo]);
              }
            });
          }
        }
      });
    } else {
      setErrCheckOpen(true);
    }
  };
  const saveBanner = async (event: any) => {
    event.preventDefault();
    if (
      code.length === 0 ||
      title.length === 0 ||
      type.length === 0 ||
      pageNameList.length === 0 ||
      webCode.length === 0
    ) {
      setOpenCheckAll(true);
      return;
    } else {
      if (
        type != 'Khác' &&
        (errorInputUtmCampaign != null ||
          errorInputUtmMedium != null ||
          errorInputUtmSource != null ||
          errorInputWebUrl != null ||
          webUrl.length === 0 ||
          campaignName.length === 0 ||
          source.length === 0 ||
          campaignMedium.length === 0)
      ) {
        setOpenCheckAll(true);
        return;
      }
      if (imageUpload == null) {
        window.confirm('Ảnh banner chưa được tải lên !');
        return;
      } else {
        const imageRef = ref(storage, `images/${fileName}`);
        await uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            let bannerItem = {
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
              createdBy: username,
            };
            axios.post('/api/banners', bannerItem).then(() => {
              saveToBannerMapping(code);
              setOpen(true);
              history.push('/banner');
            });
          });
        });
      }
    }
  };
  const saveToBannerMapping = async (code: string) => {
    await BannerService.getBannerByCode(code).then((res) => {
      let bannerId = res.data.id;
      pageList.map((pageItem) => {
        pageNameList.map((pageNameItem) => {
          if (pageItem.pageName === pageNameItem) {
            let newItem = {
              bannerId: bannerId,
              sectionId: 0,
              pageId: pageItem.id,
              position: position,
              positionValue: pstValue,
              percentage: 0,
              lastModifiedBy: '',
            };
            BannerService.saveBannerMapping(newItem);
          }
        });
      });
    });
  };
  const saveWebsiteInfo = async (event: React.MouseEvent<HTMLElement>) => {
    if (webCode.length === 0 || webDomain.length === 0) {
      setErrOpen(true);
      return;
    } else {
      const WebsiteInfo = {
        id: 0,
        code: webCode,
        domain: webDomain,
        createdDate: new Date(),
        createdBy: username,
        webKey: 'code:' + webCode + ', domain: ' + webDomain,
      };
      await WebsiteService.saveWebsite(WebsiteInfo).then((response) => {
        if (typeof response === 'undefined') {
          setErrOpen(true);
        } else {
          setOpen(true);
          setWebList((prevState) => [...prevState, WebsiteInfo]);
        }
        setOpenModal(false);
      });
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
          Quay lại danh sách các banner
        </Button>
        <Box sx={{ justifyContent: 'space-between', display: 'inline-flex', gap: 2 }}>
          <Button
            sx={{ minWidth: '100px' }}
            variant="outlined"
            onClick={() => {
              history.push('/banner');
            }}
          >
            Thoát
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
        <Typography variant="h5" color="blue" mb={2}>
          Thêm banner mới
        </Typography>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6} sx={{ pr: 3, pb: 3 }}>
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
                autoComplete="off"
                required
                inputProps={{ minLength: 6, maxLength: 50 }}
                type="text"
                error={Boolean(errorCode)}
                helperText={errorCode}
                value={code || ''}
                onChange={handleChangeCode}
              />
              <TextField
                label="Nhập chủ đề banner"
                type="text"
                required
                error={Boolean(errorTitle)}
                helperText={errorTitle}
                value={title || ''}
                onChange={handleChangeTitle}
              />
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-label" required>
                  Chọn loại banner
                </InputLabel>
                <Select
                  value={type}
                  onChange={handleChangeType}
                  label="Chọn loại banner *"
                >
                  <MenuItem value={'Khac'}>
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
                    value={fileName || ''}
                    fullWidth
                    variant="standard"
                  />
                </label>
              </Stack>
              <Grid item sm={6} md={12} sx={{ display: displayImgPre1 }}>
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
                    onLoad={onLoadImg}
                    image={preViewImage || ''}
                    sx={{ objectFit: 'contain' }}
                  />
                </Card>
              </Grid>
            </Box>
          </Grid>
          <Grid item sm={12} md={6} sx={{ pr: 3, pb: 3 }} display="flex">
            <Card
              sx={{
                width: '100%',
                display: displayImgPre,
                justifyContent: 'center',
              }}
              style={BoxStyle}
            >
              <CardMedia
                component="img"
                id="imgUpload"
                onLoad={onLoadImg}
                image={preViewImage || ''}
                sx={{ objectFit: 'contain' }}
              />
            </Card>
            <Box
              component="form"
              sx={{
                display: displaySeclect,
                marginLeft: '20px',
                width: '100%',
              }}
              style={BoxStyle1}
            >
              <div className="mt-4 mb-4">
                <p className="text-center mt-2 mb-2 fs-5">Thông tin website</p>
              </div>
              <Divider />
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="demo-simple-select-label">Chọn website</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Chọn website"
                  value={webCode || ''}
                  onChange={handleChangeWebCode}
                >
                  <div>
                    <button
                      className="btn success text-center text-primary fs-6 "
                      style={{ width: '100%' }}
                      onClick={handleOpenModal}
                    >
                      <AddCircleOutlineIcon />
                      Thêm website mới
                    </button>
                    <Modal open={openModal}>
                      <Box sx={styleModal}>
                        <Typography variant="h6" component="h2">
                          Thêm website mới
                        </Typography>
                        <TextField
                          label="Mã website"
                          type="text"
                          sx={{ width: '100%', marginTop: '20px' }}
                          margin="dense"
                          onChange={handleChangeWebsiteCode}
                          error={Boolean(errorWebCode)}
                          helperText={errorWebCode}
                          value={webCode || ''}
                        />

                        <TextField
                          label="domain"
                          type="text"
                          sx={{ width: '100%', marginTop: '20px' }}
                          onChange={handleChangeDomain}
                          error={Boolean(errorWebDomain)}
                          helperText={errorWebDomain}
                          value={webDomain || ''}
                        />
                        <Box
                          sx={{
                            width: '100%',
                            justifyContent: 'end',
                            display: 'inline-flex',
                            gap: 2,
                            marginTop: '20px',
                          }}
                        >
                          <Button
                            sx={{ minWidth: '100px' }}
                            variant="outlined"
                            color="error"
                            onClick={handleCloseModal}
                          >
                            Hủy
                          </Button>
                          <Button
                            sx={{ minWidth: '100px' }}
                            variant="contained"
                            onClick={saveWebsiteInfo}
                          >
                            Thêm
                          </Button>
                        </Box>
                      </Box>
                    </Modal>
                  </div>
                  {webList.map((item) => (
                    <MenuItem key={item.id} value={item.code}>
                      {item.code}
                    </MenuItem>
                  ))}
                </Select>
                {webCode === '' ? (
                  <FormHelperText error>Cần có website để thêm banner </FormHelperText>
                ) : (
                  <></>
                )}
              </FormControl>
              <FormControl sx={{ width: '100%', height: 100, mt: 2, mb: 2 }}>
                <InputLabel id="demo-multiple-checkbox-label">Chọn page</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={pageNameList}
                  onChange={handleChange}
                  input={<OutlinedInput label="Chọn page" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  <div>
                    <button
                      className="btn success text-center text-primary fs-6 "
                      style={{ width: '100%' }}
                      onClick={handleOpenModal}
                    >
                      <AddCircleOutlineIcon />
                      Thêm page mới
                    </button>
                    <Modal open={openModal}>
                      <Box sx={styleModal}>
                        <Typography variant="h6" component="h2">
                          Thêm page mới
                        </Typography>
                        <TextField
                          label="Tên page"
                          type="text"
                          sx={{ width: '100%', marginTop: '20px' }}
                          margin="dense"
                          onChange={changePageName}
                          error={Boolean(errorName)}
                          helperText={errorName}
                          value={pageName}
                        />

                        <TextField
                          label="Page url"
                          type="text"
                          sx={{ width: '100%', marginTop: '20px' }}
                          onChange={changePageUrl}
                          error={Boolean(errorUrl)}
                          helperText={errorUrl}
                          value={pageUrl || ''}
                        />
                        <Box
                          sx={{
                            width: '100%',
                            justifyContent: 'end',
                            display: 'inline-flex',
                            gap: 2,
                            marginTop: '20px',
                          }}
                        >
                          <Button
                            sx={{ minWidth: '100px' }}
                            variant="outlined"
                            color="error"
                            onClick={handleCloseModal}
                          >
                            Hủy
                          </Button>
                          <Button
                            sx={{ minWidth: '100px' }}
                            variant="contained"
                            onClick={savePageInfo}
                          >
                            Thêm page
                          </Button>
                        </Box>
                      </Box>
                    </Modal>
                  </div>
                  {pageList.map((item) => (
                    <MenuItem key={item.pageName} value={item.pageName}>
                      <Checkbox checked={pageNameList.indexOf(item.pageName) > -1} />
                      <ListItemText primary={item.pageName} />
                    </MenuItem>
                  ))}
                </Select>
                {pageNameList.length <= 0 ? (
                  <FormHelperText error>Cần chọn page để thêm banner</FormHelperText>
                ) : (
                  <></>
                )}
              </FormControl>
              <FormControl sx={{ width: '100%', height: 100, mt: -3 }}>
                <InputLabel id="demo-simple-select-label">Position</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Position"
                  value={position}
                  onChange={handleChangePosition}
                >
                  <MenuItem value={'default'}>Mặc định</MenuItem>
                  <MenuItem value={'top-left'}>Top, left</MenuItem>
                  <MenuItem value={'top-right'}>Top, right</MenuItem>
                  <MenuItem value={'bottom-left'}>Bottom, left</MenuItem>
                  <MenuItem value={'bottom-right'}>Bottom, right</MenuItem>
                </Select>
              </FormControl>
              <Box
                component="form"
                sx={{
                  display: displayBox,
                  marginTop: '-25px',
                  flexDirection: 'column',
                  gap: 1,
                  '& .MuiTextField-root': {
                    width: '100%',
                  },
                }}
              >
                <TextField
                  label="Nhập giá trị position"
                  autoComplete="off"
                  required
                  type="text"
                  error={Boolean(errorCode)}
                  helperText={errorCode}
                  value={pstValue}
                  onChange={handleChangePositionValue}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Tạo thành công
        </Alert>
      </Snackbar>
      <Snackbar open={errOpen} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Tạo thất bại
        </Alert>
      </Snackbar>
      <Snackbar open={errCheckOpen} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Chưa chọn website để hiển thị banner
        </Alert>
      </Snackbar>
      <Snackbar open={openCheckAll} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Bạn cần nhập đầy đủ thông tin trước khi lưu.
        </Alert>
      </Snackbar>
    </div>
  );
};
export default CreateBanner;
