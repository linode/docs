---
slug: intro-to-nlp-using-ner-in-python
author:
  name: Yanisa Haley Scherber
  email: yanisahaleyscherber@gmail.com
description: 'Named Entity Recognition (NER) is a powerful Natural Language Processing task which uses modern machine learning techniques. This tutorial provides multiple examples that introduce NER using the powerful machine learning library, Huggingface. Text samples are provided in this tutorial, although you also are encouraged to explore using NER with your own datasets.'
og_description: 'Named Entity Recognition (NER) is a powerful Natural Language Processing task which uses modern machine learning techniques. This tutorial provides multiple examples that introduce NER using the powerful machine learning library, Huggingface. Text samples are provided in this tutorial, although you also are encouraged to explore using NER with your own datasets.'
keywords: ['natural langugage processing', 'python', 'machine learning', 'named entity recognition']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-05
modified_by:
  name: Yanisa Haley Scherber
title: "Introduction to Natural Language Processing Using Named Entity Recognition (NER) in Python"
h1_title: "h1 title displayed in the guide."
enable_h1: false
contributor:
  name: Yanisa Haley Scherber
  link: https://www.yanisahaleyscherber.com
external_resources:
- '[Huggingface Pipelines](https://huggingface.co/docs/transformers/v4.20.1/en/main_classes/pipelines)'
- '[Analytics Vidhya - Named Entity Recognition](https://www.analyticsvidhya.com/blog/2021/06/part-10-step-by-step-guide-to-master-nlp-named-entity-recognition/)'
---

## Introduction to Natural Language Processing (NLP)

Natural Language Processing (NLP) is a branch of Artificial Intelligence (AI) which strives to understand spoken, written, and signed languages in a similar way that humans do. NLP utilizes statistical models, machine learning, and deep learning techniques to accomplish this task. Although NLP has existed for over 50 years, it has recently become one of the most popular and rapidly advancing fields in AI.

NLP can be used for a variety of personal projects, research tasks, or enterprise solutions, such as:

* Language translation
* Chatbots
* Voice assistants
* Email filtering
* Speech-to-text softwares
* Auto-correction and auto-prediction
* Advertising to target audiences
* Text summarization
* Information retrieval

NLP systems are strongly integrated with our modern society, and you likely interact with NLP systems on a daily basis. As the field rapidly evolves, now is a great time to become familiar with some basic NLP tasks.

## What is Named Entitity Recognition (NER)?

Named Entity Recognition (NER) is a component of NLP and machine learning that is used for automatically extracting and categorizing identified nouns and proper nouns from text data. Named entities can consist of: 

* Personal names (e.g., *Ozzy Osbourne*)
* Organization names (e.g., *The National Association of the Deaf*)
* Location names (e.g., *Minneapolis, Minnesota*)
* Miscellaneous (e.g., *Toyota Prius*, *African American*, *World War II*)

NER can be used for various information retrieval or classification tasks. For example, NER could be used to automatically extract information from resumes for job applications.

