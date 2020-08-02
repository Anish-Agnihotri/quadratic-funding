import Head from 'next/head' // HTML head
import ReactTable from 'react-table-6' // React table for QF calculator
import { useState, useEffect } from 'react';
import TagsInput from 'react-tagsinput'; // Tags input for funding amounts
import CountUp from 'react-countup'; // React countup for QF impact

export default function Home() {
  const [match, setMatch] = useState(1000); // Setup default match amount
  const [deletion, setDeletion] = useState(true); // Setup deletion handler to trigger match
  
  // Funding calculator
  const [data, setData] = useState([
    {funding: [], fundingAmount: 0, match: 0 },
    {funding: [], fundingAmount: 0, match: 0 },
    {funding: [], fundingAmount: 0, match: 0 },
    {funding: [], fundingAmount: 0, match: 0 },
  ]);

  // Event handlers to recalculate match on change
  useEffect(() => calculateMatch(), [match]);
  useEffect(() => calculateMatch(), [deletion]);

  // Remove grant by grant_number
  const removeGrant = grant_number => {
    // Filter array by index
    setData(data.length > 1 ? data.filter((v, index) => index !== grant_number) : []);
    // Trigger event handler by toggling deletion state
    setDeletion(deletion => !deletion);
  };

  // Add grant
  const addGrant = () => {
    // Append new grant to data array
    setData(data => [...data, {funding: [], fundingAmount: 0, match: 0}]);
  };

  // Calculate match for each grant
  const calculateMatch = () => {
    let newData = data; // Collect data
    let summed = 0; // Setup summed grant contributions

    // Loop over each grant
    for (let i = 0; i < newData.length; i++) {
      let sumAmount = 0;

      // Sum the square root of each grant contribution
      for (let j = 0; j < newData[i].funding.length; j++) {
        sumAmount += Math.sqrt(newData[i].funding[j]);
      }

      // Square the total value of each summed grants contributions
      sumAmount *= sumAmount;
      newData[i].match = sumAmount;
      summed += sumAmount;
    }

    // Setup a divisor based on available match
    let divisor = match/summed;
    // Multiply matched values with divisor to get match amount in range of available funds
    for (let i = 0; i < newData.length; i++) {
      newData[i].match *= divisor;
    }

    // Set new data
    setData([...newData]);
  };

  // Change handler for tags input
  const handleChange = (tags, grant_number) => {
    let newData = data; // Collect data
    newData[grant_number].funding = tags.map(x => parseFloat(x)); // Set array value
    newData[grant_number].fundingAmount = newData[grant_number].funding.reduce((a, b) => a + b, 0); // Update funding amount
    setData([...newData]); // Set data
    calculateMatch(); // Recalculate match with new changes
  };

  // Calculator column format for react-table
  const columns = [
    {Header: "Remove", accessor: 'number', Cell: row => <button onClick={() => removeGrant(row.index)} className="close-button">X</button>},
    {Header: 'Grant', accessor: 'number', Cell: row => <span className="grant__name">Grant #{row.index + 1}</span>},
    {Header: 'Funding', accessor: 'funding', Cell: row => <TagsInput inputProps={{className: 'react-tagsinput-input', placeholder: 'Add a contribution'}} value={data[row.index].funding} onChange={tags => handleChange(tags, row.index)} />},
    {Header: 'Funded amount', accessor: 'fundingAmount', Cell: row => <span className="grant__match">${row.value ? row.value.toFixed(2) : 0}</span>},
    {Header: 'Match amount', accessor: 'match', Cell: row => <span className="grant__match">${row.value ? row.value.toFixed(2) : 0}</span>}
  ];

  return (
    <div className="container">

      <Head>
        <title>Quadratic Funding | Calculator</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#0f0857" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#0f0857" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
        <meta name="theme-color" content="#0f0857" />
        <meta name="description" content="Quadratic Funding is the mathematically optimal way to fund public goods in a democratic community." />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content="Quadratic Funding | Calculator" />
        <meta name="og:description" property="og:description" content="Quadratic Funding is the mathematically optimal way to fund public goods in a democratic community." />
        <meta property="og:site_name" content="Quadratic-Funding.Vercel.APP" />
        <meta property="og:url" content="https://quadratic-funding.vercel.app/" />  
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Quadratic Funding | Calculator" />
        <meta name="twitter:description" content="Quadratic Funding is the mathematically optimal way to fund public goods in a democratic community." />
        <meta name="twitter:site" content="https://quadratic-funding.vercel.app/" />
        <meta name="twitter:creator" content="https://twitter.com/_anishagnihotri" />
        <meta property="og:image" content="https://quadratic-funding.vercel.app/metaimage.png" />
        <meta name="twitter:image" content="https://quadratic-funding.vercel.app/metaimage.png" />
      </Head>

      <div className="header">
        <a href="https://gitcoin.co" target="_blank" rel="noopener noreferrer">
          <img src="https://s.gitcoin.co/static/v2/images/logo_med_hover.c2969168bf04.gif" alt="QF.WTF logo" />
        </a>
      </div>

      <div className="subheader">
        <img src="/logo.gif" alt="Quadratic Funding logo" />
        <p>Quadratic Funding is the mathematically optimal way to fund public goods in a democratic community.</p>
        <img src="/formula.gif" alt="Quadratic Funding formula" />
        <p><a href="https://arxiv.org/pdf/1809.06421.pdf" target="_blank" rel="noopener noreferrer">Quadratic Funding Paper (PDF)</a> by <a href="https://twitter.com/glenweyl" target="_blank" rel="noopener noreferrer">@glenweyl</a> &amp; <a href="https://twitter.com/vitalikbuterin" target="_blank" rel="noopener noreferrer">@vitalikbuterin</a></p> 
        <p>This calculator made with &lt;3 by <a href="https://twitter.com/_anishagnihotri" target="_blank" rel="noopener noreferrer">@_anishagnihotri</a> &amp; <a href="https://twitter.com/owocki" target="_blank" rel="noopener noreferrer">@owocki</a></p>
      </div>

      <div className="content">
        <div className="content__center">
          <div className="half-box content__center__qfamount">
            <h3>Match Amount</h3>
            <input type="number" min="0" value={match} onChange={e => setMatch(e.target.value)} placeholder="Enter $ funding match amount" />
          </div>
          <div className="half-box content__center__projectnum">
            <h3>Number of projects</h3>
            <h2>{data.length}</h2>
          </div>
          <div className="table__view">
            <div>
              <h3>Grants</h3>
            </div>
            <ReactTable
              data={data}
              columns={columns}
              showPagination={false}
              resizable={false}
              className="table -striped -highlight"
              minRows={0}
              sortable={false}
            />
            <button onClick={addGrant} className="add__grant">Add Grant</button>
          </div>
        </div>
      </div>

      <div className="counter">
        <span>Quadratic Funding Impact</span>
        <h1><CountUp end={2338000} duration={5} prefix={"$"} separator={","} /></h1>
        <span>has been distributed via projects like:</span>
        <div>
          <div>
            <a href="https://gitcoin.co/grants" target="_blank" rel="noopener noreferrer">
              <img src="/grants_logo.png" alt="Gitcoin Grants logo" />
            </a>
            <h3>Gitcoin Grants</h3>
            <span>$2,300,000</span>
          </div>
          <div>
            <a href="https://downtownstimulus.com/" target="_blank" rel="noopener noreferrer">
              <img src="/downtown_stimulus_logo.png" alt="Downtown Stimulus logo" />
            </a>
            <h3>Downtown Stimulus</h3>
            <span>$38,000</span>
          </div>
          <div>
            <img src="/plus.png" alt="Add icon" />
            <h3>Add your project</h3>
            <a href="mailto:founders@gitcoin.co">Email Gitcoin</a>
          </div>
        </div>
      </div>

      <div className="subfooter">
        <div className="content__center">
          <h3>What if you could program support for public goods into your monetary system?</h3>
          <p>Private goods incentive landscape + Public goods incentive landscape = </p>
          <img src="/landscape.png" alt="Combined lanscapes" />
          <div>
            <a href="https://vitalik.ca/general/2020/07/21/round6.html" target="_blank" rel="noopener noreferrer">Read more about experiments with QF</a>
            <a href="https://gitcoin.co/grants" target="_blank" rel="noopener noreferrer">Play with Gitcoin Grants</a>
          </div>
        </div>
      </div>

      <div className="footer">
        <a href="https://gitcoin.co" target="_blank" rel="noopener noreferrer">
          <img src="https://s.gitcoin.co/static/v2/images/logo_med_hover.c2969168bf04.gif" alt="QF.WTF logo" />
        </a>
        <div>
          <a href="https://github.com/anish-agnihotri/quadratic-funding" target="_blank" rel="noopener noreferrer">
            <img src="/github.png" alt="GitHub logo" />
          </a>
          <a href="https://gitcoin.co/twitter" target="_blank" rel="noopener noreferrer">
            <img src="/twitter.png" alt="Twitter logo" />
          </a>
        </div>

      </div>
      <style jsx global>{`
      body {
        margin: 0px;
        padding: 0px;
        background-color: #0F0432;
        font-family: 'Roboto', sans-serif;
      }
      .table {
        border-left: none;
        border-right: none;
      }
      .rt-thead {
        text-transform: uppercase;
        color: #5a728c;
        font-size: 13px;
        font-weight: 700;
        background-color: #f8fafd;
        border-top: 1px solid #e7eaf3;
        border-bottom: 1px solid #e7eaf3;
        height: 40px;
        border-top: none;
      }
      .rt-th, .rt-td {
        padding: 0px !important;
        text-align: left;
        border-right: none !important;
      }
      .rt-td {
        min-height: 60px;
      }
      .rt-th > div {
        display: inline-block;
        transform: translate(10px, 10px);
      }
      .rt-thead, .-header {
        box-shadow: none !important;
      }
      .rt-tbody > div {
        border-bottom-color: #e7eaf3!important;
      }
      .close-button {
        background-color: #ff1c48;
        background-image: linear-gradient(180deg, #ff1c48 0%, #ff6132 100%);
        border-radius: 5px;
        border: none;
        color: #fff;
        padding: 5px 10px;
        transform: translate(11.5px, 17.5px);
        transition: 100ms ease-in-out;
        cursor: pointer;
        font-weight: 700;
      }
      .close-button:hover {
        opacity: 0.7;
      }
      .close-button:focus {
        none;
      }
      .grant__name {
        font-size: 18px;
        font-weight: 500;
        line-height: 60px;
        padding-left: 10px;
      }
      .grant__match {
        font-weight: bold;
        font-size: 22px;
        line-height: 60px;
        padding-left: 10px;
      }
      .rt-tbody, .rt-thead {
        min-width: 770px !important;
      }
      .rt-tr > .rt-th:nth-of-type(1), .rt-tr > .rt-td:nth-of-type(1) {
        width: 70px !important;
        flex: none !important;
      }
      .rt-tr > .rt-th:nth-of-type(2), .rt-tr > .rt-td:nth-of-type(2) {
        width: 100px !important;
        flex: none !important;
      }
      .rt-tr > .rt-th:nth-of-type(3), .rt-tr > .rt-td:nth-of-type(3) {
        width: calc(100% - 470px) !important;
        flex: none !important;
      }
      .rt-tr > .rt-td:nth-of-type(3) > div {
        width: 95%;
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        border: 1px solid #e7eaf3;
      }
      .react-tagsinput-input {
        width: 120px !important;
      }
      .react-tagsinput-tag {
        background-color: #e7eaf3;
        color: #000;
        border-color: #bbc4dd;
      }
      .rt-tr > .rt-th:nth-of-type(4), .rt-tr > .rt-td:nth-of-type(4) {
        width: 150px !important;
        flex: none !important;
      }
      .rt-tr > .rt-th:nth-of-type(5), .rt-tr > .rt-td:nth-of-type(5) {
        width: 150px !important;
        flex: none !important;
      }
      `}</style>
      <style jsx>{`
      .container > div {
        display: block;
      }
      .header {
        height: 65px;
        box-shadow: 0 2px 10px rgba(151,164,175,.1);
        padding: 0px 20px;
        width: calc(100% - 40px);
        background-image: url('/header-bg.png');
        background-position: center top;
      }
      .header > a {
        text-decoration: none;
        transition: 100ms ease-in-out;
      }
      .header > a:hover {
        opacity: 0.7;
      }
      .header > a > img {
        height: 50px;
        padding-top: 5px;
      }
      .subheader {
        text-align: center;
        background-image: url('/subheader-bg.jpg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        min-height: 200px;
        padding: 20px 0px;
        box-shadow: inset 0 3px 8px rgba(151,164,175,.05);
        border-bottom: 1px solid #e7eaf3;
      }
      .subheader > img:nth-of-type(1) {
        height: 150px;
      }
      .subheader > img:nth-of-type(2) {
        height: 50px;
      }
      .subheader > p {
        max-width: 450px;
        display: block;
        margin-block-start: 0px;
        line-height: 25px;
        margin: 15px auto;
        padding: 0px 20px;
        color: #fff;
      }
      .subheader > p:nth-of-type(2) {
        margin-top: 30px;
      }
      .subheader > p:nth-of-type(2), .subheader > p:nth-of-type(3) {
        max-width: 600px;
      }
      .subheader > p > a {
        color: #000;
        padding: 1px 3px;
        background-color: #00e996;
        border-radius: 2px;
        font-weight: 500;
        text-decoration: none;
        transition: 100ms ease-in-out;
      }
      .subheader > p > a:hover {
        opacity: 0.75;
      }
      .content {
        background-color: #F6F9FC;
        width: 100%;
        padding: 30px 0px;
      }
      .content__center {
        width: 1000px;
        margin: 0px auto;
        padding-top: 25px;
        padding-bottom: 25px;
        text-align: center;
      }
      .half-box {
        background-color: #fff;
        border: 1px solid #e7eaf3;
        border-radius: 8px;
        height: 80px;
        display: inline-block;
        box-shadow: 0 0 35px rgba(127,150,174,.125);
        width: calc(50% - 29.5px);
        padding: 10px;
        vertical-align: top;
        text-align: left;
      }
      .half-box:nth-child(1) {
        margin-right: 7.5px;
      }
      .half-box:nth-child(2) {
        margin-left: 7.5px;
      }
      .half-box > h3, .table__view > div > h3 {
        margin: 5px;
        color: #587299;
        font-weight: 600;
        font-size: 13.5px;
        text-transform: uppercase;
      }
      .half-box > h2 {
        font-weight: 500;
        font-size: 30px;
        margin-block-start: 10px;
        margin-left: 5px;
      }
      .half-box > input {
        margin: 0px 5px;
        width: calc(100% - 30px);
        font-size: 30px;
        padding: 5px 0px 5px 5px;
        border: 1px solid #e7eaf3;
        border-radius: 5px;
      }
      .half-box > input::placeholder {
        font-size: 18px;
        transform: translateY(-3.5px);
      }
      .table__view {
        margin: 15px 0px 0px 0px;
        background-color: #fff;
        border: 1px solid #e7eaf3;
        border-radius: 8px;
        box-shadow: 0 0 35px rgba(127,150,174,.125);
      }
      .table__view > div > h3 {
        text-align: left;
        font-size: 20px;
        padding: 7.5px 0px 7.5px 5px;
      }
      .add__grant {
        margin: 10px;
        padding: 10px 15px;
        font-size: 18px;
        font-weight: 400;
        color: #000;
        font-weight: bold;
        border: none;
        border-radius: 5px;
        background-color: #00EC93;
        transition: 100ms ease-in-out;
        cursor: pointer;
      }
      .add__grant:hover {
        background-color: #00cc7e; 
      }
      .add_grant:focus {
        outline: none;
      }
      .counter {
        background-color: #F6F9FC;
        width: 100%;
        padding: 30px 0px 50px 0px;
        text-align: center;
      }
      .counter > span {
        display: block;
        text-transform: uppercase;
        font-weight: 500;
        color: #0F0857;
      }
      .counter > h1 {
        background-color: #ff1c48;
        background-image: linear-gradient(180deg, #ff1c48 0%, #ff6132 100%);
        display: inline-block;
        color: #fff;
        font-size: 80px;
        padding: 10px 20px;
        border-radius: 5px;
        margin-block-start: 15px;
        margin-block-end: 15px;
      }
      .counter > div {
        padding: 30px 0px 10px 0px;
      }
      .counter > div > div {
        display: inline-block;
        margin: 20px;
        width: 300px;
      }
      .counter > div > div:nth-child(1) > a, .counter > div > div:nth-child(2) > a {
        border-bottom: none;
      }
      .counter > div > div:nth-child(1) > a > img {
        width: 250px;
      }
      .counter > div > div:nth-child(2) > a > img {
        width: 80px;
      }
      .counter > div > div:nth-child(3) > img {
        width: 150px;
      }
      .counter > div > div > h3 {
        font-size: 22px;
        margin-block-end: 5px;
      }
      .counter > div > div > span {
        font-size: 18px;
      }
      .counter > div > div > a {
        font-size: 18px;
        text-decoration: none;
        color: #000;
        border-bottom: 1px solid #00e996;
        transition: 50ms ease-in-out;
      }
      .counter > div > div > a:hover {
        opacity: 0.7;
      }
      .subfooter {
        height: auto;
        border-top: 2px solid ##6D1DA1;
        width: calc(100% - 40px);
        padding: 50px 20px 30px 20px;
        background-color: #070C16;
        color: #fff;
      }
      .subfooter > div {
        padding: 0px;
      }
      .subfooter > div > h3 {
        font-size: 23px;
        margin-block-start: 0px;
        color: #00e996;
      }
      .subfooter > div > img {
        max-width: 500px;
        margin-top: 10px;
      }
      .subfooter > div > div {
        display: block;
        padding: 40px 0px 20px 0px;
      }
      .subfooter > div > div > a {
        margin: 10px;
        padding: 7px 15px;
        border-radius: 2px;
        font-size: 18px;
        text-decoration: none;
        display: inline-block;
        color: #fff;
        background-color: #980572;
        transition: 50ms ease-in-out;
      }
      .subfooter > div > div > a:hover {
        opacity: 0.85;
      }
      .footer {
        height: 150px;
        padding: 0px 20px;
        width: calc(100% - 40px);
        background-image: url('/header-bg.png');
        background-position: center top;
        text-align: center;
      }
      .footer > a {
        transition: 50ms ease-in-out;
      }
      .footer > a:hover {
        opacity: 0.7;
      }
      .footer > a > img {
        height: 60px;
        margin-top: 15px;
      }
      .footer > div {
        display: block;
        height: 40px;
        padding: 10px 0px;
      }
      .footer > div > a {
        margin: 0px 5px;
        padding: 5px 10px 1px 10px;
        border-radius: 5px;
        display: inline-block;
        transition: 50ms ease-in-out;
      }
      .footer > div > a:hover img {
        opacity: 0.7;
      }
      .footer > div > a > img {
        height: 35px;
        filter: invert(100%);
      }
      @media screen and (max-width: 600px) {
        .subfooter > div > img {
          width: 90% !important;
        }
        .counter > h1 {
          font-size: 30px;
        }
        .counter > div > div {
          width: calc(100% - 40px);
        }
      }
      @media screen and (max-width: 1050px) {
        .content__center {
          width: 90%;
        }
        .subfooter > div > div > img {
          max-width: 300px;
        }
      }
      @media screen and (max-width: 800px) {
        .half-box {
          width: calc(100% - 20px) !important;
          margin: 10px 0px !important;
        }
        .content__center {
          justify-content: none;
        }
      }
      `}</style>
    </div>
  )
}

