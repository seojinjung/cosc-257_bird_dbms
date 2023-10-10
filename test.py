import pandas as pd
text = b'R'
with open('est.txt', 'rb') as file_in:
    with open('output.txt', 'wb') as file_out:
        file_out.writelines(
            filter(lambda line: text in line, file_in)
        )

df = pd.read_csv('output.txt', sep = ' ', header = None, names = ['n/a', 'feed #', 'id', 'date', 'time'])
del df['n/a']
print(df)
