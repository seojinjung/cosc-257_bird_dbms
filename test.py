import pandas as pd
text = b'R'
with open('est.txt', 'rb') as file_in: #this section reformats text file into another text file
    with open('output.txt', 'wb') as file_out:
        file_out.writelines(
            filter(lambda line: text in line, file_in)
        )

df = pd.read_csv('output.txt', sep = ' ', header = None, names = ['n/a', 'feed #', 'id', 'date', 'time'])
del df['n/a'] #This section creates a table from the output text file using pandas
print(df)
