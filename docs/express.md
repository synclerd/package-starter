## Express package documenation
Refer to `src/express.json`

## Providers
Here we have 2 providers provider1 and provider2. The first one will parse html pages while the second will use a JSON API

### `html_parser` providers (provider1)

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

### `json_format` providers (provider2)
A JSON API is always preferred than parsing HTML. It is significantly faster. Here's how to search for "Movie ABC 2020" with the IMDb id: "tt1111111"

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
      "size":11111,
      "hints": {
        "filename": "Movie.ABC.2020.By.AAA.mkv",
        "size": "11110"
      }
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

The keys in `json_format` are mostly self explanatory.

```
"json_format": {
    "results": "torrent_results",
    "url": "download",
    "title": "title",
    "seeds": "seeders",
    "peers": "leechers",
    "size": "size",
    "playbackFileName": "hints.filename",
    "playbackFileSize": "hints.size"
},
```

### `playbackFileName` and `playbackFileSize`

These fields define the JSON paths for the playback file name and size. When accurate values are available, enabling them is **strongly recommended**, as they improve search accuracy and metadata quality.

Because these properties **override all estimated values**, they must only be used when the source data is reliable. Incorrect mappings can result in misleading metadata.

#### Common Misconfiguration

```json
"json_format": {
    "results": "torrent_results",
    "url": "download",
    "title": "title",
    "seeds": "seeders",
    "peers": "leechers",
    "size": "hints.size",
    "playbackFileName": "hints.filename",
    "playbackFileSize": "hints.size"
}
```

This configuration assumes the total torrent size (`hints.size`) is equal to the playback file size, which is usually incorrect. Season packs and even single-episode or movie torrents often include multiple files (e.g., samples or extras).

Only map `playbackFileSize` when the value represents the actual playback file, not the overall torrent size.

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

### Json ops (post processing)
See json ops doc [./docs/json_ops.md](./docs/json_ops.md)

### Hoster and Direct Sources

Providers using the `json_format` schema can return **hoster** and **direct** sources in addition to magnet sources.

* To generate a hoster or direct source, assign a json path to the `url` field within the `json_format` object. For example:

```json
{
  ...
  "json_format": {
    ...
    "url": "url"
  }
}
```

* For direct sources, the `host` field must also be assigned to a json path. This value typically corresponds to the domain portion (see json ops to extract it) of the provided URL.

```json
{
  ...
  "json_format": {
    ...
    "host": "url"
  }
}
```
