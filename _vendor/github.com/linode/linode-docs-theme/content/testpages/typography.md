---
title: Testing
description: This is a test page used in both manual and automatic tests. Do not delete. It will not be listed anywhere.
---

## Keyboard Shortcuts

Example: Use <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy text.

Example of keyboard shortcuts within a paragraph. Aliqua anim cillum Lorem anim esse cupidatat cillum commodo labore pariatur nisi ipsum et. Use <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy text. Ex eiusmod do ullamco culpa. Nulla consequat sint labore dolor irure anim. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

## Command Shortcode

### Padding Issue 547

Command shortcode:

```command
db.bookCatalog.find( { $text: { $search: "william" } } ).pretty()
```

Output shortcode:

{{< output class="bg-blue-200" >}}
Blue output
{{< /output >}}


Command shortcode copy button overlapping content:
  
  ```command
  a = b; b = c; c = a; d = e; e = f; f = d; g = h; h = i; i = g; j = k; k = l; l = j; m = n; n = o; o = m; p = q; q = r; r = p; s = t; t = u; u = s; v = w; w = x; x = v; y = z; z = y;
  ```

Command shortcode copy button overlapping content, dark:
  
  ```command {class="dark"}
  a = b; b = c; c = a; d = e; e = f; f = d; g = h; h = i; i = g; j = k; k = l; l = j; m = n; n = o; o = m; p = q; q = r; r = p; s = t; t = u; u = s; v = w; w = x; x = v; y = z; z = y;
  ```

### Dark

#### Short Code

{{< command class="dark" title="Ubuntu 16.04" >}}
sudo systemctl restart apache2
{{< /command >}}

{{< command class="dark" title="MacOS 12.32" >}}
sudo systemctl restart apache2
{{< /command >}}

{{< command title="MS-DOS 2.3" >}}
goto 10
{{< /command >}}

#### Code Fence

```command {class="dark" title="Ubuntu 16.04"}
sudo systemctl restart apache2
```

### Dark No Title

```command {class="dark"}
sudo systemctl restart apache2
```

### Dark Overflow

```command {class="dark"}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.
```

## Output Shortcode

### Shortcode

Officia minim nostrud et cupidatat mollit nostrud  mollit eiusmod amet id dolor. In occaecat elit reprehenderit ea minim mollit enim fugiat. Et deserunt sit enim proident deserunt laboris amet.

{{< output >}}exercitation minim Lorem{{< /output >}}

Qui laborum minim esse reprehenderit laboris quis culpa veniam qui do. Ex ad ex sit ad dolore aute eu occaecat aliquip. Qui ea veniam nulla qui. Quis ut aliqua nulla minim nostrud qui dolore. Officia esse commodo ipsum quis aute aute aute commodo laborum minim eu qui. Sunt est elit dolor nisi est laboris magna ipsum.

{{< output class="bg-blue-200" >}}
Blue output
{{< /output >}}

{{< output bg-purple-200 >}}
Purple output.
{{< /output >}}

### Code Fence

```output {class="bg-blue-200"}
Blue output
```

```output {class="bg-purple-200"}
Purple output.
```

#### In Note Bottom

