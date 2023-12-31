import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "styled-components";
import MainModal from "../Shared/MainModal";
import NotificationUserImage from "../../assets/images/notification-user-sample.png";
import PopUpNotificationItem from "../Shared/PopUpNotificationItem";
import PopUpIconMenu from "./../Shared/PopUpIconMenu";
import GradientButton from "../Shared/GradientButton";
import { SignInForm } from "../SignInForm";
import { SignUpForm } from "../SignUpForm";
import { useTranslation } from "react-i18next";
import {
  BellActiveIcon,
  BellInActiveIcon,
  CloseIcon,
  DiscordIcon,
  MenuIcon,
  TelegramIcon,
  TwitterIcon,
  VerifiedIcon,
} from "../Shared/SvgIcons";
import HeaderSearchBox from "../Shared/HeaderSearchBox";
import { LanguageSelect } from "../Shared/LanguageSelect";
import BiWallet from "@meronex/icons/bi/BiWallet";
import { ConnectWalletForm } from "../Shared/ConnectWalletForm";
import ResourcesDropDown from "../Shared/ResourcesDropDown";
import UserAvatar from "../Shared/UserAvatar";
import AvatarProfile from "../../assets/images/avatar.jpg";
import PopUpUserProfileItem from "../Shared/PopUpUserProfileItem";
import { useCustomWallet } from "../../contexts/WalletContext";
import { useGlobal } from "../../contexts/GlobalContext";
import {
  HeaderArea,
  LeftMenu,
  RightMenu,
  ThemeDropDown,
  Language,
  MobileHeader,
  Logo,
  DashMenu,
  Arrow,
  DropDownMenu,
  MobileNav,
  MoreMenus,
  WalletIcon,
  WalletDropMenu,
  WalletAddressInfo,
  WalletButtonIcon,
  LogoItem,
  ConnectWallets,
  MoreMenuUL,
} from "./styles";
import BnbChain from "../../assets/images/bnbChain.svg";
import MobileLogo from "../../assets/images/logo-mobile.png";
import PencakeSwap from "../../assets/images/pencakeswap.png";
import useOnClickOutside from "../../lib/UseOnClickOutSide";

