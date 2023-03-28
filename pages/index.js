import Head from "next/head"; // HTML head
import ReactTable from "react-table-6"; // React table for QF calculator
import { useState, useEffect } from "react"; // State management
import TagsInput from "react-tagsinput"; // Tags input for funding amounts
import CountUp from "react-countup"; // React countup for QF impact
import YouTube from "react-youtube"; // React youtube player

const own = [
  { funding: [], fundingAmount: 0, match: 0 },
  { funding: [], fundingAmount: 0, match: 0 },
  { funding: [], fundingAmount: 0, match: 0 },
  { funding: [], fundingAmount: 0, match: 0 },
];

const Home = ({ query }) => {
  const [match, setMatch] = useState(1000); // Setup default match amount
  const [deletion, setDeletion] = useState(true); // Setup deletion handler to trigger match
  const [copyText, setCopyText] = useState("Copy URL"); // Setup url copy/share button

  // Funding calculator
  const [data, setData] = useState(own);

  // Event handlers to recalculate match on change
  useEffect(() => calculateMatch(), [match]);
  useEffect(() => calculateMatch(), [deletion]);
  useEffect(() => calculateMatch(), data);

  // Event handler to autofill table on load with URL params
  useEffect(() => {
    // Check for match amount in param
    if (query.match && query.match !== "") {
      // If match amount is present, set match
      setMatch(parseFloat(query.match));
    }
    // Check for grants array in param
    if (query.grant) {
      let newData = []; // Initialize temp variable

      // Loop over grants array
      for (let i = 0; i < query.grant.length; i++) {
        // Push new grant data to temp variable
        newData.push({
          funding:
            query.grant[i] === "" ? [] : query.grant[i].split(",").map(Number),
          fundingAmount:
            query.grant[i] === ""
              ? 0
              : query.grant[i]
                  .split(",")
                  .map(Number)
                  .reduce((a, b) => a + b, 0),
          match: 0,
        });
      }

      setData(newData); // Assign temp variable to data
    }
  }, []);

  // Remove grant by grant_number
  const removeGrant = (grant_number) => {
    // Filter array by index
    setData(
      data.length > 1 ? data.filter((v, index) => index !== grant_number) : []
    );
    // Trigger event handler by toggling deletion state
    setDeletion((deletion) => !deletion);
  };

  // Add grant
  const addGrant = () => {
    // Append new grant to data array
    setData((data) => [...data, { funding: [], fundingAmount: 0, match: 0 }]);
  };

  // Copy URL
  const copyURL = () => {
    navigator.clipboard.writeText(window.location.href); // Copy URL to clipboard
    setCopyText("Copied"); // Set button text to Copied
    setTimeout(() => setCopyText("Copy URL"), 500); // Revert button text after 0.5s
  };

  // Calculate match for each grant
  const calculateMatch = () => {
    let newData = data; // Collect data
    let summed = 0; // Setup summed grant contributions
    let urlParams = "?";

    // Loop over each grant
    for (let i = 0; i < newData.length; i++) {
      let sumAmount = 0;
      urlParams += i == 0 ? "grant=" : "&grant=";

      // Sum the square root of each grant contribution
      for (let j = 0; j < newData[i].funding.length; j++) {
        urlParams +=
          j == 0 ? newData[i].funding[j] : "," + newData[i].funding[j];
        sumAmount += Math.sqrt(newData[i].funding[j]);
      }

      // Square the total value of each summed grants contributions
      sumAmount *= sumAmount;
      newData[i].match = sumAmount;
      summed += sumAmount;
    }

    urlParams += `&match=${match}`;

    // Setup a divisor based on available match
    let divisor = match / summed;
    // Multiply matched values with divisor to get match amount in range of available funds
    for (let i = 0; i < newData.length; i++) {
      newData[i].match *= divisor;
    }

    // Set url parameters
    history.pushState({}, null, urlParams);

    // Set new data
    setData([...newData]);
  };

  // Change handler for tags input
  const handleChange = (tags, grant_number) => {
    let newData = data; // Collect data
    newData[grant_number].funding = tags.map((x) => parseFloat(x)); // Set array value
    newData[grant_number].fundingAmount = newData[grant_number].funding.reduce(
      (a, b) => a + b,
      0
    ); // Update funding amount
    setData([...newData]); // Set data
    calculateMatch(); // Recalculate match with new changes
  };

  // Calculator column format for react-table
  const columns = [
    {
      Header: "Remove",
      accessor: "number",
      Cell: (row) => (
        <button onClick={() => removeGrant(row.index)} className="close-button">
          X
        </button>
      ),
    },
    {
      Header: "Grant",
      accessor: "number",
      Cell: (row) => (
        <span className="grant__name">Grant #{row.index + 1}</span>
      ),
    },
    {
      Header: "Funding",
      accessor: "funding",
      Cell: (row) => (
        <TagsInput
          inputProps={{
            className: "react-tagsinput-input",
            placeholder: "Add a contribution and press Enter",
          }}
          value={data[row.index].funding}
          onChange={(tags) => handleChange(tags, row.index)}
        />
      ),
    },
    {
      Header: "Funded amount",
      accessor: "fundingAmount",
      Cell: (row) => (
        <span className="grant__match">
          ${row.value ? row.value.toFixed(2) : 0}
        </span>
      ),
    },
    {
      Header: "Match amount",
      accessor: "match",
      Cell: (row) => (
        <span className="grant__match">
          ${row.value ? row.value.toFixed(2) : 0}
        </span>
      ),
    },
  ];

  return (
    <div className="container">
      <Head>
        <title>WTF is Quadratic Funding?</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#0f0857"
        />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#0f0857" />
        <meta
          name="msapplication-config"
          content="/favicons/browserconfig.xml"
        />
        <meta name="theme-color" content="#0f0857" />
        <meta
          name="description"
          content="Quadratic Funding is the mathematically optimal way to fund public goods in a democratic community."
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="WTF is Quadratic Funding?"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Quadratic Funding is the mathematically optimal way to fund public goods in a democratic community."
        />
        <meta property="og:site_name" content="QF.Gitcoin.co" />
        <meta property="og:url" content="https://qf.gitcoin.co/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="WTF is Quadratic Funding?" />
        <meta
          name="twitter:description"
          content="Quadratic Funding is the mathematically optimal way to fund public goods in a democratic community."
        />
        <meta name="twitter:site" content="https://qf.gitcoin.co/" />
        <meta
          name="twitter:creator"
          content="https://twitter.com/_anishagnihotri"
        />
        <meta
          property="og:image"
          content="https://qf.gitcoin.co/metaimage.png"
        />
        <meta
          name="twitter:image"
          content="https://qf.gitcoin.co/metaimage.png"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-102304388-4"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments)}
              gtag("js", new Date());
              gtag("config", "UA-102304388-4");
          `,
          }}
        ></script>
      </Head>

      <div className="header">
        <a href="https://gitcoin.co" target="_blank" rel="noopener noreferrer">
          <img
            src="https://s.gitcoin.co/static/v2/images/logo_med_hover.c2969168bf04.gif"
            alt="QF.WTF logo"
          />
        </a>
      </div>

      <div className="subheader">
        <h2>WTF IS</h2>
        <img src="/logo.gif" alt="Quadratic Funding logo" />
        <p>
          Quadratic Funding is the mathematically optimal way to fund public
          goods in a democratic community.
        </p>
        <img src="/formula.gif" alt="Quadratic Funding formula" />
        <YouTube
          videoId="HJljTtLnymE"
          containerClassName="subheader-video"
          className="subheader-video-frame"
          opts={{
            playerVars: {
              controls: 0,
              loop: 1,
              modestbranding: 1,
              playsinline: 1,
            },
          }}
        />
      </div>

      <div className="content">
        <div className="content__title">
          <h1>The secret behind QF</h1>
          <h2>It's the math&trade;</h2>
          <p>
            A matching pool is raised, and then a crowdfund campaign is matched
            according to the QF algorithm:
          </p>
          <ul>
            <li>
              <span>
                <i>Number of contributors</i> matters more than{" "}
                <i>amount funded</i>.
              </span>
            </li>
            <li>
              <span>
                This pushes power to the edges, away from whales &amp; other
                central power brokers.
              </span>
            </li>
            <li>
              <span>
                This creates more democracy in public goods funding decisions!
                🦄
              </span>
            </li>
          </ul>
          <p>👇 Want to see the math in action? Use the calculator below! 👇</p>
          <p>Check out some example scenarios:</p>
        </div>
        <div className="content__center main__calculator">
          <div className="half-box content__center__qfamount">
            <h3>Match Amount</h3>
            <input
              type="number"
              min="0"
              value={match}
              onChange={(e) => setMatch(e.target.value)}
              placeholder="Enter $ funding match amount"
            />
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
            <button onClick={addGrant} className="add__grant">
              Add Grant
            </button>
            <button onClick={copyURL} className="copy__url">
              {copyText}
            </button>
          </div>
        </div>
      </div>

      <div className="counter">
        <span>Quadratic Funding Impact</span>
        <h1>
          <CountUp end={22907689} duration={5} prefix={"$"} separator={","} />
        </h1>
        <span>has been distributed via projects like:</span>
        <div>
          <div>
            <a
              href="https://gitcoin.co/grants"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/grants_logo.png" alt="Gitcoin Grants logo" />
            </a>
            <h3>Gitcoin Grants</h3>
            <span>$19,834,000</span>
          </div>
          <div>
            <a
              href="https://pomelo.io/grants"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/pomelo_grants_logo.png" alt="Pomelo Grants logo" />
            </a>
            <h3>Pomelo Grants</h3>
            <span>$3,035,689</span>
          </div>
          <div>
            <a
              href="https://downtownstimulus.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/downtown_stimulus_logo.png"
                alt="Downtown Stimulus logo"
              />
            </a>
            <h3>Downtown Stimulus</h3>
            <span>$38,000</span>
          </div>
          <div>
            <a
              href="https://clr.fund/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/clrfund.png" alt="clr.fund" />
            </a>
            <h3>clr.fund</h3>
            <span>Coming soon</span>
          </div>
        </div>
        <a href="mailto:founders@gitcoin.co">
          Email Gitcoin to add your project
        </a>
        <p>
          Reference implementations:{" "}
          <a href="https://github.com/gitcoinco/quadratic-funding">Python</a>,{" "}
          <a href="https://github.com/anish-agnihotri/quadratic-funding">
            JavaScript
          </a>
          , or <a href="mailto:founders@gitcoin.co">add your own</a>.
        </p>
      </div>

      <div className="public__goods">
        <h1>Using Markets to create impact</h1>
        <h2>Public goods are good.</h2>
        <img
          src="/public_good_grid.png"
          alt="Public goods versus private goods matrix"
        />
      </div>

      <div className="free__rider">
        <h1>Our secret to getting past the "free rider problem"</h1>
        <h2>Up to 100x matching multipliers on $1 crowdfund contributions</h2>
        <p>
          When a project gets popular enough, some pretty amazing matching
          multiples can be offered. This reinforces the incentive structure of
          QF as a fundamentally-democratic institution.
        </p>
        <img src="/slider.gif" alt="QF contribution Slider" />
      </div>

      <div className="subfooter">
        <div className="content__center">
          <h3>
            What if you could program support for public goods into your
            community?
          </h3>
          <p>
            Our goal is to align incentives between private goods &amp; public
            goods.
          </p>
          <img src="/landscape.png" alt="Combined lanscapes" />
          <div>
            <a
              href="https://vitalik.ca/general/2020/07/22/round6.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more about experiments with QF
            </a>
            <a
              href="https://gitcoin.co/grants"
              target="_blank"
              rel="noopener noreferrer"
            >
              Play with Gitcoin Grants
            </a>
          </div>
        </div>
      </div>

      <div className="footer">
        <div>
          <p>
            <a
              href="https://arxiv.org/pdf/1809.06421.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Quadratic Funding Paper (PDF)
            </a>{" "}
            by{" "}
            <a
              href="https://twitter.com/vitalikbuterin"
              target="_blank"
              rel="noopener noreferrer"
            >
              @vitalikbuterin
            </a>
            {", "}
            <a
              href="https://twitter.com/zhitzig"
              target="_blank"
              rel="noopener noreferrer"
            >
              @zhitzig
            </a>{" "}
            &amp;{" "}
            <a
              href="https://twitter.com/glenweyl"
              target="_blank"
              rel="noopener noreferrer"
            >
              @glenweyl
            </a>{" "}
          </p>
          <p>
            This calculator made with &lt;3 by{" "}
            <a
              href="https://twitter.com/_anishagnihotri"
              target="_blank"
              rel="noopener noreferrer"
            >
              @_anishagnihotri
            </a>{" "}
            &amp;{" "}
            <a
              href="https://twitter.com/owocki"
              target="_blank"
              rel="noopener noreferrer"
            >
              @owocki
            </a>
          </p>
          <p>
            Design by{" "}
            <a
              href="http://gitcoin.co/guistf"
              target="_blank"
              rel="noopener noreferrer"
            >
              @guistf
            </a>{" "}
            &amp;{" "}
            <a
              href="http://gitcoin.co/octavian"
              target="_blank"
              rel="noopener noreferrer"
            >
              @octavian
            </a>
          </p>
        </div>
        <div>
          <a
            href="https://gitcoin.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://s.gitcoin.co/static/v2/images/logo_med_hover.c2969168bf04.gif"
              alt="QF.WTF logo"
            />
          </a>
        </div>
        <div>
          <a
            href="https://github.com/anish-agnihotri/quadratic-funding"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="socialIcon" src="/github.png" alt="GitHub logo" />
          </a>
          <a
            href="https://gitcoin.co/twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="socialIcon" src="/twitter.png" alt="Twitter logo" />
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
        width: 220px !important;
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
      .subheader-video {
        padding: 40px 0px 20px 0px;
      }
      .subheader-video-frame {
        border-radius: 10px;
        -webkit-box-shadow: 0px 0px 13px -1px rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0px 0px 13px -1px rgba(0, 0, 0, 0.15);
        box-shadow: 0px 0px 13px -1px rgba(0, 0, 0, 0.15);
        max-width: calc(100% - 40px);
      }
      `}</style>
      <style jsx>{`
        .container > div {
          display: block;
        }
        .header {
          height: 65px;
          box-shadow: 0 2px 10px rgba(151, 164, 175, 0.1);
          padding: 0px 20px;
          width: calc(100% - 40px);
          background-image: url("/header-bg.png");
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
          background-image: url("/subheader-bg.jpg");
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          min-height: 200px;
          padding: 20px 0px;
          box-shadow: inset 0 3px 8px rgba(151, 164, 175, 0.05);
          border-bottom: 1px solid #e7eaf3;
        }
        .subheader > h2 {
          color: #00ec93;
          font-size: 50px;
          margin-block-start: -22.5px;
          margin-block-end: 0px;
          transform: translateY(22.5px);
        }
        .subheader > img:nth-of-type(1) {
          height: 150px;
        }
        .subheader > img:nth-of-type(2) {
          height: 50px;
        }
        .subheader > p,
        .footer > div > p {
          max-width: 450px;
          display: block;
          margin-block-start: 0px;
          line-height: 25px;
          margin: 15px auto;
          padding: 0px 20px;
          color: #fff;
        }
        .subheader > p:nth-of-type(2) {
          margin-top: 40px;
        }
        .subheader > p:nth-of-type(2),
        .subheader > p:nth-of-type(3),
        .footer > div > p:nth-of-type(1),
        .footer > div > p:nth-of-type(2),
        .footer > div > p:nth-of-type(3) {
          max-width: 600px;
        }
        .subheader > p > a,
        .footer > div > p > a {
          color: #000;
          padding: 1px 3px;
          background-color: #00e996;
          border-radius: 2px;
          font-weight: 500;
          text-decoration: none;
          transition: 100ms ease-in-out;
        }
        .subheader > p > a:hover,
        .footer > div > p > a:hover {
          opacity: 0.75;
        }
        .content {
          background-color: #f6f9fc;
          width: 100%;
          padding: 30px 0px;
        }
        .content__title {
          width: 100%;
          text-align: center;
        }
        .content__title > h1,
        .public__goods > h1 {
          font-size: 40px;
          margin-block-end: 0px;
          color: #0f0857;
        }
        .content__title > h2,
        .public__goods > h2 {
          margin-block-start: 0px;
          color: #00d182;
        }
        .content__title > p,
        .free__rider > p {
          font-size: 18px;
          line-height: 27px;
          color: rgb(107, 114, 128);
          max-width: 600px;
          margin: 0px auto;
        }
        .content__title > ul {
          list-style-type: none;
          padding: 0px;
          max-width: 600px;
          display: inline-block;
          width: 0 auto;
        }
        .content__title > ul > li {
          background-color: #fff;
          display: inline-block;
          width: 580px;
          padding: 10px 10px;
          border-radius: 5px;
          margin: 5px 0px;
          text-align: left;
          border: 1px solid #e7eaf3;
          text-align: center;
        }
        .main__calculator {
          padding-top: 55px !important;
          padding-bottom: 42.5px !important;
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
          box-shadow: 0 0 35px rgba(127, 150, 174, 0.125);
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
        .half-box > h3,
        .table__view > div > h3 {
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
          box-shadow: 0 0 35px rgba(127, 150, 174, 0.125);
        }
        .table__view > div > h3 {
          text-align: left;
          font-size: 20px;
          padding: 7.5px 0px 7.5px 5px;
        }
        .add__grant,
        .copy__url {
          margin: 10px;
          padding: 9px 15px;
          font-size: 18px;
          font-weight: 400;
          color: #000;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          background-color: #00ec93;
          transition: 100ms ease-in-out;
          cursor: pointer;
        }
        .add__grant:hover {
          background-color: #00cc7e;
        }
        .copy__url {
          background-color: #0f0557 !important;
          color: #fff !important;
        }
        .copy__url:hover {
          opacity: 0.8;
        }
        .add_grant:focus {
          outline: none;
        }
        .counter {
          background-color: #ebf1f9;
          width: 100%;
          padding: 50px 0px 35px 0px;
          text-align: center;
          border-top: 1px solid #e7eaf3;
          border-bottom: 1px solid #e7eaf3;
        }
        .counter > span {
          display: block;
          text-transform: uppercase;
          font-weight: 500;
          color: #0f0857;
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
          padding: 30px 0px 30px 0px;
        }
        .counter > div > div {
          display: inline-block;
          margin: 20px;
          width: 300px;
        }
        .counter > div > div:nth-child(1) > a,
        .counter > div > div:nth-child(2) > a {
          border-bottom: none;
        }
        .counter > div > div:nth-child(1) > a > img {
          width: 250px;
        }
        .counter > div > div:nth-child(2) > a > img {
          width: 250px;
        }
        .counter > div > div:nth-child(3) > a > img {
          width: 80px;
        }
        .counter > div > div:nth-child(4) > a > img {
          width: 90px;
        }
        .counter > div > div > h3 {
          font-size: 22px;
          margin-block-end: 5px;
        }
        .counter > div > div > span {
          font-size: 18px;
        }
        .counter > a,
        .counter > p > a {
          font-size: 18px;
          text-decoration: none;
          color: #000;
          border-bottom: 1px solid #00e996;
          transition: 50ms ease-in-out;
        }
        .counter > a:hover,
        .counter > p > a:hover {
          opacity: 0.7;
        }
        .counter > p {
          font-size: 18px;
        }
        .public__goods {
          background-color: #f6f9fc;
          text-align: center;
          padding: 20px 20px 35px 20px;
          width: calc(100% - 40px);
        }
        .public__goods > img {
          max-width: 600px;
          width: 90%;
        }
        .free__rider {
          padding: 20px 20px 45px 20px;
          width: calc(100% - 40px);
          text-align: center;
          background-color: #ebf1f9;
          border-top: 1px solid #e7eaf3;
        }
        .free__rider > h1 {
          font-size: 30px;
          margin-block-end: 0px;
          color: #0f0857;
        }
        .free__rider > h2 {
          font-size: 22px;
          margin-block-start: 0px;
          color: #00d182;
        }
        .free__rider > img {
          max-width: 600px;
          width: 90%;
          margin-top: 25px;
          border-radius: 10px;
        }
        .subfooter {
          height: auto;
          border-top: 2px solid #6d1da1;
          width: calc(100% - 40px);
          padding: 50px 20px 30px 20px;
          background-color: #070c16;
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
          height: auto;
          padding: 30px 20px;
          width: calc(100% - 40px);
          background-image: url("/header-bg.png");
          background-position: center top;
          text-align: center;
        }
        .footer > div > a {
          transition: 50ms ease-in-out;
        }
        .footer > div > a:hover {
          opacity: 0.7;
        }
        .footer > div > a > img {
          height: 50px;
        }
        .footer > div {
          display: block;
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
        .socialIcon {
          height: 35px !important;
          filter: invert(100%);
          margin-top: 15px;
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
          .content__title > ul > li {
            width: 85%;
          }
          .content__title > p {
            width: 90%;
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
  );
};

Home.getInitialProps = ({ query }) => {
  return { query };
};

export default Home;
