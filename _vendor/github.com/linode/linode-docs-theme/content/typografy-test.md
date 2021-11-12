---
title: Testing
description: This is a test page used in both manual and automatic tests. Do not delete. It will not be listed anywhere.
noindex: true
_build:
  render: always
  list: never
  publishResources: false
---

## Notes Shortcode

### Note with paragraphs

{{< note >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.
{{< /note >}}

### Note with file shortcode


{{< note >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

{{< file "/home/minecraft/run.sh" sh >}}
#!/bin/sh

java -Xms1024M -Xmx1536M -jar minecraft_server.1.13.jar -o true
{{< /file >}}
{{< /note >}}


### Note with no paragraphs

{{< note >}}A oneliner{{< /note >}}

## Code Shortcode

### Dark

{{< code class="dark" title="Ubuntu 16.04" >}}
sudo systemctl restart apache2
{{< /code >}}

### Dark No Title

{{< code class="dark" >}}
sudo systemctl restart apache2
{{< /code >}}

### Dark Overflow

{{< code class="dark" >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.
{{< /code >}}

#### In Note Bottom

{{< note >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

{{< code class="dark" >}}
sudo systemctl restart apache2
{{< /code >}}
{{< /note >}}

#### In Note Middle

{{< note >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

{{< code class="dark" >}}
sudo systemctl restart apache2
{{< /code >}}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

{{< /note >}}

#### Indented in list

* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.
  * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.
  {{< code class="dark" >}}
sudo systemctl restart apache2
{{< /code >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.

### Light

{{< code class="light" title="Ubuntu 16.04" >}}
sudo systemctl restart apache2
{{< /code >}}

{{< code class="light" title="Ubuntu 16.04" >}}
sudo systemctl restart apache2
sudo systemctl restart apache2
sudo systemctl restart apache2
{{< /code >}}

## File Shortcode

### As a regular block

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.

{{< file "/home/minecraft/run.sh" sh >}}
#!/bin/sh

java -Xms1024M -Xmx1536M -jar minecraft_server.1.13.jar -o true
{{< /file >}}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

{{< file "/foo/bar/maz.go" go >}}
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
{{< /file >}}


###  No Title

{{< file >}} import { SayHello } from "/TestTypescript/Greetings"; {{</ file >}}



### Indented in list

* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.
  * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Ut suscipit nec orci vel sagittis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce accumsan fringilla urna et maximus. Aliquam erat volutpat. Nam malesuada faucibus massa ac ultrices. Sed finibus diam at dolor maximus porttitor.
  {{< file "/home/minecraft/run.sh" sh >}}
#!/bin/sh

java -Xms1024M -Xmx1536M -jar minecraft_server.1.13.jar -o true
{{< /file >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.


### Overflow

{{< file "/home/minecraft/run.sh" sh >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin id metus vel malesuada.
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