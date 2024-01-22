# Provider package starter project
A started project to get started on developing a provider package. It includes sample provider, typescript support, npm scripts to build and test (in an android device) packages easily.

### Requirements
- NodeJs
- NPM
- ADB
- Android Device (preferebly emulator) with app installed and `Developer mode` on.

### Documentation

#### Building the package

- `git clone` this (`package-starter`)
- Open terminal
- `cd` to root dir of this project.
- `npm install`
- `npm run test`
- You should see `Ran all test suites`.
- Modify files in `./src` to your needs.
- Build package with `npm run build`


#### Running the package in android app
- Serve package with `npm run serve` (Only need to do once)
- Ensure running `adb devices` returns one device and the android app is installed.
- Run `npm run help` to see command line options and adjust parameters in `scripts` in `package.json`
- Install and run package on an android device with `npm run execute`
- Android app should install the package (uninstalls rest packages to avoid conflict) and launch search screen.

#### Publishing the package
- Upload `manifest.json` and generated package file (`index.js`/`express.json`) in `./dist` directory.
- Reach out to a vendor to include your package manifest url in their manifest (as seen in `/src/manifest.vendor.json`)

#### Publishing vendor manifest
- Only publish a vendor manifest if you are a vendor maintainer. **Do not publish** vendor manifest just for your package. 
- Urge existing vendors to include your package before you deploy your own. Ideally there should be only ONE vendor that has all packages. 
- Multiple vendors will confuse users and make configuration complicated. Avoid this at all cost.
- To publish a vendor manifest, upload `./dist/manifest.vendor.json`.
- Use a url shortener (preferebly `bit.ly`) to shorten the url that can be easily typed in the app.
- Share this shortened url to users.

### Migration guide
- For `Express` packages drop your existing express package in place of `/src/express.json`.
- For `Kosmos` packages import your javascript in `/src`, adapt it until typescript errors are gone.
- Change `/src/manifest.json` as needed. Ensure the `type` (possible values are `express` and `kosmos`) and `url` field (points to the the generated `index.js`/`express.json` after publishing) reflect correct values.
- Build, test and publish your package using documentation above.



## Express package documenation
Refer to `src/express.json`

## Providers
Here we have 2 providers provider1 and provider2. The first one will parse html pages while the second will use a JSON API

### provider1

For example, we want to look for the movie "Movie ABC" aired on 2020. Here are the steps executed to search for this query:

1. Replace `{title} {year}` by `Movie ABC 2020` (below all available variables)
2. Replace `{query}/Movies/1/` by `Movie%20ABC%202020/Movies/1/`
3. Issue a http `GET` to `https://www.some-provider.com/search/Movie%20ABC%202020/Movies/1/`

If the url returns a 200 response, Engine will parse the HTML received using html_parser property. It will:

1. Execute `doc.querySelectorAll('tbody > tr')` where `doc` is the HTML document received
2. For each returned row it will attempt to find all the other properties:
	2.1. Get the title from `row.querySelector('a:nth-child(2)').innerHTML`
    2.2. Get the peers from `row.querySelector('.leeches').innerHTML`
    2.3. Get the seeds from `row.querySelector('.seeds').innerHTML`
    2.4. Get the size from `row.querySelector('tbody > tr .size').textContent.split('B')[0] + 'B'` (If the size is a number it will be converted automatically)
    2.5. This provider has `source_is_in_sub_page = true` it indicates url retrieved is not the torrent url but a page where the source url will be found. We get this sub page url like this from `row.querySelector('a:nth-child(2)').getAttribute('href')`.

The execution pattern for TV shows is the same. `{episodeCode}` will look like sAAeBB where AA is the season number and BB is the episode number.

### provider2
A JSON API is always preferred than parsing HTML. Here's how to search for "Movie ABC 2020" with the IMDb id: "tt1111111"

This API needs a token for every request, first Engine will retrieve this token because it is dynamic and it doesn't last forever.

Engine will execute "GET" on "https://some-provider2.org/api?get_token=get_token". It expects a JSON response formatted as:

```
{
  "token":"aToken"
}
```

Once the token is retrieved, it will be stored for "840000" ms, after that another token will be requested before new requests.

Here the keywords are not title+year but imdbId. Searching by imdbId will provide accurate results.

Engine will provide all the replacements and finally call GET on "https://some-provider2.org/api?mode=search&search_imdb=tt1111111&category=movies&token=aToken"

The expected result for this request will look like:
```
{
 "torrent_results": [
    {
      "url":"magnet:XXXXX",
      "title":"Movie ABC 2020 By AAA",
      "seeds":100,
      "peers": 90,
      "size":11111
    },

    {
      "url":"magnet:XXXXX",
      "title":"Movie ABC 2020 By BBB",
      "seeds":55,
      "peers": 20,
      "size":99999
    },
      ....
 ]
}
```

### Available variables

This is the list of all variable that can be added with examples.

* title - Movie ABC, Show ABC
* titleFirstLetter - M
* imdbId - tt00..... (movie/episode/season id)
* tmdbId - 0000 (movie/episode/season id)
* tvdbId - 0000 (movie/episode/season id)
* traktId - 0000 (movie/episode/season id)
* showImdbId - tt00..... (show id)
* showTmdbId - 0000 (show id)
* showTvdbId - 0000 (show id)
* showTraktId - 0000 (show id)
* year 2020 (movie/episode/season year)
* episodeCode - s02e06
* seasonCode - s02
* season - 2
* episode - 2
* absoluteNumber - 1
* query
* Title variants for different languages can be found as well. By default "title" will be replaced by the original title. If you want the french title, use "title.fr" (This is not implemented yet, this message will be removed when it.)

