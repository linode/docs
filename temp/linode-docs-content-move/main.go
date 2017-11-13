//usr/bin/env go run "$0" "$@"; exit "$?"

package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

var listedSections []string

type contentFixer func(path, s string) (string, error)

func relOldContentPath(s string) string {
	return s[strings.LastIndex(s, "docs")+5:]
}

func fromToPath(from string) string {
	return strings.Replace(from, "docs/docs", "docs/content", 1)
}

func (m *mover) fixContent(path, s string) (string, error) {

	// TODO(bep) copy assets folder

	fixers := []contentFixer{
		categoriesHandler,
		removeFeatured,

		tableFixer,
		tableEndingFixer,

		// Handles the callouts file, shell and file-exerpt
		calloutFilesFixer,

		// Handles conversion of all the other callouts to shortcodes
		calloutsToShortCodes,

		keywordsToArray,

		fixDates,

		// Plural alias => aliases
		aliasFixer,

		// Fix "##Install Required Packages" etc. titles
		titlesFixes,
	}

	for _, fix := range fixers {
		fixed, err := fix(path, s)
		if err != nil {
			fmt.Printf("%s\t%s\n", path, err)
		} else {
			s = fixed
		}
	}

	relPath := relOldContentPath(path)

	// Add front matter to get them listen on the front page tiles.
	if addon, ok := fundamentalPages[relPath]; ok {
		s = addToFrontpage(s, addon)
	}

	return s, nil

}

