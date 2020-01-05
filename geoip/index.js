const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const PouchDB = require('pouchdb');
const ipInfo = require('ipinfo');

// Instantiate PouchDB
const db = new PouchDB('pouch');

// Check for valid file.
let file = process.argv[2];
let filename, extname, outputFile;
try {
  // Throw error for missing file input.
  if (file === undefined) {
    throw Error('File not found, check the path or use an absolute path from the root.');
  }
  file = path.resolve(file);
  extname = path.extname(file);
  filename = path.basename(file, extname);
  outputFile = __dirname + '/results/' + filename + '-ipinfo.csv';
} catch (err) {
  console.error(err);
  process.exit(err);
}

// Create writer.
const ws = fs.createWriteStream(outputFile);

// Parse CSV file.
fs.createReadStream(file)
  .pipe(csv.parse({ headers: true }))
  // Pipe the parsed input into a csv formatter
  .transform((row, next) => {
    let ipinfo = getIpInfo(row.ip);
    let data = Object.assign({}, row, ipinfo);
    console.log(ipinfo);
  })
  .pipe(ws)
  .on('end', rowCount => {
    console.log(`Parsed ${rowCount} rows`);
    write.end();
  });

/**
 * Get data about IP from ipinfo.
 * @param {string} ip
 */
async function getIpInfo(ip) {
  let ipdata = {
    ip: '',
    hostname: '',
    city: '',
    region: '',
    country: '',
    loc: '',
    org: '',
    postal: '',
    lat: '',
    lon: '',
  };

  // Check if IP already fetched.
  ipdata = await db.get(ip, (error, data) => {
    if (error) {
      // Check if IP exists
      console.log(error);
      ipInfo(ip, (err, info) => {
        // Split lat/lon for mapping.
        if (info.loc.length) {
          [info.lat, info.lon] = info.loc.split(',');
        }

        // Assign ID for Pouch.
        info._id = ip;

        // Store in pouch.
        db.put(info, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            return res;
          }
        });
      });
    } else {
      ipdata = db
        .get(ip)
        .then(data => {
          return data;
        })
        .catch(e => {
          console.log(e);
          return ipdata;
        });
    }
  });

  return ipdata;
}