The popular NLP and machine learning library, [Huggingface](https://huggingface.co/), is used in this tutorial. HuggingFace utilizes Python and contains many pre-trained models which are ready to use for NER tasks and can achieve high accuracy rates.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. If you have not already done so, install Python 3. You can learn how to install Python 3 using Linode's existing guide, [How to Install Python 3](https://www.linode.com/docs/guides/how-to-install-python-on-ubuntu-20-04/).

1. Install the latest version of the Huggingface `transformers` library using pip:

```
pip install transformers
```

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Named Entity Recognition

### Import dependencies

This NER task utilizes the Huggingface `pipeline` object, which offers a simple API for various powerful NLP tasks. You can read more about Huggingface pipelines in their [official documentation](https://huggingface.co/docs/transformers/v4.20.1/en/main_classes/pipelines).

```
from transformers import pipeline
```

### Identify named entities

Instantiate your NER pipeline:

```
ner_pipeline = pipeline("ner", grouped_entities=True)
```

The NER pipeline only needs to be instantiated once. Now, you are ready to extract named entities from text.

Copy the following text sample:

```
text = "Jacob purchased a bottle of Coca-Cola during an Atlanta Falcons game."
```

Pass your text to the `ner_pipeline` object and print the results:

```
nes = ner_pipeline(text)
print(nes)
```

The `ner_pipeline` object returns a list of dictionaries which includes metadata for each named entity, such as the text or the type of named entity.

Use the following code to return only the named entity text:

```
for nes_text in nes:
  print(nes_text['word'])
```

Now, you have a list of each of the named entities.

The Huggingface NER pipeline is very powerful, and it can correctly identify named entities which also exist as other parts of speech.

Copy the following text sample:

```
text2 = "Rose loves rose-scented perfume. Her favorite flower is a rose. Rose's roses rose high during rose season."
```

You can also write it in the following format for easy readability:

```
text2 = "Rose loves rose-scented perfume. " \
        + "Her favorite flower is a rose. " \
        + "Rose's roses rose high during rose season."
```

Pass your text to the `ner_pipeline` and print only the named entity text:

```
nes2 = ner_pipeline(text2)
for nes_text2 in nes2:
  print(nes_text2['word'])
```

As you can see, your pipeline correctly identified two instances of Rose as a personal name, and did not consider rose to be a named entity for any other forms.

Additionally, Huggingface's NER pipeline is sophisticated enough to identify named entities which are not capitalized or are uncommon.

Copy the following text sample:

```
text3 = "Her name is rose. My name is Yanisa."
```

Pass your text to the `ner_pipeline` and print only the named entity text:

```
nes3 = ner_pipeline(text3)
for nes_text3 in nes3:
  print(nes_text3['word'])
```

The personal name, *rose* is still identified, although the first letter is erroneously lowercased. The pipeline also correctly identified *Yanisa* as a name because of the context of the sentence.

You can also pass larger text samples to `ner_pipeline`.

Copy the following text, which contains chapter one of Frankenstein, by Mary Shelley:

```
list_text4 = ["I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation. He was respected by all who knew him for his integrity and indefatigable attention to public business. He passed his younger days perpetually occupied by the affairs of his country; a variety of circumstances had prevented his marrying early, nor was it until the decline of life that he became a husband and the father of a family. " ,
             "As the circumstances of his marriage illustrate his character, I cannot refrain from relating them. One of his most intimate friends was a merchant who, from a flourishing state, fell, through numerous mischances, into poverty. This man, whose name was Beaufort, was of a proud and unbending disposition and could not bear to live in poverty and oblivion in the same country where he had formerly been distinguished for his rank and magnificence. Having paid his debts, therefore, in the most honourable manner, he retreated with his daughter to the town of Lucerne, where he lived unknown and in wretchedness. My father loved Beaufort with the truest friendship and was deeply grieved by his retreat in these unfortunate circumstances. He bitterly deplored the false pride which led his friend to a conduct so little worthy of the affection that united them. He lost no time in endeavouring to seek him out, with the hope of persuading him to begin the world again through his credit and assistance. " ,
             "Beaufort had taken effectual measures to conceal himself, and it was ten months before my father discovered his abode. Overjoyed at this discovery, he hastened to the house, which was situated in a mean street near the Reuss. But when he entered, misery and despair alone welcomed him. Beaufort had saved but a very small sum of money from the wreck of his fortunes, but it was sufficient to provide him with sustenance for some months, and in the meantime he hoped to procure some respectable employment in a merchant’s house. The interval was, consequently, spent in inaction; his grief only became more deep and rankling when he had leisure for reflection, and at length it took so fast hold of his mind that at the end of three months he lay on a bed of sickness, incapable of any exertion. " ,
             "His daughter attended him with the greatest tenderness, but she saw with despair that their little fund was rapidly decreasing and that there was no other prospect of support. But Caroline Beaufort possessed a mind of an uncommon mould, and her courage rose to support her in her adversity. She procured plain work; she plaited straw and by various means contrived to earn a pittance scarcely sufficient to support life. " ,
             "Several months passed in this manner. Her father grew worse; her time was more entirely occupied in attending him; her means of subsistence decreased; and in the tenth month her father died in her arms, leaving her an orphan and a beggar. This last blow overcame her, and she knelt by Beaufort’s coffin weeping bitterly, when my father entered the chamber. He came like a protecting spirit to the poor girl, who committed herself to his care; and after the interment of his friend he conducted her to Geneva and placed her under the protection of a relation. Two years after this event Caroline became his wife. " ,
             "There was a considerable difference between the ages of my parents, but this circumstance seemed to unite them only closer in bonds of devoted affection. There was a sense of justice in my father’s upright mind which rendered it necessary that he should approve highly to love strongly. Perhaps during former years he had suffered from the late-discovered unworthiness of one beloved and so was disposed to set a greater value on tried worth. There was a show of gratitude and worship in his attachment to my mother, differing wholly from the doting fondness of age, for it was inspired by reverence for her virtues and a desire to be the means of, in some degree, recompensing her for the sorrows she had endured, but which gave inexpressible grace to his behaviour to her. Everything was made to yield to her wishes and her convenience. He strove to shelter her, as a fair exotic is sheltered by the gardener, from every rougher wind and to surround her with all that could tend to excite pleasurable emotion in her soft and benevolent mind. Her health, and even the tranquillity of her hitherto constant spirit, had been shaken by what she had gone through. During the two years that had elapsed previous to their marriage my father had gradually relinquished all his public functions; and immediately after their union they sought the pleasant climate of Italy, and the change of scene and interest attendant on a tour through that land of wonders, as a restorative for her weakened frame. " ,
             "From Italy they visited Germany and France. I, their eldest child, was born at Naples, and as an infant accompanied them in their rambles. I remained for several years their only child. Much as they were attached to each other, they seemed to draw inexhaustible stores of affection from a very mine of love to bestow them upon me. My mother’s tender caresses and my father’s smile of benevolent pleasure while regarding me are my first recollections. I was their plaything and their idol, and something better—their child, the innocent and helpless creature bestowed on them by Heaven, whom to bring up to good, and whose future lot it was in their hands to direct to happiness or misery, according as they fulfilled their duties towards me. With this deep consciousness of what they owed towards the being to which they had given life, added to the active spirit of tenderness that animated both, it may be imagined that while during every hour of my infant life I received a lesson of patience, of charity, and of self-control, I was so guided by a silken cord that all seemed but one train of enjoyment to me. " ,
             "For a long time I was their only care. My mother had much desired to have a daughter, but I continued their single offspring. When I was about five years old, while making an excursion beyond the frontiers of Italy, they passed a week on the shores of the Lake of Como. Their benevolent disposition often made them enter the cottages of the poor. This, to my mother, was more than a duty; it was a necessity, a passion—remembering what she had suffered, and how she had been relieved—for her to act in her turn the guardian angel to the afflicted. During one of their walks a poor cot in the foldings of a vale attracted their notice as being singularly disconsolate, while the number of half-clothed children gathered about it spoke of penury in its worst shape. One day, when my father had gone by himself to Milan, my mother, accompanied by me, visited this abode. She found a peasant and his wife, hard working, bent down by care and labour, distributing a scanty meal to five hungry babes. Among these there was one which attracted my mother far above all the rest. She appeared of a different stock. The four others were dark-eyed, hardy little vagrants; this child was thin and very fair. Her hair was the brightest living gold, and despite the poverty of her clothing, seemed to set a crown of distinction on her head. Her brow was clear and ample, her blue eyes cloudless, and her lips and the moulding of her face so expressive of sensibility and sweetness that none could behold her without looking on her as of a distinct species, a being heaven-sent, and bearing a celestial stamp in all her features. " ,
             "The peasant woman, perceiving that my mother fixed eyes of wonder and admiration on this lovely girl, eagerly communicated her history. She was not her child, but the daughter of a Milanese nobleman. Her mother was a German and had died on giving her birth. The infant had been placed with these good people to nurse: they were better off then. They had not been long married, and their eldest child was but just born. The father of their charge was one of those Italians nursed in the memory of the antique glory of Italy—one among the schiavi ognor frementi, who exerted himself to obtain the liberty of his country. He became the victim of its weakness. Whether he had died or still lingered in the dungeons of Austria was not known. His property was confiscated; his child became an orphan and a beggar. She continued with her foster parents and bloomed in their rude abode, fairer than a garden rose among dark-leaved brambles. " ,
             "When my father returned from Milan, he found playing with me in the hall of our villa a child fairer than pictured cherub—a creature who seemed to shed radiance from her looks and whose form and motions were lighter than the chamois of the hills. The apparition was soon explained. With his permission my mother prevailed on her rustic guardians to yield their charge to her. They were fond of the sweet orphan. Her presence had seemed a blessing to them, but it would be unfair to her to keep her in poverty and want when Providence afforded her such powerful protection. They consulted their village priest, and the result was that Elizabeth Lavenza became the inmate of my parents’ house—my more than sister—the beautiful and adored companion of all my occupations and my pleasures. ",
             "Everyone loved Elizabeth. The passionate and almost reverential attachment with which all regarded her became, while I shared it, my pride and my delight. On the evening previous to her being brought to my home, my mother had said playfully, “I have a pretty present for my Victor—tomorrow he shall have it.” And when, on the morrow, she presented Elizabeth to me as her promised gift, I, with childish seriousness, interpreted her words literally and looked upon Elizabeth as mine—mine to protect, love, and cherish. All praises bestowed on her I received as made to a possession of my own. We called each other familiarly by the name of cousin. No word, no expression could body forth the kind of relation in which she stood to me—my more than sister, since till death she was to be mine only."]
```

This excerpt from Frankenstein was downloaded from [Project Gutenberg](https://www.gutenberg.org/), which is an online library of over 60,000 free eBooks.

As you can see, this text sample is contained as a list of paragraphs, rather than one string. The full chapter exceeded Huggingface's maximum text length for this pipeline.

Use the following code to loop over each paragraph of the chapter and print a list of the named entities:

```
allNEs = []
for paragraph in list_text4:
  nes4 = ner_pipeline(paragraph)
  for words in nes4:
    allNEs.append(words["word"])
print(allNEs)
```

You can also use a `set()` to print only the unique named entities:

```
uniqueNEs = set(allNEs)
print(uniqueNEs)
```

You've just completed your first NER task. Great job! Now, try it out with your own data. If you don't have your own data, consider downloading text from [Project Gutenberg](https://www.gutenberg.org/), or copying text from your preferred news source.

NER is a powerful NLP task with various uses in information retrieval and classification. If you found this tutorial interesting, consider exploring other modern NLP tasks offered by [Huggingface pipelines](https://huggingface.co/docs/transformers/v4.20.1/en/main_classes/pipelines).

## Conclusion

Natural Language Processing (NLP) is one of the fastest growing areas in AI and machine
learning and has many business applications, such as: language translation, chatbots and virtual
assistants, autocorrection, and more. NER is one component of NLP which can be used to
discover and classify important information in large text datasets, which can be used to enrich
your data science projects.