var (
	calloutFilesFixer = func(path, s string) (string, error) {
		// Handle file and file-excerpt shortcodes
		// Replace callouts with shortcodes
		calloutsFiles := regexp.MustCompile(`(?s)([\t ]*){:\s?\.(shell|file[\w|-]*)\s?}\n(.*?)\n.*?~~~\s?(\w*)\s*\n(.*?)~~~`)

		s = calloutsFiles.ReplaceAllStringFunc(s, func(s string) string {
			m := calloutsFiles.FindAllStringSubmatch(s, -1)
			if len(m) > 0 {

				first := m[0]

				whitespace := first[1]
				shortcode := strings.TrimSpace(first[2])
				filename := strings.TrimSpace(first[3])
				style := strings.TrimSpace(first[4])
				code := strings.TrimRight(first[5], " \n\r")

				trimIdx := -1

				lines := strings.Split(code, "\n")
				if len(lines) > 0 {
					trimIdx = firstNonWhitespace(lines[0])
				}

				if trimIdx != -1 {
					newCode := ""
					for _, line := range lines {
						f := firstNonWhitespace(line)
						if f >= trimIdx {
							line = line[trimIdx:]
						}
						newCode += line + "\n"
					}

					code = newCode

				}

				if shortcode == "shell" {
					return fmt.Sprintf(`{{< shell %q>}}
%s
{{< /shell >}}`, filename, code)
				}

				// Misspelled
				if shortcode == "file-exceprt" || shortcode == "file-exerpt" {
					shortcode = "file-excerpt"
				}

				// Correct to supported Pygments lexers
				// See http://pygments.org/docs/lexers/
				if style == "conf" || style == "config" || style == "apache2" || style == "cnf" || style == "httpd" {
					style = "aconf" // Apache conf
				} else if style == "pp" {
					style = "puppet"
				} else if style == "aspx" {
					style = "aspx-cs"
				} else if style == "yml" {
					style = "yaml"
				} else if style == "text" || style == "txt" || style == "log" {
					style = "resource"
				} else if strings.EqualFold(style, "vimrc") {
					style = "vim"
				} else if strings.EqualFold(style, "list") {
					style = "sourceslist"
				}

				if style != "" {
					style += " "
				}

				return fmt.Sprintf(`%s{{< %s %q %s>}}
%s
{{< /%s >}}
`, whitespace, shortcode, filename, style, code, shortcode)
			}

			return s
		})

		return s, nil

	}

	calloutsToShortCodes = func(path, s string) (string, error) {

		// Apply these in order
		regexps := []string{`(?s)([\t ]*){:\s?\.([\w|-]*)\s?}(.*?)\s*\n\s*\n`, `(?s)([\t ]*){:\s?\.([\w|-]*)\s?}(.*?)\z`}

		for i, re := range regexps {
			calloutsRe := regexp.MustCompile(re)

			s = calloutsRe.ReplaceAllStringFunc(s, func(s string) string {
				m := calloutsRe.FindAllStringSubmatch(s, -1)
				if len(m) > 0 {
					first := m[0]
					whitespace := first[1]
					name, content := first[2], first[3]
					name = strings.TrimSpace(name)
					content = strings.TrimSpace(content)

					// Block level markdown is superflous.
					lines := strings.Split(content, "\n")
					newContent := ""
					for _, line := range lines {
						l := strings.TrimSpace(line)
						if strings.HasPrefix(l, ">") {
							l = strings.TrimSpace(strings.TrimPrefix(l, ">"))
							line = l
						}

						newContent += line + "\n"
					}

					newContent = strings.TrimSpace(newContent)

					s = fmt.Sprintf(`%s{{< %s >}}
%s
{{< /%s >}}
`, whitespace, name, newContent, name)

					if i == 0 {
						s += "\n"
					}

				}

				return s
			})

		}

		return s, nil
	}

	keywordsToArray = func(path, s string) (string, error) {
		keywordsRe := regexp.MustCompile(`keywords: '(.*)'\s*\n?`)

		s = keywordsRe.ReplaceAllStringFunc(s, func(s string) string {
			m := keywordsRe.FindAllStringSubmatch(s, -1)
			if len(m) > 0 {
				kw := m[0][1]
				kwStr := strings.Trim(kw, "'")
				kwSplit := strings.Split(kwStr, ",")
				r := fmt.Sprintf("keywords: %#v", kwSplit)
				r = strings.Replace(r, "]string{", "", 1)
				r = strings.Replace(r, "}", "]", 1)

				return r + "\n"
			}

			return s + "\n"
		})

		return s, nil
	}

	fixDates = func(path, s string) (string, error) {
		dateRe := regexp.MustCompile(`(published|modified): '?(.*)'?\s*\n`)

		// Make modified and published front matter date into proper dates.
		var err error
		s = dateRe.ReplaceAllStringFunc(s, func(s string) string {
			m := dateRe.FindAllStringSubmatch(s, -1)
			key, val := m[0][1], m[0][2]
			var tt time.Time
			cleaned := dateCleaner(val)
			if cleaned == "" {
				return ""
			}
			tt, err = time.Parse("Monday, January 2, 2006", cleaned)
			if err != nil {
				err = fmt.Errorf("%s: %s", key, err)
				return ""
			}

			return fmt.Sprintf("%s: %s\n", key, tt.Format("2006-01-02"))
		})

		return s, err
	}

	tableFixer = func(path, s string) (string, error) {
		re := regexp.MustCompile(`{: \.table.*?}\s*\n`)
		return re.ReplaceAllString(s, ""), nil
	}

	tableEndingFixer = func(path, s string) (string, error) {
		re := regexp.MustCompile(`\|:------\S*\n\n`)
		return re.ReplaceAllString(s, ""), nil
	}

	//

	aliasFixer = func(path, s string) (string, error) {
		re := regexp.MustCompile(`alias: \[`)
		return re.ReplaceAllString(s, "aliases: ["), nil
	}

	titlesFixes = func(path, s string) (string, error) {
		re := regexp.MustCompile(`(?s)\n\n(#{1,3})(\w.*?)\n`)
		return re.ReplaceAllString(s, "\n\n$1 $2\n"), nil
	}

	removeFeatured = func(path, s string) (string, error) {
		res := []*regexp.Regexp{
			regexp.MustCompile(`(?s)featured:\n(\s?\-.*?)\n(\-{3,4})`),
			regexp.MustCompile(`(?s)featured:\n(\s?\-.*?)\n([^ \-])`),
		}

		for _, re := range res {
			s = re.ReplaceAllString(s, "$2")
		}

		s = regexp.MustCompile(`featured: \[.*\]?.*\n`).ReplaceAllString(s, "")

		return s, nil
	}

	categoriesHandler = func(path, s string) (string, error) {
		res := []*regexp.Regexp{
			regexp.MustCompile(`(?s)categories:\n(\s?\-.*?)\n(\-{3,4})`),
			regexp.MustCompile(`(?s)categories:\n(\s?\-.*?)\n([^ \-])`),
		}

		dir := filepath.Dir(fromToPath(path))

		for _, re := range res {
			s = re.ReplaceAllStringFunc(s, func(s string) string {
				m := re.FindAllStringSubmatch(s, -1)
				f := m[0]

				sections := strings.Split(f[1], "\n")
				for _, section := range sections {
					section = strings.Trim(section, " -")
					if section == "" {
						continue
					}

					listedSections = append(listedSections, filepath.Join(dir, section))
				}

				s = f[2]

				return s
			})
		}

		return s, nil

	}
)