{{< note >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

```command {class="dark"}
sudo systemctl restart apache2
```
{{< /note >}}

#### In Note Middle

{{< note >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

```command {class="dark"}
sudo systemctl restart apache2
```

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

{{< /note >}}

#### Indented in list

* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.
  * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.
  ```command {class="dark"}
  sudo systemctl restart apache2
  ```
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.


#### Lists padding

1.  Log in to a Compute Instance that has been deployed in a supported data center using a supported distribution image.

1.  Generate your API token by running the command below:

    ```command
    curl -X PUT -H "Metadata-Token-Expiry-Seconds: 3600" http://169.254.169.254/v1/token
    ```

    Instead of receiving the token as an output string, you can save it directly to the `$TOKEN` environmental variable:

    ```command
    export TOKEN=$(curl -X PUT -H "Metadata-Token-Expiry-Seconds: 3600" http://169.254.169.254/v1/token)
    ```

1.  Query one of the following API endpoints to receive data from the API. If you did not save the API token to the `$TOKEN` variable, replace `$TOKEN` in the commands below with your token.

    -   **/v1/instance**: Output information about your instance, including plan resources.

        ```command
        curl -H "Metadata-Token: $TOKEN" http://169.254.169.254/v1/instance
        ```

    -   **/v1/network**: Output information about your instance's IP addresses.

        ```command
        curl -H "Metadata-Token: $TOKEN" http://169.254.169.254/v1/network
        ```

    -   **/v1/user-data**: Output your user data.

        ```command
        curl -H "Metadata-Token: $TOKEN" http://169.254.169.254/v1/user-data | base64 --decode
        ```

### Light

```command {class="light" title="Ubuntu 16.04"}
sudo systemctl restart apache2
```

```command {class="light" title="Ubuntu 16.04"}
sudo systemctl restart apache2
sudo systemctl restart apache2
sudo systemctl restart apache2
```

## File Shortcode

### As a regular block

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.

```file {title="/home/minecraft/run.sh"}
#!/bin/sh

java -Xms1024M -Xmx1536M -jar minecraft_server.1.13.jar -o true
```

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

```file {title="/foo/bar/maz.go"}
// IsTruthfulValue returns whether the given value has a meaningful truth value.
// This is based on template.IsTrue in Go's stdlib, but also considers
// IsZero and any interface value will be unwrapped before it's considered
// for truthfulness.
//
// Based on:
// https://github.com/golang/go/blob/178a2c42254166cffed1b25fb1d3c7a5727cada6/src/text/template/exec.go#L306
func IsTruthfulValue(val reflect.Value) (truth bool) {
	val = indirectInterface(val)

	if !val.IsValid() {
		// Something like var x interface{}, never set. It's a form of nil.
		return
	}

	if val.Type().Implements(zeroType) {
		return !val.Interface().(types.Zeroer).IsZero()
	}

	switch val.Kind() {
	case reflect.Array, reflect.Map, reflect.Slice, reflect.String:
		truth = val.Len() > 0
	case reflect.Bool:
		truth = val.Bool()
	case reflect.Complex64, reflect.Complex128:
		truth = val.Complex() != 0
	case reflect.Chan, reflect.Func, reflect.Ptr, reflect.Interface:
		truth = !val.IsNil()
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		truth = val.Int() != 0
	case reflect.Float32, reflect.Float64:
		truth = val.Float() != 0
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		truth = val.Uint() != 0
	case reflect.Struct:
		truth = true // Struct values are always true.
	default:
		return
	}

	return
}
```



###  No Title

{{< file >}} import { SayHello } from "/TestTypescript/Greetings"; {{</ file >}}



### Indented in list

* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.
  * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.
  ```file {title="/home/minecraft/run.sh"}
  #!/bin/sh

  java -Xms1024M -Xmx1536M -jar minecraft_server.1.13.jar -o true
  ```
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.


### Overflow

```file {title="/home/minecraft/run.sh" lang="sh"}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.
```

```file {title="/home/minecraft/run.sh"}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.
```

### Overflow High Starting High Line Number

```file {title="/home/minecraft/run.sh" lang="sh" linenostart="6332"}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.
```

### Highlighted

```file {title="/home/foo/dev/title.go" lang="bash" hl_lines="3-4" linenostart="5"}
line 1 asdfadasd
line 2 asdfadfasdfasdfasdf
line 3
line 4
line 5
line 6
line 7
line 8
```

```file {title="/home/foo/dev/title.go" lang="go" hl_lines="3-12 18" linenostart="199" }
// GetTitleFunc returns a func that can be used to transform a string to
// title case.
//
// The supported styles are
//
// - "Go" (strings.Title)
// - "AP" (see https://www.apstylebook.com/)
// - "Chicago" (see https://www.chicagomanualofstyle.org/home.html)
//
// If an unknown or empty style is provided, AP style is what you get.
func GetTitleFunc(style string) func(s string) string {
  switch strings.ToLower(style) {
  case "go":
    return strings.Title
  case "chicago":
    return transform.NewTitleConverter(transform.ChicagoStyle)
  default:
    return transform.NewTitleConverter(transform.APStyle)
  }
}
```


### Highlighted

{{< file title="/home/foo/dev/title.go" lang="bash" hl_lines="3-4" linenostart=5 >}}
line 1 asdfadasd
line 2 asdfadfasdfasdfasdf
line 3
line 4
line 5
line 6
line 7
line 8
{{< /file >}}

{{< file title="/home/foo/dev/title.go" lang="go" hl_lines="3-12 18" linenostart=199 >}}
// GetTitleFunc returns a func that can be used to transform a string to
// title case.
//
// The supported styles are
//
// - "Go" (strings.Title)
// - "AP" (see https://www.apstylebook.com/)
// - "Chicago" (see https://www.chicagomanualofstyle.org/home.html)
//
// If an unknown or empty style is provided, AP style is what you get.
func GetTitleFunc(style string) func(s string) string {
  switch strings.ToLower(style) {
  case "go":
    return strings.Title
  case "chicago":
    return transform.NewTitleConverter(transform.ChicagoStyle)
  default:
    return transform.NewTitleConverter(transform.APStyle)
  }
}
{{< /file >}}



## Styles

Lorem ipsum dolor sit amet, **consectetur adipiscing elit**. Nunc sollicitudin id metus vel _malesuada_. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

### Unordered list

* This is a [**Bold Link**](https://example.com).
* This is a [*Italic Link*](https://example.com).

### Ordered list

1. This is a [**Bold Link**](https://example.com).
2. This is a [*Italic Link*](https://example.com).

> This is a block quote. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.


### Disclosure Note

### Starting with a link

{{< disclosure-note "Starting with a link" >}}
[Front matter](https://gohugo.io/content-management/front-matter/) and then some lorem. Ad veniam ex do anim exercitation consequat voluptate id veniam fugiat quis. Aute mollit nisi dolore eiusmod veniam commodo excepteur eu. Mollit commodo sit pariatur officia adipisicing fugiat dolore ex labore. Pariatur fugiat minim non laboris fugiat velit fugiat officia. Nulla qui velit nulla ad aliquip velit dolor ut amet pariatur.

Incididunt reprehenderit nisi do cillum adipisicing sunt excepteur culpa excepteur nulla sit. Ullamco tempor sunt irure culpa Lorem esse esse dolor consectetur aliquip. Et do est et cupidatat officia ipsum sit est sit veniam Lorem non tempor do. Eiusmod laborum nostrud eiusmod cupidatat proident in mollit veniam ad cupidatat quis ullamco sunt. Ex aute non qui sint amet incididunt labore et velit ad.

Dolor enim duis enim elit fugiat ea in labore deserunt proident quis voluptate. Dolore incididunt cillum exercitation sit ut amet amet consequat amet. Ad dolore deserunt ex non duis labore ut qui. Esse aliqua nostrud laborum et proident.

Reprehenderit excepteur officia labore deserunt fugiat qui. Deserunt elit sint amet et est pariatur commodo duis est eu esse. Duis Lorem labore magna ad minim est adipisicing. Fugiat nostrud do velit elit. Culpa eu aliqua aliquip Lorem excepteur amet velit exercitation mollit excepteur exercitation. Quis excepteur ad et voluptate.

Ipsum officia excepteur sunt quis ut mollit minim consequat adipisicing velit aute incididunt. Esse id adipisicing occaecat culpa qui consectetur sint tempor. Ex laborum enim cillum exercitation quis anim irure est duis aliqua in. Labore eu nulla adipisicing ex dolore tempor id nisi proident laborum amet ea. Ex Lorem ex magna ex. Dolor exercitation ad ad duis irure laboris pariatur eiusmod enim.

Cillum irure fugiat laborum nisi ut deserunt occaecat esse officia sint in et dolore. Deserunt labore veniam ullamco aute. Irure quis amet velit velit non tempor exercitation ipsum.
{{< /disclosure-note >}}


## Tables

### Wide Table

| Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column | Column |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|
| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content| Content|


### Small Table

| Column | Column | Column | Column |
| ------ | ------ | ------ | ------ |
| Content| Content| Content| Content| 
| Content| Content| Content| Content| 
| Content| Content| Content| Content| 


### Wide Table with scroll

{{< table >}}
| Region | [Shared Compute](/docs/products/compute/compute-instances/plans/shared-cpu/) | [Dedicated Compute](/docs/products/compute/compute-instances/plans/dedicated-cpu/) | [GPUs](/docs/products/compute/compute-instances/plans/gpu/) | [Premium Compute](/docs/products/compute/compute-instances/plans/premium/) | [Kubernetes](/docs/products/compute/kubernetes/) | [Managed DB](/docs/products/databases/managed-databases/) | [Cloud Firewall](/docs/products/networking/cloud-firewall/) | [DDoS Protection](/docs/products/networking/ddos-protection/) | [NodeBalancers](/docs/products/networking/nodebalancers/) | [VLANs](/docs/products/networking/vlans/) | [Backups](/docs/products/storage/backups/) | [Block Storage](/docs/products/storage/block-storage/) | [Object Storage](/docs/products/storage/object-storage/) | [Images](/docs/products/tools/images/) |
| --- | :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:|
| Atlanta        | ✔ | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Chicago        | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔† | ✔ |
| Dallas         | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ | ✔ |   | ✔ |
| Frankfurt      | ✔ | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Fremont        | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ | ✔ |   | ✔ |
| London         | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ |
| Mumbai         | ✔ | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ |
| Newark         | ✔ | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Paris          | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔† | ✔ |
| Singapore      | ✔ | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Sydney         | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ |
| Tokyo          | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ | ✔ |   | ✔ |
| Toronto        | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ |
| Washington, DC | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔† | ✔ |
{{< /table >}}

### Wide Table with scroll, anchor first

{{< table class="first-sticky" >}}
| Region | [Shared Compute](/docs/products/compute/compute-instances/plans/shared-cpu/) | [Dedicated Compute](/docs/products/compute/compute-instances/plans/dedicated-cpu/) | [GPUs](/docs/products/compute/compute-instances/plans/gpu/) | [Premium Compute](/docs/products/compute/compute-instances/plans/premium/) | [Kubernetes](/docs/products/compute/kubernetes/) | [Managed DB](/docs/products/databases/managed-databases/) | [Cloud Firewall](/docs/products/networking/cloud-firewall/) | [DDoS Protection](/docs/products/networking/ddos-protection/) | [NodeBalancers](/docs/products/networking/nodebalancers/) | [VLANs](/docs/products/networking/vlans/) | [Backups](/docs/products/storage/backups/) | [Block Storage](/docs/products/storage/block-storage/) | [Object Storage](/docs/products/storage/object-storage/) | [Images](/docs/products/tools/images/) |
| --- | :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:| :---:|
| Atlanta        | ✔ | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Chicago        | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔† | ✔ |
| Dallas         | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ | ✔ |   | ✔ |
| Frankfurt      | ✔ | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Fremont        | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ | ✔ |   | ✔ |
| London         | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ |
| Mumbai         | ✔ | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ |
| Newark         | ✔ | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Paris          | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔† | ✔ |
| Singapore      | ✔ | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Sydney         | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ |
| Tokyo          | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ | ✔ |   | ✔ |
| Toronto        | ✔ | ✔ |   |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |   | ✔ |
| Washington, DC | ✔ | ✔ |   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔† | ✔ |
{{< /table >}}