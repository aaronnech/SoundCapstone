from bs4 import BeautifulSoup
import requests

URL = 'http://www.speech.cs.cmu.edu/cgi-bin/cmudict?in='

replace = {'R' : 'W', 'ER' : 'UH'} # If R is the last character, also drop it
words = open('words.txt', 'r').read().upper().splitlines()
result = {}

for word in words:
    page = requests.get(URL + word).text
    soup = BeautifulSoup(page)

    result[word] = [str(phoneme) for phoneme in soup.find_all('tt')[1].getText().split(' ')[:-1]]

sphinxWords = []
sphinxGrammars = []
wordBank = []
for word in result:

    possible = [list(result[word])]
    labels = [word]

    sphinxWords.append([word, ' '.join(result[word])])
    for to_replace in replace:
        if to_replace in result[word]:
            index = result[word].index(to_replace)
            new_phoneme = list(result[word])
            new_phoneme[index] = replace[to_replace]
            possible.append(new_phoneme)
            label = word.replace(to_replace, replace[to_replace])
            entry = [label, ' '.join(new_phoneme)]
            labels.append(label)
            sphinxWords.append(entry)

    # Special case where r is the last character
    if word[-1] == 'R':
        new_phoneme = list(result[word])
        new_phoneme = new_phoneme[:-1]
        possible.append(new_phoneme)
        entry = [word[:-1], ' '.join(new_phoneme)]
        labels.append(word[:-1])
        sphinxWords.append(entry)


    grammar = {'word' : word, 'g' : {'numStates' : len(possible), 'start' : 0, 'end' : 1, 'transitions' : []}}
    for changed_word in labels:
        entry = {'from' : 0, 'to' : 1, 'word' : changed_word}

        grammar['g']['transitions'].append(entry)

    sphinxGrammars.append(grammar)
    correct = {'right' : word, 'wrong' : labels[1:]}
    wordBank.append(correct)


print 'sphinxWords : ', sphinxWords
print
print 'sphinxGrammars : ', sphinxGrammars
print
print 'wordBank : ', wordBank
