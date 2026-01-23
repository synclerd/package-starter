# `json_format` Operations (`ops`)

Provider packages can post-process extracted values using **operations (`ops`)**.
Operations run sequentially on a field after it is resolved via JSONPath.

---

## Syntax

```json
"<field>": "<jsonPath>",
"<field>:ops": [
  { "name": "<opName>", "params": [ ... ] }
]
```

* Operations run **in order**
* Input and output are strings
* If an operation fails, the original value is preserved

---

## Supported Operation: `regex`

Applies a regular expression to the field value.

### Behavior

* Uses the **first match**
* Returns **capture group 1** if present
* Otherwise returns the full match

---

#### Example Backend Responses

##### Movie

```json
{
  "infoHash": "xxxx",
  "info": "📦 91 GB\n📄 A movie (2025).mkv"
}
```

##### Show

```json
{
  "infoHash": "xxx",
  "info": "💾 42 GB 📦 294 GB\n📄 Show.S01E08.mkv"
}
```

---

##### Example `json_format`

```json
"json_format": {
  "results": "items",

  "hash": "infoHash",

  "size": "info",
  "size:ops": [
    {
      "name": "regex",
      "params": ["📦\\s*([\\d.]+\\s*(?:MB|GB|TB))"]
    }
  ],

  "playbackFileName": "info",
  "playbackFileName:ops": [
    {
      "name": "regex",
      "params": ["📄\\s*(.+)$"]
    }
  ],

  "playbackFileSize": "info",
  "playbackFileSize:ops": [
    {
      "name": "regex",
      "params": ["💾\\s*([\\d.]+\\s*(?:MB|GB|TB))"]
    }
  ]
}
```

---

##### Resulting Values

| Field              | Example Output       |
| ------------------ | -------------------- |
| `hash`             | `xxxx`               |
| `size`             | `91 GB` / `294 GB`   |
| `playbackFileName` | `A movie (2025).mkv` |
| `playbackFileSize` | `42 GB`              |

---

##### Notes for Provider Authors

* Regex must be kotlin 
* Always capture the desired value in **group 1**
* Keep regex single-purpose and readable
* All regular expressions used in ops must follow Kotlin’s Regex syntax (which is based on the JVM / Java regex engine).
Make sure to escape characters accordingly (for example, \\d, \\s) when writing regex patterns in JSON.


---
