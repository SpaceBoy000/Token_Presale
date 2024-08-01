import { useEffect, useState, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import config from "../../config";
import { numberWithCommas } from "../../utils/method";
import { web3_buy, web3_fund_tokens, web3_initialize, web3_start_sale, web3_withdraw, getContractBalance } from "../../contracts/web3";
import { toast } from "react-toastify";

const Token = () => {

    const wallet = useWallet();

    const progressRef = useRef();
    const percentRef = useRef();
    const [isAdmin, setAdmin] = useState(true);
    const [solAmount, setSolAmount] = useState(0);
    const [gerbiAmount, setGerbiAmount] = useState(0);
    const [raisedAmount, setRaisedAmount] = useState(0);

    const getData = async () => {
        const balance = await getContractBalance();
        console.log("balance: ", balance);
        setRaisedAmount(balance);
    }

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (raisedAmount) {
            console.log(progressRef.current);
            // progressRef.current.style=`width:${raisedAmount/config.hardCapap * 100}%`;
            progressRef.current.style.width = `${raisedAmount / config.hardCap * 100}%`;
            // percentRef.current = raisedAmount/config.hardCap * 100;
        }
    }, [raisedAmount]);

    useEffect(() => {
        if (wallet?.publicKey) {
            if (wallet.publicKey.toBase58() == config.admin || wallet.publicKey.toBase58() == config.authority) {
                setAdmin(true);
            } else {
                setAdmin(false);
            }
        } else {
            setAdmin(false);
        }
    }, [wallet])

    const handleChangeAmount = (e) => {
        const amount = e.target.value;

        setSolAmount(amount);
        setGerbiAmount(amount * config.tokenPrice);
    }

    const handleChangeTokenAmount = (e) => {
        const amount = e.target.value;

        setGerbiAmount(amount);
        setSolAmount(amount / config.tokenPrice);
    }


    const handleClickInitialize = async () => {
        console.log('handleClickInitialize');

        await web3_initialize(wallet);
    }

    const handleClickStartSale = async () => {
        console.log('handleClickStartSale');

        await web3_start_sale(wallet);
    }

    const handleClickFundToken = async () => {
        console.log('handleClickFundToken');

        await web3_fund_tokens(wallet, gerbiAmount);
    }

    const handleClickBuy = async () => {

        if (solAmount < 0.05) {
            toast.info("Minimum buy amount is 0.05 SOL");
            return;
        }

        try {
            await web3_buy(wallet, solAmount);
            await getData();
        } catch (e) {
            toast.error("Internal server error, please try later");
            return;
        }

        toast.success("Successfully purchased!");
    }

    const handleClickWithdrawSOL = async () => {
        await web3_withdraw(wallet);
    }

    return (
        <div id="wrapper">
            <header id="header_main" className="header">
                <div className="container">
                    <div id="site-header-inner" style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                        <div className="header__log">
                            <a href="https://gerbi.io/" style={{ width: '180px' }}>
                                <img src="assets/images/logo/logo2.png" width="180px" alt="logo" />
                            </a>
                        </div>

                        <nav id="main-nav" className="main-nav">
                            <ul id="menu-primary-menu" className="menu">
                                <li className="menu-item menu-item current-menu-item">
                                    <a href="https://gerbi.io/">Home</a>
                                </li>
                                <li className="menu-item"><a href="/#tokenomics">Tokenomics</a>
                                </li>
                                <li className="menu-item">
                                    <a target="_blank" href="https://gerbi.io/gerbi_whitepaper.pdf">Whitepaper</a>
                                </li>
                                <li className="menu-item"><a href="/#roadmap">Roadmap</a>
                                </li>
                                <li className="menu-item"><a href="/#faq">FAQ</a>
                                </li>
                            </ul>
                        </nav>
                        {/* <a href="#" className="tf-button style1 d-none d-sm-inline" data-toggle="modal" data-target="#popup_bid">CONNECT</a> */}

                        <div className="wallet-container">
                            <WalletMultiButton />
                        </div>

                        <div className="mobile-button">
                        </div>
                    </div>
                </div>
            </header>

            <section className="tf-section project_2 relative" style={{ padding: "100px 0px 0px 0px!important" }}>
                <div className="overbg" style={{ position: "absolute", left: "0px", top: "100px", width: "100%", height: "100%", background: "url('./assets/images/backgroup/bg_geb.jpg')", opacity: "0.4", zIndex: "-22", backgroundRepeat: "no-repeat", backgroundPosition: "center, center", backgroundSize: "cover" }}></div>
                <div className="container w_1280">
                    <div className="row">
                        <div className="tf-title pb-5" data-aos="fade-up" data-aos-duration="800" style={{ marginTop: "50px" }}>
                            <div className="mobile-wallet-container">
                                <WalletMultiButton />
                            </div>
                            <h2 className="title rise-font" style={{ marginTop: '100px' }}><span style={{ color: "#86FF00" }}>$GERBI</span> MemeCoin Presale</h2>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-12 d-flex justify-content-center" style={{ marginBottom: "-100px" }}>
                            <div className="wallet-form mt-5">
                                <div className="row">
                                    <div className="col-xl-9 col-9">
                                        <h4>Buy Before Price Rise</h4>
                                        <h5 className="sub text-secondary">RAISED SO FAR: <span className="ms-2" style={{ color: "#86FF00" }}>{Number(raisedAmount).toFixed(2)} SOL</span></h5>
                                        <div className="content-progress-box style2">
                                            <div className="progress-bar" data-percentage={`${raisedAmount / config.hardCap * 100}%`}>
                                                <p className="progress-title-holder">
                                                    <span className="progress-number-wrapper">
                                                        <span className="progress-number-mark">
                                                            <span>
                                                                {(raisedAmount / config.hardCap * 100).toFixed(2)} %
                                                            </span>
                                                        </span>
                                                    </span>
                                                </p>
                                                <div className="progress-content-outter">
                                                    <div className="progress-content" ref={progressRef}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-3">
                                        <div className="image_cta" data-aos="fade-up" data-aos-duration="1200">
                                            <img className="move5 mt-2" src="./assets/images/coinsm2.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="spacing"></div>
                                <div className="content_inner" data-aos="fade-left" data-aos-duration="1200">
                                    <div className="wrapper">
                                        <ul className="price mb-3">
                                            <li> <span>1 $GERBI = {1 / config.tokenPrice} SOL</span>
                                            </li>
                                        </ul>
                                        <h6 className="featured_title">UNTIL NEXT ROUND</h6>
                                        <div className="d-flex justify-content-center">
                                            <div className="featured-countdown" style={{ width: '350px' }}> <span className="slogan"></span> <span className="js-countdown" data-timer={config.startTime}></span>
                                                <ul className="desc">
                                                    <li>day</li>
                                                    <li>hou</li>
                                                    <li>min</li>
                                                    <li>sec</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="project-info-form style mt-4">
                                    <div className="form-inner">
                                        <div className="flex mb22">
                                            <div className="col50 text-start">
                                                <label className="fz16 mb8 ms-1">
                                                    SOL You Pay
                                                </label>
                                                <fieldset>
                                                    <input
                                                        className="pl14"
                                                        id="city"
                                                        type="number"
                                                        value={solAmount}
                                                        onChange={handleChangeAmount}
                                                    />
                                                </fieldset>
                                            </div>
                                            <div className="col50 text-start">
                                                <label className="fz16 mb8 ms-1" for="code">
                                                    $GERBI You Receive
                                                </label>
                                                <fieldset>
                                                    <input
                                                        id="code"
                                                        className="pl14"
                                                        type="number"
                                                        value={gerbiAmount}
                                                        onChange={handleChangeTokenAmount}
                                                    />
                                                </fieldset>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="connect-wallet mt-4">
                                    <div className="col-md-12 d-flex justify-content-center">
                                        <button
                                            className="tf-button style2"
                                            style={{ width: '150px' }}
                                            onClick={handleClickBuy}
                                        >
                                            Buy $Gerbi
                                        </button>
                                        {/* <WalletMultiButton /> */}
                                    </div>
                                </div>
                                <div className="bottom mt-3 text-center"> <a href="#">Don't have wallet yet?</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-6 col-lg-6 col-md-6 col-12 text-center">
                            <div className="row">
                                <div className="col-md-12">
                                    <img src="./assets/images/gerbicoins.png" className="img-fluid" style={{ maxHeight: "400px", width: "auto" }} />
                                </div>
                                <div className="col-md-12">
                                    <h5 className="marker-text">  Introducing <span className="rise-font">$GERBI</span>, our unique meme coin designed to bring the fun and profitability of cryptocurrency to everyone</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {

                    isAdmin && <div className="flex gap-4 justify-center">
                        <button
                            className="tf-button style2"
                            style={{ width: '150px' }}
                            onClick={handleClickInitialize}
                        >
                            Initialize
                        </button>
                        <button
                            className="tf-button style2"
                            style={{ width: '150px' }}
                            onClick={handleClickStartSale}
                        >
                            Start Sale
                        </button>
                        <button
                            className="tf-button style2"
                            style={{ width: '150px' }}
                            onClick={handleClickFundToken}
                        >
                            Fund Token
                        </button>
                        <button
                            className="tf-button style2"
                            style={{ width: '150px' }}
                            onClick={handleClickWithdrawSOL}
                        >
                            Withdraw SOL
                        </button>
                    </div>
                }
            </section>

            <section className="tf-section supported" style={{ marginTop: "130px" }} id="tokenomics">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tf-title" data-aos="fade-up" data-aos-duration="800">
                                <h2 className="title rise-font">Our Media Spotlight</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container w_1710 brand_wrapper">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="brand">
                                <div className="swiper-container2 slider-12" data-aos="fade-in" data-aos-duration="1000">
                                    <img className="mobmedia" src="/assets/images/common/branda.png" alt="" />
                                    <img className="mobmedia" src="/assets/images/common/brandb.png" alt="" />
                                    <img className="mobmedia" src="/assets/images/common/brandc.png" alt="" />
                                    <img className="mobmedia" src="/assets/images/common/brandd.png" alt="" />
                                    <img className="mobmedia" src="/assets/images/common/brandf.png" alt="" />
                                    <img className="mobmedia" src="/assets/images/common/brandg.png" alt="" />
                                    <img className="mobmedia" src="/assets/images/common/brandh.png" alt="" />
                                    <img className="mobmedia" src="/assets/images/common/brandi.png" alt="" />
                                    <img className="mobmedia" src="/assets/images/common/brandj.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="tf-section features">
                <div className="overlay">
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tf-title" data-aos="fade-up" data-aos-duration="800">
                                <h2 className="title rise-font mt-5 mt-xl-1 mt-lg-1">
                                    TOKENOMICS </h2>
                                <h4 style={{ fontSize: '28px', display: 'flex', justifyContent: 'center' }}>Total Supply: 1,000,000,000 <img src="./assets/images/gerbism2.png" style={{ width: "40px", marginTop: "-3px" }} /> $GERBI</h4>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="wrapper-box">
                                <div className="icon-box-style2" style={{ width: "70%" }}>
                                    <ul className="describe_chart">
                                        <li className="mobili">
                                            <img src="./assets/images/col5.png" width="40px;" alt="" />
                                            <div className="desc">
                                                <p className="name" style={{ fontSize: "1rem" }}>Presale Phase #1</p>
                                                <p className="number">20%</p>
                                            </div>
                                        </li>
                                        <li>
                                            <img src="./assets/images/col2.png" width="40px;" alt="" />
                                            <div className="desc">
                                                <p className="name" style={{ fontSize: "1rem" }}>Presale Phase #2</p>
                                                <p className="number">30%</p>
                                            </div>
                                        </li>
                                        <li>
                                            <img src="./assets/images/col3.png" width="40px;" alt="" />
                                            <div className="desc">
                                                <p className="name">Liquidity Pools</p>
                                                <p className="number">20%</p>
                                            </div>
                                        </li>
                                        <li>
                                            <img src="./assets/images/col6.png" width="40px;" alt="" />
                                            <div className="desc">
                                                <p className="name">Reserve</p>
                                                <p className="number">20%</p>
                                            </div>
                                        </li>
                                        <li>
                                            <img src="./assets/images/col4.png" width="40px;" alt="" />
                                            <div className="desc">
                                                <p className="name">Team and Advisors</p>
                                                <p className="number">5%</p>
                                            </div>
                                        </li>
                                        <li>
                                            <img src="./assets/images/col7.png" width="40px;" alt="" />
                                            <div className="desc">
                                                <p className="name">Marketing</p>
                                                <p className="number">5%</p>
                                            </div>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 text-center mb-5 mb-xl-0 mb-lg-0" style={{ marginTop: "30px" }}>
                            <img src="./assets/images/diagram4.png" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-section tf_CTA_2" id="whitepaper">
                <div className="overlay">
                </div>
                <div className="container relative">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="tf-title left mb0" data-aos="fade-up" data-aos-duration="800">
                                <h2 className="title rise-font">WHITEPAPER</h2>
                                <div className="row">
                                    <div className="col-md-12">
                                        <p className="sub" style={{ width: "90%" }}>
                                            Dive deep into the $GERBI project with our comprehensive whitepaper. Discover our innovative vision, detailed tokenomics, and strategic roadmap. Learn how $GERBI is set to revolutionize the meme coin space with robust security measures and a community-driven approach. Download now to join us on this exciting journey and be part of the future of decentralized finance!</p>
                                    </div>
                                </div>
                                <div className="wrap-btn">
                                    <a href="https://gerbi.io/gerbi_whitepaper.pdf" className="tf-button style3"><i className="fa fa-download me-2"></i>
                                        DOWNLOAD</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="image_cta" data-aos="fade-left" data-aos-duration="1200">
                                <img className="move4" src="./assets/images/paper.png" alt="" />
                                <img className="icon icon_1 mt-5 mt-xl-0 mt-lg-0 mt-md-0" src="./assets/images/gerbism2.png" width="70px" alt="" />
                                <img className="icon icon_2" src="./assets/images/emo6.png" width="150px;" alt="" style={{ rotate: "130deg !important" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-section roadmap" style={{ marginTop: "50px" }} id="roadmap">
                <div className="container">
                    <div className="row">
                        <h2 className="title rise-font text-center">ROADMAP</h2>
                        <div className="col-md-12 mt-4">
                            <div className="roadmap-wrapper-style2" data-aos="fade-up" data-aos-duration="1200">
                                <div className="left">
                                    <div className="roadmap-box-style active">
                                        <div className="icon">
                                            <img src="./assets/images/common/down.svg" alt="" />
                                        </div>
                                        <div className="content">
                                            <h6 className="date">July 2024</h6>
                                            <ul>
                                                <li>Token Development: Finalize the development of the $GERBI token, ensuring robust security and functionality.</li>
                                                <li>Launch of Presale: Initiate the first phase of our token presale, releasing 20% of the total supply at the initial price.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="roadmap-box-style">
                                        <div className="icon">
                                            <img src="./assets/images/common/down.svg" alt="" />
                                        </div>
                                        <div className="content">
                                            <h6 className="date">October 2024</h6>
                                            <ul>
                                                <li>DEX Integration: List $GERBI on major decentralized exchanges and establish liquidity pools to ensure smooth trading and liquidity.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="roadmap-box-style">
                                        <div className="icon">
                                            <img src="./assets/images/common/down.svg" alt="" />
                                        </div>
                                        <div className="content">
                                            <h6 className="date">2025</h6>
                                            <ul>
                                                <li>Price Growth: Continue promoting $GERBI to drive value appreciation and market recognition.</li>
                                                <li>Community Building: Foster a strong, engaged community through continuous support and development.</li>
                                                <li>Global Recognition: Elevate $GERBI to a renowned token in the crypto space through strategic marketing and collaborations.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="roadmap-box-style">
                                        <div className="icon">
                                            <img src="./assets/images/common/down.svg" alt="" />
                                        </div>
                                        <div className="content">
                                            <h6 className="date">September 2024</h6>
                                            <ul>
                                                <li>Phase #2 Presale: Commence the second phase of the token presale, introducing the next 30% of the supply at an increased price.</li>
                                                <li>Community Engagement: Begin strategic marketing campaigns to grow and engage the $GERBI community.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="roadmap-box-style">
                                        <div className="icon">
                                            <img src="./assets/images/common/down.svg" alt="" />
                                        </div>
                                        <div className="content">
                                            <h6 className="date">December 2024</h6>
                                            <ul>
                                                <li>CEX Listings: Start listing $GERBI on centralized exchanges to increase accessibility and market reach.</li>
                                                <li>Market Expansion: Focus on expanding the market presence and building partnerships with key industry players.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-section features">
                <div className="overlay"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tf-title" data-aos="fade-up" data-aos-duration="800">
                                <h2 className="title rise-font mt-5 mt-xl-0 mt-lg-0 mt-md-0">MEMES</h2>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-12 text-center mb-3">
                            <a style={{ cursor: "pointer !important" }} target="_blank">
                                <img src="/assets/images/meme1.jpg" style={{ borderRadius: "10px" }} />
                            </a>
                        </div>
                        <div className="col-xl-4 col-md-4 col-12 text-center mb-3">
                            <a style={{ cursor: "pointer !important" }} target="_blank">
                                <img src="/assets/images/meme2.jpg" style={{ borderRadius: "10px" }} />
                            </a>
                        </div>
                        <div className="col-xl-4 col-md-4 col-12 text-center mb-3">
                            <a style={{ cursor: "pointer !important" }} target="_blank">
                                <img src="/assets/images/meme3.jpg" style={{ borderRadius: "10px" }} />
                            </a>
                        </div>
                        <div className="col-xl-4 col-md-4 col-12 text-center mb-3">
                            <a style={{ cursor: "pointer !important" }} target="_blank">
                                <img src="/assets/images/meme4.jpg" style={{ borderRadius: "10px" }} />
                            </a>
                        </div>
                        <div className="col-xl-4 col-md-4 col-12 text-center mb-3">
                            <a style={{ cursor: "pointer !important" }} target="_blank">
                                <img src="/assets/images/meme5.jpg" style={{ borderRadius: "10px" }} />
                            </a>
                        </div>
                        <div className="col-xl-4 col-md-4 col-12 text-center mb-3">
                            <a style={{ cursor: "pointer !important" }} target="_blank">
                                <img src="/assets/images/meme6.jpg" style={{ borderRadius: "10px" }} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-section FAQs" id="faq" style={{ paddingTop: "0px" }}>
                <div className="overlay"></div>
                <div className="container mb-5 mb-xl-0 mb-lg-0 mb-md-0">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tf-title" data-aos="fade-up" data-aos-duration="800">
                                <h2 className="title rise-font">
                                    F.A.Q. </h2>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="flat-accordion aos-init aos-animate" data-aos="fade-up" data-aos-duration="800">
                                <div className="flat-toggle active">
                                    <div className="h7 toggle-title active">
                                        <span className="icon-Icon"> </span>
                                        <span>What is the $GERBI token?</span>
                                    </div>
                                    <p className="toggle-content" style={{ display: "none" }}>$GERBI is a meme coin built on the Solana blockchain, designed to provide fun and profitable opportunities for cryptocurrency enthusiasts. Our mission is to combine the excitement of meme culture with the security and potential returns of decentralized finance.</p>
                                </div>
                                <div className="flat-toggle">
                                    <div className="h7 toggle-title">
                                        <span className="icon-Icon"> </span>
                                        <span>How can I participate in the $GERBI token presale?</span>
                                    </div>
                                    <p className="toggle-content" style={{ display: "none" }}>To participate in the $GERBI token presale, visit our official website during the presale phases. You will need a compatible cryptocurrency wallet to purchase $GERBI tokens using supported cryptocurrencies.</p>
                                </div>
                                <div className="flat-toggle">
                                    <div className="h7 toggle-title">
                                        <span className="icon-Icon"> </span>
                                        <span>What are the phases of the $GERBI token presale?</span>
                                    </div>
                                    <p className="toggle-content" style={{ display: "none" }}>The $GERBI token presale consists of two phases:<br />
                                        Phase 1 (July 2024): 20% of the total supply at the initial price.<br />
                                        Phase 2 (September 2024): 30% of the total supply at a slightly higher price.
                                    </p>
                                </div>
                                <div className="flat-toggle">
                                    <div className="h7 toggle-title">
                                        <span className="icon-Icon"> </span>
                                        <span>What will happen after the presale?</span>
                                    </div>
                                    <p className="toggle-content" style={{ display: "none" }}>After the presale, $GERBI will be listed on major decentralized exchanges (DEXs) in October 2024 to provide liquidity and enable trading. By December 2024, we plan to list $GERBI on centralized exchanges (CEXs) to increase accessibility and market reach.</p>
                                </div>
                                <div className="flat-toggle">
                                    <div className="h7 toggle-title">
                                        <span className="icon-Icon"> </span>
                                        <span>How will $GERBI ensure the security and success of the project?</span>
                                    </div>
                                    <p className="toggle-content" style={{ display: "none" }}>We prioritize security through rigorous development and regular audits of our smart contracts. Our roadmap includes strategic marketing, community engagement, and continuous development to foster growth and long-term success.</p>
                                </div>
                                <div className="flat-toggle">
                                    <div className="h7 toggle-title">
                                        <span className="icon-Icon"> </span>
                                        <span>How can I stay updated on the $GERBI project?</span>
                                    </div>
                                    <p className="toggle-content" style={{ display: "none" }}>Stay updated by following our official social media channels, subscribing to our newsletter, and regularly visiting our website for the latest news, updates, and community events.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <div className="modal fade popup" id="popup_bid" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="close icon" data-dismiss="modal" aria-label="Close">
                            <img src="./assets/images/backgroup/bg_close.png" alt="" />
                        </div>
                        <div className="header-popup">
                            <h5>Select a Wallet</h5>
                            <div className="desc">
                                By connecting your wallet, you agree to our <a href="#">Terms of Service</a> and our <a href="#">Privacy Policy</a>.
                            </div>
                            <div className="spacing"></div>
                        </div>

                        <div className="modal-body center">
                            <div className="connect-wallet">
                                <ul>
                                    <li>
                                        <a href="connect-wallet.html"><img src="./assets/images/common/wallet_5.png" alt="" />
                                            <span>MetaMask</span>
                                            <span className="icon">
                                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.1875 1.375L6.8125 7L1.1875 12.625" stroke="#798DA3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="connect-wallet.html">
                                            <img src="./assets/images/common/wallet_6.png" alt="" />
                                            <span>Coibase Walet</span>
                                            <span className="icon">
                                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.1875 1.375L6.8125 7L1.1875 12.625" stroke="#798DA3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="connect-wallet.html">
                                            <img src="./assets/images/common/wallet_7.png" alt="" />
                                            <span>WaletConnect</span>
                                            <span className="icon">
                                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.1875 1.375L6.8125 7L1.1875 12.625" stroke="#798DA3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="connect-wallet.html">
                                            <img src="./assets/images/common/wallet_8.png" alt="" />
                                            <span>Phantom</span>
                                            <span className="icon">
                                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.1875 1.375L6.8125 7L1.1875 12.625" stroke="#798DA3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="connect-wallet.html">
                                            <img src="./assets/images/common/wallet_9.png" alt="" />
                                            <span>Core</span>
                                            <span className="icon">
                                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.1875 1.375L6.8125 7L1.1875 12.625" stroke="#798DA3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </a>
                                    </li>

                                    <li>
                                        <a href="#">
                                            <img src="./assets/images/common/wallet_10.png" alt="" />
                                            <span>Bitski</span>
                                            <span className="icon">
                                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.1875 1.375L6.8125 7L1.1875 12.625" stroke="#798DA3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer id="footer">

                <div className="footer-bottom">
                    <div className="container">
                        <div className="wrap-fx">
                            <div className="Copyright">
                                Copyright © 2024 GERBI.io. All Rights Reserved
                            </div>

                            <ul className="social">
                                <li>
                                    <a href="#"><i className="fa fa-paper-plane"></i></a>
                                </li>
                                <li>
                                    <a href="https://twitter.com"><i className="fa-brands fa-x-twitter"></i></a>
                                </li>
                                <li>
                                    <a href="#"><i className="fa-brands fa-discord"></i></a>
                                </li>
                                <li>
                                    <a href="https://twitter.com"><i className="fa-brands fa-youtube"></i></a>
                                </li>
                                <li>
                                    <a href="https://twitter.com"><i className="fa-brands fa-instagram"></i></a>
                                </li>
                                <li>
                                    <a href="https://twitter.com"><i className="fa-brands fa-threads"></i></a>
                                </li>
                                <li>
                                    <a href="https://twitter.com"><i className="fa-brands fa-medium"></i></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Token;
