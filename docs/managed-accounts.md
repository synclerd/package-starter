# Provider package managed accounts

Providers may declare third-party accounts that users can configure inside the app.
Accounts can be used to inject authentication headers, query parameters, cookies, or other values into requests. This approach centralizes credential management and enables seamless synchronization across services. 

#### At present, this capability is supported only for providers using the `json_format` configuration.

---

# Account Structure
Declare the accounts section in your package `manifest.json` as follows. All providers within the package have access to every declared account.

Please note that accounts natively supported by the app cannot be managed by provider packages for security reasons and therefore must not be declared in the manifest. Including them may result in conflicts. This restriction can be revisited if a valid use case is demonstrated.


```json
{
  "accounts": [
    {
      "alias": "myUsenetProvider",

      "branding": {
        "name": "Some provider",
        "website": "https://example.org",
        "logo": "https://example.org/logo.png"
      },

      "auth": {
        "type": "token",

        "allowedDomains": [
          "example.org"
        ],

        "inject": {
          "headers": {
            "Authorization": "Bearer {managedAccounts.myUsenetProvider.token}"
          }
        }
      },

      "verification": {
        "url": "https://api.example.org/rest/1.0/user",
        "method": "GET",
        "responseType": "json",

        "extract": {
          "username": {
            "type": "jsonpath",
            "value": "$.username"
          }
        }
      }
    }
  ]
}
```

# Account ID
Account IDs are automatically derived from the `branding.website` field by extracting the primary domain name. This design ensures that even when multiple provider packages request access to an account for the same domain (for example, `example.org`), the user only needs to authenticate once. As a result, account management is simplified and kept consistent across integrations.

The value must exclude any subdomains and should point to the main homepage users would typically expect to visit.

For example:

* `https://drive.google.com/drive/` is incorrect.
* `https://google.com/drive/` is correct.


---

# Auth Types

## token

Prompts the user for a single token value.

Available interpolation variables:

```text
{managedAccounts.alias.token}
```

Example:

```json
{
  "auth": {
    "type": "token",
    "inject": {
      "headers": {
        "Authorization": "Bearer {managedAccounts.myUsenetProvider.token}"
      }
    }
  }
}
```

---

## basic

Prompts the user for:

* username
* password

Available interpolation variables:

```text
{managedAccounts.alias.username}
{managedAccounts.alias.password}
{managedAccounts.alias.basicToken}
```

`basicToken` is:

```text
base64(username:password)
```

Example:

```json
{
  "auth": {
    "type": "basic",
    "inject": {
      "headers": {
        "Authorization": "Basic {managedAccounts.myUsenetProvider.basicToken}"
      }
    }
  }
}
```

---

# Injection

Authentication values may be injected into requests using:

* headers
* query parameters

Example header injection:

```json
{
  "inject": {
    "headers": {
      "Authorization": "Bearer {managedAccounts.myUsenetProvider.token}"
    }
  }
}
```

Example API key header:

```json
{
  "inject": {
    "headers": {
      "X-Api-Key": "{managedAccounts.myUsenetProvider.token}"
    }
  }
}
```

Example query parameter injection:

```json
{
  "inject": {
    "query": {
      "apikey": "{managedAccounts.myUsenetProvider.token}"
    }
  }
}
```

Example custom basic auth usage:

```json
{
  "inject": {
    "headers": {
      "X-Credentials": "{managedAccounts.myUsenetProvider.username}:{managedAccounts.myUsenetProvider.password}"
    }
  }
}
```

---

# Allowed Domains

The `allowedDomains` specifies which domains are permitted to receive automatically injected account credentials. 

```json
{
  "allowedDomains": [
    "example.org"
  ]
}
```

Subdomains are automatically allowed.

Example:

```text
example.org
```

matches:

```text
example.org
api.example.org
cdn.example.com
```

If no domains are defined, credential values must instead be inserted manually through interpolation within the `json_format` configuration.

Example:

```json
"movie": {
    "query": "/search.php?page=1&search={query}&api_key={managedAccounts.myUsenetProvider.token}",
    "keywords": "{title}"
}
```
---

# Verification

Verification is used to validate user credentials and retrieve account information.

If extraction fails, verification is considered unsuccessful.

Supported response types:

```text
json
text
html
```

Supported extraction types:

```text
jsonpath
regex
```

---

# JSON Extraction Example

```json
{
  "extract": {
    "username": {
      "type": "jsonpath",
      "value": "$.username"
    },

    "email": {
      "type": "jsonpath",
      "value": "$.email"
    }
  }
}
```

---

# Regex Extraction Example

```json
{
  "extract": {
    "username": {
      "type": "regex",
      "value": "Username: (.+)"
    }
  }
}
```
