const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const ipInfo = require("ipinfo");
const cliProgress = require("cli-progress");
const readline = require("readline");
const Keyv = require("keyv");
const program = require("commander");
const typeOf = require("precise-typeof");

// Get CLI options
program
  .option("-k, --key", "IPInfo authentication key")
  .option("-i, --input [path]", "CSV input path")
  .option("-o, --output [path]", "CSV output path");
program.parse(process.argv);

// Set up database.
const db = new Keyv("sqlite://geoip.sqlite", { namespace: "geoip" });
// Handle DB connection errors
db.on("error", err => {
  console.log("Connection Error", err);
  process.exit(err);
});

// IP Info
const ipinfoKey = program.key || "";

// Create progress bar
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
// Start the progress bar (total, starting).
bar.start(0, 1);

// Check for valid file.
let file = program.input || process.argv[2];
let filename, extname, outputFile;
try {
  // Throw error for missing file input.
  if (file === undefined) {
    throw Error(
      "File not found, check the path or use an absolute path from the root."
    );
  }
  file = path.resolve(file);
  extname = path.extname(file);
  filename = path.basename(file, extname);
  outputFile =
    program.output || __dirname + "/results/" + filename + "-ipinfo.csv";

  // Eventually, set total lines for CLI bar.
  getLines(file).then(lns => {
    bar.setTotal(lns);
  });
} catch (err) {
  console.error(err);
  process.exit(err);
}

// Create writer.
const ws = fs.createWriteStream(outputFile).on("end", data => {
  ws.close();
});

// Parse CSV file.
const rs = fs.createReadStream(file);
rs.pipe(csv.parse({ headers: true }))
  .pipe(csv.format({ headers: true }))
  // Using the transform function from the formatting stream
  .transform((row, next) => {
    // Add IP data
    this.pause();
    if (row.hasOwnProperty("ip")) {
      let ipinfo = getIpInfo(row.ip);
      //   console.log(ipinfoKey);
      row = Object.assign({}, row, ipinfo);
    }
    bar.increment();
    return next(null, row);
    this.resume();
  })
  .pipe(ws, { end: false })
  .on("finish", () => {
    // Clean up.
    ws.destroy();
    bar.stop();
    process.exit();
  });

/**
 * Store and retrieve IP info.
 * @param {string} ip
 */
function getIpInfo(ip) {
  // Check for existing IP data.
  ipcache = db.get(ip);
  let typed = typeOf(ipcache);

  // Fetch new data.
  if (typed !== "object") {
    ipcache = formatIpInfo(ip);
  }

  // Retry after checki ng for error response from IPinfo
  //   if (typeof ipcache === "object" && ipcache.hasOwnProperty("error")) {
  //     console.warn(ipcache.error.title, ipcache.error.message);
  //   }

  // Store results in db.
  let ipdb = db.set(ip, ipcache);

  return ipcache;
}

/**
 * Extract and format IP info.
 * @param {string} ip
 */
function formatIpInfo(ip) {
  // Create template.
  let ipdata = {
    ip: "",
    hostname: "",
    city: "",
    region: "",
    country: "",
    loc: "",
    org: "",
    postal: "",
    lat: "",
    lon: ""
  };

  // Fetch IP data.
  ipInfo(ip, ipinfoKey, (err, info) => {
    // Check if result is valid
    if (typeof info == "object") {
      // Split lat/lon for mapping.
      if (info.hasOwnProperty("loc")) {
        [info.lat, info.lon] = info.loc.split(",");
      }
      ipdata = Object.assign({}, ipdata, info);
    }
  });

  return ipdata;
}

/**
 * Get total line count from file.
 * @param {string} file
 */
async function getLines(file) {
  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  let lines = 0;
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    lines++;
  }
  return lines;
}