var (
	skipFiles = map[string]bool{
		// Handle these by manual copy.
		"assets":    true,
		".DS_Store": true,
	}

	try = false
)

type mover struct {
	fromDir string
	toDir   string
}

func main() {
	pwd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	root := filepath.Join(pwd, "../..")
	fromDir := filepath.Join(root, "docs")
	toDir := filepath.Join(root, "content")

	m := &mover{fromDir: fromDir, toDir: toDir}

	if err := m.move(); err != nil {
		log.Fatal(err)
	}

}

func (m *mover) move() error {
	fmt.Println("Move Content from", m.fromDir, "to", m.toDir)

	counter := 0

	err := filepath.Walk(m.fromDir, func(path string, fi os.FileInfo, err error) error {

		if skipFiles[fi.Name()] {
			fmt.Println("Skip", fi.Name())
			if fi.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}

		if fi.Mode().IsRegular() {
			counter++
			if try && counter > 5 {
				return filepath.SkipDir
			}
			return m.handleFile(path, true, fi, m.fixContent)

		}

		return nil
	})

	if err != nil {
		return err
	}

	for _, sect := range listedSections {
		index := filepath.Join(sect, "index.md")
		fi, err := os.Stat(index)
		if err != nil {
			if !os.IsNotExist(err) {
				return err
			}
			fmt.Println(index, "not found. Skip setting the show_in_lists flag")
		} else {
			if err := m.handleFile(index, false, fi, showInList); err != nil {
				return err
			}
		}
	}

	return nil

}

func (m *mover) targetFilename(sourceFilename string) string {
	// sourceFilename: /path/docs/some-path/file.md"

	// Rules:
	// * We remove the "/docs" prefix
	// * Rename index.md to _index.md
	filename := strings.TrimPrefix(sourceFilename, m.fromDir)
	if !strings.HasPrefix(filename, m.toDir) {
		filename = filepath.Join(m.toDir, filename)
	}
	filename = strings.Replace(filename, "index.md", "_index.md", 1)

	return filename
}

func (m *mover) openTargetFile(sourceFilename string, info os.FileInfo) (io.ReadWriteCloser, error) {
	targetFilename := m.targetFilename(sourceFilename)

	fi, err := os.Stat(targetFilename)
	if err != nil {
		return nil, err
	}

	if fi.IsDir() {
		fmt.Println(sourceFilename, "is a dir, skip")
		return nil, nil
	}

	return os.OpenFile(targetFilename, os.O_RDWR, fi.Mode())
}

func (m *mover) openOrCreateTargetFile(sourceFilename string, info os.FileInfo) (io.ReadWriteCloser, error) {
	targetFilename := m.targetFilename(sourceFilename)
	targetDir := filepath.Dir(targetFilename)

	err := os.MkdirAll(targetDir, os.FileMode(0755))
	if err != nil {
		return nil, err
	}

	return m.openFileForWriting(targetFilename, info)
}

func (m *mover) openFileForWriting(filename string, info os.FileInfo) (io.ReadWriteCloser, error) {
	return os.OpenFile(filename, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, info.Mode())
}

func (m *mover) handleFile(path string, create bool, info os.FileInfo, replacer func(path string, content string) (string, error)) error {
	sourceFilename := path

	var (
		out io.ReadWriteCloser
		in  bytes.Buffer
		err error
	)

	infile, err := os.Open(sourceFilename)
	if err != nil {
		return err
	}
	in.ReadFrom(infile)
	infile.Close()

	if create {
		out, err = m.openOrCreateTargetFile(sourceFilename, info)
	} else {
		out, err = m.openFileForWriting(sourceFilename, info)
	}

	if err != nil {
		return err
	}
	defer out.Close()

	return m.replaceInContent(path, &in, out, replacer)
}