import { Web3Button } from '@web3modal/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import i18next from "i18next";
export const Header = () => {
  const [themeDrop, setThemeDrop] = useState(false);
  const [walletDropdown, setWalletDropdown] = useState(false);
  const [language, setLanguage] = useState(false);
  const [menu, setMenu] = useState(false);
  const [moreMenu, setMoreMenu] = useState(false);
  const [NftMoreMenu, setNftMoreMenu] = useState(false);
  const [notItems, setNotItems] = useState([]);
  const pathName = useLocation().pathname;
  const ref = useRef();
  useOnClickOutside(ref, () => setThemeDrop(false));
  useOnClickOutside(ref, () => setWalletDropdown(false));

  const themeToggle = () => {
    setLanguage(true);
    setThemeDrop(false);
  };

  const { invokeServer } = useGlobal();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showConnectWallet, setShowConnectWallet] = useState(false);

  const {  address, isConnected } = useAccount();

  const windowSize = useWindowSize();
  let navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();

  const { auth } = useAuth();
  const { wallet, getWalletAddressBySessionKey } = useCustomWallet();

  const [isMenu, setIsMenu] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showCreatorConfirm, setShowCreatorConfirm] = useState(false);
  const [avatar, setAvatar] = useState("");
  const viewTypeList = [
    { id: 1, name: "USA", key: "USA", icon: theme.images.flagUsa },
  ];
  const selected = localStorage.getItem("i18nextLng") || "en";
  const { t } = useTranslation();

  // const notificationList = [
  //   { id: 1, userName: 'User1', userImage: NotificationUserImage, text: 'has commented on your item', date: 'Today 15:45' },
  //   { id: 2, userName: 'User2', userImage: NotificationUserImage, text: 'has commented on your item', date: 'Today 23:40' },
  //   { id: 3, userName: 'User3', userImage: NotificationUserImage, text: 'has commented on your item', date: 'Today 21:25' }
  // ]

  const menuInfo = [
    {
      id: 0,
      name: "Explorer",
      action: () => {
        navigate("/explorer");
      },
    },
    {
      id: 1,
      name: "Creators",
      action: () => {
        navigate("/creators");
      },
    },
    {
      id: 2,
      name: "Collections",
      action: () => {
        navigate("/collections");
      },
    },
    {
      id: 3,
      name: "Unlisted NFTs",
      action: () => {
        navigate("/offer");
      },
    },
  ];

  const [menuTitle, setMenuTitle] = useState(
    location?.pathname === "/explorer"
      ? menuInfo[0].name
      : location?.pathname === "/creators"
      ? menuInfo[1].name
      : location?.pathname === "/offer"
      ? menuInfo[2].name
      : location?.pathname === "/collections"
      ? menuInfo[2].name
      : "Explorer"
  );

  const handleConnectWallet = () => {
    setIsMenu(false);
    setShowConnectWallet(true);
  };

  useEffect(() => {
    if (auth.isLoggedIn !== true) {
      if (
        location.pathname.includes("/settings") ||
        location.pathname.includes("/profile")
      ) {
        navigate("/");
      }
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (typeof window !== "undefined") {
    }
  }, [selected]);

  // const handleCreateConfirm = () => {
  //   setShowSignUp(false)
  //   setShowCreatorConfirm(true)
  // }

  // const handleCloseConfirm = () => {
  //   setShowCreatorConfirm(false)
  //   setShowSignUp(true)
  // }

  // const handleGotoCreateSignup = () => {
  //   navigate('/create-signup')
  //   setShowCreatorConfirm(false)
  // }

  useEffect(() => {
    auth.avatarURI && auth.avatarURI !== "" && setAvatar(auth.avatarURI);
  }, [auth.avatarURI]);

  const handleMenu = (t) => {
    let tt = menuInfo.filter((item) => item.name === t);
    if (tt.length > 0) {
      setMenuTitle(tt[0].name);
      tt[0].action();
    }
  };

  useEffect(() => {
    let ac = new AbortController();

    const loadNotification = () => {
      invokeServer(
        "get",
        `/api/notification?address=${getWalletAddressBySessionKey()}`
      )
        .then((r) => {
          if (ac.signal.aborted) return;

          if (
            r.data.items !== undefined &&
            JSON.stringify(r.data.items) !== JSON.stringify(notItems)
          ) {
            setNotItems((t) => r.data.items);
          }
          setTimeout(loadNotification, 10000);
        })
        .catch((err) => {
          console.log(`${err.message}`);
          if (ac.signal.aborted) return;
          setTimeout(loadNotification, 3000);
        });
    };

    loadNotification();

    return () => ac.abort();
  }, []);

  useEffect(() => {
    let ac = new AbortController();

    const loadNotification = () => {
      invokeServer(
        "get",
        `/api/notification?address=${getWalletAddressBySessionKey()}`
      )
        .then((r) => {
          if (ac.signal.aborted) return;

          if (
            r.data.items !== undefined &&
            JSON.stringify(r.data.items) !== JSON.stringify(notItems)
          ) {
            setNotItems((t) => r.data.items);
          }
          setTimeout(loadNotification, 10000);
        })
        .catch((err) => {
          console.log(`${err.message}`);
          if (ac.signal.aborted) return;
          setTimeout(loadNotification, 3000);
        });
    };

    loadNotification();

    return () => ac.abort();
  }, []);

  const languageMap = {
    en: { label: "English", dir: "ltr", active: true },
    de: { label: "DEUTSCH", dir: "rtl", active: false },
    // fr: { label: "FRANÇAISE", dir: "ltr", active: false, Image: { flag3 } },
    // es: { label: "ESPAÑOLA", dir: "ltr", active: false, Image: { flag2 } },
  };

  return (
    <>
      {showConnectWallet && (
        <MainModal
          title={"My Wallet"}
          handleClose={() => setShowConnectWallet(false)}
        >
          <ConnectWalletForm
            goToSignIn={() => {
              setShowSignUp(false);
              setShowSignIn(true);
            }}
            handleClose={() => setShowConnectWallet(false)}
          />
        </MainModal>
      )}
      {themeDrop && (
        <ThemeDropDown ref={ref}>
          <ul>
            <li onClick={themeToggle}>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-globe"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                </svg>
              </span>{" "}
              English
            </li>
          </ul>
        </ThemeDropDown>
      )}
      {language && (
        <Language>
          <div>
            <h2>
              <svg
                onClick={() => setLanguage(false)}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-left-short"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
                />
              </svg>
              {t("Choose a language")}
            </h2>
            <ul>
              {Object.keys(languageMap)?.map((item) => {
                return (
                  <li
                    button
                    key={item}
                    onClick={() => {
                      i18next.changeLanguage(item);
                    }}
                  >
                    {" "}
                    {languageMap[item].label}{" "}
                  </li>
                );
              })}
              {/* <li onClick={() => setLanguage(false)}>简体中文</li>
              <li onClick={() => setLanguage(false)}>Pусский</li>
              <li onClick={() => setLanguage(false)}>日本語</li>
              <li onClick={() => setLanguage(false)}>Tiếng Việt</li>
              <li onClick={() => setLanguage(false)}>Bahasa Melayu</li>
              <li onClick={() => setLanguage(false)}>한국인</li> */}
            </ul>
          </div>
        </Language>
      )}
      <HeaderArea>
        <LeftMenu></LeftMenu>
        <RightMenu>
         {/*} {window.web3 ? ( */}
         {isConnected ? ( 
            <>
              <button>
                <img src={BnbChain} alt="Bnb Chain" /> {t("BNBChain")}
              </button>
          {/*}  <button>{wallet.address?.substr(0, 6) +
                      "..." +
          wallet.address?.slice(-4)}</button> */}
          <button>{address?.substr(0, 6) +
                      "..." +
          address?.slice(-4)}</button> 
              <button>
                <PopUpIconMenu
                  width={"257px"}
                  right={"-110px"}
                  icon={
                    notItems.length > 0 ? (
                      <BellActiveIcon size="25px" />
                    ) : (
                      <BellInActiveIcon size="25px" />
                    )
                  }
                >
                  <PopUpNotificationItem notificationList={notItems} />
                </PopUpIconMenu>
              </button>
              <button className="nav-logged-user-section">
                <div className="creator-icon">
                  <VerifiedIcon />
                </div>
                <PopUpIconMenu
                  width={"211px"}
                  icon={
                    NotificationUserImage !== "" ? (
                      <img
                        src={NotificationUserImage}
                        alt=""
                        width="24px"
                        height="24px"
                      />
                    ) : (
                      <UserAvatar size="25px" isNaked />
                    )
                  }
                >
                  <PopUpUserProfileItem />
                </PopUpIconMenu>
              </button>
            </>
          ) : (
            <>
            <Web3Button />
             
           {/*} <ConnectWallets onClick={handleConnectWallet}>
              <button>{t("Connect wallet")}</button>
          </ConnectWallets> */}
             </>
          )}
          {walletDropdown && (
            <WalletDropMenu ref={ref}>
              <PopUpNotificationItem notificationList={notItems} />
            </WalletDropMenu>
          )}

          <button onClick={() => setThemeDrop((e) => !e)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-three-dots"
              viewBox="0 0 16 16"
            >
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
          </button>
        </RightMenu>
      </HeaderArea>
      <MobileHeader>
        {menu && (
          <DropDownMenu>
            <div>
              <h2>
                {t("Swap Zimax Token")}
                <svg
                  onClick={() => setMenu(false)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
              </h2>
              <ul>
                <li>
                  <a

                    href="https://pancakeswap.finance/swap?outputCurrency=0xA080dCB3350d99320Bf67A997D7f876284727ec7"

                    target="_blank"
                  >
                    <strong>
                      <img src={PencakeSwap} alt="pencakeswap" />
                    </strong>
                    <span>{t("Pancakeswap")}</span>
                  </a>
                </li>
              </ul>
            </div>
          </DropDownMenu>
        )}
        <Logo>
          <LogoItem>
            <Link to="/">
              <img src={MobileLogo} alt="logo" />
            </Link>
          </LogoItem>
        </Logo>
        <RightMenu>
        {/*}  {window.web3 ? (  */}
        {isConnected ? ( 
            <>
              <button>
                <img src={BnbChain} alt="Bnb Chain" />
              </button>
            {/*}  <button>{t("0xA8D4...7595")}</button>  */}
            <button>{address?.substr(0, 6) +
                      "..." +
          address?.slice(-4)}</button> 
              <button>
                <PopUpIconMenu
                  width={"257px"}
                  right={"-110px"}
                  icon={
                    notItems.length > 0 ? (
                      <BellActiveIcon size="25px" />
                    ) : (
                      <BellInActiveIcon size="25px" />
                    )
                  }
                >
                  <PopUpNotificationItem notificationList={notItems} />
                </PopUpIconMenu>
              </button>
              <button className="nav-logged-user-section">
                <div className="creator-icon">
                  <VerifiedIcon />
                </div>
                <PopUpIconMenu
                  width={"211px"}
                  icon={
                    NotificationUserImage !== "" ? (
                      <img
                        src={NotificationUserImage}
                        alt=""
                        width="24px"
                        height="24px"
                      />
                    ) : (
                      <UserAvatar size="25px" isNaked />
                    )
                  }
                >
                  <PopUpUserProfileItem />
                </PopUpIconMenu>
              </button>
            </>
          ) : (
            <>
            <Web3Button />
             
           {/*} <ConnectWallets onClick={handleConnectWallet}>
              <button>{t("Connect wallet")}</button>
          </ConnectWallets> */}
             </>
          
          )}
          {walletDropdown && (
            <WalletDropMenu ref={ref}>
              <PopUpNotificationItem notificationList={notItems} />
            </WalletDropMenu>
          )}
        </RightMenu>
        <MobileNav>
          <ul>
            <li
              onClick={() => {
                setMoreMenu(false);
                setNftMoreMenu(false);
              }}
              className={pathName === "/" ? "active" : ""}
            >
              <Link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-grid-1x2"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 1H1v14h5V1zm9 0h-5v5h5V1zm0 9v5h-5v-5h5zM0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V1zm1 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-5z" />
                </svg>
                {t("Dashboard")}
              </Link>
            </li>
            <li
              onClick={() => {
                setMoreMenu(false);
                setNftMoreMenu(false);
              }}
              className={pathName === "/nft-matrix" ? "active" : ""}
            >
              <Link to="/nft-matrix">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-activity"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"
                  />
                </svg>
                {t("Levels")}
              </Link>
            </li>
            <li
              onClick={() => {
                setNftMoreMenu((e) => !e);
                setMoreMenu(false);
              }}
              className={pathName === "/viewcollection/0xa8d41233e172fd291b9bb9943195bc363e047595" ? "active" : ""}
            >
              <Link to="/viewcollection/0xa8d41233e172fd291b9bb9943195bc363e047595">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-file-image"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
                </svg>
                {t("NFT'S")}
              </Link>
            </li>
            <li
              onClick={() => {
                setMoreMenu((e) => !e);
                setNftMoreMenu(false);
              }}
              className={moreMenu ? "active" : ""}
            >
              <Link to="#">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM4 12C4 10.9 4.9 10 6 10C7.1 10 8 10.9 8 12C8 13.1 7.1 14 6 14C4.9 14 4 13.1 4 12ZM16 12C16 10.9 16.9 10 18 10C19.1 10 20 10.9 20 12C20 13.1 19.1 14 18 14C16.9 14 16 13.1 16 12ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
                    fill="currentColor"
                  ></path>
                </svg>
                {t("More")}
              </Link>
            </li>
          </ul>
        </MobileNav>
        {moreMenu && (
          <MoreMenus>
            <ul style={{ overflowY: "scroll", height: "50vh" }}>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}
                className={pathName === '/token' ? 'active' : ''}
              >
                <Link to="/token">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-coin"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z" />
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                  </svg>
                  {t("Buy ZiMax")}
                </Link>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}
                className={pathName === '/templates' ? 'active' : ''}
              >
                <Link to="/templates">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-hearts"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.5 1.246c.832-.855 2.913.642 0 2.566-2.913-1.924-.832-3.421 0-2.566ZM9 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h10s1 0 1-1-1-4-6-4-6 3-6 4Zm13.5-8.09c1.387-1.425 4.855 1.07 0 4.277-4.854-3.207-1.387-5.702 0-4.276ZM15 2.165c.555-.57 1.942.428 0 1.711-1.942-1.283-.555-2.281 0-1.71Z"
                    />
                  </svg>

                  {t('Influencers program')}

                </Link>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}
                className={pathName === '/staking' ? 'active' : ''}
              >
                <Link to="/staking">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-bank"
                    viewBox="0 0 16 16"
                  >
                    <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.501.501 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89L8 0ZM3.777 3h8.447L8 1 3.777 3ZM2 6v7h1V6H2Zm2 0v7h2.5V6H4Zm3.5 0v7h1V6h-1Zm2 0v7H12V6H9.5ZM13 6v7h1V6h-1Zm2-1V4H1v1h14Zm-.39 9H1.39l-.25 1h13.72l-.25-1Z" />
                  </svg>

                  {t('ZiMax Bank')}
                </Link>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}
                className={pathName === '/multiply' ? 'active' : ''}
              >
                <Link to="/nft-matrix">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-images"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
                  </svg>
                  {t("NFT MATRIX")}
                </Link>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}
                className={pathName === '/autostaking-faq' ? 'active' : ''}
              >
                <Link to="/autostaking-faq">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-safe2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h12A1.5 1.5 0 0 1 16 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 1 14.5V14H.5a.5.5 0 0 1 0-1H1V9H.5a.5.5 0 0 1 0-1H1V4H.5a.5.5 0 0 1 0-1H1v-.5zM2.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5h-12z" />
                    <path d="M5.035 8h1.528c.047-.184.12-.357.214-.516l-1.08-1.08A3.482 3.482 0 0 0 5.035 8zm1.369-2.303 1.08 1.08c.16-.094.332-.167.516-.214V5.035a3.482 3.482 0 0 0-1.596.662zM9 5.035v1.528c.184.047.357.12.516.214l1.08-1.08A3.482 3.482 0 0 0 9 5.035zm2.303 1.369-1.08 1.08c.094.16.167.332.214.516h1.528a3.483 3.483 0 0 0-.662-1.596zM11.965 9h-1.528c-.047.184-.12.357-.214.516l1.08 1.08A3.483 3.483 0 0 0 11.965 9zm-1.369 2.303-1.08-1.08c-.16.094-.332.167-.516.214v1.528a3.483 3.483 0 0 0 1.596-.662zM8 11.965v-1.528a1.989 1.989 0 0 1-.516-.214l-1.08 1.08A3.483 3.483 0 0 0 8 11.965zm-2.303-1.369 1.08-1.08A1.988 1.988 0 0 1 6.563 9H5.035c.085.593.319 1.138.662 1.596zM4 8.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0zm4.5-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                  </svg>

                  {t('Bank 15')}

                </Link>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}
                className={pathName === '/defi-lottery' ? 'active' : ''}
              >
                <Link to="/defi-lottery">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-cash-coin"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"
                    />
                    <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z" />
                    <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z" />
                    <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z" />
                  </svg>

                  {t('ZiMax Lottery')}

                </Link>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}
                className={pathName === '/collections' ? 'active' : ''}
              >
                <Link to="/collections">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-file-image"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
                  </svg>

                  {t('NFT Marketplace')}

                </Link>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}

                className={pathName === '/nft-calculator' ? 'active' : ''}

              >
                <Link to="/nft-calculator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-calculator-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zm0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-1z" />
                  </svg>

                  {t('Matrix Calculator')}
                </Link>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}

                className={pathName === '/calculator' ? 'active' : ''}

              >
                <Link to="/calculator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-calculator"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z" />
                    <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z" />
                  </svg>

                  {t('Token Calculator')}
                </Link>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}
                className={pathName === '/teams' ? 'active' : ''}
              >
                <Link to="/teams">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-people"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                  </svg>
                  {t('My Teams')}

                </Link>
              </li>
            </ul>
            <ul>
              <li onClick={themeToggle}>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-globe"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
                  </svg>
                </span>
                English
              </li>
            </ul>
            <ul>
              <li className="pencakeswapLink">
                <a

                  href="https://pancakeswap.finance/swap?outputCurrency=0xA080dCB3350d99320Bf67A997D7f876284727ec7"

                  target="_blank"
                >
                  <span>
                    <svg
                      width="96"
                      height="96"
                      viewBox="0 0 96 96"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="48"
                        cy="48"
                        r="48"
                        fill="url(#paint0_linear_10493:36952)"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M47.8581 79.8749C38.5164 79.8678 30.9915 77.6262 25.7338 73.5999C20.413 69.5252 17.5903 63.7429 17.5903 57.2001C17.5903 50.8957 20.4068 46.3497 23.5936 43.2769C26.0911 40.8688 28.8471 39.3265 30.7661 38.4394C30.3322 37.1076 29.7907 35.364 29.3063 33.5632C28.6582 31.1534 28.0223 28.3261 28.0223 26.2543C28.0223 23.802 28.557 21.3392 29.9986 19.4255C31.5217 17.4037 33.8146 16.3206 36.5731 16.3206C38.7289 16.3206 40.5593 17.1202 41.9922 18.4998C43.3619 19.8184 44.2735 21.5697 44.9029 23.3952C46.0089 26.6029 46.4396 30.633 46.5604 34.6548H49.2026C49.3234 30.633 49.754 26.6029 50.8601 23.3952C51.4895 21.5697 52.4011 19.8184 53.7708 18.4998C55.2037 17.1202 57.034 16.3206 59.1899 16.3206C61.9484 16.3206 64.2413 17.4037 65.7644 19.4255C67.206 21.3392 67.7407 23.802 67.7407 26.2543C67.7407 28.3261 67.1048 31.1534 66.4566 33.5632C65.9722 35.364 65.4308 37.1076 64.9968 38.4394C66.9159 39.3265 69.6719 40.8688 72.1693 43.2769C75.3562 46.3497 78.1726 50.8957 78.1726 57.2001C78.1726 63.7429 75.35 69.5252 70.0292 73.5999C64.7715 77.6262 57.2466 79.8678 47.9049 79.8749H47.8581Z"
                        fill="#633001"
                      />
                      <path
                        d="M36.573 18.6528C32.5327 18.6528 30.6729 21.6977 30.6729 25.9088C30.6729 29.2559 32.8339 35.9594 33.7205 38.569C33.9199 39.1559 33.6065 39.799 33.0351 40.0266C29.797 41.3164 20.241 46.039 20.241 56.8546C20.241 68.2477 29.952 76.838 47.86 76.8516C47.8671 76.8516 47.8742 76.8516 47.8814 76.8516C47.8885 76.8516 47.8956 76.8516 47.9028 76.8516C65.8107 76.838 75.5218 68.2477 75.5218 56.8546C75.5218 46.039 65.9658 41.3164 62.7277 40.0266C62.1562 39.799 61.8429 39.1559 62.0423 38.569C62.9289 35.9594 65.0898 29.2559 65.0898 25.9088C65.0898 21.6977 63.23 18.6528 59.1898 18.6528C53.374 18.6528 51.9243 26.9751 51.8209 35.907C51.814 36.5033 51.3368 36.9871 50.7465 36.9871H45.0163C44.4259 36.9871 43.9488 36.5033 43.9419 35.907C43.8385 26.9751 42.3887 18.6528 36.573 18.6528Z"
                        fill="#D1884F"
                      />
                      <path
                        d="M47.9028 73.202C34.7449 73.202 20.2637 66.0868 20.241 56.8762C20.241 56.8906 20.241 56.905 20.241 56.9193C20.241 68.3216 29.9675 76.9164 47.9028 76.9164C65.838 76.9164 75.5645 68.3216 75.5645 56.9193C75.5645 56.905 75.5645 56.8906 75.5645 56.8762C75.5418 66.0868 61.0607 73.202 47.9028 73.202Z"
                        fill="#FEDC90"
                      />
                      <path
                        d="M40.5919 54.0472C40.5919 57.1569 39.1371 58.7765 37.3426 58.7765C35.548 58.7765 34.0933 57.1569 34.0933 54.0472C34.0933 50.9375 35.548 49.3179 37.3426 49.3179C39.1371 49.3179 40.5919 50.9375 40.5919 54.0472Z"
                        fill="#633001"
                      />
                      <path
                        d="M61.7122 54.0472C61.7122 57.1569 60.2575 58.7765 58.4629 58.7765C56.6684 58.7765 55.2136 57.1569 55.2136 54.0472C55.2136 50.9375 56.6684 49.3179 58.4629 49.3179C60.2575 49.3179 61.7122 50.9375 61.7122 54.0472Z"
                        fill="#633001"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_10493:36952"
                          x1="48"
                          y1="0"
                          x2="48"
                          y2="96"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#53DEE9" />
                          <stop offset="1" stopColor="#1FC7D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  Pancakeswap
                </a>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}
              >
                <a href="https://docs.zimax.io/" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-card-list"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                    <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                  </svg>
                  {t("Docs")}
                </a>
              </li>
              <li
                onClick={() => {
                  setMoreMenu(false);
                  setNftMoreMenu(false);
                }}
              >
                <Link to="/risks">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-exclamation-triangle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                  </svg>
                  {t("Risk Warning")}
                </Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link to="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-github"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  {t("Github")}
                </Link>
              </li>
              <li>
                <Link to="https://twitter.com/Zimaxdefi">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-twitter"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                  {t("Twitter")}
                </Link>
              </li>
              <li>
                <Link to="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-discord"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                  </svg>
                </Link>
                {t("Discord")}
              </li>
              <li>
                <Link to="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-telegram"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
                  </svg>
                  {t("Telegram")}
                </Link>
              </li>
              <li>
                <Link to="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-youtube"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9.025 8c0 2.485-2.02 4.5-4.513 4.5A4.506 4.506 0 0 1 0 8c0-2.486 2.02-4.5 4.512-4.5A4.506 4.506 0 0 1 9.025 8zm4.95 0c0 2.34-1.01 4.236-2.256 4.236-1.246 0-2.256-1.897-2.256-4.236 0-2.34 1.01-4.236 2.256-4.236 1.246 0 2.256 1.897 2.256 4.236zM16 8c0 2.096-.355 3.795-.794 3.795-.438 0-.793-1.7-.793-3.795 0-2.096.355-3.795.794-3.795.438 0 .793 1.699.793 3.795z" />
                  </svg>

                  {t('Youtube')}

                </Link>
              </li>
            </ul>
          </MoreMenus>
        )}

        {NftMoreMenu && (
          <MoreMenus>
            <MoreMenuUL>
              <li onClick={() => setNftMoreMenu(false)}>
                <Link to="/offer">{t("Unlisted NFT's")}</Link>
              </li>
              <li onClick={() => setNftMoreMenu(false)}>
                <Link to="/my-collections">{t("My collections")}</Link>
              </li>
            </MoreMenuUL>
          </MoreMenus>
        )}
      </MobileHeader>
    </>
  );
};
