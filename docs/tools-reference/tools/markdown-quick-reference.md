---
deprecated: false
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'Mark Down Reference Guide'
keywords: 'style guide, write for us, linode library, article submissions, mark down,'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Tuesday, December 30th, 2014
modified_by:
  name: Joseph Dooley
published: 'Tuesday, December 30th, 2014'
title: Mark Down Quick Reference
---

At Linode, we use Markdown. We even created some custom tags of our own. Use the tables below to get started writing your first Linode guide. Feel free to copy and paste from the left hand column into a text editor.

To preview Markdown, find a Markdown interpreter. Try [Nottingham](http://clickontyler.com/nottingham/), a simple, free notepad for Mac; command, shift, and p to preview. For more advanced text editors, try [textmate](http://macromates.com) or [Sublime Text](http://www.sublimetext.com/).

##Markdown
<head>
<style>
table {
    width:100%;
}
table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
}
th, td {
    padding: 5px;
    text-align: left;
}
table#t01 tr:nth-child(even) {
    background-color: #eee;
}
table#t01 tr:nth-child(odd) {
   background-color:#fff;
}
table#t01 th  {
    background-color: black;
    color: white;
}
</style>
</head>
<table id="t01">
  <tr>
  <th>
  <font size="5">
  Text Highlighting
  </font>
  </th>
  <th>
  </th>
  </tr>
  <tr>
    <td>
    <br>
    *italics* 
    </td>
    <td>
    <br>
    <em>
    &nbsp;italics
    </em> 
    </td>
  </tr>
    <tr>
    <td>
    <br>
    `highlight`
    </td>     
    <td>
    <br>
    <img src="/docs/assets/example-highlight.png"> 
    </td>
  </tr>
  <tr>
    <td>
    <br>
    **bold** 
    </td>     
    <td>
    <br>
    <b>
    &nbsp;bold
    </b> 
    </td>
  </tr>
  <tr>
  <th>
  <font size="5">
  Headers
  </font>
  </th>
  <th></th>
  </tr>
  <tr>
    <td>
    #Main Title or h1 
    </td>     
    <td>
    <font size="6">Main Title or h1</font> 
    </td>
  </tr>
  <tr>
    <td>
    <br>
    ##Primary Section or h2
    </td>     
    <td>
    <br>
    <font size="5">Primary Section or h2</font> 
    </td>
  </tr>
  <tr>
    <td>
    <br>
    ###Sub-section or h3
    </td>     
    <td>
    <br>
    <font size="4">Sub-section or h3</font>
    </td>
  </tr> 
  <tr>
  <th>
  <font size="5">
  Lists
  </font>
  </th>
  <th></th>
  </tr>
    <tr>
    <td>
    - For bullet points,
    <br>
    * Or unordered lists,
    <br>
    + Use hyphens, asterisks,
    <br>
    + Or plus symbols.
    </td>     
    <td>
    <ul>
    <li>For bullet points,</li>
    <li>Or unordered lists,</li>
    <li>Use hyphens, asterisks,</li>
    <li>Or plus symbols.</li>
    </ul>
    </td>
  </tr>
  <tr>
    <td>
    <br>
1.  A numbered list. 
<br>
<br>
2.  Two spaces after the period. 
<br>
<br>       
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Eight spaces for indentation. 
<br>
<br>
3.  Above, an indented command. 
    </td>     
    <td>
    <img src="/docs/assets/example-numbered-list.png">
    </td>
  </tr>
  <tr>
    <th>
    <font size="5">
    Links and Images
    </font>
    </th>
    <th></th>
  </tr>
  <tr>
    <td>
    <br>
    [Mask text link.](https://www.linode.com) 
    </td>
    <td>
    <br>
    <a href="https://www.linode.com">Mask text link.</a> 
    </td>
  </tr>
  <tr>
    <td width="50%">
    <br>
    [![Image text.](/docs/assets/sample.png)](/docs/assets/sample.png) 
    </td>
    <td width="50%">
    <br>
    <img src="/docs/assets/example.png"> 
    </td>
  </tr>
  <tr>
  <th>
  <font size="5">
  Tables and Separated Quotes
  </font>
  </th>
  <th></th>
  </tr>
  <tr>
    <td>
| Left-Aligned | Centered     | Right-Aligned |
<br>
| ---------------- |:-------------:| -----------------:|
<br>
| Columns,&nbsp;&nbsp;&nbsp;&nbsp; | both&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| headers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
<br>
| and &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | line items, | are aligned &nbsp;&nbsp;|
<br>
| by the hypens | and colons | above. &nbsp;&nbsp;&nbsp; |
    </td>
    <td>
    <img src="/docs/assets/example-markdown-table.png">
    </td>
  </tr>
      <tr>
    <td>
    <br>
    > To separate text, use right angle brackets.
    <br>
    Break in separated text.
    <br>
    > Some more separated text. 
    </td>
    <td>
    <br>
    <img src="/docs/assets/example-separated-quote.png"> 
    </td>    
  </tr>     
</table>

##Custom Linode Class Tags

<table id="t01">
  <tr>
  <th>
  <font size="5">
  Notes and Cautions
  </font>
  </th>
  <th></th>
  </tr>
  <tr>
    <td>
    &nbsp;{: .note}
    <br>>
    <br>> This is a sample note.
    <br>
    </td>
    <td><img src="/docs/assets/example-note.png"></td>      
  </tr>
  <tr>
    <td>
    <br>
    &nbsp;{: .caution}
    <br>>
    <br>> This is a sample caution.
    <br>    
    </td>
    <td>
    <img src="/docs/assets/example-caution.png">
    </td>        
  </tr> 
    <tr>
  <th>
  <font size="5">
  Custom Table
  </font>
  </th>
  <th></th>
  </tr>
  <tr>
    <td>
{: .table .table-striped}
<br>
| Left-Aligned | Centered     | Right-Aligned |
<br>
| ---------------- |:-------------:| -----------------:|
<br>
| Columns,&nbsp;&nbsp;&nbsp;&nbsp; | both&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| headers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
<br>
| and &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | line items, | are aligned &nbsp;&nbsp;|
<br>
| by the hypens | and colons | above. &nbsp;&nbsp;&nbsp; |
    </td>
    <td>
    <img src="/docs/assets/example-blue-stripe-table.png">
    </td>
  </tr>  
</table>