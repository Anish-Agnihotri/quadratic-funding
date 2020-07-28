import Head from 'next/head'
import ReactTable from 'react-table-6'
import { useState } from 'react'
import { CreatableSelect } from '@atlaskit/select';

export default function Home() {
  const [data, setData] = useState([
    {number: 1, funding: 100, match: 100 },
    {number: 2, funding: 100, match: 100 },
  ]);

  const columns = [
    {Header: "Remove", accessor: 'number', Cell: row => <button className="close-button">X</button>},
    {Header: 'Grant', accessor: 'number', Cell: row => <span className="grant__name">Grant #{row.value}</span>},
    {Header: 'Funding', accessor: 'funding', Cell: row => <CreatableSelect isMulti placeholder="Enter various donation amounts and hit enter" />},
    {Header: 'Match amount', accessor: 'match', Cell: row => <span className="grant__match">${row.value}</span>}
  ];

  return (
    <div className="container">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="header">
        <a href="https://gitcoin.co" target="_blank" rel="noopener noreferrer">
          <img src="/logo.png" alt="QF.WTF logo" />
        </a>
      </div>
      <div className="subheader">
        <h1>Quadratic Funding</h1>
        <p>Quadratic Funding proposes a mechanism of quadratic voting to fund public goods. <a href="https://gitcoin.co" target="_blank" rel="noopener noreferrer">Gitcoin</a> hosts crowdfund matching rounds built atop Quadratic Funding that help fund grants supporting Ethereum research, infrastructure, and resources in general as a public good.</p>
        <p>Below is a simple calculator to illustrate Quadratic Funding in action.</p>
      </div>
      <div className="content">
        <div className="content__center">
          <div className="half-box content__center__qfamount">
            <h3>Match Amount</h3>
            <input type="number" min="0" placeholder="Enter $ funding match amount" />
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
            />
            <button className="add__grant">Add Grant</button>
          </div>
        </div>
      </div>
      <style jsx global>{`
      body {
        margin: 0px;
        padding: 0px;
        background-color: #F6F9FC;
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
        background-color: #aa381e;
        border-radius: 5px;
        border: none;
        color: #fff;
        padding: 5px 10px;
        transform: translate(8px, 17.5px);
        transition: 100ms ease-in-out;
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
      .rt-tr > .rt-th:nth-of-type(1), .rt-tr > .rt-td:nth-of-type(1) {
        width: 70px !important;
        flex: none !important;
      }
      .rt-tr > .rt-th:nth-of-type(2), .rt-tr > .rt-td:nth-of-type(2) {
        width: 100px !important;
        flex: none !important;
      }
      .rt-tr > .rt-th:nth-of-type(3), .rt-tr > .rt-td:nth-of-type(3) {
        width: calc(100% - 320px) !important;
        flex: none !important;
      }
      .rt-tr > .rt-td:nth-of-type(3) > div {
        width: 95%;
        margin-top: 10px;
      }
      .rt-tr > .rt-th:nth-of-type(4), .rt-tr > .rt-td:nth-of-type(4) {
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
        border-bottom: 2px solid #ccc;
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
        background-color: #F2F6F9;
        min-height: 200px;
        padding: 20px 0px;
        box-shadow: inset 0 3px 8px rgba(151,164,175,.05);
        border-bottom: 1px solid #e7eaf3;
      }
      .subheader > h1 {
        margin: 0px;
        background-color: #3E00FF;
        display: inline-block;
        padding: 7.5px 15px;
        border-radius: 5px;
        color: #fff;
      }
      .subheader > p {
        max-width: 700px;
        display: block;
        margin-block-start: 0px;
        line-height: 25px;
        margin: 15px auto;
        padding: 0px 20px;
      }
      .subheader > p > a {
        color: #000;
        border-bottom: 1px solid #00e996;
        font-weight: 500;
        text-decoration: none;
        transition: 100ms ease-in-out;
      }
      .subheader > p > a:hover {
        opacity: 0.75;
      }
      .content {
        min-height: calc(100vh - 287px);
        background-color: #F6F9FC;
        width: 100%;
      }
      .content__center {
        width: 1000px;
        margin: 0px auto;
        padding-top: 20px;
        text-align: center;
      }
      .half-box {
        background-color: #fff;
        border: 1px solid #e7eaf3;
        border-radius: 8px;
        height: 80px;
        display: inline-block;
        box-shadow: 0 0 35px rgba(127,150,174,.125);
        width: calc(40% - 40px);
        margin: 10px;
        padding: 10px;
        vertical-align: top;
        text-align: left;
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
        margin: 15px 0px 50px 0px;
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
        color: #fff;
        border: none;
        border-radius: 5px;
        background-color: #00A652;
        transition: 100ms ease-in-out;
      }
      .add__grant:hover {
        background-color: #008040; 
      }
      .add_grant:focus {
        outline: none;
      }
      @media screen and (max-width: 1050px) {
        .content__center {
          width: 90%;
        }
      }
      @media screen and (max-width: 800px) {
        .half-box {
          width: calc(100% - 40px) !important;
        }
        .content__center {
          justify-content: none;
        }
      }
      `}</style>
    </div>
  )
}