func (m *mover) replaceInContent(path string, in io.Reader, out io.Writer, replacer func(path string, content string) (string, error)) error {
	var buff bytes.Buffer
	if _, err := io.Copy(&buff, in); err != nil {
		return err
	}

	var r io.Reader

	fixed, err := replacer(path, buff.String())
	if err != nil {
		fmt.Printf("%s\t%s\n", path, err)
		r = &buff
	} else {
		r = strings.NewReader(fixed)
	}

	if _, err = io.Copy(out, r); err != nil {
		return err
	}
	return nil
}

type frontmatterAddon struct {
	weight      int
	icon        string
	short_title string
}

var (

	// (?s){{< (file-?\w*) >}}\n(.*?)\n.*?~~~\s?(\w*)\n(.*?)~~~.*?{< /file-excerpt >}}

	//	fileExcerpt = regexp.MustCompile(`(?s){{< (file-?\w*) >}}(.*):\s*~~~.*\n(.*)\n~~~.*?({{< /file-?\w* >}})?`)
	//fileExcerpt = regexp.MustCompile(`(?s){{< (file-?\w*) >}}\n(.*?)\n.*?~~~\s?(\w*)\n(.*?)~~~.*?{< /file-?\w* >}}`)

	ndRe     = regexp.MustCompile(`(\d+)(th|nd|st|rd)`)
	commaRe1 = regexp.MustCompile(`([0-9])\s([0-9])`)
	commaRe2 = regexp.MustCompile(`([a-zA-Z])\s([a-zA-Z])`)

	frontmatterRe = regexp.MustCompile(`(?s)---
(.*)
---(\n?)`)

	// We will add the "essential" category and some other metadata needed for the front page.
	fundamentalPages = map[string]frontmatterAddon{
		"getting-started.md":       frontmatterAddon{10, "book", "Getting Started"},
		"quick-answers/index.md":   frontmatterAddon{20, "bolt", "Quick Answers"},
		"platform/index.md":        frontmatterAddon{30, "cube", "Linode Platform"},
		"websites/index.md":        frontmatterAddon{40, "laptop", "Websites"},
		"web-servers/index.md":     frontmatterAddon{50, "globe", "Web Servers"},
		"networking/index.md":      frontmatterAddon{60, "sitemap", "IPs, Networking & Domains"},
		"security/index.md":        frontmatterAddon{70, "lock", "Security, Upgrades & Backups"},
		"email/index.md":           frontmatterAddon{80, "envelope", "Email"},
		"databases/index.md":       frontmatterAddon{90, "database", "Databases"},
		"uptime/index.md":          frontmatterAddon{100, "bar-chart-o", "Uptime & Analytics"},
		"applications/index.md":    frontmatterAddon{110, "cogs", "Applications"},
		"game-servers/index.md":    frontmatterAddon{120, "gamepad", "Game Servers"},
		"development/index.md":     frontmatterAddon{130, "code", "Development"},
		"troubleshooting/index.md": frontmatterAddon{140, "question-circle", "Troubleshooting"},
		"tools-reference/index.md": frontmatterAddon{150, "wrench", "Tools & Reference"},
	}
)

func addToFrontpage(src string, addon frontmatterAddon) string {
	addition := fmt.Sprintf(`show_on_frontpage: true
title_short: %q
weight: %d
icon: %q`, addon.short_title, addon.weight, addon.icon)

	return appendToFrontMatter(src, addition)
}

func showInList(path, s string) (string, error) {
	return appendToFrontMatter(s, `show_in_lists: true`), nil
}

func appendToFrontMatter(src, addition string) string {
	return frontmatterRe.ReplaceAllString(src, fmt.Sprintf(`---
$1
%s
---$2`, addition))

}

func firstNonWhitespace(s string) int {
	return strings.IndexFunc(s, func(r rune) bool {
		return r != ' ' && r != '\t'
	})
}
func dateCleaner(s string) string {
	cleaned := ndRe.ReplaceAllString(s, "$1")
	cleaned = strings.Trim(cleaned, "' ")
	cleaned = commaRe1.ReplaceAllString(cleaned, "$1, $2")
	cleaned = commaRe2.ReplaceAllString(cleaned, "$1, $2")

	return cleaned
}
