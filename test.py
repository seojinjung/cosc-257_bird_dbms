import pandas as pd


text = b'R'
with open('12-29-20_fin.txt', 'rb') as file_in: #This section reformats text file into another text file
    with open('output.txt', 'wb') as file_out:
        file_out.writelines(
            filter(lambda line: text in line, file_in)
        )

df = pd.read_csv('output.txt', sep = ' ', header = None, names = ['n/a', 'feed #', 'id', 'date', 'time', 'displace', 'departure' 'score'])

df['datetime'] = df['date'] + " "+ df['time']
del df['n/a']
del df['date']
del df['time']
del df['feed #'] 
df['displace'].fillna(0, inplace = True)
df['departure'].fillna(0, inplace = True)
df['score'].fillna(0, inplace = True)
 
from datetime import datetime

string = df['datetime'][0]
 
timestamp = datetime.strptime(string, '%m/%d/%y %H:%M:%S').timestamp()

print(df)

print(timestamp)

for ind in df.index:

    if(ind<=len(df.index)-2):
        bird_time = datetime.strptime(df['datetime'][ind], '%m/%d/%y %H:%M:%S').timestamp()
    
        bird2_time = datetime.strptime(df['datetime'][ind+1], '%m/%d/%y %H:%M:%S').timestamp()
        bird2_id = df['id'][ind+1]
    
        bird2_dep_time = datetime.strptime(df['datetime'][ind+2], '%m/%d/%y %H:%M:%S').timestamp()
        bird2_dep_id = df['id'][ind+2]
    
        disp_time = bird2_time-bird_time
        df['displace'][ind+1] = disp_time
    
        if(disp_time <=3):
            dep_time = bird2_dep_time - bird2_time
            df['departure'][ind+2] = dep_time
            if(bird2_id==bird2_dep_id and dep_time<=5):
                df['score'][ind+1] += 1


print(df)            
    
