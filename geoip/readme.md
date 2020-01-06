# GeoIP Fetcher

Gets GeoIP information about the IPs in the Fastly logs.

### Usage

```bash
npm run start -- --help
Usage: index [options]

Options:
  -k, --key            IPInfo authentication key
  -i, --input [path]   CSV input path
  -o, --output [path]  CSV output path
  -h, --help           output usage information
```

# Format

```
npm run start -- -i <path to input CSV> -o <path to output CSV> -k <ipinfo auth key>
```

# Example

```
npm run start -- -i ~/Downloads/fastly.csv -o ~/Downloads/fastly-ipinfo.csv -k asErdFtvb
```
